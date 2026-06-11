#!/usr/bin/env python3
"""Fix duplicate FAQ question titles - simple string replace approach."""

import re
from pathlib import Path

TOOLS_DIR = Path("/Users/zhaoshuanghu/CodeBuddy/toolsbase/tools")

def fix_file(filepath):
    """Fix duplicate FAQ questions."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Strategy: For each file, find the FAQ section and look for patterns of:
    # <div class="faq-item"> followed by <div class="faq-question">What Is... or Why Use...
    # Then extract the emoji and create unique questions.

    faq_match = re.search(r'<section class="faq-section">.*?</section>', content, re.DOTALL)
    if not faq_match:
        return False

    faq_section = faq_match.group(0)

    # Find all faq-item blocks using a simpler split approach
    # Split by '<div class="faq-item">' keeping the delimiter
    parts = re.split(r'(<div class="faq-item">)', faq_section)

    # Reassemble into items
    items = []
    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            items.append(parts[i] + parts[i+1])

    # For items with duplicate questions, we need to split them further
    # The issue is that each faq-item contains one question but malformed HTML
    # makes them appear as if they have multiple questions

    # Instead, let's just fix the question titles directly by replacing
    # the pattern where the same question appears multiple times consecutively

    # Find groups of consecutive items with same question
    processed_section = faq_section
    changes = 0

    # Pattern: look for sequences like:
    # <div class="faq-item">...<div class="faq-question">X<span...
    # <div class="faq-item">...<div class="faq-question">X<span...
    # <div class="faq-item">...<div class="faq-question">X<span...

    # Extract all question titles and their positions
    question_pattern = re.compile(r'<div class="faq-question">([^<]+)<span class="faq-icon">\+</span></div>')

    questions = []
    for m in question_pattern.finditer(processed_section):
        questions.append({
            'text': m.group(1),
            'start': m.start(),
            'end': m.end()
        })

    # Find consecutive groups with same question (no onclick between them)
    i = 0
    while i < len(questions):
        group_start = i
        q_text = questions[i]['text']
        # Check if next questions have same text and no onclick in between
        while i + 1 < len(questions) and questions[i + 1]['text'] == q_text:
            # Check if there's an onclick item between these questions
            between_text = processed_section[questions[i]['end']:questions[i + 1]['start']]
            if 'onclick="toggleFaq(this)"' in between_text:
                break
            i += 1

        group_size = i - group_start + 1
        if group_size > 1:
            # We have duplicates - fix them
            # Get the actual faq-item blocks for this group
            for j in range(group_start, i + 1):
                q_pos = questions[j]['start']
                # Find the start of this faq-item
                item_start = processed_section.rfind('<div class="faq-item">', 0, q_pos)
                if item_start == -1:
                    continue

                # Extract the emoji from this item's answer
                # Look for <strong>emoji</strong> pattern
                item_end_search = processed_section[q_pos:q_pos + 2000]
                emoji_match = re.search(r'<strong>([\U00010000-\U0010ffff])</strong>', item_end_search)
                if emoji_match:
                    emoji = emoji_match.group(1)
                    # Create new question title
                    new_q = f"{emoji} {q_text}"

                    # Replace in the section
                    old_q_pattern = f'<div class="faq-question">{q_text}<span class="faq-icon">+</span></div>'
                    new_q_pattern = f'<div class="faq-question">{new_q}<span class="faq-icon">+</span></div>'

                    # Only replace this specific occurrence (the j-th one)
                    # Count how many we've already replaced before this position
                    count_before = sum(1 for k in range(j) if questions[k]['text'] == q_text and k < group_start)
                    # Find the correct occurrence to replace
                    search_start = 0
                    for _ in range(count_before):
                        idx = processed_section.find(old_q_pattern, search_start)
                        if idx != -1:
                            search_start = idx + 1

                    idx = processed_section.find(old_q_pattern, search_start)
                    if idx != -1 and idx >= q_pos - 100:
                        processed_section = processed_section[:idx] + new_q_pattern + processed_section[idx + len(old_q_pattern):]
                        changes += 1

        i += 1

    # Remove "What is X used for?" items
    used_for_pattern = re.compile(
        r'<div class="faq-item" onclick="toggleFaq\(this\)">\s*'
        r'<div class="faq-question">What is [^<]* used for\?<span class="faq-icon">\+</span></div>\s*'
        r'<div class="faq-answer">[^<]+</div>\s*'
        r'</div>\s*',
        re.DOTALL
    )
    new_section, n_removed = used_for_pattern.subn('', processed_section)
    if n_removed > 0:
        changes += n_removed

    if changes > 0:
        content = content[:faq_match.start()] + new_section + content[faq_match.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    count = 0
    for filepath in sorted(TOOLS_DIR.rglob('*.html')):
        try:
            if fix_file(filepath):
                print(f"Fixed: {filepath.relative_to(TOOLS_DIR)}")
                count += 1
        except Exception as e:
            print(f"Error in {filepath}: {e}")
    print(f"\nTotal fixed: {count} files")

if __name__ == '__main__':
    main()