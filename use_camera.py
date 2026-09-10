import os, re

def fix_camera(act_num, folder):
    dir_path = f"frontend/src/activities/{folder}"
    ui_file = f"{dir_path}/Activity{act_num}UI.tsx"
    
    with open(ui_file, "r") as f:
        content = f.read()
        
    cam_regex = r'(  // Camera and Telemetry state\n.*?  \}, \[.*?\]\);\n)'
    if act_num == 4:
        cam_regex = r'(  const videoRef = useRef<HTMLVideoElement>\(null\).*?  \}, \[\]\);\n)'
        
    cam_match = re.search(cam_regex, content, re.DOTALL)
    
    if cam_match:
        old_block = cam_match.group(1)
        
        new_block = f"""  // Session init
  useEffect(() => {{
    const initSession = async () => {{
      try {{
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=A{act_num}`, {{ method: 'POST' }});
        const data = await res.json();
        setSessionId(data.session_id);
      }} catch(e) {{ console.error(e); }}
    }};
    initSession();
  }}, []);"""
  
        content = content.replace(old_block, new_block)
        
    jsx_regex = r'(      \{/\* Hidden camera.*?</canvas>)'
    if act_num == 3: jsx_regex = r'(      \{/\* Hidden camera.*?</canvas>)'
    if act_num == 4: jsx_regex = r'(      \{/\* Hidden camera.*?</canvas>)'
    if act_num == 5: jsx_regex = r'(      \{/\* Hidden camera.*?</canvas>)'
    if act_num == 6: jsx_regex = r'(      \{/\* Hidden camera.*?</canvas>)'
    
    # Let's just use string replacement for the exact tags
    content = re.sub(r'      \{/\* Hidden camera.*?\n      <video ref=\{videoRef\} autoPlay playsInline muted className="hidden" />\n      <canvas ref=\{canvasRef\} className="hidden" />', 
                     f'      {{/* Hidden camera & telemetry */}}\n      <HiddenCameraProcessor sessionId={{sessionId || "mock"}} activityId="A{act_num}" />', content)
                     
    content = re.sub(r'      <video ref=\{videoRef\} autoPlay playsInline muted className="hidden" />\n      <canvas ref=\{canvasRef\} className="hidden" />', 
                     f'      {{/* Hidden camera & telemetry */}}\n      <HiddenCameraProcessor sessionId={{sessionId || "mock"}} activityId="A{act_num}" />', content)
                     
    imp = 'import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";\n'
    if 'import HiddenCameraProcessor' not in content:
        content = content.replace('"use client";', '"use client";\n' + imp)
    
    with open(ui_file, "w") as f:
        f.write(content)

fix_camera(2, "a2_follow_instruction")
fix_camera(3, "a3_target_finding")
fix_camera(4, "a4_imitation")
fix_camera(5, "a5_emotion_social")
fix_camera(6, "a6_controlled_challenge")
