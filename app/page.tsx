"use client"

import { useState } from "react"
import ProcessSchedulingQA from "../process-scheduling-qa"
import QuizPage from "../quiz-page"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"qa" | "quiz">("qa")

  return (
    <div>
      <div className="flex justify-center gap-4 p-4 border-b">
        <Button variant={currentPage === "qa" ? "default" : "outline"} onClick={() => setCurrentPage("qa")}>
          Q&A Study Guide
        </Button>
        <Button variant={currentPage === "quiz" ? "default" : "outline"} onClick={() => setCurrentPage("quiz")}>
          Take Quiz
        </Button>
      </div>

      {currentPage === "qa" ? <ProcessSchedulingQA /> : <QuizPage />}
    </div>
  )
}
