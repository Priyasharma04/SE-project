import pdfplumber
import openai
# change krke model aa jayega
openai.api_key = "YOUR_OPENAI_API_KEY"
def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text
def generate_review(text):
    """Send text to OpenAI GPT-4/5 to generate research paper review."""
    prompt = f"""
You are an expert research paper reviewer. 
Analyze the following paper text and provide a structured review including:

1. Summary
2. Strengths
3. Weaknesses + suggested fixes
4. Suggested experiments
5. Policy issues
6. Decision (Accept / Revision / Reject)

Paper Text:
{text[:3000]}  # limit to first 3000 chars for faster response
"""
    response = openai.ChatCompletion.create(
        model="gpt-4o",   
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1000
    )
    return response['choices'][0]['message']['content']
def process_paper(pdf_path):
    """Full pipeline: PDF → Review"""
    text = extract_text_from_pdf(pdf_path)
    review = generate_review(text)
    return {"review": review}
