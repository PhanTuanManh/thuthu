// Thêm vào file App.jsx
import React, { useEffect, useRef } from 'react';
import BalloonEffect from "./BalloonEffect";
import FireworkEffect from "./FireworkEffect";
import FloatingHearts from './FloatingHearts';
import HeartEffect from "./HeartEffect";
import LoveMessage from "./LoveMessage";
import SurpriseButton from "./SurpriseButton";

export default function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.log("Tự động phát nhạc bị chặn", error));
      }
    };
    
    document.addEventListener("click", playMusic, { once: true });
    
    return () => document.removeEventListener("click", playMusic);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 relative overflow-hidden">
        <audio ref={audioRef} src="/nhac.mp3" loop />
      <HeartEffect />
      {/* <BalloonEffect /> */}
      <FireworkEffect />
      <LoveMessage />
      <FloatingHearts/>
    </div>
  );
}