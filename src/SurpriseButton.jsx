

// SurpriseButton.jsx - Cập nhật hiển thị nhiều ảnh quà tặng với vòng lặp và nút đóng overlay
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SurpriseButton = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastImageFirework, setLastImageFirework] = useState(false);

  const gifts = [
    { src: "/son.png", title: "Cây Son V6 Merzy" },
    { src: "/mingo.png", title: "Con gì ấy kh phải bb3" },
    { src: "/qua1.png", title: "Hộp quà bí ẩn🤔" },
    { src: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXczMjJ2NXVkYTV3cjZwOTg0dDJtbHUyOWpoajE2aHBkZXkxNWxxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41JWw65TcBGjPpRK/giphy.gif", title: "🎉Cảm ơn đối tác 4 năm🎉" },
  ];


  const handleClick = () => {
    setShowOverlay(true); // Hiển thị overlay đen
    setShowImage(true);
    triggerFirework(); // Kích hoạt hiệu ứng pháo hoa đặc biệt
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % gifts.length;
      if (nextIndex === gifts.length - 1) {
        setLastImageFirework(true); // Bật pháo hoa khi ở ảnh cuối
      } else {
        setLastImageFirework(false); // Tắt pháo hoa nếu không phải ảnh cuối
      }
      return nextIndex;
    });
  };

  const handleClose = () => {
    setShowOverlay(false);
    setShowImage(false);
    setLastImageFirework(false);
  };

  const triggerFirework = () => {
    const fireworkContainer = document.createElement("div");
    fireworkContainer.classList.add("fixed", "inset-0", "pointer-events-none", "firework-effect");
    document.body.appendChild(fireworkContainer);
    
    for (let i = 0; i < 50; i++) {
      const spark = document.createElement("div");
      spark.classList.add("absolute", "w-2", "h-2", "rounded-full", "animate-special-spark");
      spark.style.backgroundColor = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C", "#FFD700", "#FF69B4", "#00FFFF"][Math.floor(Math.random() * 7)];
      spark.style.left = `${Math.random() * 100}%`;
      spark.style.top = `${Math.random() * 100}%`;
      spark.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
      fireworkContainer.appendChild(spark);
    }
    
    setTimeout(() => fireworkContainer.remove(), 2000); // Xóa pháo hoa sau 3 giây
  };

  useEffect(() => {
    if (lastImageFirework) {
      const interval = setInterval(triggerFirework, 2000); // Pháo hoa liên tục nếu là ảnh cuối
      return () => clearInterval(interval);
    }
  }, [lastImageFirework]);

  return (
    <>
      <div className="flex bottom-6 right-6">
        <motion.button
          onClick={handleClick}
          className="bg-yellow-300 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🎁 Nhấn Để Nhận Quà 🎁
        </motion.button>
      </div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-centerrelative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="absolute top-2 right-2  text-gray-700 rounded-full p-2"
                onClick={handleClose}
              >
                ✖
              </button>
              {showImage && (
                <>
                
                  <img
                    src={gifts[currentIndex].src}
                    alt="Surprise Gift"
                    className="w-[250px] mb-5 h-auto object-contain mx-auto"
                  />
                     <h2 className={`text-2xl font-bold mb-2 ${currentIndex === gifts.length - 1 ? 'text-[#FFDC82] text-3xl animate-pulse' : 'text-white'}`}>
                    {gifts[currentIndex].title}
                  </h2>
                  <motion.button
                    onClick={handleNextImage}
                    className="bg-pink-500 mt-10 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:bg-pink-600 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Xem Quà Tiếp Theo 
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SurpriseButton;