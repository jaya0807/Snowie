import urllib.request
import json
import urllib.parse
import os

url = "https://api.github.com/repos/microsoft/fluentui-emoji/contents/assets"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        for item in data:
            if item['type'] == 'dir':
                name = item['name'].lower()
                if 'astronaut' in name or 'globe' in name or 'earth' in name or 'space' in name:
                    print(f"Found match: {item['name']}")
                    
                    # fetch 3d file path
                    try:
                        sub_url = f"https://api.github.com/repos/microsoft/fluentui-emoji/contents/assets/{urllib.parse.quote(item['name'])}/3D"
                        sub_req = urllib.request.Request(sub_url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(sub_req) as sub_response:
                            sub_data = json.loads(sub_response.read().decode())
                            for f in sub_data:
                                if f['name'].endswith('.png'):
                                    print(f"  -> Path: {item['name']}/3D/{f['name']}")
                                    
                                    # Download it
                                    download_url = f"https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/{urllib.parse.quote(item['name'])}/3D/{urllib.parse.quote(f['name'])}"
                                    out_name = "astronaut.png" if "astronaut" in name else "earth.png"
                                    out_file = f"frontend/public/assets/space/{out_name}"
                                    print(f"     Downloading to {out_file}...")
                                    urllib.request.urlretrieve(download_url, out_file)
                    except Exception as e:
                        print(f"  Error fetching subfolder: {e}")
except Exception as e:
    print(f"Error: {e}")
