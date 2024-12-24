"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // from Next.js 13+ App Router
import axiosInstance from "@/app/_utils/axiosInstance"; // your custom axios
import toast from "react-hot-toast";
//import { Role,Roles } from '/src/auth/decorators/roles.decorator';


// Forum shape
interface Forum {
  _id: string;
  course: string;       // course ID
  threads: Thread[];
  title: string;
  content: string;
  createdBy: string;   // user ID
  tag: string;
}

// Thread shape
interface Thread {
  _id: string;
  content: string;
  threads: Thread[];
  createdBy: string; // user ID
}

const ForumPage = () => {
  const { courseId } = useParams() || {}; 
  // user ID from /auth/me
  const [userId, setUserId] = useState<string | null>(null);

  // state to hold the forums for this course
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);

  // For creating a new forum
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState("");
  const [newForumTag, setNewForumTag] = useState("Question");
  const [newForumContent, setNewForumContent] = useState("");

  // For editing an existing forum
  const [editingForumId, setEditingForumId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // For toggling "Load replies" (this snippet just demonstrates the idea)
  const [expandedForums, setExpandedForums] = useState<string[]>([]);

    // For creating a reply (thread) - Add these here
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [newReplyContent, setNewReplyContent] = useState("");

    const [userRole, setuserRole] = useState<string | null>(null);

//////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////

  // =========== 1) On mount, fetch user ID =================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meResp = await axiosInstance.get("/auth/me", { withCredentials: true });
        setUserId(meResp.data.id);
        setuserRole(meResp.data.role); // Adjust according to your API response
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        toast.error("Not logged in?");
      }
    };
    fetchUserData();
  }, []);
  
  

  // =========== 2) Load all forums for course ==============
  const fetchForums = async () => {
    setLoading(true);
    try {
      // Fetch forums for the given course
      const resp = await axiosInstance.get(`/forum/course/${courseId}`, {
        withCredentials: true,
      });
      setForums(resp.data);
    } catch (err) {
      console.error("Failed to load forums:", err);
      toast.error("Failed to load forums.");
    } finally {
      setLoading(false);
    }
  };
  
  // useEffect for initial loading
  useEffect(() => {
    if (!courseId) return;
    fetchForums();
  }, [courseId]);


  ////////

  const handleinstructorDeleteStudentForum = async (forumId: string) => {
    try {
      await axiosInstance.delete(`/courses/${courseId}/deleteStudentForum/${forumId}`, {
        withCredentials: true,
      });
      toast.success('Forum deleted successfully!');
      fetchForums(); // Re-fetch forums to update the list
    } catch (error) {
      toast.error('Failed to delete the forum');
    }
  };

  // =========== 3) Create Forum logic ======================
  const handleCreateForum = async () => {
    if (!newForumTitle || !newForumContent) {
      toast.error("Please fill in Title and Content");
      return;
    }

    
    try {
      // e.g. POST /courses/:courseId/forum
      await axiosInstance.post(
        `/courses/${courseId}/forum`,
        {
          title: newForumTitle,
          content: newForumContent,
          tag: newForumTag,
          createdBy: userId, // pass user ID
        },
        { withCredentials: true }
      );
      toast.success("Forum created!");
      setShowCreateModal(false);
      setNewForumTitle("");
      setNewForumContent("");
      setNewForumTag("Question");
      // re-fetch forums
      const updated = await axiosInstance.get(`/forum/course/${courseId}`, {
        withCredentials: true,
      });
      setForums(updated.data);
    } catch (error) {
      console.error("Failed to create forum:", error);
      toast.error("Error creating forum.");
    }
  };

  // =========== 4) Delete Forum logic ======================
  const handleDeleteForum = async (forumId: string) => {
    try {
      // e.g. DELETE /courses/:courseId/forum/:forumId
      await axiosInstance.delete(`/courses/${courseId}/forum/${forumId}`, {
        withCredentials: true,
      });
      toast.success("Forum deleted!");
      setForums((prev) => prev.filter((f) => f._id !== forumId));
    } catch (error) {
      console.error("Failed to delete forum:", error);
      toast.error("Error deleting forum.");
    }
  };

  // =========== 5) Edit Forum logic ========================
  const handleEditForum = (forum: Forum) => {
    // open some UI to edit
    setEditingForumId(forum._id);
    setEditTitle(forum.title);
    setEditContent(forum.content);
  };

  const handleSaveForumEdits = async () => {
    if (!editingForumId) return;
    try {
      // e.g. PUT /forum/:forumId
      await axiosInstance.put(`/forum/${editingForumId}`,
        {
          title: editTitle,
          content: editContent,
        },
        { withCredentials: true }
      );
      toast.success("Forum updated!");
      // close edit UI
      setEditingForumId(null);
      setEditTitle("");
      setEditContent("");
      // re-fetch
      const resp = await axiosInstance.get(`/forum/course/${courseId}`);
      setForums(resp.data);
    } catch (error) {
      toast.error("Error updating forum.");
      console.error(error);
    }
  };

  // =========== 6) Expand "Load replies (#)" ===============
  const handleToggleExpand = (forumId: string) => {
    setExpandedForums((prev) =>
      prev.includes(forumId)
        ? prev.filter((id) => id !== forumId)
        : [...prev, forumId]
    );
  };
