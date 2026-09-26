/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Mic, X } from "lucide-react";
import BackgroundScene from "./components/BackgroundScene";
import HiddenCameraProcessor from "./components/HiddenCameraProcessor";
import AnimalCharacter from "./components/AnimalCharacter";
import DialogueBubble from "./components/DialogueBubble";
import ResponseOptions from "./components/ResponseOptions";
import FeedbackState from "./components/FeedbackState";
import ContinueButton from "./components/ContinueButton";
import { useVoiceRecognition } from "./components/useVoiceRecognition";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: "intro", charImage: "fox.png", name: "Foxie", message: "Hi! I'm Foxie!\nI can't wait to meet you!\nLet's get to know each other. 💛", action: "✨ Let's Talk!" },
  { id: "name", charImage: "bunny.png", name: "Bunny", message: "And I'm Bunny! What's your name? 😊", action: "✨ That's me!" },
  { id: "feeling", charImage: "bear.png", name: "Bear", message: "Hi {name}! 👋\nHow are you feeling today?", action: "Continue" },
  { id: "animal", charImage: "panda.png", name: "Panda", message: "What's your favourite animal?", action: "Continue" },
  { id: "day", charImage: "puppy.png", name: "Puppy", message: "Tell me about your day. I'm listening!\n(There's no right or wrong answer. 💛)", action: "✨ Done!" },
  { id: "outro", charImage: "lion.png", name: "Lion", message: "You've met everyone, {name}!\nReady for your adventure?", action: "🚀 Let's Go!" }
];

