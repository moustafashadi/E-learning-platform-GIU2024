"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

/** The shape of a single option */
interface Option {
  _id?: string;
  text: string;
  identifier: string; // e.g. "A", "B", "C", "D"
}

/** The shape of a single question returned by your student endpoint */
interface StudentQuestion {
  _id: string;     // question ID
  content: string; // question text
  options: Option[];
}

/** If you eventually want to display some results like correctCount, totalQuestions, etc. */
interface SubmitResults {
  correctCount: number;
  totalQuestions: number;
}

interface StudentExamProps {
  quizId: string;  // The quiz ID from the parent or route param
}

function StudentExam({ quizId }: StudentExamProps) {
  const router = useRouter();

  // --------------- STATES ---------------
  const [userId, setUserId] = useState<string | null>(null); // from /auth/me
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // After submission
  const [submitted, setSubmitted] = useState(false);
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  // =============== 1) Fetch the user ID (like your StudentQuiz example) ===============
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userResponse = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);
      } catch (error) {
        toast.error("Failed to get user ID. Are you logged in?");
        console.error(error);
      }
    };

    fetchUserId();
  }, []);

  // =============== 2) Fetch the questions for the student ===============
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // GET /quiz/:quizId/questions/student
        const response = await axiosInstance.get(
          `/quiz/${quizId}/questions/student`,
          { withCredentials: true }
        );

        if (!Array.isArray(response.data)) {
          toast.error("Invalid question response from server.");
          setQuestions([]);
        } else {
          setQuestions(response.data);
        }
      } catch (error) {
        toast.error("Failed to load questions.");
        console.error(error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId && quizId) {
      fetchQuestions();
    }
  }, [quizId, userId]);

  // Handler for selecting an answer
  const handleOptionChange = (questionId: string, chosenIdentifier: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: chosenIdentifier,
    }));
  };

  // Must answer all Q’s
  const allAnswered =
    questions.length > 0 && Object.keys(answers).length === questions.length;

  // =============== 3) Submit each answer question-by-question ===============
  const handleSubmitAll = async () => {
    if (!allAnswered) {
      toast.error("Please answer all questions first!");
      return;
    }

    try {
      let correctCount = 0;
      const totalQuestions = questions.length;

      // Loop over each answered question
      for (const question of questions) {
        const questionId = question._id;
        const chosenAnswer = answers[questionId];

        // e.g. POST /quiz/:quizId/:questionId/submit
        const resp = await axiosInstance.post(
          `/quiz/${quizId}/${questionId}/submit`,
          { chosenAnswer },
          { withCredentials: true }
        );

        // If the server returns partial info about correctness, increment
        if (resp.data?.isCorrect) {
          correctCount++;
        }
      }

      // Optionally fetch final grade or just keep track of correctCount
      setSubmitResults({
        correctCount,
        totalQuestions,
      });

      toast.success("Quiz submitted!");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Error submitting quiz.");
    }
  };

  if (loading) {
    return <p className="text-black mt-20 ml-2">Loading questions...</p>;
  }

  if (questions.length === 0) {
    return <p className="text-black mt-20 ml-2">No questions found for this quiz.</p>;
  }

  // =============== RENDER UI ===============
  return (
    <div className="text-black mt-20 ml-2">
      <h2 className="text-2xl font-bold mb-4">Quiz Examination</h2>

      {submitted && submitResults && (
        <p className="text-green-600 mb-4">
          You got {submitResults.correctCount}/{submitResults.totalQuestions} correct!
        </p>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const chosen = answers[q._id];
          return (
            // Use a "card" style
            <div
              key={q._id}
              className="shadow-md bg-white rounded-lg p-4 border border-gray-200"
            >
              <p className="text-lg font-semibold mb-2">{q.content}</p>

              <div className="space-y-2 ml-4">
                {q.options.map((opt) => {
                  const isSelected = chosen === opt.identifier;
                  return (
                    <label
                      key={opt.identifier}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q._id}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() => handleOptionChange(q._id, opt.identifier)}
                      />
                      <span className="ml-2">
                        ({opt.identifier}) {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmitAll}
          disabled={!allAnswered}
          className={`mt-6 bg-blue-600 text-white px-4 py-2 rounded-md ${
            !allAnswered ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}

export default StudentExam;
