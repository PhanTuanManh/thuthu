import React, { useEffect, useState } from 'react'

const ScatteredHearts = ({ count = 50 }) => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const generatedHearts = []
    for (let i = 0; i < count; i++) {
      generatedHearts.push({
        id: i,
        left: Math.random() * 100, // vị trí random theo phần trăm
        top: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.4, // opacity từ 0.4 đến 0.7
        size: Math.random() * 20 + 10, // kích thước từ 10px đến 30px
        animationDelay: Math.random() * 5, // delay ngẫu nhiên cho animation
      })
    }
    setHearts(generatedHearts)
  }, [count])

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            opacity: heart.opacity,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            transform: 'translate(-50%, -50%)',
            animation: `float 8s ease-in-out infinite`,
            animationDelay: `${heart.animationDelay}s`,
          }}
        >
          <svg
            viewBox="0 0 32 29.6"
            fill="pink"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.6,0c-3.4,0-6.4,2.1-7.6,5.1C14.8,2.1,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
              c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z" />
          </svg>
        </div>
      ))}
    </>
  )
}

export default ScatteredHearts
