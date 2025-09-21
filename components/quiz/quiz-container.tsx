"use client"

import { useState } from "react"
import { QuizStart } from "./quiz-start"
import { QuizQuestion } from "./quiz-question"
import { QuizResults } from "./quiz-results"
import { CareerAnalysis } from "./career-analysis"

const sampleQuiz = [
  {
    id: 1,
    type: "mcq" as const,
    question: "Which college is ranked #1 in Maharashtra?",
    options: ["IIT Bombay", "COEP Pune", "TISS Mumbai", "MIT Pune"],
    answer: "IIT Bombay"
  },
  {
    id: 2,
    type: "mcq" as const,
    question: "Which course is NOT offered at AIIMS Delhi?",
    options: ["Medicine", "BDS", "Engineering", "Nursing"],
    answer: "Engineering"
  },
  {
    id: 3,
    type: "truefalse" as const,
    question: "University of Kashmir was established before 1950.",
    answer: true
  },
  {
    id: 4,
    type: "multiselect" as const,
    question: "Select all engineering streams offered at NIT Srinagar.",
    options: ["Computer Science", "Medicine", "Civil", "Mechanical"],
    answer: ["Computer Science", "Civil", "Mechanical"]
  },
  {
    id: 5,
    type: "mcq" as const,
    question: "Which city is home to IIT Delhi?",
    options: ["New Delhi", "Mumbai", "Srinagar", "Pune"],
    answer: "New Delhi"
  },
]

type QuizState = "start" | "question" | "results" | "career-analysis"

export function QuizContainer() {
  const [currentState, setCurrentState] = useState<QuizState>("start")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Array<{
    question: string
    userAnswer: string | string[] | boolean
    correctAnswer: string | string[] | boolean
    isCorrect: boolean
  }>>([])
  const [score, setScore] = useState(0)

  const handleStart = () => {
    setCurrentState("question")
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
  }

  const handleAnswer = (answer: string | string[] | boolean) => {
    const question = sampleQuiz[currentQuestion]
    const isCorrect = checkAnswer(question, answer)
    
    const newAnswer = {
      question: question.question,
      userAnswer: answer,
      correctAnswer: question.answer,
      isCorrect
    }

    setAnswers(prev => [...prev, newAnswer])
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuiz.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setCurrentState("results")
    }
  }

  const handleRestart = () => {
    setCurrentState("start")
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
  }

  const handleViewCareerAnalysis = () => {
    setCurrentState("career-analysis")
  }

  const checkAnswer = (question: any, answer: string | string[] | boolean): boolean => {
    if (question.type === "multiselect") {
      const correctAnswers = question.answer as string[]
      const selectedAnswers = answer as string[]
      return correctAnswers.length === selectedAnswers.length && 
             correctAnswers.every(ans => selectedAnswers.includes(ans))
    } else if (question.type === "truefalse") {
      return answer === question.answer
    } else {
      return answer === question.answer
    }
  }

  const getCareerSuggestions = () => {
    // Simple career suggestion based on quiz performance and answers
    const engineeringAnswers = answers.filter(a => 
      a.question.includes("engineering") || 
      a.question.includes("IIT") || 
      a.question.includes("NIT")
    ).length

    const medicalAnswers = answers.filter(a => 
      a.question.includes("AIIMS") || 
      a.question.includes("Medicine") || 
      a.question.includes("medical")
    ).length

    if (engineeringAnswers >= 2) {
      return ["Software Engineering", "Data Science", "Product Management"]
    } else if (medicalAnswers >= 2) {
      return ["Medicine", "Biotechnology", "Healthcare Management"]
    } else {
      return ["Business Management", "Finance", "Marketing"]
    }
  }

  if (currentState === "start") {
    return <QuizStart onStart={handleStart} />
  }

  if (currentState === "question") {
    return (
      <QuizQuestion
        question={sampleQuiz[currentQuestion]}
        currentQuestion={currentQuestion + 1}
        totalQuestions={sampleQuiz.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        timeLimit={30}
      />
    )
  }

  if (currentState === "results") {
    return (
      <QuizResults
        score={score}
        totalQuestions={sampleQuiz.length}
        answers={answers}
        onRestart={handleRestart}
        onViewCareerAnalysis={handleViewCareerAnalysis}
      />
    )
  }

  if (currentState === "career-analysis") {
    return (
      <CareerAnalysis
        suggestedCareers={getCareerSuggestions()}
        quizScore={score}
        totalQuestions={sampleQuiz.length}
        onBackToResults={() => setCurrentState("results")}
        onRetakeQuiz={handleRestart}
      />
    )
  }

  return null
}
