// src/components/CategorySelection/CategorySelection.jsx
import React, { useState, useEffect } from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import styles from "./CategorySelection.module.css";

const CategorySelection = ({ onStartQuiz }) => {
  const { flashcards, setSelectedCategories } = useFlashcards();
  const categories = Object.keys(flashcards.anatomy || {});
  const [localSelectedCategories, setLocalSelectedCategories] = useState([]);
  const [order, setOrder] = useState("sequence");
  const [error, setError] = useState("");

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedCategories = checked
      ? [...localSelectedCategories, name]
      : localSelectedCategories.filter((category) => category !== name);
    setLocalSelectedCategories(updatedCategories);
    if (updatedCategories.length > 0) {
      setError("");
    }
  };

  const handleStartQuiz = () => {
    if (localSelectedCategories.length === 0) {
      setError("Selecteer minstens één categorie om de quiz te starten.");
    } else {
      setSelectedCategories(localSelectedCategories);
      onStartQuiz(localSelectedCategories, order);
    }
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h2>Selecteer categorieën</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form>
        {categories.map((category) => (
          <div key={category}>
            <label>
              <input
                type="checkbox"
                name={category}
                onChange={handleCheckboxChange}
              />
              {category}
            </label>
          </div>
        ))}
        <div>
          <label>
            <input
              type="radio"
              name="order"
              value="sequence"
              checked={order === "sequence"}
              onChange={handleOrderChange}
            />
            Volgorde
          </label>
          <label>
            <input
              type="radio"
              name="order"
              value="random"
              checked={order === "random"}
              onChange={handleOrderChange}
            />
            Willekeurig
          </label>
        </div>
      </form>
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default CategorySelection;
