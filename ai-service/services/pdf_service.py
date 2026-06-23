from pypdf import PdfReader
from io import BytesIO

def extract_text(contents):
    pdf = PdfReader(BytesIO(contents))
    text = ""

    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
            
    return text