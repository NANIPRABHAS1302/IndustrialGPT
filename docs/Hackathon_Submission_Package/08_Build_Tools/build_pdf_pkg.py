import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image

def build_pdf_from_md(md_file, pdf_file, title):
    pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    doc = SimpleDocTemplate(
        pdf_file,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1,
        spaceAfter=20
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0F766E'),
        alignment=1,
        spaceAfter=30
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=15,
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0F766E'),
        spaceBefore=12,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=8
    )

    story = [
        Paragraph(title, title_style),
        Paragraph("AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain<br/>ET AI Hackathon Submission | Solo Participant", subtitle_style),
        Spacer(1, 20)
    ]

    if os.path.exists(md_file):
        with open(md_file, "r", encoding="utf-8") as f:
            lines = f.readlines()

        for line in lines:
            line_str = line.strip()
            if line_str.startswith("# "):
                story.append(Paragraph(line_str[2:], h1_style))
            elif line_str.startswith("## "):
                story.append(Paragraph(line_str[3:], h2_style))
            elif line_str.startswith("### "):
                story.append(Paragraph(line_str[4:], h2_style))
            elif line_str.startswith("![") and "](" in line_str:
                try:
                    img_rel = line_str.split("](")[1].rstrip(")")
                    img_full = os.path.normpath(os.path.join(os.path.dirname(md_file), img_rel))
                    if os.path.exists(img_full):
                        story.append(Image(img_full, width=450, height=250))
                        story.append(Spacer(1, 10))
                except Exception as e:
                    print(f"PDF Image Error: {e}")
            elif line_str:
                story.append(Paragraph(line_str, body_style))

    doc.build(story)
    print(f"Successfully generated PDF -> {pdf_file}")

def generate_all_pdfs():
    pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. Project_Report.pdf
    build_pdf_from_md(
        os.path.join(pkg_dir, "01_Project_Report", "Project_Report.md"),
        os.path.join(pkg_dir, "01_Project_Report", "Project_Report.pdf"),
        "IndustrialGPT – Technical Project Report"
    )

    # 2. Hackathon_Submission.pdf
    build_pdf_from_md(
        os.path.join(pkg_dir, "02_Hackathon_Submission", "Hackathon_Submission.md"),
        os.path.join(pkg_dir, "02_Hackathon_Submission", "Hackathon_Submission.pdf"),
        "IndustrialGPT – Official Hackathon Submission"
    )

if __name__ == "__main__":
    generate_all_pdfs()
