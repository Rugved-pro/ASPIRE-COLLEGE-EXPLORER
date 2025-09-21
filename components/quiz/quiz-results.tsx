"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, Share2, Target, TrendingUp, Users, DollarSign } from "lucide-react"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  answers: Array<{
    question: string
    userAnswer: string | string[] | boolean
    correctAnswer: string | string[] | boolean
    isCorrect: boolean
  }>
  onRestart: () => void
  onViewCareerAnalysis: () => void
}

export function QuizResults({ 
  score, 
  totalQuestions, 
  answers, 
  onRestart, 
  onViewCareerAnalysis 
}: QuizResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const percentage = Math.round((score / totalQuestions) * 100)

  useEffect(() => {
    if (percentage >= 80) {
      setShowConfetti(true)
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [percentage])

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a college expert!"
    if (percentage >= 80) return "Excellent! Great knowledge of colleges!"
    if (percentage >= 70) return "Good job! You know your colleges well!"
    if (percentage >= 60) return "Not bad! Keep learning about colleges!"
    return "Keep exploring! There's always more to learn!"
  }

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="glass-card max-w-4xl w-full p-8">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }} />
            <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.8s" }} />
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Quiz Complete!</h1>
          <p className="text-muted-foreground text-lg mb-6">{getScoreMessage()}</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
            {percentage}%
          </div>
          <p className="text-muted-foreground text-lg">
            You got {score} out of {totalQuestions} questions correct
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4 rounded-lg text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{percentage}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="glass-card p-4 rounded-lg text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{score}</div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
          </div>
          <div className="glass-card p-4 rounded-lg text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {percentage >= 80 ? "Expert" : percentage >= 60 ? "Intermediate" : "Beginner"}
            </div>
            <div className="text-sm text-muted-foreground">Level</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Question Review</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="glass-card p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground flex-1">
                    Question {index + 1}
                  </h4>
                  <Badge 
                    variant={answer.isCorrect ? "default" : "destructive"}
                    className={answer.isCorrect ? "bg-green-500" : "bg-red-500"}
                  >
                    {answer.isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">{answer.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Your Answer: </span>
                    <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                      {Array.isArray(answer.userAnswer) 
                        ? answer.userAnswer.join(", ") 
                        : String(answer.userAnswer)
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Correct Answer: </span>
                    <span className="text-green-600">
                      {Array.isArray(answer.correctAnswer) 
                        ? answer.correctAnswer.join(", ") 
                        : String(answer.correctAnswer)
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onViewCareerAnalysis}
            className="gradient-cta text-white px-8 py-3 hover:opacity-90 transition-opacity"
          >
            <Target className="h-4 w-4 mr-2" />
            View Career Analysis
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            className="border-primary/20 hover:border-primary bg-transparent px-8 py-3"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "College Knowledge Quiz Results",
                  text: `I scored ${percentage}% on the College Knowledge Quiz! Can you beat my score?`,
                })
              } else {
                // Fallback to copying to clipboard
                navigator.clipboard.writeText(`I scored ${percentage}% on the College Knowledge Quiz! Can you beat my score?`)
              }
            }}
            variant="outline"
            className="border-primary/20 hover:border-primary bg-transparent px-8 py-3"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Score
          </Button>
        </div>
      </Card>
    </div>
  )
}
