/* eslint-disable */
"use client";
import BackgroundScene from "./components/BackgroundScene";
import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";
import { LEVELS } from "./components/data";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { IntroCard, PlayingCard, CelebrationCard, OutroCard } from "./components/ChallengeCards";

export default function Activity6UI() {
  const router = useRouter();

  const [sessionState, setSessionState] = useState<"intro" | "playing" | "celebrating" | "outro">("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalLatency, setTotalLatency] = useState<number>(0);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:8000/api/session/start?activity_id=A6&force_new=${localStorage.getItem('forceNewSession') === 'true'}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch(e) { console.error(e); }
    };
    initSession();
  }, []);

  const generateChoices = (levelIdx: number) => {
    const level = LEVELS[levelIdx];
    let selectedChoices = [level.target];
    
    const available = [...level.distractors].sort(() => 0.5 - Math.random());
    for (let i = 0; i < level.choicesCount - 1; i++) {
      selectedChoices.push(available[i % available.length]);
    }
    
    selectedChoices = selectedChoices.sort(() => 0.5 - Math.random());
    setChoices(selectedChoices);
  };

  const startGame = () => {
    setSessionState("playing");
    setLevelIndex(0);
    generateChoices(0);
    setIsCorrect(null);
    setStartTime(new Date().getTime());
  };

  const handleAnswer = (choiceId: string) => {
    const level = LEVELS[levelIndex];
    setAttempts(prev => prev + 1);

    if (choiceId === level.target) {
      setIsCorrect(true);
      const latency = (new Date().getTime() - startTime) / 1000;
      setTotalLatency(prev => prev + latency);
      setFeedbackMsg(level.feedbackPos);
      setSessionState("celebrating");
    } else {
      setErrors(prev => prev + 1);
      setIsCorrect(false);
      setFeedbackMsg(level.feedbackNeg);
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    setFeedbackMsg("");
    
    if (levelIndex + 1 < LEVELS.length) {
      setLevelIndex(prev => prev + 1);
      generateChoices(levelIndex + 1);
      setSessionState("playing");
      setStartTime(new Date().getTime());
    } else {
      setSessionState("outro");
    }
  };

  const finishActivity = async () => {
    const accuracy = attempts > 0 ? ((attempts - errors) / attempts) * 100 : 0;
    const avg_latency = LEVELS.length > 0 ? totalLatency / LEVELS.length : 0;
    
    try {
      await fetch(`http://${window.location.hostname}:8000/api/activities/a6/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a6",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: { errors, attempts, levelsCompleted: LEVELS.length }
        })
      });
      await fetch(`http://${window.location.hostname}:8000/api/session/end?session_id=${sessionId || "demo-session-a6"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    router.push("/child/thank-you");
  };

  const currentLevel = LEVELS[levelIndex];

  return (
    <div className={`relative w-screen h-screen overflow-hidden font-sans bg-gradient-to-br ${currentLevel ? currentLevel.color : 'from-indigo-900 to-black'} transition-colors duration-1000`}>
      <HiddenCameraProcessor sessionId={sessionId || "mock"} activityId="A6" />
      <BackgroundScene />
      
      <button onClick={finishActivity} className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all shadow-md">
        <X className="w-8 h-8" />
      </button>

      {(sessionState === "playing" || sessionState === "celebrating") && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 shadow-2xl flex items-center gap-6">
          {LEVELS.map((lvl, idx) => (
            <div key={lvl.id} className="flex items-center gap-4">
              <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full font-bold text-white transition-all ${idx < levelIndex ? 'bg-green-500 scale-90' : idx === levelIndex ? 'bg-indigo-500 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.6)] ring-4 ring-indigo-300' : 'bg-white/20 opacity-50'}`}>
                {idx === 0 && '🌙'}
                {idx === 1 && '🔴'}
                {idx === 2 && '🌌'}
              </div>
              {idx < LEVELS.length - 1 && (
                <div className="w-10 h-1 bg-white/20 rounded-full">
                  <div className={`h-full bg-white rounded-full transition-all duration-1000 ${idx < levelIndex ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8 pt-32">
        {sessionState === "intro" && <IntroCard onStart={startGame} />}
        
        {sessionState === "playing" && (
          <PlayingCard choices={choices} currentLevel={currentLevel} isCorrect={isCorrect} feedbackMsg={feedbackMsg} onAnswer={handleAnswer} />
        )}

        {sessionState === "celebrating" && (
          <CelebrationCard feedbackMsg={feedbackMsg} onNext={handleNext} />
        )}

        {sessionState === "outro" && <OutroCard onFinish={finishActivity} />}
      </div>
    </div>
  );
}
