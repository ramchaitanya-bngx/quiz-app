import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (currentPage !== "QUIZ") {
      return;
    }

    if (remainingTime === 0) {
      moveToNextQuestion();
      return;
    }

    const timerId = setTimeout(() => {
      setRemainingTime((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [remainingTime, currentPage]);

  const startQuiz = () => {
    setCurrentPage("QUIZ");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setRemainingTime(TOTAL_TIME_SECONDS);
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestionIndex]: optionIndex,
    }));

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Welcome to the Quiz</h1>
        <button
          onClick={startQuiz}
          className="px-6 py-2 rounded-xl bg-black text-white"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (currentPage === "QUIZ") {
    const currentQuestion = QUESTIONS[currentQuestionIndex];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </h2>

        <p className="text-lg text-center">{currentQuestion.question}</p>

        <div className="grid grid-cols-1 gap-3 w-full max-w-md">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className="px-4 py-2 border rounded-xl hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600">
          Time left: {remainingTime} seconds
        </p>
      </div>
    );
  }

  const finalScore = calculateScore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Quiz Completed</h1>
      <p className="text-lg">
        Your Score: {finalScore} / {QUESTIONS.length}
      </p>

      <button
        onClick={() => setCurrentPage("LANDING")}
        className="px-6 py-2 rounded-xl bg-black text-white"
      >
        Restart Quiz
      </button>
    </div>
  );
}
