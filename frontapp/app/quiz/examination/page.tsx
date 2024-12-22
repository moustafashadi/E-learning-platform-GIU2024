"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuizPage from "../components/QuizPage";

function ExaminationPage() {
  const searchParams = useSearchParams();
  const qId = searchParams.get("qId"); // Extract `qId` from the query string
  const [quizId, setQuizId] = useState<string | null>(qId);

  useEffect(() => {
    if (!quizId && qId) {
      setQuizId(qId); // Update state if query changes
    }
  }, [qId]);

  if (!quizId) {
    return <p>Invalid or missing quiz ID.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <QuizPage qId={quizId} /> {/* Pass qId explicitly */}
    </div>
  );
}

export default ExaminationPage;
