"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
}

interface QuizPageProps {
  qId: string;
}

function QuizPage({ qId }: QuizPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await axiosInstance.get(`/quiz/${qId}/questions`);
        setQuestions(response.data.questions);
      } catch (error) {
        toast.error("Failed to fetch quiz questions.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [qId]);

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const submitAnswers = async () => {
    try {
      const response = await axiosInstance.post(`/quiz/${qId}/submit`, {
        answers,
      });
      toast.success("Quiz submitted successfully!");
      console.log("Results:", response.data.results);
    } catch (error) {
      toast.error("Failed to submit answers.");
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading Quiz...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id} className="mb-4">
            <p className="mb-2">{question.text}</p>
            <div className="space-y-2">
              {question.options.map((option) => (
                <label key={option.id} className="block">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    onChange={() =>
                      handleAnswerChange(question.id, option.id)
                    }
                  />
                  {option.text}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={submitAnswers}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Submit Answers
      </button>
    </div>
  );
}

export default QuizPage;
