import React from 'react'
import HeartCanvas from './HeartCanvas'
import FloatingHearts from './FloatingHearts'

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Canvas chứa hiệu ứng vũ trụ trái tim (HeartCanvas đã tạo nhiều particle, nhịp đập, glow, …) */}
      <HeartCanvas />
      {/* Component FloatingHearts thêm hiệu ứng trái tim bay nhẹ, tạo cảm giác vũ trụ rộng lớn */}
      <FloatingHearts />
      {/* Overlay thông điệp */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-xl">
          Chúc mừng Ngày Quốc tế Phụ nữ
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-pink-300 drop-shadow">
         Mãi yêu iem
        </p>
      </div>
    </div>
  )
}
