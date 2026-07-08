from pypdf import PdfReader
import re
from io import BytesIO

def clean_text(text):

    # Collapse excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse multiple spaces
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()

def extract_text(contents):
    pdf = PdfReader(BytesIO(contents))
    text = ""

    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
            
    return text