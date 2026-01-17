from mcp.server.fastmcp import FastMCP
import base64
import io
import json
import fitz  # PyMuPDF
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mcp = FastMCP("pdf-processor")

# Load zoom factor from environment or use default
PDF_ZOOM_FACTOR = float(os.environ.get("HVAC_PDF_ZOOM_FACTOR", "2.0"))

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
def render_page_for_vision(pdf_base64: str, page_number: int, zoom_factor: float = 2.0) -> str:
    """Renders a specific page as a High-Res PNG for Qwen VL.
    
    Uses configurable zoom for crisp text recognition while balancing
    payload size for 8GB VRAM constraint.
    
    Args:
        pdf_base64: Base64-encoded PDF data
        page_number: Page number to render (1-indexed)
        zoom_factor: Zoom multiplier (1.5=fast, 2.0=balanced, 3.0=detailed, 4.0=ultra)
        
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
        
        # Use provided zoom factor (with fallback to environment or default)
        if zoom_factor <= 0:
            zoom_factor = PDF_ZOOM_FACTOR
        
        # Clamp zoom factor to reasonable range
        zoom_factor = max(1.0, min(zoom_factor, 4.0))
        
        zoom_matrix = fitz.Matrix(zoom_factor, zoom_factor)
        pix = page.get_pixmap(matrix=zoom_matrix)
        
        img_base64 = base64.b64encode(pix.tobytes("png")).decode("utf-8")
        
        result = {
            "image_data": img_base64,
            "page_number": page_number,
            "width": pix.width,
            "height": pix.height,
            "zoom_factor": zoom_factor
        }
        
        doc.close()
        logger.info(f"Rendered page {page_number}: {pix.width}x{pix.height}px (zoom={zoom_factor}x)")
        
        return json.dumps(result)
        
    except base64.binascii.Error as e:
        logger.error(f"Base64 decode error: {e}")
        return json.dumps({"error": f"Invalid base64 encoding: {str(e)}"})
    except Exception as e:
        logger.error(f"Page rendering error: {e}")
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    mcp.run()