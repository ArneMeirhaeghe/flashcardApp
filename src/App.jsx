// src/App.jsx
import React from "react";
import { FlashcardProvider } from "./context/FlashcardContext";
import "./App.css";
import Autentication from "./pages/Authentication/Autentication";
function App() {
  return (
    <FlashcardProvider>
      <div className="App"></div>
      <Autentication />
    </FlashcardProvider>
  );
}

export default App;
