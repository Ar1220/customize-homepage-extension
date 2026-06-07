import re

with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the import
content = content.replace('import { safeSetItem } from "./utils/storage";', 'import { storageBridge } from "./utils/storage";')

# Replace safeSetItem calls
content = content.replace('safeSetItem(', 'storageBridge.set(')

# Replace localStorage.getItem
content = re.sub(r'localStorage\.getItem\((.*?)\)', r'await storageBridge.get(\1, null)', content)

# Wrap the useEffect body in an async IIFE
use_effect_regex = re.compile(r'(useEffect\(\(\) => \{\n\s*setIsMounted\(true\);\n)(\s*// Load saved preferences.*?)(?=\n\s*// Sync volume changes)', re.DOTALL)

def replace_use_effect(match):
    prefix = match.group(1)
    body = match.group(2)
    # indentation
    body_indented = '\n'.join('  ' + line for line in body.split('\n'))
    return prefix + '  const loadSettings = async () => {\n' + body_indented + '\n  };\n  loadSettings();\n'

content = use_effect_regex.sub(replace_use_effect, content)

# Remove localStorage.removeItem and replace with set(..., null)
content = content.replace('localStorage.removeItem(', 'storageBridge.set(')

with open('src/app/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
