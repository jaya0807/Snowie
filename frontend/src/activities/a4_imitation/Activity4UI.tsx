"use client";
import MovieStage from "./components/MovieStage";
import BackgroundScene from "./components/BackgroundScene";

import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";

import { LEVELS } from "./components/data";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { IntroCard, QuestionCard, CelebrationCard, OutroCard } from "./components/ImitationCard";

export default function Activity4UI() {
  const router = useRouter();

  const [sessionState, setSessionState] = useState<"intro" | "movie" | "question" | "celebrating" | "outro">("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalLatency, setTotalLatency] = useState<number>(0);

  const [emmaPos, setEmmaPos] = useState("-left-64");
  const [propPos, setPropPos] = useState("opacity-0");
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:8000/api/session/start?activity_id=A2&force_new=${localStorage.getItem('forceNewSession') === 'true'}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch(e) { console.error(e); }
    };
    initSession();
  }, []);

  const speakSentence = (text: string, onComplete: () => void) => {
    window.speechSynthesis.cancel();
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    let isFired = false;
    const finish = () => {
      if (!isFired) {
        isFired = true;
        onComplete();
      }
    };
    
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    
    fallbackTimeoutRef.current = setTimeout(finish, 6000);
  };

  const playMovie = (index: number) => {
    setSessionState("movie");
    const level = LEVELS[index];
    
    setEmmaPos("-left-64");
    setPropPos("left-0 top-1/2 opacity-0");

    setTimeout(() => {
      setEmmaPos("left-[20%]");
      setTimeout(() => {
        setPropPos(`opacity-100 left-[25%] top-[50%] transition-all duration-[2000ms]`);
        
        speakSentence(level.sentence, () => {
          setTimeout(() => {
             setPropPos(`opacity-100 ${level.targetPropEndPos} transition-all duration-1000`);
             setTimeout(() => {
                 setSessionState("question");
                 setQuestionStartTime(new Date().getTime());
             }, 1500);
          }, 500);
        });
      }, 1000);
    }, 500);
  };

  const handleAnswer = (isCorrectChoice: boolean) => {
    const level = LEVELS[levelIndex];
    setAttempts(prev => prev + 1);

    if (isCorrectChoice) {
      setIsCorrect(true);
      const latency = (new Date().getTime() - questionStartTime) / 1000;
      setTotalLatency(prev => prev + latency);
      setFeedbackMsg(level.feedbackPos);
      setSessionState("celebrating");
    } else {
      setErrors(prev => prev + 1);
      setIsCorrect(false);
      setFeedbackMsg("Almost! Let's watch carefully again. 💛");
      
      setTimeout(() => {
        setIsCorrect(null);
        setFeedbackMsg("");
        playMovie(levelIndex);
      }, 2500);
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    setFeedbackMsg("");
    
    if (levelIndex + 1 < LEVELS.length) {
      const nextIndex = levelIndex + 1;
      setLevelIndex(nextIndex);
      playMovie(nextIndex);
    } else {
      setSessionState("outro");
    }
  };

  const finishActivity = async (quit: boolean = false) => {
    const accuracy = attempts > 0 ? ((attempts - errors) / attempts) * 100 : 0;
    const avg_latency = LEVELS.length > 0 ? totalLatency / LEVELS.length : 0;
    
    try {
      await fetch(`http://${window.location.hostname}:8000/api/activities/a4/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a4",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: { errors, attempts, levelsCompleted: LEVELS.length }
        })
      });
      await fetch(`http://${window.location.hostname}:8000/api/session/end?session_id=${sessionId || "demo-session-a4"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    if (quit === true) {
      router.push("/dashboard");
    } else {
      router.push("/child?activity=A5");
    }
  };

  const currentLevel = LEVELS[levelIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-slate-900 text-white">
      <HiddenCameraProcessor sessionId={sessionId || "mock"} activityId="A4" />
      <BackgroundScene />
      
      <button onClick={() => finishActivity(true)} className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all shadow-md border border-white/10">
        <X className="w-8 h-8" />
      </button>

      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8">
        
        {sessionState === "intro" && (
          <IntroCard onStart={() => playMovie(0)} />
        )}

        {(sessionState === "movie" || sessionState === "question" || sessionState === "celebrating") && (
          <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center pt-20">
            <MovieStage sessionState={sessionState} currentLevel={currentLevel} emmaPos={emmaPos} propPos={propPos} />
            
            {sessionState === "question" && (
              <QuestionCard level={currentLevel} onAnswer={handleAnswer} isCorrect={isCorrect} feedbackMsg={feedbackMsg} />
            )}

            {sessionState === "celebrating" && (
              <CelebrationCard feedbackMsg={feedbackMsg} onNext={handleNext} />
            )}
          </div>
        )}

        {sessionState === "outro" && (
           <OutroCard onFinish={() => finishActivity(false)} />
        )}

      </div>
    </div>
  );
}
