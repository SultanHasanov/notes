// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CardList } from "./components/CardList";
import { CardDetails } from "./components/CardDetails";
import { CompletedCards } from "./components/CompletedCards";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CardList />} />
        <Route path="/card/:id" element={<CardDetails />} />
        <Route path="/completed" element={<CompletedCards />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
