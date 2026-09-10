import urllib.request
import urllib.parse
import os

base_url = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/"

astronaut_attempts = [
    "Woman astronaut/3D/woman_astronaut_3d.png",
    "Man astronaut/3D/man_astronaut_3d.png",
    "Astronaut/3D/astronaut_3d.png",
    "Person astronaut/3D/person_astronaut_3d.png",
    "Woman astronaut Light/3D/woman_astronaut_light_3d.png",
    "Woman astronaut light skin tone/3D/woman_astronaut_light_skin_tone_3d.png",
    "Man astronaut light skin tone/3D/man_astronaut_light_skin_tone_3d.png",
    "Person in spacesuit/3D/person_in_spacesuit_3d.png"
]

earth_attempts = [
    "Globe showing Americas/3D/globe_showing_americas_3d.png",
    "Globe showing Europe-Africa/3D/globe_showing_europe-africa_3d.png",
    "Globe showing Asia-Australia/3D/globe_showing_asia-australia_3d.png",
    "Earth globe Americas/3D/earth_globe_americas_3d.png",
    "Globe/3D/globe_3d.png",
    "Earth globe/3D/earth_globe_3d.png"
]

def fetch_first(name, attempts):
    for path in attempts:
        encoded_parts = [urllib.parse.quote(p) for p in path.split('/')]
        encoded_path = '/'.join(encoded_parts)
        url = f"{base_url}{encoded_path}"
        out_file = f"frontend/public/assets/space/{name}.png"
        try:
            print(f"Trying {url}...")
            urllib.request.urlretrieve(url, out_file)
            print(f"  Success: {name} ({path})")
            return
        except Exception as e:
            pass
    print(f"  Failed all attempts for {name}")

fetch_first("astronaut", astronaut_attempts)
fetch_first("earth", earth_attempts)
