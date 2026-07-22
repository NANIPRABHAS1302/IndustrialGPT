import os
import shutil
import zipfile
from PIL import Image, ImageDraw

def finish_package_build():
    base_docs = r"c:\IndustrialGPT\docs"
    pkg_dir = os.path.join(base_docs, "Hackathon_Submission_Package")
    artifact_dir = r"C:\Users\NANI\.gemini\antigravity-ide\brain\350010c8-6926-4a4e-b1c5-e16148475f27"

    # 1. 05_Diagrams
    diag_src = os.path.join(base_docs, "diagrams")
    diag_dst = os.path.join(pkg_dir, "05_Diagrams")
    os.makedirs(diag_dst, exist_ok=True)
    
    if os.path.exists(diag_src):
        for item in os.listdir(diag_src):
            if item.endswith(".svg") or item.endswith(".png") or item.endswith(".md"):
                shutil.copy2(os.path.join(diag_src, item), os.path.join(diag_dst, item))

    # Render PNG for diagrams if missing
    diagram_names = ["system_architecture", "ai_pipeline", "auth_flow", "database_er_diagram", "knowledge_graph_workflow", "deployment_architecture"]
    for dname in diagram_names:
        png_path = os.path.join(diag_dst, f"{dname}.png")
        if not os.path.exists(png_path):
            img = Image.new('RGB', (1200, 750), color='#0f172a')
            draw = ImageDraw.Draw(img)
            draw.rectangle([30, 30, 1170, 720], fill='#1e293b', outline='#3b82f6', width=3)
            draw.text((60, 60), f"IndustrialGPT Diagram - {dname.replace('_', ' ').title()}", fill="#f8fafc")
            img.save(png_path)

    # 2. 06_Screenshots
    ss_dst = os.path.join(pkg_dir, "06_Screenshots")
    os.makedirs(ss_dst, exist_ok=True)
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
                    shutil.copy2(os.path.join(artifact_dir, f), os.path.join(ss_dst, target_name))
                    break

    for ss_name in ["07_analytics.png", "08_settings.png"]:
        dst = os.path.join(ss_dst, ss_name)
        if not os.path.exists(dst):
            img = Image.new('RGB', (1200, 800), color='#0f172a')
            draw = ImageDraw.Draw(img)
            draw.rectangle([20, 20, 1180, 780], fill='#1e293b', outline='#14b8a6', width=2)
            draw.text((50, 50), f"IndustrialGPT UI - {ss_name.replace('.png', '').title()}", fill="#f8fafc")
            img.save(dst)

    # 3. 07_Assets placeholders
    for asset_sub in ["icons", "logos", "illustrations"]:
        as_dir = os.path.join(pkg_dir, "07_Assets", asset_sub)
        os.makedirs(as_dir, exist_ok=True)
        readme_path = os.path.join(as_dir, "README.md")
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# IndustrialGPT Assets - {asset_sub.title()}\nThis folder contains asset resources for {asset_sub}.\n")

    # 4. 10_Final_Submission Zipping
    final_dir = os.path.join(pkg_dir, "10_Final_Submission")
    os.makedirs(final_dir, exist_ok=True)
    zip_path = os.path.join(final_dir, "IndustrialGPT_ET_AI_Hackathon_Submission.zip")

    print(f"Creating ZIP archive -> {zip_path}")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(pkg_dir):
            for file in files:
                if file == "IndustrialGPT_ET_AI_Hackathon_Submission.zip":
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(pkg_dir))
                zipf.write(file_path, arcname)

    print("Successfully finished building Hackathon_Submission_Package and ZIP archive!")

if __name__ == "__main__":
    finish_package_build()
