// src/App.jsx
import React from "react";
import Home from "./pages/home";
import { FlashcardProvider } from "./context/FlashcardContext";
import "./App.css";

function App() {
  return (
    <FlashcardProvider>
      <div className="App">
        <Home />
      </div>
    </FlashcardProvider>
  );
}

export default App;
