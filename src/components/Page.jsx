import React, { useState, useEffect } from "react";
import axios from "axios";
import photo from "../images/Profilee.jpg";
import "../styles/Page.css";
import "../styles/Modal.css"; 
import { motion } from "framer-motion";
import Loading from "./Loading";
const Page = (props) => {
  const myToken = localStorage.getItem("token");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false); 
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [noteToModify, setNoteToModify] = useState({ title: "", content: "" });

  const fetchNotes = () => {
    setLoading(true);
    axios
      .get("https://notes.devlop.tech/api/notes", {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      })
      .then((res) => {
        setNotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, [myToken]);

  const handleAdd = () => {
    if (newNote.title && newNote.content) {
      axios
        .post(
          "https://notes.devlop.tech/api/notes",
          newNote,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        )
        .then(() => {
          fetchNotes();
          setNewNote({ title: "", content: "" });
          setAddModalOpen(false); 
        })
        .catch((err) => console.error("Error adding note:", err));
    } else {
      alert("Please enter a title and content.");
    }
  };

  const handleModify = () => {
    if (noteToModify.title && noteToModify.content) {
      axios
        .put(
          `https://notes.devlop.tech/api/notes/${noteToModify.id}`,
          noteToModify,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        )
        .then(() => {
          fetchNotes();
          setModifyModalOpen(false);
        })
        .catch((err) => console.error("Error modifying note:", err));
    } else {
      alert("Please enter a title and content.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      axios
        .delete(`https://notes.devlop.tech/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        })
        .then(() => {
          fetchNotes();
        })
        .catch((err) => console.error("Error deleting note:", err));
    }
  };

  const toggleUpdate = (id) => {
    setActiveNoteId((prev) => (prev === id ? null : id));
  };

  const openModifyModal = (note) => {
    setNoteToModify(note); 
    setModifyModalOpen(true); 
  };

  const LogOut = () => {
    props.setisConnected(false);
  };

  return (
    <div className="container">
      <div className="leftSide">
        <div className="profile">
          <img className="myImg" src={photo} alt="user" />
          <p>Hello {firstName + " " + lastName}</p>
          <p className="Student">Student</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.3 }}
          className="LogOut"
          onClick={LogOut}
        >
          Log Out
        </motion.button>
      </div>
      <div className="rightSide">
        <div className="NotesList">
          <h2>Notes List</h2>
          <div className="btns">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="Add"
              onClick={() => setAddModalOpen(true)}
            >
              Add New Note
            </motion.button>
          </div>
        </div>
        <div className="Notes">
          <table>
            <thead>
              <tr className="thead">
                <th>Id</th>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                notes.map((note) => (
                  <tr key={note.id}>
                    <td>{note.id}</td>
                    <td>{note.title}</td>
                    <td>{note.content}</td>
                    <td>
                      <motion.button
                        className="Delete update"
                        whileHover={{ scale: 1.3 }}
                        onClick={() => openModifyModal(note)} 
                      >
                        Modify
                      </motion.button>
                      <motion.button
                        className="Delete"
                        whileHover={{ scale: 1.3 }}
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Loading />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Note</h3>
            <input
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
            ></textarea>
            <div className="modal-actions">
              <button onClick={handleAdd}>Add Note</button>
              <button onClick={() => setAddModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      
      {isModifyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modify Note</h3>
            <input
              type="text"
              placeholder="Title"
              value={noteToModify.title}
              onChange={(e) =>
                setNoteToModify({ ...noteToModify, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={noteToModify.content}
              onChange={(e) =>
                setNoteToModify({ ...noteToModify, content: e.target.value })
              }
            ></textarea>
            <div className="modal-actions">
              <button onClick={handleModify}>Save Changes</button>
              <button onClick={() => setModifyModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
