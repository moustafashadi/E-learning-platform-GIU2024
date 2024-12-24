"use client";

import { useState, useEffect,useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/store";
import { fetchCourses } from "@/app/store/slices/courseSlice";

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
interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & { files: FileList };
}

function InstructorCourses() {
  const [teachingCourses, setTeachingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [creatingCourse, setCreatingCourse] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]); // Assuming Course is your type
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);



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

  //forums
  const handleRedirectToForums = (courseId: string) => {
    router.push(`/forums/${courseId}/`);
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
  
 // Fetch courses on component mount
 useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/courses', {
        withCredentials: true,
      });
      setCourses(response.data); // Set the courses from the backend
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  fetchCourses();
}, []); // Empty dependency array ensures it runs once

const handleDeleteClick = async (courseId: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/courses/${courseId}`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      console.log('Course deleted successfully');
      alert('Course deleted successfully');

      // Remove the deleted course from the local state
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      
      );
      setTeachingCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
      
    }
  } catch (error) {
    console.error('Failed to delete course:', error);
    alert('Failed to delete course');
  }
};


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
  
  const handleFileChange = (event: FileChangeEvent) => {
    const file = event.target.files[0];
    console.log(file)
    setSelectedFile(file);
    handleUploadResource(file);
   
  };const handleUploadResource = async (file: File) => {
    console.log('Upload resource button clicked');
    if (!file) {
      console.log('No file selected');
      return;
    }
    if (!viewingCourse) {
      console.error('No course selected for uploading resource');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      console.log('Uploading resource to course:', viewingCourse._id);
      const response = await axios.post(
        `http://localhost:3000/courses/${viewingCourse._id}/upload-resource`,
        formData,
        { withCredentials: true }
      );
      console.log('File uploaded successfully:', response.data);
      fetchCourseData(viewingCourse._id);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const fetchCourseData = async (course_id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/${course_id}`, { withCredentials: true });
      setViewingCourse(response.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/search/keyword?keyword=${searchKeyword}`, { withCredentials: true });
      const filteredResults = response.data.filter((course: Course) => teachingCourses.some(tc => tc._id === course._id));
      setSearchResults(filteredResults);
  
      if (filteredResults.length === 0) {
        alert('No courses found');
      }
    } catch (error) {
      console.error('Error searching courses:', error);
      alert('Error searching courses');
    }
  };
return (
  <div className="mt-[2rem] p-6 space-y-6 bg-gray-100">
    <div className="mb-4">
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search by keyword"
        className="px-4 py-2 border rounded-md"
      />
      <button
        onClick={handleSearch}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </div>

    {!viewingCourse && searchResults.length > 0 && (
      <section>
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        <ul className="space-y-4">
          {searchResults.map((course) => (
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
                    View Course
                  </button>
                  <button
                    onClick={() => handleDeleteClick(course._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    )}

    {!viewingCourse && searchResults.length === 0 && (
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
                      <button
                        onClick={() => handleDeleteClick(course._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete Course
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
          <strong>Resources:</strong>
          <div className="space-y-2">
            {viewingCourse && Array.isArray(viewingCourse.resources) && viewingCourse.resources.length > 0 ? (
              viewingCourse.resources.map((resource, index) => {
                // Normalize the path to ensure it's in the correct format
                let normalizedResource = resource.replace(/\\/g, "/");  // Convert all backslashes to forward slashes

                // Check if the resource starts with '/uploads/', and remove '/uploads/' part if it does
                if (normalizedResource.startsWith("/uploads/")) {
                  normalizedResource = normalizedResource.replace("/uploads/", "");  // Remove '/uploads/' from the path
                }

                // Construct the view URL
                let viewUrl = normalizedResource;

                // If the resource is not a full URL or path, create the correct URL
                if (!viewUrl.startsWith("http") && !viewUrl.startsWith("/")) {
                  viewUrl = `http://localhost:3000/courses/${viewingCourse._id}/resource/${encodeURIComponent(viewUrl)}`;
                } else {
                  // If it's already a full URL, no need to modify it
                  if (!viewUrl.startsWith("http")) {
                    viewUrl = `http://localhost:3000/courses/${viewingCourse._id}/resource${encodeURIComponent(viewUrl)}`;
                  }
                }

                // Extract the filename from the last part of the path (no encoding here)
                const filename = normalizedResource.split("/").pop() || "default-filename";

                return (
                  <div key={index} className="flex items-center space-x-2">
                    <a
                      href={viewUrl}  // Use the constructed URL
                      target="_blank"  // Open in a new tab
                      rel="noopener noreferrer"  // Security for new tab
                      className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View {filename}  {/* Display the filename without URL encoding */}
                    </a>
                  </div>
                );
              })
            ) : (
              <div>No resources available</div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            onClick={handleButtonClick}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Upload New Resource
          </button>
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