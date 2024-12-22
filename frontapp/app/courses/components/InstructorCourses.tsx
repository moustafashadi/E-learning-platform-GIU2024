"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/store";

interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[];
  instructor: string;
  quizzes: string[];
  students: string[];
  createdAt: string;
  updatedAt: string;
}

interface UpdateCourseDto {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  numberofQuizzes: number;
}

function InstructorCourses() {
  const [teachingCourses, setTeachingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [creatingCourse, setCreatingCourse] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    quizzes: ""
  });
  const [showAllCourses, setShowAllCourses] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Close all forms function
  const closeAllForms = () => {
    setEditingCourse(null);
    setCreatingCourse(false);
    setFormValues({
      title: "",
      description: "",
      category: "",
      difficulty: "",
      quizzes: ""
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: authData } = await axios.get("/auth/me", { withCredentials: true });
        const response = await axios.get(`http://localhost:3000/courses/teacher/${authData.id}`, {
          withCredentials: true,
        });
        setTeachingCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourseDetails = (course: Course) => {
    if (viewingCourse && viewingCourse._id === course._id) {
      setViewingCourse(null);
    } else {
      setViewingCourse(course);
      closeAllForms(); // Close any open forms when viewing course details
    }
  };

  const handleEditClick = (course: Course) => {
    closeAllForms(); // Close any other open forms first
    setEditingCourse(course);
    setFormValues({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      quizzes: course.quizzes.length.toString()
    });
  };

  const handleCreateClick = () => {
    closeAllForms(); // Close any other open forms first
    setCreatingCourse(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editingCourse) return;

    try {
      const updatedCourse = {
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        difficulty: formValues.difficulty,
        instructor: user?.id,
        numOfQuizzes: parseInt(formValues.quizzes) || 0
      };

      const response = await axios.patch(
        `http://localhost:3000/courses/${editingCourse._id}`,
        updatedCourse,
        { withCredentials: true }
      );

      if (response.data) {
        setTeachingCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editingCourse._id ? { ...course, ...response.data } : course
          )
        );
        toast.success("Course updated successfully!");
        closeAllForms();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update the course.");
      console.error(error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const newCourse = {
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        difficulty: formValues.difficulty,
        instructor: user?.id,
        course_code: `C-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        numberofQuizzes: parseInt(formValues.quizzes) || 0
      };

      const response = await axios.post(
        "http://localhost:3000/courses",
        newCourse,
        { withCredentials: true }
      );

      if (response.data) {
        setTeachingCourses((prevCourses) => [...prevCourses, response.data]);
        toast.success("Course created successfully!");
        closeAllForms();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create the course.");
      console.error(error);
    }
  };
  

  return (
    <div className="mt-[2rem] p-6 space-y-6 bg-gray-100">
      {!viewingCourse && (
        <>
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Courses</h2>

            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              {showAllCourses ? "Hide Courses" : "View All Courses"}
            </button>

            {showAllCourses && (
              <ul className="space-y-4 mt-4">
                {teachingCourses.map((course) => (
                  <li key={course._id} className="p-4 bg-white rounded shadow-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <p className="text-gray-700">{course.description}</p>
                        <p className="text-gray-500">Code: {course.course_code}</p>
                        <p className="text-gray-500">Category: {course.category}</p>
                        <p className="text-gray-500">Difficulty: {course.difficulty}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(course)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Edit Course
                        </button>
                        <button
                          onClick={() => handleViewCourseDetails(course)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          {viewingCourse && (viewingCourse as Course)._id === course._id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Create New Course
          </button>
        </>
      )}

      {viewingCourse && (
        <section className="mt-6 bg-white p-6 rounded shadow-md">
          <button
            onClick={() => setViewingCourse(null)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Courses
          </button>
          <h1 className="text-2xl font-bold">{viewingCourse.title}</h1>
          <div>
            <strong>Description:</strong> {viewingCourse.description}
          </div>
          <div>
            <strong>Category:</strong> {viewingCourse.category}
          </div>
          <div>
            <strong>Difficulty:</strong> {viewingCourse.difficulty}
          </div>
          <div>
            <strong>Instructor:</strong> {viewingCourse.instructor}
          </div>
          <div>
            <strong>Resources:</strong>
            <div className="space-y-2">
              {viewingCourse.resources.length > 0 ? (
                viewingCourse.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={`http://localhost:3000/courses/${viewingCourse.course_code}/resource/${encodeURIComponent(resource)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                    View {resource}
                  </a>
                ))
              ) : (
                <div>No resources available</div>
              )}
            </div>
          </div>
          <div>
            <strong>Quizzes:</strong>
            <ul className="list-disc pl-5">
              {viewingCourse.quizzes.length > 0 ? (
                viewingCourse.quizzes.map((quiz, index) => <li key={index}>{quiz}</li>)
              ) : (
                <li>No quizzes available</li>
              )}
            </ul>
          </div>
        </section>
      )}

      {editingCourse && (
        <section className="mt-6 p-6 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
  <label htmlFor="quizzes" className="block text-sm font-medium text-gray-700">
    Quizzes
  </label>
            <select
    id="quizzes"
    name="quizzes"
    value={formValues.quizzes}
    onChange={handleFormChange}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
  >
    <option value="">Select Number of Quizzes</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="10">10</option>
  </select>
  </div>
            <div>
  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
    Difficulty
  </label>
  <select
    id="difficulty"
    name="difficulty"
    value={formValues.difficulty}
    onChange={handleFormChange}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
    >
    <option value="">Select Difficulty</option>
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
</div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      )}

      {creatingCourse && (
        <section className="mt-6 p-6 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create New Course</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
  <label htmlFor="quizzes" className="block text-sm font-medium text-gray-700">
    Quizzes
  </label>
  <select
    id="quizzes"
    name="quizzes"
    value={formValues.quizzes}
    onChange={handleFormChange}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
  >
    <option value="">Select Number of Quizzes</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="10">10</option>
  </select>
</div>
  <div>
  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
    Difficulty
  </label>
  <select
    id="difficulty"
    name="difficulty"
    value={formValues.difficulty}
    onChange={handleFormChange}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
    >
    <option value="">Select Difficulty</option>
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
</div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCreateCourse}
                className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Create Course
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default InstructorCourses;
