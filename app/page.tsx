'use client'

import { useEffect, useState, useRef } from 'react'
import './valentine.css'

export default function Page() {
  const [currentSection, setCurrentSection] = useState(0)
  const [noButtonAttempts, setNoButtonAttempts] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [playfulText, setPlayfulText] = useState('')
  const [typingText, setTypingText] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const audioContextRef = useRef<AudioContext | null>(null)

  const CONFIG = {
    herName: 'My Love',
    yourName: 'Me'
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      createFloatingHearts()
      createSparkles()
      initLanding()
    }
  }, [])

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      if (!audioContextRef.current) return
      const osc = audioContextRef.current.createOscillator()
      const gain = audioContextRef.current.createGain()
      
      osc.connect(gain)
      gain.connect(audioContextRef.current.destination)
      
      osc.frequency.value = frequency
      osc.type = type
      gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)
      
      osc.start(audioContextRef.current.currentTime)
      osc.stop(audioContextRef.current.currentTime + duration)
    } catch (e) {}
  }

  const playClickSound = () => playSound(600, 0.1)
  const playChimeSound = () => {
    playSound(800, 0.3)
    setTimeout(() => playSound(1000, 0.2), 100)
  }

  const createFloatingHearts = () => {
    const container = document.getElementById('hearts-container')
    if (!container) return
    
    const addHeart = () => {
      const heart = document.createElement('div')
      heart.className = 'heart'
      const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞']
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
      heart.style.left = Math.random() * 100 + '%'
      heart.style.animationDuration = (6 + Math.random() * 4) + 's'
      heart.style.opacity = String(0.3 + Math.random() * 0.4)
      heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem'
      container.appendChild(heart)
      
      setTimeout(() => heart.remove(), 10000)
    }
    
    const interval = setInterval(addHeart, 1500)
    return () => clearInterval(interval)
  }

  const createSparkles = () => {
    const container = document.createElement('div')
    container.className = 'sparkles'
    document.body.appendChild(container)
    
    const addSparkle = () => {
      const sparkle = document.createElement('div')
      sparkle.className = 'sparkle'
      sparkle.style.left = Math.random() * 100 + '%'
      sparkle.style.top = Math.random() * 100 + '%'
      sparkle.style.animationDelay = Math.random() * 3 + 's'
      container.appendChild(sparkle)
      
      setTimeout(() => sparkle.remove(), 3000)
    }
    
    setInterval(addSparkle, 300)
  }

  const typeText = (text: string, speed = 50, callback?: () => void) => {
    let index = 0
    setTypingText('')
    
    const type = () => {
      if (index < text.length) {
        const char = text.charAt(index)
        setTypingText(prev => prev + char)
        index++
        // Add slight delay after spaces for more natural typing
        const delay = char === ' ' ? speed * 2 : speed
        setTimeout(type, delay)
      } else if (callback) {
        callback()
      }
    }
    
    type()
  }

  const typeLetterContent = (text: string, speed = 30) => {
    let index = 0
    setLetterContent('')
    
    const type = () => {
      if (index < text.length) {
        const char = text.charAt(index)
        if (char === '\n') {
          setLetterContent(prev => prev + '<br>')
        } else {
          setLetterContent(prev => prev + char)
        }
        index++
        const delay = char === '.' || char === ',' ? speed * 3 : speed
        setTimeout(type, delay)
      } else {
        setLetterContent(prev => prev + '<span class="cursor"></span>')
      }
    }
    
    type()
  }

  const initLanding = () => {
    typeText(`Hi ${CONFIG.herName} ❤️`, 60, () => {
      setTimeout(() => {
        typeText(`I made something special for you...`, 50)
      }, 500)
    })
  }

  const goToSection = (sectionNumber: number) => {
    playClickSound()
    setCurrentSection(sectionNumber)
    window.scrollTo(0, 0)
    
    if (sectionNumber === 3) initGift1()
    if (sectionNumber === 4) initGift2()
    if (sectionNumber === 6) setCurrentSlide(0)
  }

  const initGift1 = () => {
    const rose = document.querySelector('#gift1-section svg') as HTMLElement
    if (rose && !rose.style.animation) {
      rose.style.animation = 'fadeIn 2s ease-in-out'
    }
  }

  const initGift2 = () => {
    if (letterContent === '') {
      const letterText = `My Dearest Love,\n\nYou are the magic in my days.\nYour smile is my favorite sight,\nyour laughter, my sweetest melody.\n\nMy heart chose you,\nand will choose you forever.\n\nAll my love,\n${CONFIG.yourName} 💕`
      typeLetterContent(letterText, 30)
    }
  }

  const createConfetti = () => {
    const canvas = document.getElementById('confetti') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.classList.add('active')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confetti: any[] = []
    const shapes = ['circle', 'square', 'heart']

    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 6,
        speedX: Math.random() * 10 - 5,
        speedY: Math.random() * 10 + 5,
        color: ['#ff1493', '#ff4d6d', '#ffc0cb', '#ffe5d9', '#fff5f7', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 7)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let anyConfettiLeft = false

      confetti.forEach(c => {
        c.x += c.speedX
        c.y += c.speedY
        c.speedY += 0.3
        c.rotation += c.rotationSpeed

        if (c.y < canvas.height + 50) {
          anyConfettiLeft = true
          ctx.save()
          ctx.translate(c.x, c.y)
          ctx.rotate((c.rotation * Math.PI) / 180)
          ctx.fillStyle = c.color
          
          if (c.shape === 'circle') {
            ctx.beginPath()
            ctx.arc(0, 0, c.size, 0, Math.PI * 2)
            ctx.fill()
          } else if (c.shape === 'square') {
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size)
          } else if (c.shape === 'heart') {
            ctx.font = `${c.size * 2}px Arial`
            ctx.fillText('❤️', -c.size, c.size / 2)
          }
          
          ctx.restore()
        }
      })

      if (anyConfettiLeft) {
        requestAnimationFrame(animate)
      } else {
        canvas.classList.remove('active')
      }
    }

    animate()
  }

  const handleYesClick = () => {
    playChimeSound()
    createConfetti()
    setTimeout(() => {
      goToSection(2)
    }, 1000)
  }

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement
    target.classList.add('shake')
    playSound(300, 0.2)
    setNoButtonAttempts(prev => prev + 1)

    if (noButtonAttempts === 0) {
      target.style.pointerEvents = 'none'
      target.style.opacity = '0.5'
      setPlayfulText('Are you really sure? 🥺')
    } else if (noButtonAttempts >= 1) {
      target.style.display = 'none'
    }

    setTimeout(() => {
      target.classList.remove('shake')
    }, 400)
  }

  return (
    <>
      <div className="hearts-container" id="hearts-container"></div>
      <canvas id="confetti"></canvas>
      <button 
        className={`back-btn ${currentSection > 2 ? 'show' : ''}`} 
        id="back-btn"
        onClick={() => goToSection(2)}
      >
        ← Back
      </button>

      <main>
        {/* SECTION 1: LANDING */}
        <section className={`section ${currentSection === 0 ? 'active' : ''}`} id="landing-section">
          <div className="landing-text" id="typing-text">{typingText}</div>
          <div className="landing-subtext">Before you scroll...</div>
          <div className="landing-subtext">I need to ask you something important.</div>
          <button className="continue-btn" onClick={() => { playChimeSound(); goToSection(1) }}>
            Continue ✨
          </button>
        </section>

        {/* SECTION 2: PROPOSAL */}
        <section className={`section ${currentSection === 1 ? 'active' : ''}`} id="proposal-section">
          <div className="proposal-card">
            <h2 className="proposal-question">Will you be my Valentine? 💕</h2>
            <div className="button-group">
              <button className="yes-btn" onClick={handleYesClick}>YES, OF COURSE! 💗</button>
              <button className="no-btn" onClick={handleNoClick}>No 🙈</button>
            </div>
            {playfulText && <div className="playful-text">{playfulText}</div>}
          </div>
        </section>

        {/* SECTION 3: CELEBRATION */}
        <section className={`section ${currentSection === 2 ? 'active' : ''}`} id="celebration-section">
          <h2 className="celebration-title">YOU SAID YES! 💞✨</h2>
          <p className="celebration-subtitle">I prepared these special gifts just for you, my love...</p>
          <div className="gifts-grid">
            {[
              { icon: '🌹', title: 'A Rose Just for You', desc: 'A symbol of eternal love', gift: 1 },
              { icon: '💌', title: 'My Words From the Heart', desc: 'A heartfelt love letter', gift: 2 },
              { icon: '📸', title: 'Our Precious Memories', desc: 'Moments frozen in time', gift: 3 },
              { icon: '💍', title: 'A Sacred Promise', desc: 'Forever and always', gift: 4 }
            ].map((item) => (
              <div 
                key={item.gift} 
                className="gift-box" 
                onClick={() => { playChimeSound(); goToSection(2 + item.gift) }}
              >
                <div className="gift-icon">{item.icon}</div>
                <div className="gift-title">{item.title}</div>
                <div className="gift-description">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: GIFT 1 - ROSE */}
        <section className={`section ${currentSection === 3 ? 'active' : ''}`} id="gift1-section">
          <div className="rose-section">
            <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: 'var(--rose-red)', marginBottom: '1rem' }}>
              🌹 A Rose Just for You
            </h3>
            <div className="rose-container">
              <svg viewBox="0 0 200 300" width="150" height="225">
                <defs>
                  <radialGradient id="roseGradient" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#ff1493" />
                    <stop offset="50%" stopColor="#ff4d6d" />
                    <stop offset="100%" stopColor="#ff69b4" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path d="M100 250 Q95 200 100 100" stroke="#2d5016" strokeWidth="3" fill="none"/>
                <circle cx="100" cy="50" r="12" fill="url(#roseGradient)" filter="url(#glow)"/>
                <circle cx="100" cy="40" r="10" fill="url(#roseGradient)" filter="url(#glow)"/>
                <circle cx="110" cy="45" r="11" fill="url(#roseGradient)" filter="url(#glow)"/>
                <circle cx="90" cy="45" r="11" fill="url(#roseGradient)" filter="url(#glow)"/>
                <circle cx="105" cy="55" r="10" fill="url(#roseGradient)" filter="url(#glow)"/>
                <circle cx="95" cy="55" r="10" fill="url(#roseGradient)" filter="url(#glow)"/>
                <circle cx="115" cy="35" r="12" fill="#ff7a8a" filter="url(#glow)"/>
                <circle cx="85" cy="35" r="12" fill="#ff7a8a" filter="url(#glow)"/>
                <circle cx="120" cy="55" r="11" fill="#ff7a8a" filter="url(#glow)"/>
                <circle cx="80" cy="55" r="11" fill="#ff7a8a" filter="url(#glow)"/>
                <circle cx="110" cy="30" r="10" fill="#ffa0b0" filter="url(#glow)"/>
                <circle cx="90" cy="30" r="10" fill="#ffa0b0" filter="url(#glow)"/>
                <ellipse cx="85" cy="120" rx="8" ry="15" fill="#2d5016" transform="rotate(-30 85 120)"/>
                <ellipse cx="115" cy="140" rx="8" ry="15" fill="#2d5016" transform="rotate(30 115 140)"/>
                <ellipse cx="80" cy="180" rx="6" ry="12" fill="#3a6b1f" transform="rotate(-35 80 180)"/>
                <ellipse cx="120" cy="200" rx="6" ry="12" fill="#3a6b1f" transform="rotate(35 120 200)"/>
              </svg>
            </div>
            <p className="rose-text">Like this rose, my feelings for you bloom more beautifully with each passing day. You are the garden of my heart. 🌹✨</p>
          </div>
        </section>

        {/* SECTION 5: GIFT 2 - LOVE LETTER */}
        <section className={`section ${currentSection === 4 ? 'active' : ''}`} id="gift2-section">
          <div className="letter-section">
            <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: 'var(--rose-red)', marginBottom: '2rem' }}>
              💌 Love Letter
            </h3>
            <div className="letter-content" dangerouslySetInnerHTML={{ __html: letterContent }}></div>
          </div>
        </section>

        {/* SECTION 6: GIFT 3 - SLIDESHOW */}
        <section className={`section ${currentSection === 5 ? 'active' : ''}`} id="gift3-section">
          <div className="slideshow-container">
            <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: 'var(--rose-red)', marginBottom: '1.5rem', textAlign: 'center' }}>
              📸 Our Memories
            </h3>
            <div id="slideshow">
              {[
                { emoji: '💑', caption: 'Our first magical moments together' },
                { emoji: '🌅', caption: 'Beautiful sunrises we shared' },
                { emoji: '🎭', caption: 'Adventures that made us laugh' },
                { emoji: '✨', caption: 'Forever moments, eternally ours' }
              ].map((slide, idx) => (
                <div key={idx} className={`slide ${currentSlide === idx ? 'active' : ''}`}>
                  <div className="slide-image">{slide.emoji}</div>
                  <div className="slide-caption">{slide.caption}</div>
                </div>
              ))}
            </div>
            <div className="slide-controls">
              <button 
                className="slide-btn" 
                onClick={() => { playClickSound(); setCurrentSlide((currentSlide - 1 + 4) % 4) }}
              >
                ← Previous
              </button>
              <button 
                className="slide-btn" 
                onClick={() => { playClickSound(); setCurrentSlide((currentSlide + 1) % 4) }}
              >
                Next →
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 7: GIFT 4 - PROMISE */}
        <section className={`section ${currentSection === 6 ? 'active' : ''}`} id="gift4-section">
          <div className="promise-section">
            <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem', color: 'var(--rose-red)', marginBottom: '2rem' }}>
              💍 A Promise
            </h3>
            <div className="promise-list">
              <div className="promise-item">✓ To respect and honor you always</div>
              <div className="promise-item">✓ To support your dreams and aspirations</div>
              <div className="promise-item">✓ To choose you every single day</div>
              <div className="promise-item">✓ To stand beside you through everything</div>
              <div className="promise-item">✓ To never stop showing you my love</div>
            </div>
            <div className="promise-final">
              So... will you let me be yours forever? <span className="heartbeat">❤️</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
