
// StarEffect.jsx
import React, { useEffect } from 'react';

const StarEffect = () => {
  useEffect(() => {
    const stars = document.createElement("div");
    stars.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "pointer-events-none");
    document.body.appendChild(stars);

    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      star.classList.add("absolute", "animate-twinkle");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 5 + 2}px`;
      star.style.height = star.style.width;
      star.style.background = "#fff";
      star.style.borderRadius = "50%";
      stars.appendChild(star);
    }
  }, []);

  return null;
};

export default StarEffect;
