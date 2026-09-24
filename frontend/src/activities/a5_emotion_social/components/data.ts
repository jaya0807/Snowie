/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, RotateCcw, ArrowRight } from "lucide-react";



const TASKS = [
  {
    level: 1,
    id: "obvious_emotions",
    character: "maya",
    scene_text: "Maya received a big birthday present!",
    question: "How do you think Maya feels?",
    options: [
      { id: "happy", label: "Happy", emoji: "😊" },
      { id: "sad", label: "Sad", emoji: "😢" },
      { id: "angry", label: "Angry", emoji: "😠" },
      { id: "scared", label: "Scared", emoji: "😨" }
    ],
    correct: "happy",
    emotion_change: "happy",
    feedback: "That's right! You noticed how Maya might feel! 💛",
    scene_objects: ["present", "balloon"]
  },
  {
    level: 2,
    id: "emotion_from_situation",
    character: "aarav",
    scene_text: "Aarav's favorite toy just broke while he was playing.",
    question: "How might Aarav feel?",
    options: [
      { id: "happy", label: "Happy", emoji: "😊" },
      { id: "sad", label: "Sad", emoji: "😢" },
      { id: "sleepy", label: "Sleepy", emoji: "😴" },
      { id: "excited", label: "Excited", emoji: "😎" }
    ],
    correct: "sad",
    emotion_change: "sad",
    feedback: "Yes... when things break, we often feel sad. 💛",
    scene_objects: ["kite"]
  },
  {
    level: 3,
    id: "social_situation",
    character: "riya",
    scene_text: "Riya is standing alone while the other children are playing together.",
    question: "How might Riya feel?",
    options: [
      { id: "happy", label: "Happy", emoji: "😊" },
      { id: "lonely", label: "Lonely / Sad", emoji: "😢" },
      { id: "angry", label: "Angry", emoji: "😠" },
      { id: "sleepy", label: "Sleepy", emoji: "😴" }
    ],
    correct: "lonely",
    emotion_change: "sad",
    feedback: "She might feel lonely.",
    social_question: "What could you do?",
    social_options: [
      { id: "ask_play", label: "Ask Riya to play", emoji: "💛" },
      { id: "laugh", label: "Laugh at her", emoji: "😂" },
      { id: "walk", label: "Walk away", emoji: "🚶" },
      { id: "leave", label: "Tell her to leave", emoji: "😠" }
    ],
    social_correct: "ask_play",
    social_emotion_change: "happy",
    social_feedback: "That's very kind! Asking her to play helps her feel included! 💛",
    scene_objects: ["football"]
  },
  {
    level: 4,
    id: "helping_empathy",
    character: "kabir",
    scene_text: "Kabir dropped his crayons and looks upset.",
    question: "What could you do?",
    options: [
      { id: "help", label: "Help pick them up", emoji: "💛" },
      { id: "laugh", label: "Laugh", emoji: "😂" },
      { id: "walk", label: "Walk away", emoji: "🚶" },
      { id: "take", label: "Take the crayons", emoji: "😠" }
    ],
    correct: "help",
    emotion_change: "happy",
    feedback: "You are a great helper! 💛",
    scene_objects: ["crayon"]
  }
];


export { TASKS };
