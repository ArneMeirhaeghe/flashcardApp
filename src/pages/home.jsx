// src/pages/home.jsx
import React, { useState } from "react";
import CategorySelection from "../components/CategorySelection/CategorySelection";
import FlashcardQuiz from "../components/FlashcardQuiz/FlashcardQuiz";
import styles from "./home.module.css";

const Home = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [order, setOrder] = useState("sequence");

  const handleStartQuiz = (categories, selectedOrder) => {
    setOrder(selectedOrder);
    setIsQuizStarted(true);
  };

  const handleBackToCategorySelector = () => {
    setIsQuizStarted(false);
  };

  return (
    <div className={styles.homeContainer}>
      <h1>Flashcard App</h1>
      {isQuizStarted ? (
        <FlashcardQuiz
          order={order}
          onBackToCategorySelector={handleBackToCategorySelector}
        />
      ) : (
        <CategorySelection onStartQuiz={handleStartQuiz} />
      )}
    </div>
  );
};

export default Home;
