from mcp.server.fastmcp import FastMCP
import base64
import io
import json
import fitz  # PyMuPDF

mcp = FastMCP("pdf-processor")

@mcp.tool()
def split_pdf_metadata(pdf_base64: str) -> str:
    """Returns page count and metadata without heavy image data."""
    try:
        pdf_bytes = base64.b64decode(pdf_base64)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return json.dumps({"total_pages": len(doc), "metadata": doc.metadata})
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
def render_page_for_vision(pdf_base64: str, page_number: int) -> str:
    """Renders a specific page as a High-Res PNG for Qwen VL."""
    try:
        pdf_bytes = base64.b64decode(pdf_base64)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        page = doc.load_page(page_number - 1)
        
        # Zoom=2.0 ensures text is crisp for OCR
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        img_base64 = base64.b64encode(pix.tobytes("png")).decode("utf-8")
        
        return json.dumps({"image_data": img_base64})
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    mcp.run()