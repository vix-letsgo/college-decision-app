'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

const CONFETTI_COLORS = ['#c8956c', '#e8b896', '#f5ebe0', '#a0522d', '#ffd700', '#ff8c69', '#deb887']

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
    }))

    let animFrame: number
    let active = true

    function draw() {
      if (!ctx || !canvas || !active) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotationSpeed
        if (p.y > canvas.height) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }
      })
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    const stop = setTimeout(() => { active = false }, 4000)

    return () => {
      active = false
      cancelAnimationFrame(animFrame)
      clearTimeout(stop)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    />
  )
}

type Personality = 'bold' | 'sweet' | 'zen' | 'owl' | 'indulgent'

type Answer = {
  emoji: string
  text: string
  personality: Personality
}

type Question = {
  id: number
  text: string
  answers: Answer[]
}

type PersonalityInfo = {
  name: string
  coffee: string
  tagline: string
  image: string
}

const PERSONALITIES: Record<Personality, PersonalityInfo> = {
  bold: {
    name: 'Bold Adventurer',
    coffee: 'Double Espresso',
    tagline: 'You live for intensity',
    image: '/espresso.jpg',
  },
  sweet: {
    name: 'Sweet Enthusiast',
    coffee: 'Caramel Latte',
    tagline: "Life's too short for bitter",
    image: '/caramel-latte.jpg',
  },
  zen: {
    name: 'Zen Minimalist',
    coffee: 'Black Coffee, Single Origin',
    tagline: 'Simple. Clean. Perfect.',
    image: '/black-coffee.jpg',
  },
  owl: {
    name: 'Night Owl',
    coffee: 'Red Eye',
    tagline: 'Sleep is optional',
    image: '/red-eye.jpg',
  },
  indulgent: {
    name: 'Indulgent Treat',
    coffee: 'Mocha with Whip',
    tagline: 'Coffee is dessert',
    image: '/mocha.jpg',
  },
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You're sorting yourself into a Hogwarts house. Which fits you best?",
    answers: [
      { emoji: '⚡', text: 'Gryffindor — brave, bold, first to volunteer', personality: 'bold' },
      { emoji: '🌿', text: "Hufflepuff — loyal, warm, always has snacks", personality: 'sweet' },
      { emoji: '💙', text: 'Ravenclaw — thoughtful, curious, needs quiet', personality: 'zen' },
      { emoji: '🐍', text: 'Slytherin — strategic, up late plotting greatness', personality: 'owl' },
      { emoji: '✨', text: "I'd bribe the Sorting Hat for the best common room", personality: 'indulgent' },
    ],
  },
  {
    id: 2,
    text: "It's Friday night. What are you watching?",
    answers: [
      { emoji: '🧙', text: 'An epic fantasy series — give me all the worlds', personality: 'bold' },
      { emoji: '😂', text: "A feel-good comedy I've seen 10 times", personality: 'sweet' },
      { emoji: '🎬', text: 'A slow-burn arthouse film', personality: 'zen' },
      { emoji: '🌙', text: "A thriller I shouldn't be watching alone at midnight", personality: 'owl' },
      { emoji: '🍿', text: "Something with a 90s rom-com energy", personality: 'indulgent' },
    ],
  },
  {
    id: 3,
    text: 'Which TV character are you at a party?',
    answers: [
      { emoji: '🗡️', text: 'Daenerys — showing up with dragons (metaphorically)', personality: 'bold' },
      { emoji: '☀️', text: 'Leslie Knope — organizing the snack table', personality: 'sweet' },
      { emoji: '📚', text: 'Hermione — in the corner with a book', personality: 'zen' },
      { emoji: '🌑', text: 'Wednesday Addams — arrives fashionably late', personality: 'owl' },
      { emoji: '👑', text: 'Blair Waldorf — the host, obviously', personality: 'indulgent' },
    ],
  },
  {
    id: 4,
    text: 'Pick your ideal travel destination:',
    answers: [
      { emoji: '🏔️', text: 'Patagonia hiking trek', personality: 'bold' },
      { emoji: '🌸', text: 'Japan in cherry blossom season', personality: 'sweet' },
      { emoji: '🏯', text: 'Kyoto temple stays, total silence', personality: 'zen' },
      { emoji: '🌃', text: 'Tokyo at 2am, neon everywhere', personality: 'owl' },
      { emoji: '🛳️', text: 'Mediterranean cruise with unlimited food', personality: 'indulgent' },
    ],
  },
  {
    id: 5,
    text: 'Which Netflix genre do you always click first?',
    answers: [
      { emoji: '🎯', text: 'Action & Adventure', personality: 'bold' },
      { emoji: '💌', text: 'Romance & Feel-Good', personality: 'sweet' },
      { emoji: '🧘', text: 'Nature Documentaries', personality: 'zen' },
      { emoji: '🕵️', text: 'True Crime & Thrillers', personality: 'owl' },
      { emoji: '🍰', text: 'Food & Travel Shows', personality: 'indulgent' },
    ],
  },
  {
    id: 6,
    text: 'Your friends describe you as:',
    answers: [
      { emoji: '🔥', text: 'The one who suggests the wild idea', personality: 'bold' },
      { emoji: '🤗', text: "The one who remembers everyone's birthday", personality: 'sweet' },
      { emoji: '🪴', text: 'The one who actually reads the whole menu', personality: 'zen' },
      { emoji: '🦉', text: 'The one who texts you at 1am with a great idea', personality: 'owl' },
      { emoji: '🎁', text: 'The one who orders dessert and shares with everyone', personality: 'indulgent' },
    ],
  },
]

