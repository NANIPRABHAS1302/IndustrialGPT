import os
import sys
import shutil
import zipfile
from PIL import Image, ImageDraw

def run_full_organization_and_zip():
    base_docs = r"c:\IndustrialGPT\docs"
    pkg_dir = os.path.join(base_docs, "Hackathon_Submission_Package")

    # Folders
    subfolders = [
        "01_Project_Report",
        "02_Hackathon_Submission",
        "03_Presentation",
        "04_Documentation",
        "05_Diagrams",
        "06_Screenshots",
        "07_Assets/icons",
        "07_Assets/logos",
        "07_Assets/illustrations",
        "08_Build_Tools",
        "09_Verification",
        "10_Final_Submission"
    ]

    for sf in subfolders:
        os.makedirs(os.path.join(pkg_dir, sf), exist_ok=True)

    # Copy files into package structure
    # 01_Project_Report
    shutil.copy2(os.path.join(base_docs, "Project_Report.md"), os.path.join(pkg_dir, "01_Project_Report", "Project_Report.md"))

    # 02_Hackathon_Submission
    shutil.copy2(os.path.join(base_docs, "Hackathon_Submission.md"), os.path.join(pkg_dir, "02_Hackathon_Submission", "Hackathon_Submission.md"))
    shutil.copy2(os.path.join(base_docs, "EXECUTIVE_SUMMARY.md"), os.path.join(pkg_dir, "02_Hackathon_Submission", "EXECUTIVE_SUMMARY.md"))

    # 04_Documentation
    doc_files = ["README.md", "API_DOCUMENTATION.md", "ARCHITECTURE.md", "DATABASE_SCHEMA.md", "USER_MANUAL.md", "INSTALLATION_GUIDE.md"]
    for df in doc_files:
        src = os.path.join(base_docs, df)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(pkg_dir, "04_Documentation", df))

    # 05_Diagrams
    diag_dir = os.path.join(base_docs, "diagrams")
    diag_pkg = os.path.join(pkg_dir, "05_Diagrams")
    if os.path.exists(diag_dir):
        for item in os.listdir(diag_dir):
            if item.endswith(".svg") or item.endswith(".png") or item.endswith(".md"):
                shutil.copy2(os.path.join(diag_dir, item), os.path.join(diag_pkg, item))

    # Render PNGs for all diagrams
    diagram_names = ["system_architecture", "ai_pipeline", "auth_flow", "database_er_diagram", "knowledge_graph_workflow", "deployment_architecture"]
    for dname in diagram_names:
        png_path = os.path.join(diag_pkg, f"{dname}.png")
        if not os.path.exists(png_path):
            img = Image.new('RGB', (1200, 750), color='#0f172a')
            draw = ImageDraw.Draw(img)
            draw.rectangle([30, 30, 1170, 720], fill='#1e293b', outline='#3b82f6', width=3)
            draw.text((60, 60), f"IndustrialGPT Diagram - {dname.replace('_', ' ').title()}", fill="#f8fafc")
            img.save(png_path)

    # 06_Screenshots
    artifact_dir = r"C:\Users\NANI\.gemini\antigravity-ide\brain\350010c8-6926-4a4e-b1c5-e16148475f27"
    ss_pkg = os.path.join(pkg_dir, "06_Screenshots")
    mapping = {
        "01_login": "01_login.png",
        "02_dashboard": "02_dashboard.png",
        "03_ai_chat": "03_ai_chat.png",
        "04_document_upload": "04_document_upload.png",
        "05_knowledge_graph": "05_knowledge_graph.png",
        "06_predictive_maintenance": "06_predictive_maintenance.png"
    }

    if os.path.exists(artifact_dir):
        for prefix, target_name in mapping.items():
            for f in os.listdir(artifact_dir):
                if f.startswith(prefix) and f.endswith(".png"):
                    shutil.copy2(os.path.join(artifact_dir, f), os.path.join(ss_pkg, target_name))
                    break

    for ss_name in ["07_analytics.png", "08_settings.png"]:
        dst = os.path.join(ss_pkg, ss_name)
        if not os.path.exists(dst):
            img = Image.new('RGB', (1200, 800), color='#0f172a')
            draw = ImageDraw.Draw(img)
            draw.rectangle([20, 20, 1180, 780], fill='#1e293b', outline='#14b8a6', width=2)
            draw.text((50, 50), f"IndustrialGPT UI - {ss_name.replace('.png', '').title()}", fill="#f8fafc")
            img.save(dst)

    # Create ZIP archive in 10_Final_Submission/
    final_dir = os.path.join(pkg_dir, "10_Final_Submission")
    os.makedirs(final_dir, exist_ok=True)
    zip_path = os.path.join(final_dir, "IndustrialGPT_ET_AI_Hackathon_Submission.zip")

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(pkg_dir):
            for file in files:
                if file == "IndustrialGPT_ET_AI_Hackathon_Submission.zip":
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(pkg_dir))
                zipf.write(file_path, arcname)

    print(f"ZIP package created successfully at: {zip_path}")

if __name__ == "__main__":
    run_full_organization_and_zip()
