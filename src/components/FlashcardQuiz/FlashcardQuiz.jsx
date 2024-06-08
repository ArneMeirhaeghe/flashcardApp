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
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

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
    } else {
      setQuizFinished(true);
    }
    setShowDescription(false);
    setShowNextButton(false);
    setButtonsDisabled(false);
    clearTimeout(descriptionTimer);
    updateProgress();
  };

  const handleAnswer = (confidence) => {
    console.log(`User knew the answer: ${confidence}`);
    const currentFlashcard = filteredFlashcards[currentFlashcardIndex];
    if (confidence === "knewIt") {
      setShowDescription("green");
      setButtonsDisabled(true);
      const timer = setTimeout(handleNextFlashcard, 3000); // Show description for 3 seconds
      setDescriptionTimer(timer);
    } else if (confidence === "knewSomewhat") {
      setShowDescription("orange");
      setIncorrectQuestions((prev) => [
        ...prev,
        { ...currentFlashcard, confidence },
      ]);
      const timer = setTimeout(() => setShowDescription(false), 5000); // Show description for 5 seconds
      setDescriptionTimer(timer);
    } else if (confidence === "didNotKnow") {
      setShowDescription("red");
      setRepeatQuestions((prev) => [...prev, currentFlashcard]);
      setIncorrectQuestions((prev) => [
        ...prev,
        { ...currentFlashcard, confidence },
      ]);
      setShowNextButton(true);
      console.log("Foute vraag:", currentFlashcard);
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

  if (filteredFlashcards.length === 0 && !quizFinished) {
    return <div>Loading...</div>;
  }

  if (quizFinished) {
    return (
      <div className={styles.quizContainer}>
        <h2>Quiz Voltooid</h2>
        {incorrectQuestions.length === 0 ? (
          <div>
            <p>Joepiee 10 op 10</p>
            <button
              className={styles.backButton}
              onClick={onBackToCategorySelector}
            >
              Ga terug naar het overzicht
            </button>
          </div>
        ) : (
          <div>
            <h2>Overzicht van foute vragen</h2>
            <table className={styles.incorrectQuestionsTable}>
              <thead>
                <tr>
                  <th>Vraag</th>
                  <th>Antwoord</th>
                  <th>Beschrijving</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incorrectQuestions.map((question, index) => (
                  <tr key={index} className={styles[question.confidence]}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td>{question.answer}</td>
                    <td>
                      {question.confidence === "didNotKnow"
                        ? "Wist het niet"
                        : "Wist het ongeveer"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className={styles.backButton}
              onClick={onBackToCategorySelector}
            >
              Ga terug naar het overzicht
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentFlashcard = filteredFlashcards[currentFlashcardIndex];

  return (
    <div className={styles.quizContainer}>
      <button className={styles.backButton} onClick={onBackToCategorySelector}>
        Ga terug naar categorie selector
      </button>
      <h2>Quiz</h2>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}>
          <span className={styles.progressText}>{progress}% voltooid</span>
        </div>
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
                <button
                  onClick={() => handleAnswer("didNotKnow")}
                  disabled={buttonsDisabled}
                >
                  Wist het niet
                </button>
                <button
                  onClick={() => handleAnswer("knewSomewhat")}
                  disabled={buttonsDisabled}
                >
                  Wist het ongeveer
                </button>
                <button
                  onClick={() => handleAnswer("knewIt")}
                  disabled={buttonsDisabled}
                >
                  Wist het
                </button>
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
