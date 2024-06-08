// src/components/FlashcardQuiz/FlashcardQuiz.jsx
import React, { useEffect, useState } from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import styles from "./FlashcardQuiz.module.css";

const FlashcardQuiz = ({ order, onBackToCategorySelector }) => {
  const { flashcards, selectedCategories } = useFlashcards();
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionTimer, setDescriptionTimer] = useState(null);
  const [repeatQuestions, setRepeatQuestions] = useState([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgressMessage, setShowProgressMessage] = useState(false);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const quizFlashcards = selectedCategories.flatMap((category) => {
        const subCategories = flashcards.anatomy[category] || {};
        return Object.entries(subCategories).map(([key, value]) => ({
          question: key,
          answer: value.description,
        }));
      });

      if (order === "random") {
        setFilteredFlashcards(quizFlashcards.sort(() => Math.random() - 0.5));
      } else {
        setFilteredFlashcards(quizFlashcards);
      }
    }
  }, [selectedCategories, flashcards, order]);

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < filteredFlashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
    } else if (repeatQuestions.length > 0) {
      setFilteredFlashcards(repeatQuestions);
      setRepeatQuestions([]);
      setCurrentFlashcardIndex(0);
    }
    setShowDescription(false);
    setShowNextButton(false);
    clearTimeout(descriptionTimer);
    updateProgress();
  };

  const handleAnswer = (confidence) => {
    console.log(`User knew the answer: ${confidence}`);
    if (confidence === "knewIt") {
      setShowDescription("green");
      const timer = setTimeout(handleNextFlashcard, 3000); // Show description for 3 seconds
      setDescriptionTimer(timer);
    } else if (confidence === "knewSomewhat") {
      setShowDescription("orange");
      const timer = setTimeout(() => setShowDescription(false), 5000); // Show description for 5 seconds
      setDescriptionTimer(timer);
    } else if (confidence === "didNotKnow") {
      setShowDescription("red");
      setRepeatQuestions([
        ...repeatQuestions,
        filteredFlashcards[currentFlashcardIndex],
      ]);
      setShowNextButton(true);
      console.log("Foute vraag:", filteredFlashcard);
    }
  };

  const updateProgress = () => {
    const totalQuestions = filteredFlashcards.length + repeatQuestions.length;
    const currentProgress = Math.floor(
      ((currentFlashcardIndex + 1) / totalQuestions) * 100
    );
    setProgress(currentProgress);
    if (currentProgress % 10 === 0) {
      setShowProgressMessage(true);
      setTimeout(() => setShowProgressMessage(false), 2000);
    }
  };

  if (filteredFlashcards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = filteredFlashcards[currentFlashcardIndex];

  return (
    <div className={styles.quizContainer}>
      <button className={styles.backButton} onClick={onBackToCategorySelector}>
        Ga terug naar categorie selector
      </button>
      <h2>Quiz</h2>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showProgressMessage && (
        <div className={styles.progressMessage}>
          Jooeeepppieee al {progress}%
        </div>
      )}
      {currentFlashcard ? (
        <div
          className={`${styles.flashcard} ${
            showDescription ? styles[showDescription] : ""
          }`}
        >
          <p>
            <strong>{currentFlashcard.question}</strong>
          </p>
          {(showDescription || showDescription === "red") && (
            <p>{currentFlashcard.answer}</p>
          )}
          <div className={styles.buttons}>
            {showNextButton ? (
              <button onClick={handleNextFlashcard}>Volgende vraag</button>
            ) : (
              <>
                <button onClick={() => handleAnswer("didNotKnow")}>
                  Wist het niet
                </button>
                <button onClick={() => handleAnswer("knewSomewhat")}>
                  Wist het ongeveer
                </button>
                <button onClick={() => handleAnswer("knewIt")}>Wist het</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>Je hebt de quiz voltooid!</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardQuiz;
