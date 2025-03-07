import React, { useRef, useEffect } from 'react'

const settings = {
  particles: {
    length: 144,      // Số lượng particle tối đa
    duration: 4,      // Thời gian tồn tại của mỗi particle (giây)
    velocity: 80,     // Tốc độ particle (pixel/giây)
    effect: -1.3,     // Hệ số gia tốc tạo hiệu ứng
    size: 9,          // Kích thước particle cơ bản (dùng làm mẫu)
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

// Vẽ hình trái tim "realistic" bằng bézier curves
function createRealisticHeartImage() {
  // Tạo canvas offscreen với kích thước đủ lớn để hiển thị chi tiết
  const size = settings.particles.size * 5
  const offscreen = document.createElement('canvas')
  offscreen.width = size
  offscreen.height = size
  const ctx = offscreen.getContext('2d')

  ctx.beginPath()
  // Vẽ hình trái tim bằng đường bézier (giả lập trái tim con người)
  ctx.moveTo(size * 0.5, size * 0.25)           // Điểm trên cùng giữa
  ctx.bezierCurveTo(size * 0.2, 0, 0, size * 0.4, size * 0.5, size * 0.85)
  ctx.bezierCurveTo(size, size * 0.4, size * 0.8, 0, size * 0.5, size * 0.25)
  ctx.closePath()

  // Tạo gradient để tạo chiều sâu cho trái tim
  let grad = ctx.createLinearGradient(0, 0, 0, size)
  grad.addColorStop(0, "#d10000")  // đỏ tối
  grad.addColorStop(0.5, "#ff0000") // đỏ sáng
  grad.addColorStop(1, "#8b0000")  // đỏ đậm
  ctx.fillStyle = grad
  ctx.fill()

  // Thêm outline mịn và shadow để tạo hiệu ứng 3D
  ctx.shadowColor = "rgba(0,0,0,0.3)"
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 3
  ctx.shadowOffsetY = 3
  ctx.strokeStyle = "#800000"
  ctx.lineWidth = 2
  ctx.stroke()

  const image = new Image()
  image.src = offscreen.toDataURL()
  return image
}

// Spawn particle trong vùng gần hình trái tim (giả lập vùng hình trái tim)
function spawnHeartParticlePosition(width, height) {
  // Sử dụng ellipse xấp xỉ hình trái tim
  const heartWidth = 300
  const heartHeight = 450
  const angle = Math.random() * 2 * Math.PI
  const r = Math.sqrt(Math.random())  // phân bố lệch về trung tâm
  const xOffset = r * (heartWidth / 2) * Math.cos(angle)
  const yOffset = r * (heartHeight / 2) * Math.sin(angle)
  return { x: width / 2 + xOffset, y: height / 2 + yOffset }
}

// Vẽ outline của trái tim realistic bằng bézier curves
function drawRealisticHeartOutline(ctx, centerX, centerY, beat, size) {
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.scale(beat, beat)
  ctx.beginPath()
  const w = size
  const h = size * 1.5
  ctx.moveTo(w * 0.5, h * 0.25)
  ctx.bezierCurveTo(w * 0.2, 0, 0, h * 0.4, w * 0.5, h * 0.85)
  ctx.bezierCurveTo(w, h * 0.4, w * 0.8, 0, w * 0.5, h * 0.25)
  ctx.closePath()
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(255,182,193,0.7)'
  ctx.stroke()
  ctx.restore()
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
    const heartImage = createRealisticHeartImage()

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

      // Vẽ nền gradient tạo không gian sâu
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

      // Hiệu ứng nhịp đập: scale theo sin
      const beat =
        1 +
        settings.heart.beatScale *
          Math.sin((2 * Math.PI * (newTime - beatStart)) / settings.heart.beatPeriod)

      // Sinh particle: sử dụng spawn trong vùng trái tim, giới hạn max 100 particle/frame
      const spawnCount = Math.min(particleRate * deltaTime, 100)
      for (let i = 0; i < spawnCount; i++) {
        const pos = spawnHeartParticlePosition(width, height)
        const angle = Math.random() * 2 * Math.PI
        const vx = Math.cos(angle) * settings.particles.velocity
        const vy = Math.sin(angle) * settings.particles.velocity
        pool.add(pos.x, pos.y, vx, vy)
      }
      // Sinh thêm vài particle ngẫu nhiên
      const randomCount = 1
      for (let i = 0; i < randomCount; i++) {
        const spawnX = Math.random() * width
        const spawnY = Math.random() * height
        const angle = Math.random() * 2 * Math.PI
        const vx = Math.cos(angle) * (Math.random() * 20 + 10)
        const vy = Math.sin(angle) * (Math.random() * 20 + 10)
        pool.add(spawnX, spawnY, vx, vy)
      }

      pool.update(deltaTime)

      // Vẽ particle với blending additive và hiệu ứng glow
      context.globalCompositeOperation = 'lighter'
      context.shadowBlur = 8
      context.shadowColor = '#ffb6c1'
      pool.draw(context, heartImage, beat)
      context.shadowBlur = 0
      context.shadowColor = 'transparent'
      context.globalCompositeOperation = 'source-over'

      // Vẽ outline trái tim realistic với hiệu ứng 3D:
      // Vẽ lớp shadow lệch để tạo độ sâu
      context.save()
      context.translate(width / 2 + 10, height / 2 + 10)
      const beatShadow = beat * 0.98
      context.scale(beatShadow, beatShadow)
      context.beginPath()
      const outlineSize = 300
      context.moveTo(outlineSize * 0.5, outlineSize * 0.25)
      context.bezierCurveTo(outlineSize * 0.2, 0, 0, outlineSize * 0.4, outlineSize * 0.5, outlineSize * 0.85)
      context.bezierCurveTo(outlineSize, outlineSize * 0.4, outlineSize * 0.8, 0, outlineSize * 0.5, outlineSize * 0.25)
      context.closePath()
      context.lineWidth = 5
      context.strokeStyle = 'rgba(0,0,0,0.5)'
      context.stroke()
      context.restore()

      // Vẽ outline chính của trái tim realistic
      drawRealisticHeartOutline(context, width / 2, height / 2, beat, 300)
    }

    render()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

export default HeartCanvas
