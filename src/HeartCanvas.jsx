import React, { useRef, useEffect } from 'react'

const settings = {
  particles: {
    length: 15000,    // Số lượng particle tối đa tạo vũ trụ trái tim
    duration: 4,      // Thời gian tồn tại của mỗi particle (giây)
    velocity: 80,     // Tốc độ particle (pixel/giây)
    effect: -1.3,     // Hệ số gia tốc tạo hiệu ứng
    size: 9,          // Kích thước particle cơ bản (dùng để tạo ảnh trái tim)
  },
  heart: {
    beatPeriod: 1.2,  // Chu kỳ nhịp đập (giây)
    beatScale: 0.12,  // Biên độ thay đổi kích thước theo nhịp
  },
}

class Point {
  constructor(x, y) {
    this.x = x !== undefined ? x : 0
    this.y = y !== undefined ? y : 0
  }
  clone() {
    return new Point(this.x, this.y)
  }
  length(len) {
    if (len === undefined) return Math.sqrt(this.x * this.x + this.y * this.y)
    this.normalize()
    this.x *= len
    this.y *= len
    return this
  }
  normalize() {
    const len = this.length()
    this.x /= len
    this.y /= len
    return this
  }
}

class Particle {
  constructor() {
    this.position = new Point()
    this.velocity = new Point()
    this.acceleration = new Point()
    this.age = 0
  }
  initialize(x, y, dx, dy) {
    this.position.x = x
    this.position.y = y
    this.velocity.x = dx
    this.velocity.y = dy
    this.acceleration.x = dx * settings.particles.effect
    this.acceleration.y = dy * settings.particles.effect
    this.age = 0
  }
  update(deltaTime) {
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime
    this.velocity.x += this.acceleration.x * deltaTime
    this.velocity.y += this.acceleration.y * deltaTime
    this.age += deltaTime
  }
  draw(context, image, extraScale = 1) {
    // Hàm easing để tạo hiệu ứng mượt khi particle phai biến mất
    const ease = (t) => (--t) * t * t + 1
    const t = this.age / settings.particles.duration
    const size = image.width * ease(t) * extraScale
    context.globalAlpha = 1 - t
    context.drawImage(
      image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    )
  }
}

class ParticlePool {
  constructor(length) {
    this.particles = new Array(length)
    for (let i = 0; i < length; i++) {
      this.particles[i] = new Particle()
    }
    this.firstActive = 0
    this.firstFree = 0
    this.duration = settings.particles.duration
  }
  add(x, y, dx, dy) {
    this.particles[this.firstFree].initialize(x, y, dx, dy)
    this.firstFree++
    if (this.firstFree === this.particles.length) this.firstFree = 0
    if (this.firstActive === this.firstFree) {
      this.firstActive++
      if (this.firstActive === this.particles.length) this.firstActive = 0
    }
  }
  update(deltaTime) {
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime)
      }
    } else {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].update(deltaTime)
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime)
      }
    }
    while (
      this.particles[this.firstActive].age >= this.duration &&
      this.firstActive !== this.firstFree
    ) {
      this.firstActive++
      if (this.firstActive === this.particles.length) this.firstActive = 0
    }
  }
  draw(context, image, extraScale = 1) {
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].draw(context, image, extraScale)
      }
    } else {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].draw(context, image, extraScale)
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].draw(context, image, extraScale)
      }
    }
  }
}

function pointOnHeart(t) {
  // Nhân hệ số để làm trái tim to hơn
  const scale = 1.2
  return new Point(
    160 * Math.pow(Math.sin(t), 3) * scale,
    (130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25) * scale
  )
}