// =========== 7) Replies ===================================
const handleReply = async (parentId: string, isThread: boolean = false) => {
  if (!newReplyContent.trim()) {
    toast.error("Reply content cannot be empty");
    return;
  }

  try {
    // Use the correct API path for replying to forums or threads
    const endpoint = isThread
      ? `/forum/thread/${parentId}/addSubThread`
      : `/forum/${parentId}/addThread`;

    await axiosInstance.post(
      endpoint,
      {
        content: newReplyContent,
        createdBy: userId,
      },
      { withCredentials: true }
    );

    toast.success("Reply added successfully!");
    setReplyingTo(null); // Close the reply UI
    setNewReplyContent(""); // Reset input

    // Re-fetch forums to update the UI
    const updated = await axiosInstance.get(`/forum/course/${courseId}`, {
      withCredentials: true,
    });
    setForums(updated.data);
  } catch (error) {
    console.error("Failed to add reply:", error);
    toast.error("Error adding reply.");
  }
};


  // =========== 8) Render UI ===============================

  
  

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (loading) {
    return <p className="p-4">Loading forums...</p>;
  }
  console.log('Current User Role:', userRole); // Log outside JSX
  return (
    <div className="p-4 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">
        Forums for course: {courseId}
      </h1>

      {/* Button to create a new forum */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Create Post
      </button>

      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create New Forum</h2>

            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={newForumTitle}
                onChange={(e) => setNewForumTitle(e.target.value)}
                className="border w-full p-1 mt-1 rounded"
              />
            </label>

            <label className="block mb-2">
              Tag:
              <select
                value={newForumTag}
                onChange={(e) => setNewForumTag(e.target.value)}
                className="border w-full p-1 mt-1 rounded"
              >
                <option value="Helpful">Helpful</option>
                <option value="Frequent Questions">Frequent Questions</option>
                <option value="Question">Question</option>
                <option value="Answer">Answer</option>
                <option value="Announcement">Announcement</option>
              </select>
            </label>

            <label className="block mb-2">
              Content:
              <textarea
                value={newForumContent}
                onChange={(e) => setNewForumContent(e.target.value)}
                className="border w-full p-1 mt-1 rounded"
              />
            </label>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-300 text-black px-3 py-1 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateForum}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Forum Modal */}
      {editingForumId && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Forum</h2>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border w-full p-1 mt-1 rounded"
              />
            </label>
            <label className="block mb-2">
              Content:
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border w-full p-1 mt-1 rounded"
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setEditingForumId(null);
                  setEditTitle("");
                  setEditContent("");
                }}
                className="bg-gray-300 text-black px-3 py-1 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveForumEdits}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
{/* instructor delete student forum */}


