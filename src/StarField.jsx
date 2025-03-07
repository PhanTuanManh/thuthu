import React, { useMemo } from 'react'

const StarField = ({ count = 100 }) => {
  const stars = useMemo(() => {
    const starArray = []
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100
      const top = Math.random() * 100
      const size = Math.random() * 2 + 1 // size between 1px and 3px
      const delay = Math.random() * 2
      starArray.push({ left, top, size, delay })
    }
    return starArray
  }, [count])

  return (
    <div className="absolute inset-0">
      {stars.map((star, idx) => (
        <div
          key={idx}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        ></div>
      ))}
    </div>
  )
}

export default StarField
