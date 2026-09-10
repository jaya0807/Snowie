import urllib.request
import urllib.parse
import os

assets = {
    "monkey_face": "Monkey face/3D/monkey_face_3d.png",
    "rabbit_face": "Rabbit face/3D/rabbit_face_3d.png",
    "cat_face": "Cat face/3D/cat_face_3d.png"
}

base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

for name, path in assets.items():
    encoded_path = urllib.parse.quote(path)
    url = f"{base_url}{encoded_path}"
    out_file = f"frontend/public/assets/circus3d/{name}.png"
    print(f"Downloading {name} from {url}...")
    try:
        urllib.request.urlretrieve(url, out_file)
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
