"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast";
import { ObjectId } from "mongodb";

interface Course {
  id: string;
  name: string;
}

interface Quiz {
  id: string;
  title: string;
}

function StudentQuiz() {
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<{ [courseId: string]: Quiz[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCoursesAndQuizzes = async () => {
      try {
        // Fetch user ID and enrolled courses
        const userResponse = await axiosInstance.get("/auth/me", { withCredentials: true });
        const userId = userResponse.data.id;
        setUserId(userId);

        const enrolledCourseIds: string[] =
          userResponse.data.user.enrolledCourses?.map((courseId: ObjectId) =>
            courseId.toString()
          ) || [];

        if (enrolledCourseIds.length === 0) {
          toast.error("No enrolled courses found.");
          setCourses([]);
          return;
        }

        console.log("Enrolled Course IDs:", enrolledCourseIds);

        // Fetch details for each course
        const courseDetails = await Promise.all(
          enrolledCourseIds.map(async (courseId) => {
            try {
              const response = await axiosInstance.get(`/courses/${courseId}`, {
                withCredentials: true,
              });
              return { id: courseId, name: response.data.title };
            } catch (err) {
              console.error(`Error fetching course details for ${courseId}:`, err);
              return null;
            }
          })
        );

        const formattedCourses = courseDetails.filter((course) => course !== null) as Course[];
        setCourses(formattedCourses);

        // Fetch quizzes for each course
        const quizzesByCourse: { [courseId: string]: Quiz[] } = {};
        for (const course of formattedCourses) {
          try {
            const quizResponse = await axiosInstance.get(`${course.id}/quizzes`, {
              withCredentials: true,
            });
            quizzesByCourse[course.id] = quizResponse.data.map((quiz: any) => ({
              id: quiz._id,
              title: quiz.title || "Untitled Quiz",
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
    return (
      <div className="text-black mt-20 ml-2">
        <h1>Loading Quizzes...</h1>
      </div>
    );
  }

  return (
    <div className="text-black mt-20 ml-2">
      <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-lg p-4 mb-6"
          >
            <h2 className="text-xl font-semibold">{course.name}</h2>
            <div className="mt-4">
              {quizzes[course.id]?.length > 0 ? (
                quizzes[course.id].map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2"
                  >
                    <span>{quiz.title}</span>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        console.log(`Entering quiz ${quiz.id}`); // Placeholder for navigation logic
                        toast.success(`Entering quiz: ${quiz.title}`);
                      }}
                    >
                      Enter Quiz
                    </button>
                  </div>
                ))
              ) : (
                <p>No quizzes available for this course.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}

export default StudentQuiz;
