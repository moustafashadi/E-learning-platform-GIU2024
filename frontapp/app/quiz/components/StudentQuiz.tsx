"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/_utils/axiosInstance"; // or just axios
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  name: string;
}

interface Quiz {
  id: string;
  title: string;
  isCompleted?: boolean;
  grade?: number;
}

function StudentQuiz() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<{ [courseId: string]: Quiz[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCoursesAndQuizzes = async () => {
      setLoading(true);
      try {
        // 1) Get user info
        const userResponse = await axiosInstance.get("/auth/me", {
          withCredentials: true
        });
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);

        // 2) Get the user's enrolled courses
        const enrolledCourseIds: string[] =
          userResponse.data.user.enrolledCourses?.map((c: any) => c.toString()) || [];

        if (enrolledCourseIds.length === 0) {
          toast.error("You are not enrolled in any courses.");
          setCourses([]);
          setLoading(false);
          return;
        }

        // 3) For each enrolled course, fetch course details
        const courseDetails: (Course | null)[] = await Promise.all(
          enrolledCourseIds.map(async (courseId) => {
            try {
              const resp = await axiosInstance.get(`/courses/${courseId}`, {
                withCredentials: true
              });
              return {
                id: courseId,
                name: resp.data.title || resp.data.name || "Unnamed Course"
              };
            } catch (err) {
              console.error("Error fetching course details for:", courseId, err);
              return null;
            }
          })
        );

        const validCourses = courseDetails.filter(Boolean) as Course[];
        setCourses(validCourses);

        // 4) For each course, fetch quizzes
        const quizzesByCourse: { [courseId: string]: Quiz[] } = {};
        for (const course of validCourses) {
          try {
            const quizResp = await axiosInstance.get(`/courses/${course.id}/quizzes`, {
              withCredentials: true
            });
            // Suppose the server returns an array of quiz docs:
            // [ { _id, title, isCompleted, grade }, ... ]
            quizzesByCourse[course.id] = quizResp.data.map((q: any) => ({
              id: q._id,
              title: q.title || "Untitled Quiz",
              isCompleted: q.isCompleted || false,
              grade: q.grade ?? null
            }));
          } catch (err) {
            console.error(`Error fetching quizzes for course ${course.id}:`, err);
            quizzesByCourse[course.id] = [];
          }
        }
        setQuizzes(quizzesByCourse);
      } catch (error) {
        toast.error("Failed to fetch quizzes.");
        console.error("Error fetching enrolled courses and quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCoursesAndQuizzes();
  }, []);

  if (loading) {
    return <div className="text-black mt-20 ml-2">Loading Quizzes...</div>;
  }

  return (
    <div className="text-black mt-20 ml-2">
      <h1 className="text-2xl font-bold mb-6">Your Quizzes</h1>

      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course.id} className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold">{course.name}</h2>
            <div className="mt-4">
              {quizzes[course.id]?.length > 0 ? (
                quizzes[course.id].map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2"
                  >
                    <span>{quiz.title}</span>

                    {quiz.isCompleted ? (
                      <span className="text-green-600 font-semibold">
                        {quiz.grade !== null
                          ? `Grade: ${quiz.grade}%`
                          : "Completed"}
                      </span>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => {
                          // Navigate to /quiz/examination?quizId=<quiz.id>
                          router.push(`/quiz/examination?quizId=${quiz.id}`);
                          toast.success(`Entering quiz: ${quiz.title}`);
                        }}
                      >
                        Enter Quiz
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No quizzes available for this course.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>You have no enrolled courses.</p>
      )}
    </div>
  );
}

export default StudentQuiz;
