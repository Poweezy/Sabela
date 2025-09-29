import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the button
old = '<button class="btn btn-primary" id="view-detailed-report" onclick="navigateToDetailedReport()">View Detailed Report</button>'
new = '<button class="btn btn-primary" id="view-detailed-report" tabindex="0" onclick="navigateToDetailedReport()">View Detailed Report</button>'

content = content.replace(old, new)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement done")
