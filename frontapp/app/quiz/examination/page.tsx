"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StudentExam from "../components/QuizPage";// We'll create this component below

export default function ExaminationPage() {
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("quizId");

  if (!quizIdParam) {
    return <p>No quizId provided in the URL!</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <StudentExam quizId={quizIdParam} />
    </div>
  );
}
