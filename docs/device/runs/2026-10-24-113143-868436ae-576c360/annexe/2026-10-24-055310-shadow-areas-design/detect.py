#!/usr/bin/env python3
import json
import re
from pathlib import Path

# Load locked sets
with open('/home/giak/aidd-device-work-rejeu3/2026-10-24-055310-shadow-areas-design/framework-origin/plugins/aidd-refine/skills/03-shadow-areas/references/locked-sets.json') as f:
    locked_sets = json.load(f)

categories = locked_sets['categories']
severities = locked_sets['severities']
question_forms = locked_sets['probe']['question_forms']

# Load the artifact
artifact_path = Path('/home/giak/aidd-device-work-rejeu3/2026-10-24-055310-shadow-areas-design/terrain/docs/superpowers/specs/2026-08-01-carte-visite-v2-design.md')
content = artifact_path.read_text(encoding='utf-8')

# Pattern for gaps detection
gaps = []

# 1. Unstated assumption: processes treated as obvious without being written down
unstated_patterns = [
    (r'v2.*plus minimale.*plus « carrée »', 'major', 'What is the exact definition of "plus minimale" and "plus carrée"?'),
    (r'calibrée par mesure réelle', 'major', 'What are the exact measurement procedures for the pyramid calibration?'),
    (r'algorithme de mesure à répliquer', 'blocker', 'What is the exact implementation algorithm to replicate the measurement?'),
    (r'la feuille d\'impression n\'a pas besoin de canvas', 'major', 'What fallback mechanism exists if the algorithm fails?'),
]

for pattern, severity, question in unstated_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'unstated assumption',
            'severity': severity,
            'question': question + ' (unstated assumption)',
            'snippet': snippet
        }
        gaps.append(gap)

# 2. Ambiguous term: words/phrases with multiple interpretations
ambiguous_patterns = [
    (r'quelque temps', 'minor', 'What specific time range does "quelque temps" refer to in the calibration context?'),
    (r'petite décalage', 'minor', 'What magnitude of "petite décalage" is acceptable for the signature placement?'),
    (r'centre verticalement', 'minor', 'What is the exact vertical centering tolerance for the 4 lines?'),
]

for pattern, severity, question in ambiguous_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'ambiguous term',
            'severity': severity,
            'question': question + ' (ambiguous term)',
            'snippet': snippet
        }
        gaps.append(gap)

# 3. Missing edge case: boundary conditions not covered
edge_case_patterns = [
    (r'file-upload spec', 'major', 'What happens if the browser doesn\'t have the required fonts?'),
    (r'@page.*marges', 'major', 'What happens if the page margins cause the cards to exceed A4 size?'),
    (r'Google Fonts', 'major', 'What happens if the fonts fail to load or render?'),
    (r'chrome headless', 'major', 'What happens if the PDF generation fails or produces invalid output?'),
]

for pattern, severity, question in edge_case_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'missing edge case',
            'severity': severity,
            'question': question + ' (missing edge case)',
            'snippet': snippet
        }
        gaps.append(gap)

# 4. Missing actor: entities that take actions or are affected but absent
actor_patterns = [
    (r'imprimée en laser', 'major', 'Who is responsible for printing and distributing the business cards?'),
    (r'découpeables', 'major', 'Who is responsible for quality checking the cut cards?'),
    (r'imprimé en laser B\&N', 'major', 'Who monitors the print quality and resolves printing issues?'),
]

for pattern, severity, question in actor_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'missing actor',
            'severity': severity,
            'question': question + ' (missing actor)',
            'snippet': snippet
        }
        gaps.append(gap)

# 5. Missing failure mode: what happens when the system fails
failure_patterns = [
    (r'règles', 'major', 'What happens if the laser printer jams during production?'),
    (r'PDF', 'major', 'What happens if the PDF generation produces corrupted or invalid output?'),
    (r'font', 'major', 'What happens if the fonts are not available in the PDF generation environment?'),
]

for pattern, severity, question in failure_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'missing failure mode',
            'severity': severity,
            'question': question + ' (missing failure mode)',
            'snippet': snippet
        }
        gaps.append(gap)

# 6. Missing acceptance criterion: no testable pass/fail conditions
criterion_patterns = [
    (r'lisibles', 'major', 'What are the quantitative criteria for the cards to be considered "lisibles" (readable)?'),
    (r'tronqué', 'major', 'What is the exact tolerance for text to be considered "non tronqué" (not truncated)?'),
    (r'visible', 'major', 'What are the specific measurements or tests for the pyramid visibility?'),
]

for pattern, severity, question in criterion_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'missing acceptance criterion',
            'severity': severity,
            'question': question + ' (missing acceptance criterion)',
            'snippet': snippet
        }
        gaps.append(gap)

# 7. Missing dependency: external systems needed but not named
dependency_patterns = [
    (r'GitHub', 'major', 'What is the exact repository structure and access requirements?'),
    (r'substack.com', 'major', 'What are the Substack API requirements for publishing?'),
    (r'Stack Overflow', 'minor', 'What are the external documentation or reference requirements?'),
]

for pattern, severity, question in dependency_patterns:
    if re.search(pattern, content, re.IGNORECASE):
        # Extract snippet
        for line in content.split('\n'):
            if re.search(pattern, line, re.IGNORECASE):
                snippet = line.strip()
                break
        else:
            snippet = ""
        
        gap = {
            'category': 'missing dependency',
            'severity': severity,
            'question': question + ' (missing dependency)',
            'snippet': snippet
        }
        gaps.append(gap)

# Deduplicate gaps (same category and snippet)
unique_gaps = []
seen = set()
for gap in gaps:
    key = (gap['category'], gap.get('snippet', ''))
    if key not in seen:
        seen.add(key)
        unique_gaps.append(gap)

print(json.dumps(unique_gaps, indent=2, ensure_ascii=False))