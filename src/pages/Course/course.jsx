import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFlashcards } from "../../context/FlashcardContext";
import styles from "./course.module.css";
import ROUTES from "../../consts/Routes";
import { FaEdit, FaTrash } from "react-icons/fa";

const Course = () => {
  const { courseId } = useParams();
  const {
    chapters,
    loadChapters,
    loading,
    addChapterr,
    deleteChapterr,
    updateChapterr,
  } = useFlashcards();
  const [showModal, setShowModal] = useState(false);
  const [newChapter, setNewChapter] = useState({
    name: "",
    courseID: courseId,
  });
  const [editChapter, setEditChapter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadChapters(courseId);
  }, [courseId]);

  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleStartQuiz = () => {
    console.log("Start quiz for course:", courseId);
    // Add your logic to start the quiz
  };

  const handleAddChapter = async () => {
    try {
      await addChapterr(courseId, newChapter);
      setShowModal(false);
      setNewChapter({ name: "", courseID: courseId });
      loadChapters(courseId); // Reload chapters after adding a new one
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleEditChapter = (chapter) => {
    setEditChapter(chapter);
    setNewChapter({ name: chapter.name, courseID: courseId });
    setShowModal(true);
  };

  const handleUpdateChapter = async () => {
    try {
      await updateChapterr(editChapter.id, newChapter);
      setShowModal(false);
      setNewChapter({ name: "", courseID: courseId });
      setEditChapter(null);
      loadChapters(courseId); // Reload chapters after editing
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      try {
        await deleteChapterr(courseId, chapterId);
        loadChapters(courseId); // Reload chapters after deleting
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChapter((prevChapter) => ({ ...prevChapter, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.courseContainer}>
      <button className={styles.backButton} onClick={handleBackToHome}>
        Back to Home
      </button>
      <h1>Chapters Overview</h1>
      <button className={styles.addButton} onClick={() => setShowModal(true)}>
        Add Chapter
      </button>
      <table className={styles.chaptersTable}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => (
            <tr key={chapter.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <Link
                  to={`/chapter/${chapter.id}`}
                  className={styles.chapterLink}
                >
                  {chapter.name}
                </Link>
              </td>
              <td>
                <FaEdit
                  className={styles.icon}
                  onClick={() => handleEditChapter(chapter)}
                />
                <FaTrash
                  className={styles.icon}
                  onClick={() => handleDeleteChapter(chapter.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.startQuizButton} onClick={handleStartQuiz}>
        Start Quiz
      </button>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editChapter ? "Edit Chapter" : "Add Chapter"}</h2>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newChapter.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="button"
                className={styles.addChapterButton}
                onClick={editChapter ? handleUpdateChapter : handleAddChapter}
              >
                {editChapter ? "Update Chapter" : "Add Chapter"}
              </button>
            </form>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
