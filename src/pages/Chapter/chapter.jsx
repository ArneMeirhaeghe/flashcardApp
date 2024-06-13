import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useFlashcards } from "../../context/FlashcardContext";
import styles from "./chapter.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import ROUTES from "../../consts/Routes";

const Chapter = () => {
  const { chapterId } = useParams();
  const {
    loadCarts,
    carts,
    getCourseByIdd,
    chapterName,
    updateCardd,
    deleteCardd,
    addCardd,
  } = useFlashcards();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addMode, setAddMode] = useState("line"); // "line" or "json"
  const [currentCard, setCurrentCard] = useState({
    id: "",
    question: "",
    answer: "",
  });
  const [jsonInput, setJsonInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchChapterDetails(chapterId);
    loadCarts(chapterId);
  }, [chapterId]);

  const fetchChapterDetails = async (id) => {
    await getCourseByIdd(id);
  };

  const handleEdit = (card) => {
    setCurrentCard(card);
    setIsEditMode(true);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setCurrentCard({ id: "", question: "", answer: "" });
    setIsEditMode(false);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      deleteCardd(id);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentCard((prevCard) => ({ ...prevCard, [name]: value }));
  };

  const handleSaveCard = async () => {
    if (isEditMode) {
      await updateCardd(currentCard.id, currentCard);
    } else if (addMode === "line") {
      await addCardd(chapterId, currentCard);
    } else {
      const cards = JSON.parse(jsonInput);
      for (const card of cards) {
        await addCardd(chapterId, card);
      }
    }
    loadCarts(chapterId);
    setShowEditModal(false);
  };

  const handleAddModeChange = (e) => {
    setAddMode(e.target.value);
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };
  const handleBackToHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className={styles.chapterCardsContainer}>
      <button className={styles.backButton} onClick={handleBackToHome}>
        Back to Home
      </button>
      <h1>Cards for Chapter: {chapterName}</h1>
      <button className={styles.addButton} onClick={handleAdd}>
        Add Card
      </button>
      {carts.length === 0 ? (
        <p>No cards available</p>
      ) : (
        <table className={styles.cardsTable}>
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((card) => (
              <tr key={card.id}>
                <td>{card.question}</td>
                <td>{card.answer}</td>
                <td>
                  <FaEdit
                    className={styles.icon}
                    onClick={() => handleEdit(card)}
                  />
                  <FaTrash
                    className={styles.icon}
                    onClick={() => handleDelete(card.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showEditModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowEditModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{isEditMode ? "Edit Card" : "Add Card"}</h2>
            <form>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="addMode"
                    value="line"
                    checked={addMode === "line"}
                    onChange={handleAddModeChange}
                  />
                  <span>Add per line</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="addMode"
                    value="json"
                    checked={addMode === "json"}
                    onChange={handleAddModeChange}
                  />
                  <span>Add per JSON</span>
                </label>
              </div>
              {addMode === "line" ? (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="question">Question</label>
                    <input
                      type="text"
                      id="question"
                      name="question"
                      value={currentCard.question}
                      onChange={handleModalChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="answer">Answer</label>
                    <input
                      type="text"
                      id="answer"
                      name="answer"
                      value={currentCard.answer}
                      onChange={handleModalChange}
                      required
                    />
                  </div>
                </>
              ) : (
                <div className={styles.formGroup}>
                  <label htmlFor="jsonInput">JSON Input</label>
                  <textarea
                    id="jsonInput"
                    name="jsonInput"
                    value={jsonInput}
                    onChange={handleJsonInputChange}
                    placeholder={`[
  {
    "question": "Example question 1",
    "answer": "Example answer 1"
  },
  {
    "question": "Example question 2",
    "answer": "Example answer 2"
  }
]`}
                    rows="10"
                    required
                  />
                </div>
              )}
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSaveCard}
              >
                Save
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

export default Chapter;
