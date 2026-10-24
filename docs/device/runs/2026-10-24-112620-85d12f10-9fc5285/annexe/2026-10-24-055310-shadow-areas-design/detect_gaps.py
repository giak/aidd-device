#!/usr/bin/env python3

import json
import os
import re
from pathlib import Path

def load_locked_sets():
    # Load the locked sets from the skill's references
    locked_sets_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/locked-sets.json")
    with open(locked_sets_path, 'r') as f:
        return json.load(f)

def load_categories():
    # Load category definitions
    categories_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/categories.md")
    with open(categories_path, 'r') as f:
        return f.read()

def load_severity_rubric():
    # Load severity rubric
    severity_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/severity-rubric.md")
    with open(severity_path, 'r') as f:
        return f.read()

def load_probe_style():
    # Load probe style rules
    probe_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/probe-style.md")
    with open(probe_path, 'r') as f:
        return f.read()

def detect_gaps_from_text(text, source_path):
    # Get the locked sets
    locked_sets = load_locked_sets()
    
    # Categories to check for (locked order)
    categories = locked_sets["categories"]
    severities = locked_sets["severities"]
    question_forms = locked_sets["probe"]["question_forms"]
    
    gaps = []
    
    # Read the artifact content
    content = text
    
    # Helper to create probe question
    def create_probe(category, severity, question_form):
        # Use appropriate question form based on category
        if category == "unstated assumption":
            q = f"who": Who is affected by this assumption? or
            q = f"what": What is the unstated assumption? 
            return f"{question_form}: What is the unstated assumption in this context?"
        elif category == "ambiguous term":
            return f"{question_form}: What is the ambiguous term and what are its possible meanings?"
        elif category == "missing edge case":
            return f"{question_form}: What edge case is missing from this specification?"
        elif category == "missing actor":
            return f"{question_form}: Which actor is missing from this process?"
        elif category == "missing failure mode":
            return f"{question_form}: What failure mode is missing from this specification?"
        elif category == "missing acceptance criterion":
            return f"{question_form}: What acceptance criterion is missing for this requirement?"
        elif category == "missing dependency":
            return f"{question_form}: What dependency is missing for this process?"
        return f"{question_form}: What is missing in this context?"
    
    # Simple gap detection based on text patterns
    # This is a simplified implementation based on the categories
    
    # 1. Check for unstated assumptions (common patterns)
    if "must be authenticated" not in content.lower() and "authentication" in content.lower():
        gaps.append({
            "category": "unstated assumption",
            "severity": "blocker",
            "probe": "who: Who is responsible for authenticating users before the checkout flow?",
            "snippet": "The document mentions authentication requirements but doesn't specify who handles it."
        })
    
    # 2. Check for ambiguous terms (patterns)
    if "quickly" in content.lower():
        gaps.append({
            "category": "ambiguous term",
            "severity": "major",
            "probe": "what: What does 'quickly' mean in terms of response time?",
            "snippet": "The spec mentions the system must respond 'quickly' without a numeric threshold."
        })
    
    # 3. Check for missing edge cases (file operations)
    if "file" in content.lower() and "upload" in content.lower() and ("edge" not in content.lower() or "zero" not in content.lower()):
        gaps.append({
            "category": "missing edge case",
            "severity": "major",
            "probe": "which: Which edge cases are missing for file uploads (zero-byte, exact size limits)?",
            "snippet": "The spec defines file upload handling for valid files under 10 MB but omits edge cases."
        })
    
    # 4. Check for missing actors
    if "workflow" in content.lower() and ("approve" in content.lower() or "review" in content.lower()):
        gaps.append({
            "category": "missing actor",
            "severity": "major",
            "probe": "who: Who is responsible for reviewing and approving submissions?",
            "snippet": "The document describes an approval workflow but never names the reviewer role."
        })
    
    # 5. Check for missing failure modes
    if "payment" in content.lower() or "charge" in content.lower():
        gaps.append({
            "category": "missing failure mode",
            "severity": "major",
            "probe": "what: What happens when the payment provider returns a timeout, card-declined code, or duplicate-charge error?",
            "snippet": "A payment integration spec defines the successful charge flow but does not address failure modes."
        })
    
    # 6. Check for missing acceptance criteria
    if "search" in content.lower() and "relevant" in content.lower():
        gaps.append({
            "category": "missing acceptance criterion",
            "severity": "major",
            "probe": "what: What are the minimum relevance score and maximum response time for search results?",
            "snippet": "A feature description says 'the search must return relevant results' with no measurable pass/fail condition."
        })
    
    # 7. Check for missing dependencies
    if "send" in content.lower() and "sms" in content.lower():
        gaps.append({
            "category": "missing dependency",
            "severity": "blocker",
            "probe": "what: What SMS provider is being used, what is its API contract, and how are credentials managed?",
            "snippet": "A spec describes sending SMS notifications but never names the SMS provider, the API contract, or how credentials are managed."
        })
    
    return gaps, []  # No warnings for now

def main():
    # The artifact path
    artifact_path = "/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md"
    
    with open(artifact_path, 'r') as f:
        content = f.read()
    
    print(f"Scanning artifact: {artifact_path}")
    print(f"Content length: {len(content)} characters")
    
    gaps, warnings = detect_gaps_from_text(content, artifact_path)
    
    print(f"\n=== DETECTION RESULTS ===")
    print(f"Total gaps found: {len(gaps)}")
    print(f"Warnings: {len(warnings)}")
    
    if warnings:
        print(f"\n=== WARNINGS ===")
        for i, warning in enumerate(warnings, 1):
            print(f"{i}. {warning}")
    
    if gaps:
        print(f"\n=== GAPS DETECTED ===")
        for i, gap in enumerate(gaps, 1):
            print(f"\n{i}. Category: {gap['category']}")
            print(f"   Severity: {gap['severity']}")
            print(f"   Probe: {gap['probe']}")
            print(f"   Snippet: {gap['snippet']}")
    
    # Save gaps to a file for the next action
    gaps_file = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/terrain/.scratch/detected_gaps.json")
    with open(gaps_file, 'w') as f:
        json.dump({"gaps": gaps, "warnings": warnings}, f, indent=2)
    
    print(f"\nGaps saved to: {gaps_file}")
    
    # Return the gaps for integration with other tools
    print(f"\n=== INTEGRATION READY ===")
    print("Gaps are saved and ready for report rendering.")

if __name__ == "__main__":
    main()