export default function Activity1UI() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => { setSessionId("a1-session-" + Date.now()); }, []);
  const [feedbackState, setFeedbackState] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [feeling, setFeeling] = useState("");
  const [favAnimal, setFavAnimal] = useState("");
  const [dayText, setDayText] = useState("");
  
  const { isListening, toggleListen } = useVoiceRecognition(stepIndex, setName, setDayText);
  const handleExit = () => router.push("/dashboard");

  const handleNextStep = async () => {
    setFeedbackState(null);
    if (STEPS[stepIndex].id === 'feeling' && feeling === 'Not so good') {
      setStepIndex(STEPS.length - 1);
    } else if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finish Activity
      try {
        await fetch(`http://${window.location.hostname}:8000/api/activities/a1/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            name, feeling, animal: favAnimal, day_text: dayText
          })
        });
        await fetch(`http://${window.location.hostname}:8000/api/session/end?session_id=${sessionId}`, { method: 'POST' });
      } catch (e) {
        console.error("Failed to submit A1 data", e);
      }
      router.push('/child?activity=A2');
    }
  };

  const step = STEPS[stepIndex];
  
  const getFeedbackMessage = () => {
    if (step.id === 'name') return `Nice to meet you, ${name || "friend"}! 💛`;
    if (step.id === 'feeling') {
      if (feeling === 'Happy') return "Yay! I’m so happy you’re feeling happy! 💛\nLet’s make this adventure even more fun!";
      if (feeling === 'Excited') return "Woohoo! You’re feeling excited! 🎉\nI can’t wait to go on an adventure with you!";
      if (feeling === 'Calm') return "That’s nice! You’re feeling calm and peaceful. 🌸\nLet’s enjoy our adventure together!";
      if (feeling === 'Sleepy') return "Aww, feeling sleepy? 😴\nLet’s start with a gentle and fun adventure!";
      if (feeling === 'Not so good') return "Aww, I’m sorry you’re not feeling so good. 💛\nLet’s cheer you up with a fun adventure! ✨\nReady to play?";
      return `That sounds lovely! I'm glad you're here. ✨`;
    }
    if (step.id === 'animal') return `I love ${favAnimal}s too! 🌿`;
    if (step.id === 'day') return `Thanks for sharing that with me! 🐶`;
    return "Great!";
  };

  return (
    <div className="relative w-full min-h-[100dvh] font-sans flex flex-col items-center py-6 overflow-x-hidden overflow-y-auto">
      {/* Fixed background to prevent layout stretching */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <BackgroundScene />
      </div>
      <div className="fixed top-0 left-0 w-0 h-0 z-0 pointer-events-none">
        <HiddenCameraProcessor sessionId={sessionId || "mock-session"} activityId="A1" />
      </div>

      {/* Close Button */}
      <button 
        onClick={handleExit}
        className="fixed top-6 left-4 md:left-6 z-50 bg-white/50 hover:bg-white p-3 rounded-full backdrop-blur transition-all shadow-sm"
      >
        <X className="w-6 h-6 text-zinc-600" />
      </button>

      {/* Progress Indicator */}
      <div className="fixed top-6 right-4 md:left-1/2 md:-translate-x-1/2 z-50 bg-white/80 backdrop-blur-md px-4 py-2 md:px-6 md:py-2 rounded-full shadow-sm border border-white flex items-center gap-2 w-max max-w-[50%] md:max-w-none">
        <span className="text-yellow-500 text-sm">⭐</span>
        <span className="font-bold text-xs uppercase tracking-widest text-zinc-700">
          Meet The Animal Friends • {stepIndex + 1} / 6
        </span>
      </div>

      <div className="relative z-30 w-full max-w-[800px] flex flex-col items-center px-4 my-auto mt-28 mb-12">
        <AnimalCharacter 
          charImage={step.charImage} 
          name={step.name} 
          isReacting={feedbackState !== null} 
        />

        <DialogueBubble name={step.name} charImage={step.charImage}>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#176B9C] leading-relaxed">
            {step.message
              .replace('{name}', name || "friend")
              .split('\n')
              .map((line, i) => <p key={i}>{line}</p>)}
          </h2>
        </DialogueBubble>

        <div className="w-full flex flex-col items-center justify-center mt-6 z-40 max-w-lg">

          {/* Intro & Outro */}
          {(step.id === 'intro' || step.id === 'outro') && (
            <ContinueButton onClick={handleNextStep} label={step.action} />
          )}

          {/* STEP 2: Name */}
          {step.id === 'name' && !feedbackState && (
            <div className="w-full max-w-sm mt-4 animate-[fadeIn_0.5s_ease-out]">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name here..."
                className="w-full bg-sky-50 border-2 border-sky-100 rounded-2xl px-6 py-4 text-xl font-bold text-sky-900 focus:outline-none focus:border-[#176B9C] transition-colors mb-4 text-center"
              />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={toggleListen}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 transition-all ${
                    isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-white border-[#176B9C] text-[#176B9C] hover:bg-sky-50 shadow-sm'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span className="font-bold">{isListening ? 'Listening...' : '🎤 Tell me!'}</span>
                </button>
                <ContinueButton onClick={() => setFeedbackState('name')} label={step.action} disabled={!name.trim()} />
              </div>
            </div>
          )}

          {/* STEP 3: Feeling */}
          {step.id === 'feeling' && (
            <>
              <ResponseOptions 
                options={[
                  { emoji: "😊", label: "Happy" },
                  { emoji: "🤩", label: "Excited" },
                  { emoji: "😌", label: "Calm" },
                  { emoji: "😴", label: "Sleepy" },
                  { emoji: "😟", label: "Not so good" }
                ]}
                selectedValue={feeling}
                disabled={feedbackState !== null}
                onSelect={(val) => { setFeeling(val); setFeedbackState('feeling'); }}
              />
            </>
          )}

          {/* STEP 4: Animal */}
          {step.id === 'animal' && (
            <ResponseOptions 
              options={[
                { emoji: "🐶", label: "Dog" },
                { emoji: "🐱", label: "Cat" },
                { emoji: "🐼", label: "Panda" },
                { emoji: "🦁", label: "Lion" },
                { emoji: "🐰", label: "Bunny" },
                { emoji: "🦋", label: "Butterfly" }
              ]}
              selectedValue={favAnimal}
              disabled={feedbackState !== null}
              onSelect={(val) => { setFavAnimal(val); setFeedbackState('animal'); }}
            />
          )}

          {/* STEP 5: Day Reflection */}
          {step.id === 'day' && !feedbackState && (
            <div className="w-full max-w-sm mt-4 animate-[fadeIn_0.5s_ease-out]">
              <textarea 
                value={dayText}
                onChange={(e) => setDayText(e.target.value)}
                placeholder="I played outside and..."
                className="w-full bg-sky-50 border-2 border-sky-100 rounded-2xl px-6 py-4 text-lg font-medium text-sky-900 h-28 resize-none focus:outline-none focus:border-[#176B9C] transition-colors mb-4 text-center"
              />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={toggleListen}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 transition-all ${
                    isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-[#176B9C] border-sky-900 text-white hover:brightness-110 shadow-md'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                  <span className="font-bold text-lg">{isListening ? 'Listening...' : '🎤 Talk to Puppy'}</span>
                </button>
                <ContinueButton onClick={() => setFeedbackState('day')} label={step.action} disabled={!dayText.trim()} />
              </div>
            </div>
          )}

          {/* Shared Feedback State Display */}
          {feedbackState && (
             <FeedbackState 
               message={getFeedbackMessage()} 
               onContinue={handleNextStep} 
               continueLabel="Continue" 
             />
          )}
        </div>
      </div>
    </div>
  );
}
