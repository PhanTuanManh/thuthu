import { useEffect } from "react";

const FireworkEffect = () => {
  useEffect(() => {
    const createFirework = (x, y) => {
      const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C", "#FFD700", "#FF69B4", "#00FFFF"];
      const fireworkContainer = document.createElement("div");
      fireworkContainer.classList.add("absolute", "w-2", "h-2", "rounded-full", "animate-firework");
      fireworkContainer.style.left = `${x}px`;
      fireworkContainer.style.top = `${y}px`;
      document.body.appendChild(fireworkContainer);

      // Tạo các tia lửa
      for (let i = 0; i < 100; i++) {
        const spark = document.createElement("div");
        spark.classList.add("absolute", "w-2", "h-2", "rounded-full", "animate-spark"); // Tăng kích thước tia lửa
        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        spark.style.left = "20%";
        spark.style.top = "20%";
        spark.style.transform = `translate(-20%, -20%) rotate(${(360 / 100) * i}deg) translate(0, ${Math.random() * 80 + 80}px)`; // Tăng khoảng cách di chuyển
        spark.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        fireworkContainer.appendChild(spark);
      }

      // Xóa pháo hoa sau khi hiệu ứng kết thúc
      setTimeout(() => fireworkContainer.remove(), 1500);
    };

    const handleClick = (event) => {
      createFirework(event.clientX, event.clientY);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
};

export default FireworkEffect;