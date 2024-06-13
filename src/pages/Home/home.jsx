import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFlashcards } from "../../context/FlashcardContext";
import styles from "./home.module.css";
import ROUTES from "../../consts/Routes";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
  const { courses, loading, addCoursee, deleteCoursee, updateCoursee } =
    useFlashcards();
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [currentCourse, setCurrentCourse] = useState({
    id: "",
    name: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleCourseClick = (courseId) => {
    navigate(ROUTES.COURSE.replace(":courseId", courseId));
  };

  const handleCreateCourse = () => {
    setShowAddModal(true);
  };

  const handleAddCourse = async () => {
    try {
      await addCoursee(newCourse);
      setShowAddModal(false);
      setNewCourse({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setShowEditModal(true);
  };

  const handleUpdateCourse = async () => {
    try {
      await updateCoursee(currentCourse);
      setShowEditModal(false);
      setCurrentCourse({ id: "", name: "", description: "" });
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (confirm("Ben je zeker dat je dit wil verwijderen?")) {
      try {
        await deleteCoursee(courseId);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showAddModal) {
      setNewCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
    } else if (showEditModal) {
      setCurrentCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
    }
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 20) {
      return words.slice(0, 20).join(" ") + "...";
    }
    return description;
  };

  const handleMouseEnter = (course) => {
    setHoveredCourse(course);
  };

  const handleMouseLeave = () => {
    setHoveredCourse(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homeContainer}>
      <h1>Courses Overview</h1>
      <button className={styles.addButton} onClick={handleCreateCourse}>
        Create Course
      </button>
      <div className={styles.coursesList}>
        {courses.map((course) => (
          <div
            key={course.id}
            className={styles.courseCard}
            onMouseEnter={() => handleMouseEnter(course)}
            onMouseLeave={() => handleMouseLeave(course)}
          >
            <h2 onClick={() => handleCourseClick(course.id)}>{course.name}</h2>
            <p onClick={() => handleCourseClick(course.id)}>
              {truncateDescription(course.description)}
            </p>
            <div className={styles.cardActions}>
              <FaEdit
                className={styles.icon}
                onClick={() => handleEditCourse(course)}
              />
              <FaTrash
                className={styles.icon}
                onClick={() => handleDeleteCourse(course.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Create Course</h2>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCourse.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="button"
                className={styles.addCourseButton}
                onClick={handleAddCourse}
              >
                Add to Courses
              </button>
            </form>
            <button
              className={styles.closeButton}
              onClick={() => setShowAddModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowEditModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Edit Course</h2>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentCourse.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={currentCourse.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="button"
                className={styles.addCourseButton}
                onClick={handleUpdateCourse}
              >
                Update Course
              </button>
            </form>
            <button
              className={styles.closeButton}
              onClick={() => setShowEditModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
