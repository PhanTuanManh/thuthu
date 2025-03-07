import React, { useEffect, useState } from 'react';

const BalloonEffect = () => {
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    const newBalloons = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 40 + 30,
    }));
    setBalloons(newBalloons);
  }, []);

  return (
    <>
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          style={{
            left: `${balloon.left}%`,
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.2}px`,
            animationDelay: `${balloon.delay}s`,
          }}
          className="absolute bottom-0 animate-balloon-float"
        >
          🎈
        </div>
      ))}
    </>
  );
};

export default BalloonEffect;