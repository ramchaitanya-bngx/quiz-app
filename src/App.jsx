import { useEffect, useState } from "react";
import "./App.css";

const QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    correctOptionIndex: 1,
  },
  {
    id: 2,
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correctOptionIndex: 3,
  },
  {
    id: 3,
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets",
    ],
    correctOptionIndex: 1,
  },
  {
    id: 4,
    question: "Which company developed React?",
    options: ["Google", "Facebook", "Amazon", "Microsoft"],
    correctOptionIndex: 1,
  },
  {
    id: 5,
    question: "Which HTML tag is used for JavaScript?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    correctOptionIndex: 2,
  },
  {
    id: 6,
    question: "Which hook is used for state in React?",
    options: ["useEffect", "useState", "useRef", "useMemo"],
    correctOptionIndex: 1,
  },
  {
    id: 7,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctOptionIndex: 1,
  },
  {
    id: 8,
    question: "Which command creates a React app?",
    options: [
      "npm create-react-app",
      "npm start",
      "npm install react",
      "npm build react",
    ],
    correctOptionIndex: 0,
  },
];

const TOTAL_TIME_SECONDS = 5;

export default function App() {
  const [currentPage, setCurrentPage] = useState("LANDING");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME_SECONDS);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [lastAnswerStatus, setLastAnswerStatus] = useState("idle"); // "correct" | "incorrect" | "timeout" | "idle"

  useEffect(() => {
    if (currentPage !== "QUIZ" || isShowingFeedback) {
      return;
    }

    if (remainingTime === 0) {
      setIsShowingFeedback(true);
      setLastAnswerStatus("timeout");

      const feedbackTimeout = setTimeout(() => {
        moveToNextQuestion();
      }, 800);

      return () => clearTimeout(feedbackTimeout);
    }

    const timerId = setTimeout(() => {
      setRemainingTime((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [remainingTime, currentPage, isShowingFeedback]);

  const startQuiz = () => {
    setCurrentPage("QUIZ");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setRemainingTime(TOTAL_TIME_SECONDS);
    setIsShowingFeedback(false);
    setLastSelectedIndex(null);
    setLastAnswerStatus("idle");
  };

  const handleOptionSelect = (optionIndex) => {
    if (isShowingFeedback) return;

    setSelectedAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestionIndex]: optionIndex,
    }));

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;

    setLastSelectedIndex(optionIndex);
    setLastAnswerStatus(isCorrect ? "correct" : "incorrect");
    setIsShowingFeedback(true);

    setTimeout(() => {
      moveToNextQuestion();
    }, 700);
  };

  const moveToNextQuestion = () => {
    setIsShowingFeedback(false);
    setLastSelectedIndex(null);
    setLastAnswerStatus("idle");

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setRemainingTime(TOTAL_TIME_SECONDS);
    } else {
      setCurrentPage("RESULT");
    }
  };

  const calculateScore = () => {
    let score = 0;

    QUESTIONS.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctOptionIndex) {
        score += 1;
      }
    });

    return score;
  };

  if (currentPage === "LANDING") {
    return (
      <main className="app-shell">
        <section className="quiz-panel">
          <header className="quiz-header">
            <h1 className="quiz-title">Welcome to the Quiz</h1>
            <p className="quiz-subtitle">
              Answer {QUESTIONS.length} questions. You have {TOTAL_TIME_SECONDS} seconds per
              question. Questions will automatically move forward when time is up.
            </p>
          </header>

          <div className="quiz-actions">
            <button type="button" onClick={startQuiz} className="btn btn-primary">
              Start Quiz
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (currentPage === "QUIZ") {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const totalQuestions = QUESTIONS.length;
    const timeProgress = (remainingTime / TOTAL_TIME_SECONDS) * 100;

    return (
      <main className="app-shell">
        <section className="quiz-panel" aria-live="polite">
          <header className="quiz-header">
            <p className="quiz-progress">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
            <h2 className="quiz-question">{currentQuestion.question}</h2>
          </header>

          <div className="quiz-options" role="list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = index === lastSelectedIndex;

              let optionStatusClass = "";
              if (isSelected && lastAnswerStatus === "correct") {
                optionStatusClass = "option-correct";
              } else if (isSelected && lastAnswerStatus === "incorrect") {
                optionStatusClass = "option-incorrect";
              }

              return (
                <button
                  key={index}
                  type="button"
                  role="listitem"
                  onClick={() => handleOptionSelect(index)}
                  disabled={isShowingFeedback}
                  className={`quiz-option ${isSelected ? "quiz-option-selected" : ""} ${optionStatusClass}`}
                  aria-pressed={isSelected}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="quiz-footer">
            <div className="timer">
              <div className="timer-label">
                {lastAnswerStatus === "timeout"
                  ? "Time's up!"
                  : `Time left: ${remainingTime} second${remainingTime === 1 ? "" : "s"}`}
              </div>
              <div className="timer-bar" aria-hidden="true">
                <div
                  className="timer-bar-fill"
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
            </div>

            <p className="quiz-hint">
              Tap an answer to continue. Each question has a limited time.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const finalScore = calculateScore();
  const totalQuestions = QUESTIONS.length;
  const percentage = Math.round((finalScore / totalQuestions) * 100);

  let resultMessage = "Nice work! Keep practicing to improve your score.";
  if (percentage === 100) {
    resultMessage = "Perfect score! Excellent job 🎉";
  } else if (percentage >= 70) {
    resultMessage = "Great job! You're doing really well.";
  } else if (percentage <= 40) {
    resultMessage = "Don't worry—every attempt helps you learn. Try again!";
  }

  return (
    <main className="app-shell">
      <section className="quiz-panel">
        <header className="quiz-header">
          <h1 className="quiz-title">Quiz Completed</h1>
          <p className="quiz-result-score">
            You scored {finalScore} out of {totalQuestions} ({percentage}%)
          </p>
          <p className="quiz-result-message">{resultMessage}</p>
        </header>

        <div className="quiz-actions">
          <button
            type="button"
            onClick={() => setCurrentPage("LANDING")}
            className="btn btn-primary"
          >
            Restart Quiz
          </button>
        </div>
      </section>
    </main>
  );
}
