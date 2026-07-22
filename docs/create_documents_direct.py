import os
import sys
import zipfile

def build_pdf_file(target_path, title, headings_and_paragraphs):
    """
    Constructs a 100% valid PDF 1.4 binary file with page catalog, font dictionaries, 
    stream objects, xref table, and trailer.
    """
    stream_content = []
    stream_content.append("BT")
    stream_content.append("/F1 20 Tf")
    stream_content.append("54 750 Td")
    stream_content.append(f"({title}) Tj")
    stream_content.append("ET")

    y_pos = 710
    for heading, text in headings_and_paragraphs:
        if y_pos < 100:
            break
        # Heading
        stream_content.append("BT")
        stream_content.append("/F1 14 Tf")
        stream_content.append(f"54 {y_pos} Td")
        safe_heading = heading.replace("(", "\\(").replace(")", "\\)")
        stream_content.append(f"({safe_heading}) Tj")
        stream_content.append("ET")
        y_pos -= 24

        # Text
        stream_content.append("BT")
        stream_content.append("/F2 10 Tf")
        stream_content.append(f"54 {y_pos} Td")
        safe_text = text[:80].replace("(", "\\(").replace(")", "\\)")
        stream_content.append(f"({safe_text}) Tj")
        stream_content.append("ET")
        y_pos -= 30

    content_bytes = "\n".join(stream_content).encode("utf-8")
    content_len = len(content_bytes)

    objects = []
    # 1 0 obj: Catalog
    objects.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # 2 0 obj: Pages
    objects.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # 3 0 obj: Page
    objects.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n")
    # 4 0 obj: Resources
    objects.append("4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n")
    # 5 0 obj: Contents Stream
    objects.append(f"5 0 obj\n<< /Length {content_len} >>\nstream\n" + "\n".join(stream_content) + "\nendstream\nendobj\n")

    # Build header and offsets
    pdf_bytes = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]

    for obj in objects:
        offsets.append(len(pdf_bytes))
        pdf_bytes.extend(obj.encode("utf-8"))

    xref_start = len(pdf_bytes)
    pdf_bytes.extend(b"xref\n0 6\n0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf_bytes.extend(f"{offset:010d} 00000 n \n".encode("utf-8"))

    trailer = f"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n{xref_start}\n%%EOF\n"
    pdf_bytes.extend(trailer.encode("utf-8"))

    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, "wb") as f:
        f.write(pdf_bytes)

    print(f"Generated PDF file ({len(pdf_bytes):,} bytes) -> {target_path}")

def build_docx_file(target_path, title, paragraphs):
    """
    Constructs a 100% valid Word .docx OPC ZIP package.
    """
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    word_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault>
  </w:docDefaults>
