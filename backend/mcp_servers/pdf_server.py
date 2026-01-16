from mcp.server.fastmcp import FastMCP
import base64
import io
import json
import fitz  # PyMuPDF
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mcp = FastMCP("pdf-processor")

@mcp.tool()
def split_pdf_metadata(pdf_base64: str) -> str:
    """Returns page count and metadata without heavy image data.
    
    Args:
        pdf_base64: Base64-encoded PDF data (with or without data URI prefix)
        
    Returns:
        JSON string with total_pages and metadata, or error field
    """
    try:
        # Handle data URI prefix if present
        if ',' in pdf_base64 and pdf_base64.startswith('data:'):
            pdf_base64 = pdf_base64.split(',', 1)[1]
        
        pdf_bytes = base64.b64decode(pdf_base64)
        
        if not pdf_bytes or len(pdf_bytes) < 10:
            return json.dumps({"error": "Invalid or empty PDF data"})
        
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        result = {
            "total_pages": len(doc),
            "metadata": doc.metadata or {}
        }
        doc.close()
        
        logger.info(f"PDF metadata extracted: {result['total_pages']} pages")
        return json.dumps(result)
        
    except base64.binascii.Error as e:
        logger.error(f"Base64 decode error: {e}")
        return json.dumps({"error": f"Invalid base64 encoding: {str(e)}"})
    except Exception as e:
        logger.error(f"PDF metadata extraction error: {e}")
        return json.dumps({"error": str(e)})

@mcp.tool()
def render_page_for_vision(pdf_base64: str, page_number: int) -> str:
    """Renders a specific page as a High-Res PNG for Qwen VL.
    
    Uses 2x zoom (matrix=2) for crisp text recognition while balancing
    payload size for 8GB VRAM constraint.
    
    Args:
        pdf_base64: Base64-encoded PDF data
        page_number: Page number to render (1-indexed)
        
    Returns:
        JSON string with image_data (base64 PNG) and dimensions, or error field
    """
    try:
        # Handle data URI prefix if present
        if ',' in pdf_base64 and pdf_base64.startswith('data:'):
            pdf_base64 = pdf_base64.split(',', 1)[1]
        
        pdf_bytes = base64.b64decode(pdf_base64)
        
        if not pdf_bytes or len(pdf_bytes) < 10:
            return json.dumps({"error": "Invalid or empty PDF data"})
        
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        if page_number < 1 or page_number > len(doc):
            doc.close()
            return json.dumps({"error": f"Page {page_number} out of range (1-{len(doc)})"})
        
        page = doc.load_page(page_number - 1)  # 0-indexed
        
        # Zoom=2.0 ensures text is crisp for OCR while managing payload size
        # Higher zoom (3.0+) would improve quality but increase VRAM usage
        zoom_matrix = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=zoom_matrix)
        
        img_base64 = base64.b64encode(pix.tobytes("png")).decode("utf-8")
        
        result = {
            "image_data": img_base64,
            "page_number": page_number,
            "width": pix.width,
            "height": pix.height
        }
        
        doc.close()
        logger.info(f"Rendered page {page_number}: {pix.width}x{pix.height}px")
        
        return json.dumps(result)
        
    except base64.binascii.Error as e:
        logger.error(f"Base64 decode error: {e}")
        return json.dumps({"error": f"Invalid base64 encoding: {str(e)}"})
    except Exception as e:
        logger.error(f"Page rendering error: {e}")
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    mcp.run()