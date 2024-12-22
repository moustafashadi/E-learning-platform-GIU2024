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

interface Quiz {
  _id: string;
  title: string;
}

interface QuestionData {
  _id?: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

function InstructorQuiz() {
  // ----------------- STATES -----------------
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // Create Quiz
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isSubmittingNewQuiz, setIsSubmittingNewQuiz] = useState(false);

  // View & Edit Quiz
  const [showQuizzesListModal, setShowQuizzesListModal] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Edit Quiz
  const [editQuizId, setEditQuizId] = useState<string | null>(null);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [editQuizTitle, setEditQuizTitle] = useState<string>("");
  const [editQuestions, setEditQuestions] = useState<QuestionData[]>([]);
  const [isSavingQuizChanges, setIsSavingQuizChanges] = useState(false);

  // ==========================================================
  //                FETCH COURSES ON MOUNT
  // ==========================================================
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      setLoading(true);
      try {
        const userResponse = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);

        const response = await axiosInstance.get(
          `/courses/teacher/${fetchedUserId}`,
          { withCredentials: true }
        );

        const formattedCourses = response.data.map((course: any) => ({
          id: course.id || course._id || "unknown-id",
          name: course.title || course.name || "Unnamed Course",
          maxQuizzes: course.numOfQuizzes || 0,
          doneQuizzes: (course.quizzes && course.quizzes.length) || 0,
          currentQuizzes: (course.quizzes && course.quizzes.length) || 0,
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
  //                 CREATE A NEW QUIZ
  // ==========================================================
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== questionIndex));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedCourseId || !quizTitle.trim()) {
      toast.error("Please provide a quiz title.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    // Check each question has exactly one correct answer
    for (const q of questions) {
      const correctCount = q.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        alert("You have to select answers for all the questions.");
        return;
      }
    }

    setIsSubmittingNewQuiz(true);

    try {
      // 1) create quiz
      const createQuizRes = await axiosInstance.post(
        `/quiz/${selectedCourseId}`,
        { title: quizTitle },
        { withCredentials: true }
      );
      const createdQuizId = createQuizRes.data._id;

      // 2) create each question
      for (const questionObj of questions) {
        const correctIndex = questionObj.options.findIndex((o) => o.isCorrect);
        const correctAnswer = String.fromCharCode(65 + correctIndex);

        const formattedOptions = questionObj.options.map((opt, idx) => ({
          text: opt.text,
          identifier: String.fromCharCode(65 + idx),
        }));

        await axiosInstance.post(
          `/${createdQuizId}/createQuestion`,
          {
            content: questionObj.question,
            correctAnswer,
            difficulty: "medium",
            options: formattedOptions,
          },
          { withCredentials: true }
        );
      }

      toast.success("Quiz created successfully!");
      // Close & reset
      setQuizTitle("");
      setQuestions([]);
      setShowQuizModal(false);

      // Update local doneQuizzes
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourseId
            ? { ...c, doneQuizzes: c.doneQuizzes + 1 }
            : c
        )
      );
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz.");
    } finally {
      setIsSubmittingNewQuiz(false);
    }
  };

  // ==========================================================
  //              VIEW ALL QUIZZES (LIST)
  // ==========================================================
  const handleViewQuizzes = async (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowQuizzesListModal(true);

    try {
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

  // Delete entire quiz
  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axiosInstance.delete(`/quiz/${quizId}`, { withCredentials: true });
      toast.success("Quiz deleted!");

      // Remove from local quizzes array
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));

      // Optionally update doneQuizzes in the course
      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          if (course.id === selectedCourseId) {
            return { ...course, doneQuizzes: course.doneQuizzes - 1 };
          }
          return course;
        })
      );
    } catch (error) {
      toast.error("Failed to delete quiz.");
      console.error(error);
    }
  };

  // ==========================================================
  //               EDIT AN EXISTING QUIZ
  // ==========================================================
  const handleOpenEditQuiz = async (quizId: string) => {
    setEditQuizId(quizId);
    setShowEditQuizModal(true);
    setEditQuizTitle("Edit Quiz");

    try {
      // GET /:quizId/questions
      const res = await axiosInstance.get(`/${quizId}/questions`, {
        withCredentials: true,
      });

      if (!Array.isArray(res.data)) {
        toast.error("No questions or bad response shape.");
        setEditQuestions([]);
        return;
      }

      const loaded = res.data.map((q: any) => {
        const serverOptions = Array.isArray(q.options) ? q.options : [];
        let correctIndex = -1;
        if (q.correctAnswer && serverOptions.length > 0) {
          correctIndex = serverOptions.findIndex(
            (opt: any) => opt.identifier === q.correctAnswer
          );
        }

        return {
          _id: q._id,
          question: q.content || "",
          options: serverOptions.map((opt: any, idx: number) => ({
            text: opt.text || "",
            isCorrect: idx === correctIndex,
          })),
        };
      });

      setEditQuestions(loaded);
    } catch (error) {
      toast.error("Failed to load quiz questions.");
      console.error(error);
      setEditQuestions([]);
    }
  };

  const addQuestionForEdit = () => {
    setEditQuestions((prev) => [
      ...prev,
      { question: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const removeEditQuestion = (index: number) => {
    setEditQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteQuestionDB = async (questionId: string, index: number) => {
    if (!editQuizId) return;

    if (!confirm("Are you sure you want to remove this question?")) return;

    try {
      await axiosInstance.delete(`/${editQuizId}/${questionId}`, {
        withCredentials: true,
      });
      toast.success("Question deleted!");
      setEditQuestions((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      toast.error("Delete question failed!");
      console.error(error);
    }
  };

  const handleSaveQuizChanges = async () => {
    if (!editQuizId) return;
    if (editQuestions.length === 0) {
      toast.error("No questions to update!");
      return;
    }

    // Check each question has exactly 1 correct answer
    for (const q of editQuestions) {
      const correctCount = q.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        alert("You have to select answers for all the questions in edit mode.");
        return;
      }
    }

    setIsSavingQuizChanges(true);

    try {
      for (const q of editQuestions) {
        const correctIndex = q.options.findIndex((opt) => opt.isCorrect);
        const correctAnswer = String.fromCharCode(65 + correctIndex);

        const formattedOptions = q.options.map((opt, idx) => ({
          text: opt.text,
          identifier: String.fromCharCode(65 + idx),
        }));

        if (q._id) {
          // Update existing
          await axiosInstance.put(
            `/${editQuizId}/${q._id}`,
            {
              content: q.question,
              correctAnswer,
              options: formattedOptions,
            },
            { withCredentials: true }
          );
        } else {
          // Create new
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
      setEditQuizTitle("");
      setEditQuestions([]);
    } catch (error) {
      toast.error("Failed to update quiz questions.");
      console.error(error);
    } finally {
      setIsSavingQuizChanges(false);
    }
  };

  // ==========================================================
  //                     RENDER
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

            {/* Add Quiz */}
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

            {/* View Quizzes */}
            <button
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => handleViewQuizzes(course.id)}
            >
              View Quizzes
            </button>
          </div>
        ))}
      </div>

      {/* =============== CREATE QUIZ MODAL =============== */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Quiz</h2>

            <label className="block mb-4">
              Quiz Title:
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mt-1"
              />
            </label>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-6 border-b pb-4">
                {/* QUESTION TEXT */}
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
                    className="w-full border border-gray-300 p-2 rounded mt-1"
                  />
                </label>

                {q.options.map((option, oIndex) => {
                  const optionLetter = String.fromCharCode(65 + oIndex); // A, B, C, D, ...
                  return (
                    <div key={oIndex} className="flex items-center mb-2 ml-4">
                      <span className="mr-2 font-medium">
                        Option {optionLetter}:
                      </span>
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
                      <label className="ml-2 flex items-center">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={() => {
                            const updated = [...questions];
                            updated[qIndex].options.forEach((opt, idx) => {
                              opt.isCorrect = idx === oIndex;
                            });
                            setQuestions(updated);
                          }}
                        />
                        <span className="ml-1">Correct</span>
                      </label>
                    </div>
                  );
                })}

                {/* Add Option */}
                <button
                  className="text-sm text-blue-600 ml-4"
                  onClick={() => {
                    if (q.options.length >= 4) return;
                    const updated = [...questions];
                    updated[qIndex].options.push({
                      text: "",
                      isCorrect: false,
                    });
                    setQuestions(updated);
                  }}
                  disabled={q.options.length >= 4}
                >
                  Add Option
                </button>

                {/* Remove Question */}
                <button
                  className="text-sm text-red-600 ml-4"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove Question
                </button>
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmittingNewQuiz}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ VIEW QUIZZES (LIST) MODAL ============ */}
      {showQuizzesListModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Quizzes in this Course</h2>

            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{quiz.title}</span>

                  <div className="flex space-x-2">
                    {/* Edit quiz */}
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleOpenEditQuiz(quiz._id)}
                    >
                      Edit
                    </button>

                    {/* Delete quiz */}
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      Delete
                    </button>
                  </div>
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

      {/* ============ EDIT QUIZ MODAL ============ */}
      {showEditQuizModal && editQuizId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editQuizTitle}</h2>

            {editQuestions.map((q, qIndex) => (
              <div key={qIndex} className="mb-6 border-b pb-4">
                {/* QUESTION TEXT */}
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
                    className="w-full border border-gray-300 p-2 rounded mt-1"
                  />
                </label>

                {q.options.map((option, oIndex) => {
                  const optionLetter = String.fromCharCode(65 + oIndex);
                  return (
                    <div key={oIndex} className="flex items-center mb-2 ml-4">
                      <span className="mr-2 font-medium">
                        Option {optionLetter}:
                      </span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const updated = [...editQuestions];
                          updated[qIndex].options[oIndex].text =
                            e.target.value;
                          setEditQuestions(updated);
                        }}
                        className="flex-1 border border-gray-300 p-2 rounded"
                      />
                      <label className="ml-2 flex items-center">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={() => {
                            const updated = [...editQuestions];
                            updated[qIndex].options.forEach((opt, idx) => {
                              opt.isCorrect = idx === oIndex;
                            });
                            setEditQuestions(updated);
                          }}
                        />
                        <span className="ml-1">Correct</span>
                      </label>
                    </div>
                  );
                })}

                {/* Add Option */}
                <button
                  className="text-sm text-blue-600 ml-4"
                  onClick={() => {
                    if (q.options.length >= 4) return;
                    const updated = [...editQuestions];
                    updated[qIndex].options.push({
                      text: "",
                      isCorrect: false,
                    });
                    setEditQuestions(updated);
                  }}
                  disabled={q.options.length >= 4}
                >
                  Add Option
                </button>

                {/* Remove Question */}
                {q._id ? (
                  <button
                    className="text-sm text-red-600 ml-4"
                    onClick={() => handleDeleteQuestionDB(q._id!, qIndex)}
                  >
                    Remove Question
                  </button>
                ) : (
                  <button
                    className="text-sm text-red-600 ml-4"
                    onClick={() => removeEditQuestion(qIndex)}
                  >
                    Remove Question
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
                  setEditQuizTitle("");
                  setEditQuestions([]);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuizChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isSavingQuizChanges}
              >
                Save Changes
              </button>
            </div>

            <button
              onClick={() => {
                setShowEditQuizModal(false);
                setEditQuizId(null);
                setEditQuizTitle("");
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