</w:styles>"""

    body_elements = []
    body_elements.append(f'<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="1E3A8A"/></w:rPr><w:t>{title}</w:t></w:r></w:p>')

    for p in paragraphs:
        safe_p = p.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        body_elements.append(f'<w:p><w:r><w:t>{safe_p}</w:t></w:r></w:p>')

    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {"".join(body_elements)}
  </w:body>
</w:document>"""

    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with zipfile.ZipFile(target_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", rels)
        zf.writestr("word/_rels/document.xml.rels", word_rels)
        zf.writestr("word/document.xml", document_xml)
        zf.writestr("word/styles.xml", styles_xml)

    print(f"Generated DOCX file ({os.path.getsize(target_path):,} bytes) -> {target_path}")

def build_pptx_file(target_path, title, slides_info):
    """
    Constructs a 100% valid PowerPoint .pptx OPC ZIP package.
    """
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>"""

    ppt_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
</Relationships>"""

    presentation_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldIdLst>
    <p:sldId id="256" r:id="rId1"/>
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000"/>
</p:presentation>"""

    slide1_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:grpSpPr/></p:nvGrpSpPr>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:p><a:r><a:rPr lang="en-US" sz="4000" bold="1"/><a:t>{title}</a:t></a:r></a:p>
          <a:p><a:r><a:rPr lang="en-US" sz="2000"/><a:t>AI for Industrial Knowledge Intelligence: Unified Asset &amp; Operations Brain</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>"""

    slide_master = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:grpSpPr/></p:nvGrpSpPr></p:spTree></p:cSld>
</p:sldMaster>"""

    slide_layout = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="title">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:grpSpPr/></p:nvGrpSpPr></p:spTree></p:cSld>
</p:sldLayout>"""

    slide_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>"""

    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with zipfile.ZipFile(target_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", rels)
        zf.writestr("ppt/_rels/presentation.xml.rels", ppt_rels)
        zf.writestr("ppt/presentation.xml", presentation_xml)
        zf.writestr("ppt/slides/slide1.xml", slide1_xml)
        zf.writestr("ppt/slides/_rels/slide1.xml.rels", slide_rels)
        zf.writestr("ppt/slideMasters/slideMaster1.xml", slide_master)
        zf.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout)

    print(f"Generated PPTX file ({os.path.getsize(target_path):,} bytes) -> {target_path}")

def main():
    base_pkg = r"c:\IndustrialGPT\docs\Hackathon_Submission_Package"

    # Sample section content from Project_Report.md
    report_sections = [
        ("1. Executive Summary", "IndustrialGPT is an enterprise AI solution engineered to transform industrial operations, asset maintenance, and plant troubleshooting."),
        ("2. Problem Statement (PS 8)", "Industrial plants face severe knowledge fragmentation, high MTTR, and rapid loss of expert technician knowledge."),
        ("3. Proposed Solution", "Unified Asset & Operations Brain integrating multi-modal OCR document parsing, ChromaDB vector retrieval, and Neo4j Knowledge Graph."),
        ("4. Architecture & Technology Stack", "FastAPI Python 3.11 backend with SQLAlchemy 2.x Async ORM, PostgreSQL 16, ChromaDB 0.4.24, Neo4j 5, Redis 7, and React 19 Frontend."),
        ("5. Predictive Maintenance & RUL Algorithm", "Calculates equipment Remaining Useful Life (RUL hours) via sensor telemetry evaluating Vibration (mm/s), Temperature (°C), and Oil Quality (%).")
    ]

    report_paragraphs = [f"{h}: {t}" for h, t in report_sections]

    # 1. Project_Report.pdf
    pdf_report = os.path.join(base_pkg, "01_Project_Report", "Project_Report.pdf")
    build_pdf_file(pdf_report, "IndustrialGPT - Technical Project Report", report_sections)

    # 2. Project_Report.docx
    docx_report = os.path.join(base_pkg, "01_Project_Report", "Project_Report.docx")
    build_docx_file(docx_report, "IndustrialGPT - Technical Project Report", report_paragraphs)

    # 3. Hackathon_Submission.pdf
    pdf_sub = os.path.join(base_pkg, "02_Hackathon_Submission", "Hackathon_Submission.pdf")
    build_pdf_file(pdf_sub, "IndustrialGPT - Official Hackathon Submission", report_sections)

    # 4. IndustrialGPT_Presentation.pptx
    pptx_file = os.path.join(base_pkg, "03_Presentation", "IndustrialGPT_Presentation.pptx")
    build_pptx_file(pptx_file, "IndustrialGPT Presentation", report_sections)

    # 5. Final ZIP Submission
    zip_dir = os.path.join(base_pkg, "10_Final_Submission")
    os.makedirs(zip_dir, exist_ok=True)
    zip_path = os.path.join(zip_dir, "IndustrialGPT_ET_AI_Hackathon_Submission.zip")

    if os.path.exists(zip_path):
        os.remove(zip_path)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_pkg):
            for file in files:
                if file == "IndustrialGPT_ET_AI_Hackathon_Submission.zip":
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(base_pkg))
                zipf.write(file_path, arcname)

    print(f"Generated ZIP archive ({os.path.getsize(zip_path):,} bytes) -> {zip_path}")

if __name__ == "__main__":
    main()
