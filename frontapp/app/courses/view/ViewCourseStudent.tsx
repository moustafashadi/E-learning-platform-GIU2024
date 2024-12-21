import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";



interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[];
  instructor: string;
  quizzes: string[];
}

interface ViewCourseStudentProps {
  courseid: string;
}

function ViewCourseStudent({ courseid }: ViewCourseStudentProps) {
  const [course, setCourse] = useState<Course | null>(null); // Ensure course is typed as Course | null
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (courseid) {
      const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/courses/${courseid}`, {
                withCredentials: true,  // Ensure credentials (like cookies) are sent
              });
          setCourse(response.data); // Store the course details in the state
        } catch (error) {
          toast.error("Failed to fetch course details.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [courseid]); // use courseid here instead of courseId

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      {/* Displaying course information */}
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Category:</strong> {course.category}</p>
      <p><strong>Difficulty:</strong> {course.difficulty}</p>
      <p><strong>Instructor:</strong> {course.instructor}</p>

      {/* Displaying resources in a separate compartment */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Resources</h2>
        <ul className="list-disc pl-5">
          {course.resources.map((resource, index) => (
            <li key={index} className="my-2">
              {resource}
            </li>
          ))}
        </ul>
      </div>

      {/* You can display other attributes such as quizzes if needed */}
      {course.quizzes.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Quizzes</h2>
          <ul className="list-disc pl-5">
            {course.quizzes.map((quiz, index) => (
              <li key={index} className="my-2">
                {quiz}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ViewCourseStudent;
