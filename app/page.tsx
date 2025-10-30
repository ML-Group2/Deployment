"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import PredictionInterface from "@/components/prediction-interface"
import ModelComparison from "@/components/model-comparison"
import BatchUpload from "@/components/batch-upload"
import About from "@/components/about"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "home" && <Hero setCurrentPage={setCurrentPage} />}
      {currentPage === "predict" && <PredictionInterface />}
      {currentPage === "comparison" && <ModelComparison />}
      {currentPage === "batch" && <BatchUpload />}
      {currentPage === "about" && <About />}
    </div>
  )
}
