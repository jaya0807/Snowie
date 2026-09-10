import urllib.request
import os

os.makedirs("frontend/public/assets/character", exist_ok=True)
url = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f43b.svg"
try:
    urllib.request.urlretrieve(url, "frontend/public/assets/character/bear_head.svg")
    print("Successfully downloaded twemoji bear head!")
except Exception as e:
    print(f"Error: {e}")
