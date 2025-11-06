"use client"

import { useEffect, useRef, useState } from "react"

const InterviewPracticeDemo = ({ isActive }: { isActive: boolean }) => {
  const [messages, setMessages] = useState([
    { text: "Tell me about yourself.", isBot: true, visible: false },
    { text: "I have 5 years of experience in software development...", isBot: false, visible: false },
    { text: "Great! Your answer was clear and concise. Score: 8/10", isBot: true, visible: false },
  ])
  const [typingDots, setTypingDots] = useState(0)

  useEffect(() => {
    if (!isActive) return

    setMessages([
      { text: "Tell me about yourself.", isBot: true, visible: false },
      { text: "I have 5 years of experience in software development...", isBot: false, visible: false },
      { text: "Great! Your answer was clear and concise. Score: 8/10", isBot: true, visible: false },
    ])

    const timer = setTimeout(() => {
      setMessages((prev) => prev.map((msg, i) => ({ ...msg, visible: i === 0 })))

      setTimeout(() => {
        setMessages((prev) => prev.map((msg, i) => ({ ...msg, visible: i <= 1 })))

        setTimeout(() => {
          const typingInterval = setInterval(() => {
            setTypingDots((prev) => (prev + 1) % 4)
          }, 500)

          setTimeout(() => {
            clearInterval(typingInterval)
            setMessages((prev) => prev.map((msg) => ({ ...msg, visible: true })))
          }, 2000)
        }, 1000)
      }, 1500)
    }, 500)

    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden relative">
      <div className="absolute top-2 right-2 text-xs text-slate-500 font-medium">Interview Mode</div>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"} transition-all duration-500 ${
              msg.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-1.5 rounded-full text-xs ${
                msg.isBot ? "bg-blue-100 text-blue-700" : "bg-slate-700 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typingDots > 0 && (
          <div className="flex justify-start">
            <div className="bg-blue-100 px-3 py-1.5 rounded-full">
              <div className="flex space-x-1">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-1 h-1 bg-blue-600 rounded-full transition-opacity duration-300 ${
                      typingDots >= dot ? "opacity-100" : "opacity-30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const FeedbackScoringDemo = ({ isActive }: { isActive: boolean }) => {
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  useEffect(() => {
    if (!isActive) return

    const timer = setTimeout(() => {
      const targetScore = 85
      const interval = setInterval(() => {
        setScore((prev) => {
          const newScore = Math.min(prev + 3, targetScore)
          if (newScore === 25) setFeedback(["✓ Clear structure"])
          if (newScore === 50) setFeedback((prev) => [...prev, "✓ Good examples"])
          if (newScore === 75) setFeedback((prev) => [...prev, "✓ Strong delivery"])
          return newScore
        })
      }, 50)

      setTimeout(() => clearInterval(interval), 1200)
    }, 500)

    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 flex flex-col items-center justify-center">
      <div className="text-center w-full">
        <div className="text-2xl font-bold text-slate-900">{score}</div>
        <div className="text-xs text-slate-500 mt-1">Score</div>
        <div className="mt-2 space-y-1">
          {feedback.map((fb, i) => (
            <div key={i} className="text-xs text-green-600 font-medium">
              {fb}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const InterviewTypesDemo = ({ isActive }: { isActive: boolean }) => {
  const [selected, setSelected] = useState<number | null>(null)
  const types = ["Technical", "Behavioral", "System Design"]

  useEffect(() => {
    if (!isActive) return
    types.forEach((_, index) => {
      setTimeout(
        () => {
          setSelected(index)
        },
        600 + index * 500,
      )
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32">
      <div className="space-y-2">
        {types.map((type, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-300 ${
              i === selected ? "bg-blue-100 border border-blue-300" : "bg-white"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${i === selected ? "bg-blue-600" : "bg-slate-300"}`} />
            <span className="text-xs text-slate-700 flex-1">{type}</span>
            {i === selected && (
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const PerformanceTrackingDemo = ({ isActive }: { isActive: boolean }) => {
  const [attempts, setAttempts] = useState([
    { attempt: 1, score: 0 },
    { attempt: 2, score: 0 },
    { attempt: 3, score: 0 },
  ])

  useEffect(() => {
    if (!isActive) return

    attempts.forEach((_, index) => {
      setTimeout(() => {
        const targetScores = [65, 75, 85]
        const interval = setInterval(() => {
          setAttempts((prev) =>
            prev.map((attempt, i) => {
              if (i === index && attempt.score < targetScores[index]) {
                return {
                  ...attempt,
                  score: Math.min(attempt.score + 3, targetScores[index]),
                }
              }
              return attempt
            }),
          )
        }, 50)

        setTimeout(() => clearInterval(interval), 600)
      }, index * 500)
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      <div className="space-y-1.5">
        {attempts.map((att, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-12">Attempt {att.attempt}</span>
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${att.score}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{att.score}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const AnswerAnalysisDemo = ({ isActive }: { isActive: boolean }) => {
  const [metrics, setMetrics] = useState([
    { name: "Clarity", value: 0 },
    { name: "Depth", value: 0 },
    { name: "Relevance", value: 0 },
  ])

  useEffect(() => {
    if (!isActive) return

    metrics.forEach((_, index) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setMetrics((prev) =>
            prev.map((metric, i) => {
              if (i === index && metric.value < 90) {
                return { ...metric, value: Math.min(metric.value + 3, 90) }
              }
              return metric
            }),
          )
        }, 50)

        setTimeout(() => clearInterval(interval), 800)
      }, index * 400)
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      <div className="space-y-1.5">
        {metrics.map((metric, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-12">{metric.name}</span>
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <span className="text-xs font-medium w-8">{metric.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const StudyPlanDemo = ({ isActive }: { isActive: boolean }) => {
  const [progress, setProgress] = useState([
    { topic: "Arrays & Strings", done: false },
    { topic: "Trees & Graphs", done: false },
    { topic: "Dynamic Programming", done: false },
  ])

  useEffect(() => {
    if (!isActive) return

    progress.forEach((_, index) => {
      setTimeout(
        () => {
          setProgress((prev) => prev.map((item, i) => (i === index ? { ...item, done: true } : item)))
        },
        500 + index * 600,
      )
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32">
      <div className="space-y-2">
        {progress.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded transition-all duration-300 ${
              item.done ? "bg-green-100" : "bg-white"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${item.done ? "bg-green-500" : "bg-slate-300"}`} />
            <span className="text-xs text-slate-700 flex-1">{item.topic}</span>
            {item.done && (
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    title: "AI Interview Practice",
    description:
      "Practice with our AI interviewer that simulates real interview experiences. Get instant feedback on your answers and delivery.",
    demo: InterviewPracticeDemo,
    size: "large",
  },
  {
    title: "Real-time Feedback Scoring",
    description: "Receive immediate scores and actionable feedback on clarity, depth, and relevance of your responses.",
    demo: FeedbackScoringDemo,
    size: "medium",
  },
  {
    title: "Multiple Interview Types",
    description:
      "Practice technical, behavioral, system design, and product management interview questions tailored to your role.",
    demo: InterviewTypesDemo,
    size: "medium",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your improvement across multiple interview attempts and see how your scores increase over time.",
    demo: PerformanceTrackingDemo,
    size: "large",
  },
  {
    title: "Detailed Answer Analysis",
    description:
      "Get comprehensive metrics on clarity, depth, and relevance to understand your strengths and areas for improvement.",
    demo: AnswerAnalysisDemo,
    size: "medium",
  },
  {
    title: "Personalized Study Plan",
    description:
      "Receive customized learning paths and topic recommendations based on your interview performance and goals.",
    demo: StudyPlanDemo,
    size: "medium",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeDemo, setActiveDemo] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="features" ref={sectionRef} className="relative z-10">
      <div className="bg-white rounded-t-[3rem] pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-slate-200 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div
            className={`text-center mb-12 sm:mb-20 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23ZM19 9V15H5V9H19ZM7.5 11.5C7.5 10.67 8.17 10 9 10S10.5 10.67 10.5 11.5 9.83 13 9 13 7.5 12.33 7.5 11.5ZM13.5 11.5C13.5 10.67 14.17 10 15 10S16.5 10.67 16.5 11.5 15.83 13 15 13 13.5 12.33 13.5 11.5ZM12 16C13.11 16 14.08 16.59 14.71 17.5H9.29C9.92 16.59 10.89 16 12 16Z" />
              </svg>
              Prepare Like Never Before
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-balance mb-4 sm:mb-6">
              Powerful Interview Preparation{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Tools & Insights
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Master your interviews with AI-powered practice sessions, real-time feedback, and personalized learning
              paths designed to help you succeed.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 ${feature.size === "large" ? "md:col-span-2" : ""}`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
                onMouseEnter={() => setActiveDemo(index)}
                onMouseLeave={() => setActiveDemo(null)}
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 hover:border-blue-300">
                  <div className="mb-6">
                    <feature.demo isActive={activeDemo === index || isVisible} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