{forums && forums.length > 0 && (
  forums.map((forum) => (
    <div key={forum._id} className="forum-item">
      {/* Check if the user is an instructor */}
      {userRole === 'instructor' && (
        <button
          onClick={() => handleinstructorDeleteStudentForum(forum._id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete (Forum)
        </button>
      )}
    </div>
  ))
)}








      {/* List of Forums */}
      {forums.length === 0 ? (
        <p>No forums available.</p>
      ) : (
        forums.map((forum) => {
          const isExpanded = expandedForums.includes(forum._id);
          return (
            <div
              key={forum._id}
              className="bg-white rounded-md shadow-md p-4 mb-4 border border-gray-300"
            >
              {/* Forum Header */}
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {forum.title} <span className="text-sm text-gray-600">({forum.tag})</span>
                  </h2>
                  <p className="text-gray-700 mt-1">{forum.content}</p>
                </div>
                {/* If I'm the creator, allow edit/delete */}
                {(forum.createdBy === userId) && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditForum(forum)} // Add your edit logic here
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteForum(forum._id)} // Delete logic
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}

                        </div>  

              {/* "Load replies (#)" and "Reply" Link */}
                                  <div className="mt-2">
                      <span
                        onClick={() => handleToggleExpand(forum._id)}
                        className="text-blue-600 underline cursor-pointer text-sm mr-4"
                      >
                        Load replies ({forum.threads?.length || 0})
                      </span>
                      <span
                        onClick={() => setReplyingTo(forum._id)} // Set the forum to reply to
                        className="text-blue-600 underline cursor-pointer text-sm"
                      >
                        Reply
                      </span>
                    </div>

                    {/* Reply UI */}
                    {replyingTo === forum._id && (
                      <div className="mt-2">
                        <textarea
                          value={newReplyContent}
                          onChange={(e) => setNewReplyContent(e.target.value)}
                          className="border w-full p-2 rounded mt-1"
                          placeholder="Write your reply..."
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => setReplyingTo(null)} // Close the reply UI
                            className="bg-gray-300 text-black px-3 py-1 rounded mr-2"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(forum._id)} // Trigger reply creation
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}




                  {/*Render recursivley the threads*/}
                    
                  

              {/* If expanded, show the threads here (just a minimal snippet) */}
            
              {isExpanded && forum.threads?.length > 0 && (
                    <div className="mt-3 ml-4 space-y-3 border-l pl-3 border-gray-300">
                      {forum.threads.map((thread) => (
                        <div
                          key={thread._id}
                          className="bg-gray-50 p-2 rounded border border-gray-200"
                        >
                          <p>{thread.content}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span
                              onClick={() => setReplyingTo(thread._id)} // Set the thread to reply to
                              className="text-sm text-blue-600 underline cursor-pointer"
                            >
                              Reply
                            </span>
                            {/* If I'm the creator of the thread => allow edit/delete */}
                            {thread.createdBy === userId &&(
                              <div className="space-x-2 text-sm">
                                <button className="bg-green-400 text-white px-2 py-1 rounded">
                                  Edit
                                </button>
                                <button className="bg-red-400 text-white px-2 py-1 rounded">
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Nested Reply UI */}
                          {replyingTo === thread._id && (
                            <div className="mt-2">
                              <textarea
                                value={newReplyContent}
                                onChange={(e) => setNewReplyContent(e.target.value)}
                                className="border w-full p-2 rounded mt-1"
                                placeholder="Write your reply..."
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => setReplyingTo(null)} // Close the reply UI
                                  className="bg-gray-300 text-black px-3 py-1 rounded mr-2"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleReply(thread._id, true)} // Pass true for thread reply
                                  className="bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ForumPage;



