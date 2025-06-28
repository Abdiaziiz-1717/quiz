"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, CheckCircle, XCircle, RotateCcw, Trophy, Loader2 } from "lucide-react"
import { Groq } from "groq-sdk"

interface QAItem {
  id: number
  question: string
  answer: string
  category: string
  chapter: string
  difficulty: "Basic" | "Intermediate" | "Advanced"
}

interface QuizQuestion {
  id: number
  question: string
  correctAnswer: string
  userAnswer: string
  isCorrect: boolean | null
  category: string
  chapter: string
  difficulty: string
  isEvaluating?: boolean
}

interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  score: number
  timeSpent: string
  chapterBreakdown: { [key: string]: { correct: number; total: number } }
  difficultyBreakdown: { [key: string]: { correct: number; total: number } }
}

// Import qaData from the main component to avoid duplication
import { qaData } from "./process-scheduling-qa"

const QuizPage: React.FC = () => {
  const [quizState, setQuizState] = useState<"setup" | "taking" | "results">("setup")
  const [selectedChapter, setSelectedChapter] = useState<string>("All")
  const [questionCount, setQuestionCount] = useState<number>(20)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const chapters = [
    "All",
    "Chapter 5: Process Scheduling",
    "Chapter 6: Process Synchronization",
    "Chapter 7: Deadlocks",
    "Chapter 8: Main Memory",
  ]

  const getMaxQuestions = () => {
    if (selectedChapter === "All") return 70
    const chapterQuestions = qaData.filter((q) => q.chapter === selectedChapter)
    return Math.min(chapterQuestions.length, 50)
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startQuiz = () => {
    const availableQuestions = selectedChapter === "All" ? qaData : qaData.filter((q) => q.chapter === selectedChapter)

    const shuffledQuestions = shuffleArray(availableQuestions)
    const selectedQuestions = shuffledQuestions.slice(0, questionCount)

    const quizQs: QuizQuestion[] = selectedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      correctAnswer: q.answer,
      userAnswer: "",
      isCorrect: null,
      category: q.category,
      chapter: q.chapter,
      difficulty: q.difficulty,
      isEvaluating: false,
    }))

    setQuizQuestions(quizQs)
    setCurrentQuestionIndex(0)
    setUserAnswer("")
    setStartTime(new Date())
    setQuizState("taking")
  }

  const evaluateAnswerWithGroq = async (
    question: string,
    correctAnswer: string, // Only used as fallback for keyword matching
    userAnswer: string,
  ): Promise<boolean> => {
    try {
      console.log("Starting AI evaluation (using AI's knowledge, not provided answer)...")

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
      if (!apiKey) {
        console.log("No Groq API key found, falling back to keyword matching...")
        return calculateSimilarity(userAnswer, correctAnswer) > 0.3
      }

      const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      })

      // AI evaluates based on its own knowledge, not the provided correct answer
      const prompt = `You are an expert Operating Systems professor evaluating student answers. 

Question: ${question}

Student Answer: ${userAnswer}

Evaluate if the student's answer demonstrates understanding of the key concepts related to this operating systems question. The student doesn't need to match exactly, but should show they understand the main ideas, concepts, and principles.

Consider the answer correct if it:
- Shows understanding of core concepts
- Uses relevant terminology correctly
- Demonstrates knowledge of the topic
- May be expressed differently but covers key points

Respond with ONLY "CORRECT" if the answer shows good understanding, or "INCORRECT" if it doesn't. No other text.`

      console.log("Sending request to AI (evaluating based on AI's knowledge)...")

      let chatCompletion
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          temperature: 0.1,
          max_completion_tokens: 50,
          top_p: 0.95,
          stream: false,
          stop: null,
        })
      } catch (apiError) {
        console.error("API call failed:", apiError)
        console.log("Falling back to keyword matching against correct answer...")
        return calculateSimilarity(userAnswer, correctAnswer) > 0.3
      }

      console.log("Groq API Full Response:", chatCompletion)
      console.log("Choices:", chatCompletion.choices)

      // More robust response handling with multiple safety checks
      let response = null
      try {
        response = chatCompletion?.choices?.[0]?.message?.content
      } catch (e) {
        console.log("Error accessing response content:", e)
      }

      console.log("Raw response content:", response)

      // Check if response exists and is a string
      if (!response || typeof response !== "string") {
        console.log("No valid response content, falling back to keyword matching against correct answer...")
        return calculateSimilarity(userAnswer, correctAnswer) > 0.3
      }

      // Safely normalize the response
      let normalizedResponse = ""
      try {
        normalizedResponse = response.trim().toLowerCase()
      } catch (e) {
        console.log("Error normalizing response:", e)
        console.log("Falling back to keyword matching against correct answer...")
        return calculateSimilarity(userAnswer, correctAnswer) > 0.3
      }

      console.log("Normalized response:", normalizedResponse)

      // Check for various forms of correct/incorrect with safer string operations
      const isCorrect =
        normalizedResponse.includes("correct") ||
        normalizedResponse.includes("true") ||
        normalizedResponse.includes("yes") ||
        normalizedResponse.includes("good") ||
        normalizedResponse.includes("accurate")

      const isIncorrect =
        normalizedResponse.includes("incorrect") ||
        normalizedResponse.includes("false") ||
        normalizedResponse.includes("no") ||
        normalizedResponse.includes("wrong") ||
        normalizedResponse.includes("poor")

      // Fix: Check for exact word matches to avoid substring conflicts
      const words = normalizedResponse.split(/\s+/)
      const hasExactCorrect = words.includes("correct")
      const hasExactIncorrect = words.includes("incorrect")

      // Prioritize exact matches, then fall back to substring matching
      if (hasExactIncorrect) {
        console.log("AI evaluated as INCORRECT (exact match)")
        return false
      } else if (hasExactCorrect) {
        console.log("AI evaluated as CORRECT (exact match)")
        return true
      } else if (isIncorrect && !isCorrect) {
        console.log("AI evaluated as INCORRECT")
        return false
      } else if (isCorrect && !isIncorrect) {
        console.log("AI evaluated as CORRECT")
        return true
      } else {
        console.log("Unclear AI response, falling back to keyword matching against correct answer...")
        return calculateSimilarity(userAnswer, correctAnswer) > 0.3
      }
    } catch (error) {
      console.error("Error evaluating answer with Groq:", error)
      console.log("Falling back to keyword matching against correct answer due to error...")
      // Fallback to simple keyword matching if API fails
      return calculateSimilarity(userAnswer, correctAnswer) > 0.3
    }
  }

  const calculateSimilarity = (answer1: string, answer2: string): number => {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim()

    const normalized1 = normalize(answer1)
    const normalized2 = normalize(answer2)

    // Simple keyword matching approach
    const words1 = normalized1.split(" ")
    const words2 = normalized2.split(" ")

    const commonWords = words1.filter((word) => word.length > 3 && words2.includes(word))

    const similarity = commonWords.length / Math.max(words1.length, words2.length)
    console.log(`Keyword similarity: ${similarity}`)
    return similarity
  }

  const submitAnswer = async () => {
    const currentQuestion = quizQuestions[currentQuestionIndex]

    // Set evaluating state
    const updatedQuestions = [...quizQuestions]
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer,
      isEvaluating: true,
    }
    setQuizQuestions(updatedQuestions)

    try {
      // Evaluate answer using Groq API
      const isCorrect = await evaluateAnswerWithGroq(
        currentQuestion.question,
        currentQuestion.correctAnswer,
        userAnswer,
      )

      // Update with final result
      const finalUpdatedQuestions = [...quizQuestions]
      finalUpdatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer,
        isCorrect,
        isEvaluating: false,
      }

      setQuizQuestions(finalUpdatedQuestions)

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setUserAnswer("")
      } else {
        finishQuiz(finalUpdatedQuestions)
      }
    } catch (error) {
      console.error("Error in submitAnswer:", error)
      // Fallback evaluation
      const isCorrect = calculateSimilarity(userAnswer, currentQuestion.correctAnswer) > 0.3

      const finalUpdatedQuestions = [...quizQuestions]
      finalUpdatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer,
        isCorrect,
        isEvaluating: false,
      }

      setQuizQuestions(finalUpdatedQuestions)

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setUserAnswer("")
      } else {
        finishQuiz(finalUpdatedQuestions)
      }
    }
  }

  const finishQuiz = (finalQuestions: QuizQuestion[]) => {
    const endTime = new Date()
    const timeSpent = startTime
      ? `${Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)} minutes`
      : "Unknown"

    const correctAnswers = finalQuestions.filter((q) => q.isCorrect).length
    const score = Math.round((correctAnswers / finalQuestions.length) * 100)

    // Chapter breakdown
    const chapterBreakdown: { [key: string]: { correct: number; total: number } } = {}
    finalQuestions.forEach((q) => {
      if (!chapterBreakdown[q.chapter]) {
        chapterBreakdown[q.chapter] = { correct: 0, total: 0 }
      }
      chapterBreakdown[q.chapter].total++
      if (q.isCorrect) chapterBreakdown[q.chapter].correct++
    })

    // Difficulty breakdown
    const difficultyBreakdown: { [key: string]: { correct: number; total: number } } = {}
    finalQuestions.forEach((q) => {
      if (!difficultyBreakdown[q.difficulty]) {
        difficultyBreakdown[q.difficulty] = { correct: 0, total: 0 }
      }
      difficultyBreakdown[q.difficulty].total++
      if (q.isCorrect) difficultyBreakdown[q.difficulty].correct++
    })

    setQuizResult({
      totalQuestions: finalQuestions.length,
      correctAnswers,
      score,
      timeSpent,
      chapterBreakdown,
      difficultyBreakdown,
    })

    setQuizState("results")
  }

  const resetQuiz = () => {
    setQuizState("setup")
    setQuizQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswer("")
    setStartTime(null)
    setQuizResult(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="w-8 h-8 text-yellow-500" />
    if (score >= 60) return <CheckCircle className="w-8 h-8 text-green-500" />
    return <XCircle className="w-8 h-8 text-red-500" />
  }

  if (quizState === "setup") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Operating Systems Quiz</h1>
          <p className="text-lg text-gray-600">Test your knowledge with AI-powered answer evaluation using Groq</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Quiz Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Chapter:</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Number of Questions (Max: {getMaxQuestions()}):
              </label>
              <input
                type="number"
                min="5"
                max={getMaxQuestions()}
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.min(Number.parseInt(e.target.value) || 5, getMaxQuestions()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Quiz Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Questions are selected randomly from the chosen chapter(s)</li>
                <li>• Type your answers in the text area provided</li>
                <li>• Answers are evaluated by AI for conceptual understanding</li>
                <li>• You don't need exact wording - focus on key concepts</li>
                <li>• Each answer is evaluated individually for accuracy</li>
                <li>• Take your time - there's no time limit per question</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🤖 AI-Powered Evaluation:</h4>
              <p className="text-sm text-green-700">
                Your answers will be evaluated by Groq's advanced AI model using its own knowledge of operating systems concepts. 
                The AI assesses understanding rather than exact word matching, providing more accurate and fair assessment of your knowledge.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Setup Required:</h4>
              <p className="text-sm text-yellow-700">
                This quiz requires a Groq API key for AI evaluation. Set the <code>NEXT_PUBLIC_GROQ_API_KEY</code> environment variable in your <code>.env.local</code> file. If no API key is found, the quiz will fall back to keyword matching.
              </p>
            </div>

            <Button onClick={startQuiz} className="w-full" size="lg">
              Start AI-Evaluated Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizState === "taking") {
    const currentQuestion = quizQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Quiz in Progress</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>
        </div>

        <Progress value={progress} className="w-full" />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Q{currentQuestion.id}: {currentQuestion.question}
              </CardTitle>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {currentQuestion.chapter.split(": ")[1]}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">{currentQuestion.difficulty}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here... Focus on key concepts and explanations."
              className="min-h-32"
              disabled={currentQuestion.isEvaluating}
            />

            {currentQuestion.isEvaluating && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI is evaluating your answer...</span>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                    setUserAnswer(quizQuestions[currentQuestionIndex - 1].userAnswer)
                  }
                }}
                disabled={currentQuestionIndex === 0 || currentQuestion.isEvaluating}
              >
                Previous
              </Button>

              <Button onClick={submitAnswer} disabled={userAnswer.trim().length < 10 || currentQuestion.isEvaluating}>
                {currentQuestion.isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Evaluating...
                  </>
                ) : currentQuestionIndex === quizQuestions.length - 1 ? (
                  "Finish Quiz"
                ) : (
                  "Next Question"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizState === "results" && quizResult) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">{getScoreIcon(quizResult.score)}</div>
          <h1 className="text-4xl font-bold text-gray-900">Quiz Complete!</h1>
          <div className={`text-6xl font-bold ${getScoreColor(quizResult.score)}`}>{quizResult.score}%</div>
          <p className="text-lg text-gray-600">
            You answered {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correctly
          </p>
          <p className="text-sm text-gray-500">Time spent: {quizResult.timeSpent}</p>
          <div className="bg-green-50 p-3 rounded-lg inline-block">
            <p className="text-sm text-green-700">✨ Evaluated by AI using its knowledge of operating systems concepts</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(quizResult.chapterBreakdown).map(([chapter, stats]) => (
                  <div key={chapter} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{chapter.split(": ")[1]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {stats.correct}/{stats.total}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(quizResult.difficultyBreakdown).map(([difficulty, stats]) => (
                  <div key={difficulty} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{difficulty}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {stats.correct}/{stats.total}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            difficulty === "Basic"
                              ? "bg-green-600"
                              : difficulty === "Intermediate"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          }`}
                          style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {quizQuestions.map((q, index) => (
                <div
                  key={q.id}
                  className="border-l-4 pl-4 py-2"
                  style={{ borderColor: q.isCorrect ? "#10b981" : "#ef4444" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Q{index + 1}: {q.question}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Your answer: {q.userAnswer}</p>
                      {!q.isCorrect && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer">Show correct answer</summary>
                          <p className="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded">{q.correctAnswer}</p>
                        </details>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {q.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button onClick={resetQuiz} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default QuizPage
