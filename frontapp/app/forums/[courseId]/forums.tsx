import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useParams } from 'next/navigation';

// Define interfaces for the data
interface Forum {
  _id: string;
  title: string;
  description: string;
}

interface Thread {
  _id: string;
  message: string;
  replies: string[];
}

const ForumsPage = () => {
  const { courseId } = useParams();
  const router = useRouter();

  const [forums, setForums] = useState<Forum[]>([]); // List of forums
  const [threads, setThreads] = useState<Thread[]>([]); // List of threads in the selected forum
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');
  const [selectedForumId, setSelectedForumId] = useState<string | null>(null); // ID of selected forum

  // Fetch all forums for the course
  useEffect(() => {
    if (courseId) {
      axios
        .get(`/api/forums/${courseId}`)
        .then((response) => setForums(response.data))
        .catch((error) => {
          console.error('Error fetching forums:', error);
          setForums([]); // Ensure state is reset in case of error
        });
    }
  }, [courseId]);

  // Fetch threads for the selected forum
  useEffect(() => {
    if (selectedForumId) {
      axios
        .get(`/api/forums/${selectedForumId}/threads`)
        .then((response) => setThreads(response.data))
        .catch((error) => console.error('Error fetching threads:', error));
    }
  }, [selectedForumId]);

  const handleCreateForum = async () => {
    try {
      await axios.post(`/api/forums/${courseId}/create`, {
        title: newForumTitle,
        description: newForumDescription,
      });
      setNewForumTitle('');
      setNewForumDescription('');
      alert('Forum created successfully');
      // Refresh forums after creation
      axios
        .get(`/api/forums/${courseId}`)
        .then((response) => setForums(response.data))
        .catch((error) => console.error('Error fetching forums:', error));
    } catch (error) {
      console.error('Error creating forum:', error);
      alert('Failed to create forum');
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadMessage) return;

    try {
      await axios.post(`/api/forums/${selectedForumId}/thread`, {
        message: newThreadMessage,
      });
      setNewThreadMessage('');
      alert('Thread created successfully');
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread');
    }
  };

  const handleCreateReply = async (threadId: string, replyMessage: string) => {
    if (!replyMessage) return;

    try {
      await axios.post(`/api/forums/reply/${threadId}`, { reply: replyMessage });
      alert('Reply created successfully');
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to create reply');
    }
  };

  return (
    <div>
      <h1>Forums for Course {courseId}</h1>

      {/* Create a new forum */}
      <div>
        <h2>Create a Forum</h2>
        <input
          type="text"
          placeholder="Forum Title"
          value={newForumTitle}
          onChange={(e) => setNewForumTitle(e.target.value)}
        />
        <textarea
          placeholder="Forum Description"
          value={newForumDescription}
          onChange={(e) => setNewForumDescription(e.target.value)}
        />
        <button onClick={handleCreateForum}>Create Forum</button>
      </div>

      {/* List of Forums */}
      <div>
        <h2>Forums</h2>
        {forums.length > 0 ? (
          <ul>
            {forums.map((forum) => (
              <li key={forum._id} onClick={() => setSelectedForumId(forum._id)}>
                {forum.title}
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>No forums found for this course.</p>
            <p>Use the form above to create a new forum.</p>
          </div>
        )}
      </div>

      {/* Threads for the selected forum */}
      {selectedForumId && (
        <div>
          <h2>Threads in this Forum</h2>
          <input
            type="text"
            placeholder="Thread Message"
            value={newThreadMessage}
            onChange={(e) => setNewThreadMessage(e.target.value)}
          />
          <button onClick={handleCreateThread}>Create Thread</button>
          <ul>
            {threads.map((thread) => (
              <li key={thread._id}>
                <p>{thread.message}</p>
                {/* Display replies */}
                <div>
                  {thread.replies.map((reply, index) => (
                    <p key={index}>{reply}</p>
                  ))}
                </div>
                {/* Add reply */}
                <textarea
                  placeholder="Reply to this thread"
                  onBlur={(e) => handleCreateReply(thread._id, e.target.value)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ForumsPage;
