import React, { useMemo } from 'react'

const FloatingHearts = () => {
  const hearts = useMemo(() => {
    const arr = []
    const count = 15
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        // Vị trí ngẫu nhiên theo phần trăm (chiếm toàn bộ chiều rộng)
        left: Math.random() * 100,
        // Thời gian delay và thời gian animation ngẫu nhiên
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5, // từ 5 đến 10 giây
        // Kích thước từ 20px đến 50px
        size: Math.random() * 10 + 20,
      })
    }
    return arr
  }, [])

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            zIndex: 1,
          }}
          className="absolute bottom-0 translate-y-full animate-floatUp"
        >
          <svg viewBox="0 0 32 29.6" fill="#ffb6c1" className="w-full h-full opacity-80">
            <path d="M23.6,0c-3.4,0-6.4,2.1-7.6,5.1C14.8,2.1,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4 c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z" />
          </svg>
        </div>
      ))}
    </>
  )
}

export default FloatingHearts
