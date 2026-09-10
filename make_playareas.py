import os, re

extractions = {
    4: ("a4_imitation", r'(            \{/\* The Movie Stage \*/\}.*?\n            \}\)\n)', "MovieStage"),
    5: ("a5_emotion_social", r'(      \{/\* UI Content Layer \*/\}.*?      </div>\n    </div>)', "UIContent"),
    6: ("a6_controlled_challenge", r'(      \{/\* UI Content Layer \*/\}.*?      </div>\n    </div>)', "UIContent"),
    2: ("a2_follow_instruction", r'(        \{/\* Play Area \*/\}.*?\n        </div>\n)', "PlayArea"),
    3: ("a3_target_finding", r'(        \{/\* Play Area \*/\}.*?\n        </div>\n)', "PlayArea")
}

for act_num, (folder, regex, comp_name) in extractions.items():
    dir_path = f"frontend/src/activities/{folder}"
    ui_file = f"{dir_path}/Activity{act_num}UI.tsx"
    
    with open(ui_file, "r") as f:
        content = f.read()
        
    match = re.search(regex, content, re.DOTALL)
    if not match: 
        print(f"No match for A{act_num}")
        continue
        
    jsx = match.group(1)
    
    if comp_name == "UIContent":
        # we need to remove the last closing div of the main container so it doesn't break
        jsx = jsx[:jsx.rfind("      </div>")]
    
    # Imports
    imports_match = re.search(r'(import .*?;.*?)(?=\n\n|//|export)', content, re.DOTALL)
    all_imports = imports_match.group(1) if imports_match else ""
    
    with open(f"{dir_path}/components/{comp_name}.tsx", "w") as f:
        f.write(all_imports + f"\n\nexport default function {comp_name}(props: any) {{\n  const {{ sessionState, currentTask, currentLevel, startGame, handleObjectClick, finishActivity, handleAnswer, isCorrect, feedbackMsg, handleNext, emmaPos, propPos, playMovie, attempts, errors, handleOptionClick, startChallenge, handleAction, showCelebration }} = props;\n  return (\n    <>\n")
        f.write(jsx)
        f.write("    </>\n  );\n}\n")
        
    props_str = "sessionState={sessionState} currentTask={currentTask} currentLevel={currentLevel} startGame={startGame} handleObjectClick={handleObjectClick} finishActivity={finishActivity} handleAnswer={typeof handleAnswer !== 'undefined' ? handleAnswer : undefined} isCorrect={typeof isCorrect !== 'undefined' ? isCorrect : undefined} feedbackMsg={typeof feedbackMsg !== 'undefined' ? feedbackMsg : undefined} handleNext={typeof handleNext !== 'undefined' ? handleNext : undefined} emmaPos={typeof emmaPos !== 'undefined' ? emmaPos : undefined} propPos={typeof propPos !== 'undefined' ? propPos : undefined} playMovie={typeof playMovie !== 'undefined' ? playMovie : undefined} attempts={typeof attempts !== 'undefined' ? attempts : undefined} errors={typeof errors !== 'undefined' ? errors : undefined} handleOptionClick={typeof handleOptionClick !== 'undefined' ? handleOptionClick : undefined} startChallenge={typeof startChallenge !== 'undefined' ? startChallenge : undefined} handleAction={typeof handleAction !== 'undefined' ? handleAction : undefined} showCelebration={typeof showCelebration !== 'undefined' ? showCelebration : undefined}"
    
    content = content.replace(jsx, f"      <{comp_name} {props_str} />\n")
    
    imp = f'import {comp_name} from "./components/{comp_name}";\n'
    content = content.replace('"use client";', '"use client";\n' + imp)
    
    with open(ui_file, "w") as f:
        f.write(content)

