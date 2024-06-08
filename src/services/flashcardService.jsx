// src/services/flashcardService.js

export const fetchFlashcards = async () => {
  const response = await fetch("/flashcards.json");
  const data = await response.json();
  return data;
};
