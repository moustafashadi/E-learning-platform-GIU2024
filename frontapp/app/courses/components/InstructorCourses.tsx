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

function InstructorCourses() {
  const [teachingCourses, setTeachingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // To store the instructor's userId
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null); // Track the course being viewed
  const [editingCourse, setEditingCourse] = useState<Course | null>(null); // Track course being edited
  const [creatingCourse, setCreatingCourse] = useState<boolean>(false); // Track if the instructor is creating a new course
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: authData } = await axios.get("/auth/me", { withCredentials: true });
        setUserId(authData.id); // Set the user ID using the 'sub' field

        const response = await axios.get(`http://localhost:3000/courses/teacher/${authData.id}`, {
          withCredentials: true,
        });
        setTeachingCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses. Please try again.");
        console.error(error); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleCourseDetails = (courseId: string) => {
    setViewingCourseId(courseId); // Set the course ID for viewing
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course); // Set the course to be edited
    setFormValues({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
    });
  };

  const handleCreateClick = () => {
    setCreatingCourse(true); // Show the create course form
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        ...editingCourse,
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        difficulty: formValues.difficulty,
      };

      await axios.put(`http://localhost:3000/courses/${editingCourse._id}`, updatedCourse, {
        withCredentials: true,
      });

      toast.success("Course updated successfully!");

      setTeachingCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === editingCourse._id ? updatedCourse : course
        )
      );
      setEditingCourse(null); // Close the editing form
    } catch (error) {
      toast.error("Failed to update the course.");
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
        instructor: userId, // Ensure this is correct
        // Generate a course_code or handle it backend-side
        course_code: `C-${Math.random().toString(36).substring(2, 7).toUpperCase()}`, // Random example
        numberofQuizzes: 0, // Default value if you don't capture quiz count
      };
  
      console.log("Creating course with data:", newCourse); // Log the data for debugging
  
      const response = await axios.post("http://localhost:3000/courses", newCourse, {
        withCredentials: true,
      });
  
      toast.success("Course created successfully!");
  
      // Add the new course to the list
      setTeachingCourses((prevCourses) => [...prevCourses, response.data]);
  
      // Reset the form
      setFormValues({
        title: "",
        description: "",
        category: "",
        difficulty: "",
      });
  
      setCreatingCourse(false); // Close the create course form
    } catch (error) {
      toast.error("Failed to create the course.");
      console.error(error);
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="mt-[2rem] p-6 space-y-6 bg-gray-100">
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
        {teachingCourses.length > 0 ? (
          <ul className="space-y-4">
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
                      onClick={() => toggleCourseDetails(course._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      View Course
                    </button>
                    <button
                      onClick={() => handleEditClick(course)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Course
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You are not teaching any courses yet.</p>
        )}
      </section>

      <button
        onClick={handleCreateClick}
        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
      >
        Create New Course
      </button>

      {creatingCourse && (
        <div className="mt-6 p-4 bg-white rounded shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Create New Course</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formValues.description}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formValues.category}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
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

            <button
              type="button"
              onClick={handleCreateCourse}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Create Course
            </button>
          </form>
        </div>
      )}

      {editingCourse && (
        <div className="mt-6 p-4 bg-white rounded shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formValues.description}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formValues.category}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                name="difficulty"
                value={formValues.difficulty}
                onChange={handleFormChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default InstructorCourses;
