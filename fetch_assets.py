import urllib.request
import json
import base64
import os

print("Searching github for Kenney animal characters...")
# Searching github code for path:Vector/ bear_head.svg
url = "https://api.github.com/search/code?q=filename:bear_head.svg+path:Vector"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
    if data['total_count'] > 0:
        repo = data['items'][0]['repository']['full_name']
        print(f"Found repo: {repo}")
        
        # Download bear parts
        parts = ["bear_head.svg", "bear_body.svg", "bear_armLeft.svg", "bear_armRight.svg", "bear_legLeft.svg", "bear_legRight.svg"]
        base_url = f"https://raw.githubusercontent.com/{repo}/master/"
        path = data['items'][0]['path'].replace("bear_head.svg", "")
        
        os.makedirs("frontend/public/assets/character", exist_ok=True)
        
        for part in parts:
            part_url = f"{base_url}{path}{part}"
            print(f"Downloading {part_url}")
            urllib.request.urlretrieve(part_url, f"frontend/public/assets/character/{part}")
            
        print("Success!")
    else:
        print("No results found on Github for bear_head.svg in path:Vector.")
except Exception as e:
    print(f"Error: {e}")
