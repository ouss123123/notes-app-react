import axios from "axios";
import "../styles/Page.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Update = ({ id, fetchNotes, isOpen, toggleUpdate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const myToken = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`https://notes.devlop.tech/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${myToken}` },
        })
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch((error) => {
          console.error("Error fetching note:", error);
        });
    }
  }, [id, isOpen, myToken]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `https://notes.devlop.tech/api/notes/${id}`,
        { title: title.trim(), content: content.trim() },
        {
          headers: { Authorization: `Bearer ${myToken}` },
        }
      );
      alert("Note updated successfully!");
      fetchNotes(); 
      toggleUpdate(null);
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Error updating note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isOpen && (
      <motion.div
        className="update-container"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="update-card">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
          <textarea
            placeholder="Description"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          ></textarea>
          <div>
            <button onClick={handleUpdate} className="update-btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button onClick={() => toggleUpdate(null)} className="cancel-btn" disabled={isLoading}>
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default Update;