type Scores = Record<Personality, number>

function calculateResults(scores: Scores) {
  const total = QUESTIONS.length
  return (Object.entries(scores) as [Personality, number][])
    .map(([personality, count]) => ({
      personality,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<Scores>({ bold: 0, sweet: 0, zen: 0, owl: 0, indulgent: 0 })
  const [selectedAnswer, setSelectedAnswer] = useState<Personality | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleAnswer(personality: Personality) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(personality)
    timerRef.current = setTimeout(() => {
      setScores(prev => ({ ...prev, [personality]: prev[personality] + 1 }))
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
    }, 400)
  }

  function handleRetake() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrentQuestion(0)
    setScores({ bold: 0, sweet: 0, zen: 0, owl: 0, indulgent: 0 })
    setSelectedAnswer(null)
  }

  const progress = (currentQuestion / QUESTIONS.length) * 100

  // Results screen
  if (currentQuestion >= QUESTIONS.length) {
    const results = calculateResults(scores)
    const top = results[0]
    const topInfo = PERSONALITIES[top.personality]

    return (
      <>
      <Confetti />
      <main className="min-h-screen flex items-center justify-center p-4 py-12">
        <div
          className="rounded-2xl p-8 shadow-xl max-w-xl w-full"
          style={{ background: 'var(--card-bg)', backdropFilter: 'blur(12px)' }}
        >
          {/* Header */}
          <p className="text-sm font-bold tracking-widest uppercase mb-6" style={{ color: 'var(--accent)' }}>
            ☕ ShixVix Coffee
          </p>

          {/* Top result image */}
          <div className="rounded-xl overflow-hidden mb-6">
            <Image
              src={topInfo.image}
              alt={topInfo.coffee}
              width={480}
              height={280}
              className="w-full object-cover"
            />
          </div>

          {/* Top result headline */}
          <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
            Your Coffee Personality
          </p>
          <h1 className="font-serif text-3xl font-bold text-stone-800 mb-1">
            👑 {topInfo.name}
          </h1>
          <p className="text-stone-500 text-lg mb-1">{topInfo.tagline}</p>
          <p className="font-bold mb-8" style={{ color: 'var(--accent)' }}>
            Your drink: {topInfo.coffee}
          </p>

          {/* All results breakdown */}
          <p className="text-sm font-bold tracking-widest uppercase text-stone-400 mb-4">
            Your Full Breakdown
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {results.map((result, index) => {
              const info = PERSONALITIES[result.personality]
              const isTop = index === 0
              return (
                <div
                  key={result.personality}
                  className="rounded-xl p-4"
                  style={isTop ? { background: 'rgba(200, 149, 108, 0.15)', border: '1px solid rgba(200, 149, 108, 0.3)' } : { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-stone-700 text-sm">
                      {isTop ? '👑 ' : ''}{info.name}
                    </span>
                    <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
                      {result.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-200 mb-1">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${result.percentage}%`, background: 'var(--accent)' }}
                    />
                  </div>
                  <p className="text-stone-400 text-xs">{info.coffee}</p>
                </div>
              )
            })}
          </div>

          {/* Retake button */}
          <button
            onClick={handleRetake}
            className="w-full rounded-full py-3 font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Retake Quiz
          </button>
        </div>
      </main>
      </>
    )
  }

  // Quiz screen
  const question = QUESTIONS[currentQuestion]

  return (
    <main className="min-h-screen flex items-center justify-center p-4 py-12">
      <div
        className="rounded-2xl p-8 shadow-xl max-w-xl w-full"
        style={{ background: 'var(--card-bg)', backdropFilter: 'blur(12px)' }}
      >
        {/* Brand */}
        <p className="text-sm font-bold tracking-widest uppercase mb-6" style={{ color: 'var(--accent)' }}>
          ☕ ShixVix Coffee
        </p>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <span className="text-xs font-bold text-stone-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-stone-200">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="font-serif text-2xl font-bold text-stone-800 mb-8 leading-snug">
          {question.text}
        </h1>

        {/* Answers */}
        <div className="flex flex-col gap-3">
          {question.answers.map((answer) => {
            const isSelected = selectedAnswer === answer.personality
            return (
              <button
                key={answer.personality}
                onClick={() => handleAnswer(answer.personality)}
                disabled={selectedAnswer !== null}
                className="w-full text-left rounded-xl px-5 py-4 border-2 transition-all duration-200 flex items-center gap-4 font-medium text-stone-700"
                style={
                  isSelected
                    ? { borderColor: 'var(--accent)', background: 'rgba(200, 149, 108, 0.12)' }
                    : { borderColor: 'rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)' }
                }
              >
                <span className="text-2xl">{answer.emoji}</span>
                <span>{answer.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
