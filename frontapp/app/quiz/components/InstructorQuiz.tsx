"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast";

interface Course {
  id: string;
  name: string;
  currentQuizzes: number;
  maxQuizzes: number;
  doneQuizzes: number;
}

function InstructorQuiz() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<
    { question: string; options: { text: string; isCorrect: boolean }[] }[]
  >([]);

  // Fetch courses taught by the instructor
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        // Fetch user ID
        const userResponse = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });
        const userId = userResponse.data.id;
        setUserId(userId);

        // Fetch courses taught by the instructor
        const response = await axiosInstance.get(
          `/courses/teacher/${userId}`,
          { withCredentials: true }
        );
        const formattedCourses = response.data.map((course: any) => ({
          id: course.id || course._id || "unknown-id",
          name: course.name || course.title || "Unnamed Course",
          maxQuizzes: course.numOfQuizzes || 0, // Add maxQuizzes field if available
          doneQuizzes: course.quizzes.length,
        }));

        setCourses(formattedCourses);
      } catch (error) {
        toast.error("Failed to fetch instructor's courses.");
        console.error("Error Fetching Instructor's Courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!selectedCourseId || !quizTitle || questions.length === 0) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Step 1: Create the quiz
      const createdQuizResponse = await axiosInstance.post(
        `/quiz/${selectedCourseId}`,
        { title: quizTitle },
        { withCredentials: true }
      );

      const createdQuizId = createdQuizResponse.data._id; // Assuming the created quiz ID is returned
      toast.success("Quiz created successfully!");

      // Step 2: Add questions to the quiz
      for (const question of questions) {
        const { question: content, options } = question;
      
        const correctOptionIndex = options.findIndex((option) => option.isCorrect);
        if (correctOptionIndex === -1) {
          toast.error("Each question must have one correct answer.");
          return;
        }
      
        // Map the correct answer to A, B, C, or D
        const correctAnswer = String.fromCharCode(65 + correctOptionIndex); // Convert index to letter (A, B, C, D)
      
        // Format options with letters (A, B, C, D)
        const formattedOptions = options.map((option, index) => ({
          text: option.text,
          identifier: String.fromCharCode(65 + index), // Convert index to letter
        }));
      
        try {
          // Send a request for each question
          await axiosInstance.post(
            `/${createdQuizId}/createQuestion`,
            {
              content,
              correctAnswer, // Send the correct answer as A, B, C, or D
              difficulty: "medium", // Set default difficulty; customize as needed
              options: formattedOptions,
            },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Failed to create question:", error);
          toast.error(`Failed to add question: ${content}`);
        }
      }

      // Clear form and close modal
      setShowQuizModal(false); // Close the modal
      setQuestions([]);
      setQuizTitle("");
      toast.success("All questions added successfully!");
    } catch (error) {
      toast.error("Failed to create quiz or add questions.");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Instructor Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold">{course.name}</h2>
            <p>
              Quizzes: {course.doneQuizzes}/{course.maxQuizzes}
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setSelectedCourseId(course.id);
                setShowQuizModal(true);
              }}
            >
              Add Quiz
            </button>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">Create Quiz</h2>
            <label className="block mb-2">
              Quiz Title:
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </label>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-4">
                <label className="block mb-2">
                  Question:
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[qIndex].question = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>
                <div>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[qIndex].options[oIndex].text =
                            e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        className="flex-1 border border-gray-300 p-2 rounded"
                      />
                      <label className="ml-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].options[
                              oIndex
                            ].isCorrect = e.target.checked;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[qIndex].options.push({
                        text: "",
                        isCorrect: false,
                      });
                      setQuestions(updatedQuestions);
                    }}
                  >
                    Add Option
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Question
            </button>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowQuizModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorQuiz;
