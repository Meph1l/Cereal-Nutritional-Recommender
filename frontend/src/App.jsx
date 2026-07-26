import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PreferenceForm from "./components/PreferenceForm";
import RecommendationList from "./components/RecommendationList";
import LoadingMessage from "./components/LoadingMessage";
import ErrorMessage from "./components/ErrorMessage";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import { useEffect } from "react";

const mfrNameMap = {
  A: 'American Home Food Products',
  G: 'General Mills',
  K: 'Kelloggs',
  N: 'Nabisco',
  P: 'Post',
  Q: 'Quaker Oats',
  R: 'Ralston Purina'
}

function App() {

  // Store the user's nutritional preferences
  const [preferences, setPreferences] = useState({
    goal: "",
    maxSugar: "",
    minimumProtein: "",
    minimumFiber: "",
  });

  // Store recommendation results
  const [recommendations, setRecommendations] = useState([]);

  // Control loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update the matching form input
  function handleInputChange(event) {
    const { name, value } = event.target;

    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      [name]: value,
    }));
  }

  // Submit nutritional preferences
  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      console.log("submit function called");
      const response = await fetch("/api/sendQuestionToChatgpt", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Recommendation request failed.");
      }

      const data = await response.json();
      console.log(data);
      setRecommendations(data.recommendations || []);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "The backend is not connected yet. Your preferences were saved, but recommendations cannot be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />

        <PreferenceForm
          preferences={preferences}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {loading && <LoadingMessage />}

        <ErrorMessage message={error} />

        <RecommendationList recommendations={recommendations} />

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;