"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast";

// ===================== INTERFACES =====================
interface Course {
  id: string;
  name: string;
  currentQuizzes: number;
  maxQuizzes: number;
  doneQuizzes: number;
}

interface Quiz {
  _id: string;
  title: string;
}

interface QuestionData {
  _id?: string; // Only present if it's an existing question
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

function InstructorQuiz() {
  // --------------- MAIN STATES ---------------
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // --------------- CREATE NEW QUIZ ---------------
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  // --------------- VIEW & EDIT EXISTING QUIZ ---------------
  const [showQuizzesListModal, setShowQuizzesListModal] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // --------------- EDIT QUIZ MODAL ---------------
  const [editQuizId, setEditQuizId] = useState<string | null>(null);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [editQuestions, setEditQuestions] = useState<QuestionData[]>([]);

  // ==========================================================
  //                FETCH COURSES ON MOUNT
  // ==========================================================
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      setLoading(true);
      try {
        // 1) Get user ID
        const userResponse = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);

        // 2) Get courses for which the user is the instructor
        const response = await axiosInstance.get(
          `/courses/teacher/${fetchedUserId}`,
          { withCredentials: true }
        );

        const formattedCourses = response.data.map((course: any) => ({
          id: course.id || course._id || "unknown-id",
          name: course.title || course.name || "Unnamed Course",
          maxQuizzes: course.numOfQuizzes || 0,
          doneQuizzes: course.quizzes?.length || 0,
          currentQuizzes: course.quizzes?.length || 0, // If needed
        }));

        setCourses(formattedCourses);
      } catch (error) {
        toast.error("Failed to fetch instructor's courses.");
        console.error("Error fetching instructor's courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  // ==========================================================
  //                CREATE A NEW QUIZ
  // ==========================================================
  // Add a brand-new question row when creating a quiz
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  // Submit a new Quiz
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

      const createdQuizId = createdQuizResponse.data._id;
      toast.success("Quiz created successfully!");

      // Step 2: Add questions to the newly created quiz
      for (const questionObj of questions) {
        const { question: content, options } = questionObj;

        const correctOptionIndex = options.findIndex((o) => o.isCorrect);
        if (correctOptionIndex === -1) {
          toast.error("Each question must have one correct answer.");
          return;
        }

        const correctAnswer = String.fromCharCode(65 + correctOptionIndex); // 'A' + index
        const formattedOptions = options.map((opt, idx) => ({
          text: opt.text,
          identifier: String.fromCharCode(65 + idx), // 'A', 'B', 'C', 'D', ...
        }));

        try {
          await axiosInstance.post(
            `/${createdQuizId}/createQuestion`,
            {
              content,
              correctAnswer,
              difficulty: "medium",
              options: formattedOptions,
            },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Failed to create question:", error);
          toast.error(`Failed to add question: ${content}`);
        }
      }

      // Clear form / close modal
      setShowQuizModal(false);
      setQuizTitle("");
      setQuestions([]);
      toast.success("All questions added successfully!");

      // Optionally update local course list to increment doneQuizzes
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourseId
            ? { ...c, doneQuizzes: c.doneQuizzes + 1 }
            : c
        )
      );
    } catch (error) {
      toast.error("Failed to create quiz or add questions.");
      console.error("Error creating quiz:", error);
    }
  };

  // ==========================================================
  //         VIEW ALL QUIZZES FOR A COURSE => EDIT
  // ==========================================================
  const handleViewQuizzes = async (courseId: string) => {
    // Show the modal that lists all quizzes for this course
    setSelectedCourseId(courseId);
    setShowQuizzesListModal(true);

    try {
      // GET /courses/:courseId/quizzes
      const response = await axiosInstance.get(
        `/courses/${courseId}/quizzes`,
        { withCredentials: true }
      );
      setQuizzes(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch quizzes for this course.");
      console.error(error);
    }
  };

  // ==========================================================
  //              EDIT AN EXISTING QUIZ
  // ==========================================================
  const handleOpenEditQuiz = async (quizId: string) => {
    setEditQuizId(quizId);
    setShowEditQuizModal(true);

    try {
      // GET /:quizId/questions -> get all questions for this quiz
      const res = await axiosInstance.get(`/${quizId}/questions`, {
        withCredentials: true,
      });

      // Convert backend shape to your local shape: { question, options[] }
      const loadedQuestions: QuestionData[] = res.data.map((q: any) => {
        const correctIndex = q.options.findIndex(
          (opt: any) => opt.identifier === q.correctAnswer
        );
        return {
          _id: q._id,
          question: q.content,
          options: q.options.map((opt: any, idx: number) => ({
            text: opt.text,
            isCorrect: idx === correctIndex,
          })),
        };
      });

      setEditQuestions(loadedQuestions);
    } catch (error) {
      toast.error("Failed to fetch quiz questions.");
      console.error(error);
    }
  };

  // Add a blank question row in Edit mode
  const addQuestionForEdit = () => {
    setEditQuestions((prev) => [
      ...prev,
      { question: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  // Save changes in the Edit Quiz modal
  const handleSaveQuizChanges = async () => {
    if (!editQuizId || editQuestions.length === 0) {
      toast.error("No quiz or questions to update!");
      return;
    }

    try {
      // Loop through each question in editQuestions
      for (const q of editQuestions) {
        const correctOptIndex = q.options.findIndex((opt) => opt.isCorrect);
        if (correctOptIndex === -1) {
          toast.error("Each question must have one correct answer.");
          return;
        }
        const correctAnswer = String.fromCharCode(65 + correctOptIndex);
        const formattedOptions = q.options.map((opt, idx) => ({
          text: opt.text,
          identifier: String.fromCharCode(65 + idx),
        }));

        // If the question already has an _id => update (PUT /:id)
        if (q._id) {
          await axiosInstance.put(
            `/${q._id}`,
            {
              content: q.question,
              correctAnswer,
              options: formattedOptions,
            },
            { withCredentials: true }
          );
        } else {
          // Otherwise => create a new question (POST /:quizId/createQuestion)
          await axiosInstance.post(
            `/${editQuizId}/createQuestion`,
            {
              content: q.question,
              correctAnswer,
              difficulty: "medium",
              options: formattedOptions,
            },
            { withCredentials: true }
          );
        }
      }

      toast.success("Quiz updated successfully!");
      setShowEditQuizModal(false);
      setEditQuizId(null);
      setEditQuestions([]);
    } catch (error) {
      toast.error("Failed to update quiz questions.");
      console.error(error);
    }
  };

  // Delete a single question
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await axiosInstance.delete(`/${questionId}`, { withCredentials: true });
      // Remove from local state
      setEditQuestions((prev) => prev.filter((q) => q._id !== questionId));
      toast.success("Question deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete question.");
      console.error(error);
    }
  };

  // ==========================================================
  //                   RENDER UI
  // ==========================================================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Instructor Quizzes</h1>
      {loading && <p>Loading your courses...</p>}

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

            {/* Add Quiz Button (disabled if at capacity) */}
            <button
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => {
                setSelectedCourseId(course.id);
                setShowQuizModal(true);
              }}
              disabled={course.doneQuizzes >= course.maxQuizzes}
            >
              Add Quiz
            </button>

            {/* View Quizzes Button (for editing) */}
            <button
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => handleViewQuizzes(course.id)}
            >
              View Quizzes
            </button>
          </div>
        ))}
      </div>

      {/* =========================================================
          CREATE NEW QUIZ MODAL
      ========================================================= */}
      {showQuizModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-40">
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
                      const updated = [...questions];
                      updated[qIndex].question = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>

                <div className="ml-4">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].options[oIndex].text = e.target.value;
                          setQuestions(updated);
                        }}
                        className="flex-1 border border-gray-300 p-2 rounded"
                      />
                      <label className="ml-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[qIndex].options[oIndex].isCorrect =
                              e.target.checked;
                            setQuestions(updated);
                          }}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => {
                      const updated = [...questions];
                      updated[qIndex].options.push({
                        text: "",
                        isCorrect: false,
                      });
                      setQuestions(updated);
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
                onClick={() => {
                  setShowQuizModal(false);
                  setQuizTitle("");
                  setQuestions([]);
                }}
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

      {/* =========================================================
          VIEW QUIZZES (LIST) MODAL
      ========================================================= */}
      {showQuizzesListModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 relative">
            <h2 className="text-xl font-bold mb-4">Quizzes in this Course</h2>

            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{quiz.title}</span>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleOpenEditQuiz(quiz._id)}
                  >
                    Edit
                  </button>
                </div>
              ))
            ) : (
              <p>No quizzes found for this course.</p>
            )}

            <button
              onClick={() => {
                setShowQuizzesListModal(false);
                setQuizzes([]);
                setSelectedCourseId(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          EDIT QUIZ MODAL
      ========================================================= */}
      {showEditQuizModal && editQuizId && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 relative">
            <h2 className="text-xl font-bold mb-4">Edit Quiz</h2>

            {editQuestions.map((q, qIndex) => (
              <div key={qIndex} className="mb-4">
                <label className="block mb-2">
                  Question:
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...editQuestions];
                      updated[qIndex].question = e.target.value;
                      setEditQuestions(updated);
                    }}
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                </label>

                <div className="ml-4">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const updated = [...editQuestions];
                          updated[qIndex].options[oIndex].text = e.target.value;
                          setEditQuestions(updated);
                        }}
                        className="flex-1 border border-gray-300 p-2 rounded"
                      />
                      <label className="ml-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const updated = [...editQuestions];
                            updated[qIndex].options[oIndex].isCorrect =
                              e.target.checked;
                            setEditQuestions(updated);
                          }}
                        />
                        Correct
                      </label>
                    </div>
                  ))}

                  <button
                    className="text-sm text-blue-600"
                    onClick={() => {
                      const updated = [...editQuestions];
                      updated[qIndex].options.push({
                        text: "",
                        isCorrect: false,
                      });
                      setEditQuestions(updated);
                    }}
                  >
                    Add Option
                  </button>
                </div>

                {/* Delete question button (only if an _id exists) */}
                {q._id && (
                  <button
                    className="mt-2 text-sm text-red-600 underline"
                    onClick={() => handleDeleteQuestion(q._id!)}
                  >
                    Delete Question
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addQuestionForEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add New Question
            </button>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowEditQuizModal(false);
                  setEditQuizId(null);
                  setEditQuestions([]);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuizChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>

            <button
              onClick={() => {
                setShowEditQuizModal(false);
                setEditQuizId(null);
                setEditQuestions([]);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorQuiz;
