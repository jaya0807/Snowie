/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { 
  GiFairy, GiCastle, GiStarsStack, GiMoon, GiPineTree, 
  GiRocketFlight, GiAirBalloon, GiRingedPlanet, GiCrystalCluster, 
  GiFairyWand, GiButterfly, GiSpikyField, GiFlowerPot
} from "react-icons/gi";
import { FaCloud } from "react-icons/fa";

// Speak utility using Web Speech API
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
};


const TASKS = [
  {
    level: 1,
    instruction: "Touch the BLUE star!",
    targetSequence: ["blue_star"],
    objects: [
      { id: "blue_star", type: "star", color: "text-blue-400", icon: GiStarsStack },
      { id: "gold_moon", type: "moon", color: "text-yellow-300", icon: GiMoon },
      { id: "purple_crystal", type: "crystal", color: "text-purple-400", icon: GiCrystalCluster },
      { id: "pink_wand", type: "wand", color: "text-pink-400", icon: GiFairyWand }
    ]
  },
  {
    level: 2,
    instruction: "Touch the BLUE star, then the GOLD star!",
    targetSequence: ["blue_star", "gold_star"],
    objects: [
      { id: "blue_star", type: "star", color: "text-blue-400", icon: GiStarsStack },
      { id: "gold_star", type: "star", color: "text-yellow-400", icon: GiStarsStack },
      { id: "purple_crystal", type: "crystal", color: "text-purple-400", icon: GiCrystalCluster },
      { id: "pink_wand", type: "wand", color: "text-pink-400", icon: GiFairyWand }
    ]
  },
  {
    level: 3,
    instruction: "Touch the PINK wand, then the BLUE butterfly!",
    targetSequence: ["pink_wand", "blue_butterfly"],
    objects: [
      { id: "pink_wand", type: "wand", color: "text-pink-400", icon: GiFairyWand },
      { id: "blue_butterfly", type: "butterfly", color: "text-blue-400", icon: GiButterfly },
      { id: "gold_star", type: "star", color: "text-yellow-400", icon: GiStarsStack },
      { id: "purple_crystal", type: "crystal", color: "text-purple-400", icon: GiCrystalCluster },
      { id: "gold_moon", type: "moon", color: "text-yellow-300", icon: GiMoon }
    ]
  }
];


export { speak, TASKS };
