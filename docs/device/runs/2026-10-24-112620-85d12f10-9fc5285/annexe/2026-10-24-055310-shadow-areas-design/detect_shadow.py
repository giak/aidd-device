#!/usr/bin/env python3
import json
import re
from pathlib import Path

# Load the locked sets
locked_sets_path = Path("/home/giak/aidd-device-work-rejeu2/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/locked-sets.json")
with open(locked_sets_path, 'r') as f:
    locked_sets = json.load(f)

def detect_gaps_from_text(text, source_path):
    categories = locked_sets["categories"]
    question_forms = locked_sets["probe"]["question_forms"]
    
    gaps = []
    
    # Read the artifact content
    content = text
    
    # Helper to select appropriate question form
    def get_question_form(category):
        if category == "unstated assumption":
            return "what"
        elif category == "ambiguous term":
            return "what"
        elif category == "missing edge case":
            return "which"
        elif category == "missing actor":
            return "who"
        elif category == "missing failure mode":
            return "what"
        elif category == "missing acceptance criterion":
            return "what"
        elif category == "missing dependency":
            return "what"
        return "what"
    
    # Check for unstated assumptions
    if "authentication" in content.lower() and "must be" in content.lower():
        lines = content.split('\n')
        auth_explicit = any("must be authenticated" in line.lower() or "authenticate before" in line.lower() for line in lines)
        if auth_explicit:
            gaps.append({
                "category": "unstated assumption",
                "severity": "blocker",
                "probe": "what: What is the authentication requirement that is taken for granted but not explicitly stated?",
                "snippet": "Authentication is mentioned as a requirement but the specific method or responsibility is not defined."
            })
    
    # Check for ambiguous terms
    ambiguous_patterns = [
        ("quickly", "speed or performance threshold"),
        ("small", "size or scale"),
        ("high", "level or quality"),
        ("deep", "level or thoroughness"),
        ("fast", "speed"),
        ("efficient", "performance or resource usage"),
        ("easy", "usability or simplicity"),
    ]
    
    for term, meaning in ambiguous_patterns:
        if term in content.lower():
            context_pattern = re.compile(f".*{term}.*?(?:\n|\.|\:|\,)", re.IGNORECASE)
            matches = context_pattern.findall(content)
            if matches:
                has_definition = False
                has_example = False
                for m in matches:
                    if any(word in m.lower() for word in ["defined", "threshold", "limit", "measure", "px", "mm", "pt", "size"]):
                        has_definition = True
                        break
                for m in matches:
                    if any(word in m.lower() for word in ["example", "such as", "for instance"]):
                        has_example = True
                        break
                if not (has_definition or has_example):
                    gaps.append({
                        "category": "ambiguous term",
                        "severity": "major",
                        "probe": f"what: What does '{term}' mean in this context, and what threshold or definition is missing?",
                        "snippet": f"The term '{term}' is used but lacks a precise definition or measurable threshold."
                    })
    
    # Check for missing edge cases
    if "10" in content and "MB" in content and "file" in content.lower():
        file_size_mentions = re.findall(r'\d+\s*MB', content)
        if file_size_mentions:
            edge_case_keywords = ["zero", "empty", "exactly", "exact size", "boundary", "limit", "max", "minimum", "min"]
            has_edge_case_mentions = any(keyword in content.lower() for keyword in edge_case_keywords)
            if not has_edge_case_mentions:
                gaps.append({
                    "category": "missing edge case",
                    "severity": "major",
                    "probe": "which: Which edge cases are missing for file operations (zero-byte files, exact size limits, boundary conditions)?",
                    "snippet": "File size specifications mention limits but omit edge cases like zero-byte files or exact size boundaries."
                })
    
    # Check for missing actors
    process_keywords = ["workflow", "process", "step", "stage", "submit", "review", "approve", "verify", "check"]
    if any(keyword in content.lower() for keyword in process_keywords):
        passive_patterns = re.findall(r'\b(?:is|are|was|were|be|been)\s+\w+\s+(?:by\s+\w+)?', content.lower())
        if passive_patterns:
            gaps.append({
                "category": "missing actor",
                "severity": "major",
                "probe": "who: Which actor or role is missing from this workflow or process description?",
                "snippet": "The process description uses passive voice or lacks explicit actor identification for key steps."
            })
    
    # Check for missing failure modes
    operations = ["payment", "charge", "transaction", "send", "process", "handle", "manage"]
    for operation in operations:
        if operation in content.lower():
            success_indicators = ["successful", "completed", "works", "function", "perform"]
            error_indicators = ["error", "fail", "failures", "exception", "timeout", "retry", "catch", "handle", "error handling"]
            
            has_success = any(indicator in content.lower() for indicator in success_indicators)
            has_error = any(indicator in content.lower() for indicator in error_indicators)
            
            if has_success and not has_error:
                gaps.append({
                    "category": "missing failure mode",
                    "severity": "major",
                    "probe": f"what: What failures or error conditions are missing from this {operation} specification?",
                    "snippet": f"The {operation} specification describes the success path but omits failure handling or error responses."
                })
    
    # Check for missing acceptance criteria
    requirements = re.findall(r'(?:must|should|need to|require)s?\s+(?:the\s+)?(\w+\s+\w+(?:\s+\w+)?)', content, re.IGNORECASE)
    for req in requirements:
        req_lower = req.lower()
        has_measure = any(word in req_lower for word in ["score", "time", "ms", "px", "mm", "percent", "% ", "at least", "maximum", "minimum", "exactly", "threshold"])
        has_test = any(word in req_lower for word in ["test", "verify", "validate", "check", "measure", "confirm"])
        
        if req and not (has_measure or has_test):
            if not any(gap.get("snippet", "").startswith("Requirement:") for gap in gaps):
                gaps.append({
                    "category": "missing acceptance criterion",
                    "severity": "major",
                    "probe": f"what: What are the measurable pass/fail criteria for the requirement '{req}'?",
                    "snippet": f"Requirement '{req}' lacks testable pass/fail conditions."
                })
    
    # Check for missing dependencies
    if "send" in content.lower() and "notification" in content.lower():
        dependency_keywords = ["provider", "service", "system", "api", "integration", "library", "tool", "service"]
        has_dependency = any(keyword in content.lower() for keyword in dependency_keywords)
        
        if not has_dependency:
            gaps.append({
                "category": "missing dependency",
                "severity": "blocker",
                "probe": "what: What dependency is required for sending notifications (service provider, API, integration details)?",
                "snippet": "The specification describes sending notifications but does not name the provider, API contract, or integration details."
            })
    
    return gaps, []

# Main execution
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

print(f"\n=== INTEGRATION READY ===")
print("Gaps are saved and ready for report rendering.")