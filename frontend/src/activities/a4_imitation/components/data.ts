import { Star } from "lucide-react";

const LEVELS = [
  {
    id: "level1",
    sentence: "Emma puts the ball beside the chair.",
    question: "Where did Emma put the ball?",
    sceneProps: ["chair"],
    targetProp: "ball",
    targetPropEndPos: "right-[20%]",
    choices: [
      { text: "Beside the chair", isCorrect: true, icon: "🪑" },
      { text: "Near the bed", isCorrect: false, icon: "🛏️" },
      { text: "Under the tree", isCorrect: false, icon: "🌳" }
    ],
    feedbackPos: "Great listening, Movie Star! ⭐"
  },
  {
    id: "level2",
    sentence: "Emma puts the toy on the bed.",
    question: "What did Emma put on the bed?",
    sceneProps: ["bed"],
    targetProp: "toy",
    targetPropEndPos: "right-[40%] top-[40%]",
    choices: [
      { text: "The toy", isCorrect: true, icon: "🧸" },
      { text: "The ball", isCorrect: false, icon: "⚽" },
      { text: "The flower", isCorrect: false, icon: "🌸" }
    ],
    feedbackPos: "Amazing memory! 🎬"
  },
  {
    id: "level3",
    sentence: "Emma puts the beautiful flower near the house.",
    question: "Where was the flower?",
    sceneProps: ["house"],
    targetProp: "flower",
    targetPropEndPos: "right-[30%] top-[60%]",
    choices: [
      { text: "Near the house", isCorrect: true, icon: "🏠" },
      { text: "Next to the tree", isCorrect: false, icon: "🌳" },
      { text: "On the chair", isCorrect: false, icon: "🪑" }
    ],
    feedbackPos: "You're a true director! 🌟"
  }
];


export { LEVELS };
