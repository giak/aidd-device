#!/usr/bin/env python3
import json
import os
import re
from datetime import datetime
from pathlib import Path

def load_report_template():
    template_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/assets/report-template.md")
    with open(template_path, 'r') as f:
        return f.read()

def load_locked_sets():
    locked_sets_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/locked-sets.json")
    with open(locked_sets_path, 'r') as f:
        return json.load(f)

def categorize_gaps_by_locked_order(gaps):
    locked_sets = load_locked_sets()
    categories = locked_sets["categories"]
    
    # Initialize categories
    categorized = {cat: [] for cat in categories}
    
    # Sort gaps by category (locked order) and severity
    severity_order = {"blocker": 1, "major": 2, "minor": 3}
    
    for gap in gaps:
        category = gap["category"]
        if category in categorized:
            categorized[category].append(gap)
    
    # Sort each category by severity
    for cat in categorized:
        categorized[cat].sort(key=lambda x: severity_order.get(x["severity"], 4))
    
    # Return in locked order, only categories that have gaps
    result = {}
    for cat in categories:
        if categorized[cat]:
            result[cat] = categorized[cat]
    
    return result

def render_report(source_path, gaps, warnings):
    # Get the report template
    template = load_report_template()
    
    # Derive the report path
    source_path_obj = Path(source_path)
    report_filename = source_path_obj.stem + "-shadow-report.md"
    report_path = source_path_obj.parent / report_filename
    
    # Prepare the report content
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    # Count totals
    total_gaps = len(gaps)
    blocker_count = sum(1 for gap in gaps if gap["severity"] == "blocker")
    major_count = sum(1 for gap in gaps if gap["severity"] == "major")
    minor_count = sum(1 for gap in gaps if gap["severity"] == "minor")
    
    # Replace placeholders in template
    content = template
    content = content.replace("<source_path>", source_path)
    content = content.replace("<generated_at>", generated_at)
    
    # Format header
    header_line = f"# Shadow Areas Report\n\nSource: `{source_path}`\nGenerated: `{generated_at}`\n\nTotal gaps: {total_gaps} | Blocker: {blocker_count} | Major: {major_count} | Minor: {minor_count}\n"
    
    # Add warnings section if any
    warnings_section = ""
    if warnings:
        warnings_section = "\n## Warnings\n\n"
        for warning in warnings:
            warnings_section += f"- {warning}\n"
        warnings_section += "\n---\n"
    
    # Build the main content
    main_content = ""
    
    # Group gaps by category
    categorized = categorize_gaps_by_locked_order(gaps)
    
    # Add category sections
    for category in categorized:
        main_content += f"\n### {category}\n\n"
        for gap in categorized[category]:
            main_content += f"**[{gap['severity']}]** {gap['probe']}\n"
            if gap.get("snippet"):
                main_content += f"> {gap['snippet']}\n\n"
    
    # Add status stamp
    status = ""
    if blocker_count == 0 and major_count == 0:
        # Find the frontmatter section
        frontmatter_pattern = r'---\n(.*?)\n---\n'
        match = re.search(frontmatter_pattern, content, re.DOTALL)
        if match:
            frontmatter = match.group(1)
            # Add status line
            if "status:" not in frontmatter:
                frontmatter += "\nstatus: clean"
            # Replace the frontmatter
            content = content[:match.start(1)] + frontmatter + content[match.end(1):]
        status = "\nstatus: clean\n"
    
    # Combine everything
    final_content = header_line + warnings_section + main_content
    
    # Write the report
    with open(report_path, 'w') as f:
        f.write(final_content)
    
    print(f"Report rendered and saved to: {report_path}")
    print(f"Total gaps: {total_gaps} (Blockers: {blocker_count}, Majors: {major_count}, Minors: {minor_count})")
    
    return report_path

# Main execution
artifact_path = "/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md"

# Load the gaps from the detection step
gaps_file = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/terrain/.scratch/detected_gaps.json")
with open(gaps_file, 'r') as f:
    detected_data = json.load(f)

gaps = detected_data["gaps"]
warnings = detected_data["warnings"]

print(f"Loading {len(gaps)} gaps for report rendering...")

# Render the report
report_path = render_report(artifact_path, gaps, warnings)

print(f"\n=== REPORT RENDERING COMPLETE ===")
print(f"Report generated successfully at: {report_path}")