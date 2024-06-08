// src/context/FlashcardContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchFlashcards } from "../services/flashcardService";

const FlashcardContext = createContext();

export const FlashcardProvider = ({ children }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const loadFlashcards = async () => {
      const data = await fetchFlashcards();
      setFlashcards(data);
    };

    loadFlashcards();
  }, []);

  return (
    <FlashcardContext.Provider
      value={{ flashcards, selectedCategories, setSelectedCategories }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = () => {
  return useContext(FlashcardContext);
};
