"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import clsx from "clsx"

interface QuizQuestionProps {
  question: {
    id: number
    type: "mcq" | "multiselect" | "truefalse"
    question: string
    options?: string[]
    answer: string | string[] | boolean
  }
  currentQuestion: number
  totalQuestions: number
  onAnswer: (answer: string | string[] | boolean) => void
  onNext: () => void
  timeLimit?: number
}

export function QuizQuestion({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onNext,
  timeLimit = 30,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | boolean>(
    question.type === "multiselect" ? [] : null
  )
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isAnswered, setIsAnswered] = useState(false)

  const progress = (currentQuestion / totalQuestions) * 100

  // Timer
  useEffect(() => {
    if (isAnswered) return

    if (timeLeft <= 0) {
      handleAnswer(question.type === "multiselect" ? [] : "")
      return
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isAnswered, question.id])

  // Reset state on question change
  useEffect(() => {
    setSelectedAnswer(question.type === "multiselect" ? [] : null)
    setShowFeedback(false)
    setIsCorrect(false)
    setTimeLeft(timeLimit)
    setIsAnswered(false)
  }, [question.id, timeLimit])

  const handleAnswer = (answer: string | string[] | boolean) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    // Check correctness
    let correct = false
    if (question.type === "multiselect") {
      const correctAnswers = question.answer as string[]
      const selected = answer as string[]
      correct =
        correctAnswers.length === selected.length &&
        correctAnswers.every(ans => selected.includes(ans))
    } else {
      correct = answer === question.answer
    }

    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(answer)
  }

  const handleNext = () => onNext()

  const getOptionClass = (option: string) => {
    if (!showFeedback) {
      return "glass-card p-4 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
    }

    const isSelected =
    question.type === "multiselect"
      ? Array.isArray(selectedAnswer) && selectedAnswer.includes(option)
      : selectedAnswer === option
  

    const isAnswer = question.type === "multiselect"
      ? (question.answer as string[]).includes(option)
      : question.answer === option

    if (isSelected) {
      return clsx(
        "glass-card p-4 rounded-lg",
        isCorrect
          ? "bg-green-500/20 border-green-500 text-green-700"
          : "bg-red-500/20 border-red-500 text-red-700"
      )
    }

    if (isAnswer && showFeedback) {
      return "glass-card p-4 rounded-lg bg-green-500/20 border-green-500 text-green-700"
    }

    return "glass-card p-4 rounded-lg opacity-50"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="glass-card max-w-4xl w-full p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-foreground mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        {question.type === "truefalse" ? (
          <div className="grid grid-cols-2 gap-4">
            {[true, false].map((val) => (
              <Button
                key={val.toString()}
                onClick={() => handleAnswer(val)}
                disabled={isAnswered}
                className={clsx(
                  "h-16 text-lg font-semibold",
                  showFeedback && selectedAnswer === val
                    ? isCorrect
                      ? "bg-green-500 hover:bg-green-500"
                      : "bg-red-500 hover:bg-red-500"
                    : "glass-card hover:scale-105 transition-all"
                )}
              >
                {val ? "True" : "False"}
              </Button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options?.map((option) => (
              <div
                key={option}
                onClick={() => {
                  if (question.type === "multiselect") {
                    const current = selectedAnswer as string[]
                    const updated = current.includes(option)
                      ? current.filter(o => o !== option)
                      : [...current, option]
                    setSelectedAnswer(updated)
                  } else {
                    handleAnswer(option)
                  }
                }}
                className={getOptionClass(option)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showFeedback && (
                    <>
                      {question.type === "multiselect" &&
                        Array.isArray(selectedAnswer) &&
                        selectedAnswer.includes(option) &&
                       (isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                       <XCircle className="h-5 w-5 text-red-500" />
                       ))}

                      {question.type === "mcq" && selectedAnswer === option && (
                        isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Multiselect Submit */}
        {question.type === "multiselect" && !isAnswered && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => handleAnswer(selectedAnswer as string[])}
              disabled={(selectedAnswer as string[]).length === 0}
              className="gradient-cta text-white px-8 py-3"
            >
              Submit Answer
            </Button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={clsx("font-semibold", isCorrect ? "text-green-700" : "text-red-700")}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            {!isCorrect && (
              <p className="text-muted-foreground">
                Correct answer{question.type === "multiselect" ? "s were" : " was"}:{" "}
                {question.type === "multiselect"
                  ? (question.answer as string[]).join(", ")
                  : question.answer.toString()}
              </p>
            )}
          </div>
        )}

        {/* Next */}
        {showFeedback && (
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="gradient-cta text-white px-8 py-3 hover:opacity-90 transition-opacity"
            >
              {currentQuestion === totalQuestions ? "View Results" : "Next Question"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
