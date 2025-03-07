import { useEffect } from "react";

const HeartEffect = () => {
  useEffect(() => {
    const heartContainer = document.createElement("div");
    heartContainer.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "pointer-events-none");
    document.body.appendChild(heartContainer);

    const createHeart = (x, y) => {
      const heart = document.createElement("div");
      heart.classList.add("absolute", "text-red-500", "text-2xl", "animate-float");
      heart.innerHTML = ["❤️", "💖", "💘", "💞", "💓"][Math.floor(Math.random() * 5)];
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.animation = `falling ${2 + Math.random() * 3}s linear infinite`;
      heartContainer.appendChild(heart);

      setTimeout(() => heart.remove(), 5000);
    };

    const handleClick = (event) => {
      createHeart(event.clientX, event.clientY);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      heartContainer.remove();
    };
  }, []);

  return null;
};

export default HeartEffect;
