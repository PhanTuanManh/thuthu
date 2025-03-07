import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SurpriseButton from "./SurpriseButton";

const LoveMessage = () => {
  const [message, setMessage] = useState("💖 Chúc em luôn vui vẻ và hạnh phúc! 💖");

  const messages = [
    "💐 Chúc em luôn xinh đẹp! 🌸",
    "💕 Anh luôn yêu em nhiều lắm! 😘",
    "✨ Hãy luôn tỏa sáng như ánh mặt trời! ☀️",
    "🎀 Ngày hôm nay là của em! 🥰",
    "🎶 Chúc em một ngày ngập tràn yêu thương! 💓"
  ];

  const changeMessage = () => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  useEffect(() => {
    const triggerRandomFirework = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createFirework(x, y);
    };

    const interval = setInterval(triggerRandomFirework, Math.random() * 3000 + 500); // 2-5 giây xuất hiện 1 lần
    return () => clearInterval(interval);
  }, []);

  const createFirework = (x, y) => {
    const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C", "#FFD700", "#FF69B4", "#00FFFF"];
    const fireworkContainer = document.createElement("div");
    fireworkContainer.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "pointer-events-none", "z-50", "animate-firework");
    fireworkContainer.style.left = `${x}px`;
    fireworkContainer.style.top = `${y}px`;
    document.body.appendChild(fireworkContainer);

    for (let i = 0; i < 100; i++) {
      const spark = document.createElement("div");
      spark.classList.add("absolute", "w-2", "h-2", "rounded-full", "animate-spark");
      spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      spark.style.left = "20%";
      spark.style.top = "20%";
      spark.style.transform = `translate(-20%, -20%) rotate(${(360 / 100) * i}deg) translate(0, ${Math.random() * 80 + 80}px)`;
      spark.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
      fireworkContainer.appendChild(spark);
    }

    setTimeout(() => fireworkContainer.remove(), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-200 to-pink-400 text-center">
      <motion.h1 
        className="text-5xl font-extrabold text-white drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        🎀
      </motion.h1>

      <motion.h1 
        className="text-5xl font-extrabold text-white drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
       Chúc Mừng Ngày Của Em!
      </motion.h1>
      <div className="flex items-center gap-3 mt-5 cursor-pointer relative" onClick={changeMessage}>
        <motion.p 
          className="text-xl text-white shadow-lg px-6 py-3 bg-pink-500 rounded-xl mx-4"
          initial={{ scale: 1 }}
          whileTap={{ scale: 1.3 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {message}
        </motion.p>
        <motion.span 
          className="text-2xl text-white absolute -bottom-6 right-4 animate-bounce"
          initial={{ scale: 1, rotate: 0 }}
          animate={{ rotate: -45 }}
          whileHover={{ scale: 1.2}}
        >
          👆
        </motion.span>

      </div>

      <motion.img 
        src="/hoa.png"
        className="mt-6 w-[200px] h-[254px]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 200 }}
      />

    <motion.div 
      className="mt-10"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, type: "spring", stiffness: 200 }}
    >
      <SurpriseButton />
    </motion.div>
    </div>
  );
};

export default LoveMessage;