function createHeartImage() {
  const size = settings.particles.size
  const offscreen = document.createElement('canvas')
  offscreen.width = size
  offscreen.height = size
  const ctx = offscreen.getContext('2d')
  ctx.beginPath()
  const to = (t) => {
    const p = pointOnHeart(t)
    p.x = size / 2 + (p.x * size) / 350
    p.y = size / 2 - (p.y * size) / 350
    return p
  }
  let t = -Math.PI
  let p = to(t)
  ctx.moveTo(p.x, p.y)
  while (t < Math.PI) {
    t += 0.01
    p = to(t)
    ctx.lineTo(p.x, p.y)
  }
  ctx.closePath()
  // Sử dụng gradient radial với màu hồng nhẹ
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size / 8,
    size / 2,
    size / 2,
    size / 2
  )
  grad.addColorStop(0, '#ffb6c1')  // light pink
  grad.addColorStop(1, '#ff69b4')  // hot pink nhẹ
  ctx.fillStyle = grad
  ctx.fill()
  const image = new Image()
  image.src = offscreen.toDataURL()
  return image
}

const HeartCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let width, height
    let time = 0
    const beatStart = performance.now() / 1000

    const pool = new ParticlePool(settings.particles.length)
    const particleRate = settings.particles.length / settings.particles.duration
    const heartImage = createHeartImage()

    const onResize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      width = canvas.width
      height = canvas.height
    }
    onResize()
    window.addEventListener('resize', onResize)

    const render = () => {
      requestAnimationFrame(render)
      const newTime = performance.now() / 1000
      const deltaTime = time ? newTime - time : 0
      time = newTime

      // Vẽ nền với gradient động tạo không gian sâu
      const bgGrad = context.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) / 4,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5
      )
      bgGrad.addColorStop(0, 'rgba(0,0,0,0.2)')
      bgGrad.addColorStop(1, 'rgba(0,0,0,0.9)')
      context.fillStyle = bgGrad
      context.fillRect(0, 0, width, height)

      // Hiệu ứng nhịp đập: scale theo sin để tạo chuyển động "đập"
      const beat =
        1 +
        settings.heart.beatScale *
          Math.sin((2 * Math.PI * (newTime - beatStart)) / settings.heart.beatPeriod)

      // Sinh particle từ đường cong trái tim (áp dụng hiệu ứng nhịp đập)
      const amount = particleRate * deltaTime
      for (let i = 0; i < amount; i++) {
        const t = Math.random() * 2 * Math.PI - Math.PI
        const pos = pointOnHeart(t)
        pos.x *= beat
        pos.y *= beat
        const spawnX = width / 2 + pos.x
        const spawnY = height / 2 - pos.y
        const dir = pos.clone().length(settings.particles.velocity)
        pool.add(spawnX, spawnY, dir.x, -dir.y)
      }

      // Sinh thêm một số particle ngẫu nhiên (floating hearts) trên toàn màn hình
      const randomCount = 2
      for (let i = 0; i < randomCount; i++) {
        const spawnX = Math.random() * width
        const spawnY = Math.random() * height
        const angle = Math.random() * 2 * Math.PI
        const velocityMagnitude = Math.random() * 20 + 10
        const vx = Math.cos(angle) * velocityMagnitude
        const vy = Math.sin(angle) * velocityMagnitude
        pool.add(spawnX, spawnY, vx, vy)
      }

      pool.update(deltaTime)

      // Dùng chế độ blending additive và thêm shadowBlur để tạo hiệu ứng glow mượt mà
      context.globalCompositeOperation = 'lighter'
      context.shadowBlur = 8
      context.shadowColor = '#ffb6c1'
      pool.draw(context, heartImage, beat)
      context.shadowBlur = 0
      context.shadowColor = 'transparent'
      context.globalCompositeOperation = 'source-over'

      // Vẽ viền trái tim pulsating với màu hồng nhẹ
      context.save()
      context.translate(width / 2, height / 2)
      context.scale(beat, beat)
      context.beginPath()
      let t2 = -Math.PI
      let p2 = pointOnHeart(t2)
      context.moveTo(p2.x, -p2.y)
      while (t2 < Math.PI) {
        t2 += 0.01
        p2 = pointOnHeart(t2)
        context.lineTo(p2.x, -p2.y)
      }
      context.closePath()
      context.lineWidth = 3
      context.strokeStyle = 'rgba(255,182,193,0.7)' // light pink stroke
      context.stroke()
      context.restore()
    }

    render()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

export default HeartCanvas
