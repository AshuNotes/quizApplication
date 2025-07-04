// Import the questions array from questions.js
import { questions } from "./questions.js";

// Track the current question index and user answers
let currentIndex = 0;
const userAnswers = Array(questions.length).fill(null);

// Get references to DOM elements for updating UI
const questionText = document.querySelector(".question");
const optionButtons = document.querySelector(".options");
const questionCounter = document.querySelector(".question-counter");
const prevBtn = document.querySelector(
  ".buttons-container button:nth-child(1)"
);
const submitBtn = document.querySelector(
  ".buttons-container button:nth-child(2)"
);
const nextBtn = document.querySelector(
  ".buttons-container button:nth-child(3)"
);
const endBtn = document.querySelector(".footer button");

let score = 0; // Track user's score
let timer; // Timer interval reference
let timeLeft = 60; // Time left for each question

// Update the timer display in the UI
let updateTimerDisplay = () => {
  const timerEl = document.getElementById("timer");
  const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const sec = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${min}:${sec}`;
};

// Start the countdown timer for the current question
let startTimer = () => {
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 0) {
      clearInterval(timer);
      handleSubmit(); // Auto-submit if time runs out
    }
  }, 1000);
};

// Load a question and its options into the UI
let loadQuestion = (index) => {
  clearInterval(timer);
  timeLeft = 60;
  updateTimerDisplay();
  startTimer();

  const q = questions[index];
  questionText.textContent = q.question;
  questionCounter.textContent = `${q.number} of ${questions.length} Questions`;

  optionButtons.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;

    // Highlight if this option is selected
    if (userAnswers[index] === opt) {
      btn.style.backgroundColor = "#d7ecff";
    }

    // If already submitted, disable options and show correct/incorrect
    if (userAnswers[index] !== null && typeof userAnswers[index] !== "string") {
      btn.disabled = true;
      if (opt === q.answer) {
        btn.style.backgroundColor = "#c8f7c5";
      } else if (opt === userAnswers[index].selected) {
        btn.style.backgroundColor = "#f7c5c5";
      }
    }

    // When an option is clicked, select it (but don't submit yet)
    btn.addEventListener("click", () => {
      if (
        userAnswers[index] === null ||
        typeof userAnswers[index] === "string"
      ) {
        document.querySelectorAll(".option").forEach((b) => {
          b.style.backgroundColor = "";
        });
        btn.style.backgroundColor = "#d7ecff";
        userAnswers[index] = opt;
      }
    });

    optionButtons.appendChild(btn);
  });
};

// Handle submission of the current answer (either by user or timer)
function handleSubmit() {
  const currentQ = questions[currentIndex];
  const selectedOption = userAnswers[currentIndex];

  // If nothing selected or already submitted, do nothing
  if (
    selectedOption === null ||
    (typeof selectedOption !== "string" && selectedOption !== null)
  ) {
    return;
  }

  // Mark as submitted
  userAnswers[currentIndex] = { selected: selectedOption, submitted: true };

  // Show correct/incorrect and disable options
  const options = document.querySelectorAll(".option");
  options.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === currentQ.answer) {
      btn.style.backgroundColor = "#c8f7c5";
    } else if (btn.textContent === selectedOption) {
      btn.style.backgroundColor = "#f7c5c5";
    }
  });

  // Update score if correct
  if (selectedOption === currentQ.answer) {
    score++;
  }

  clearInterval(timer);
}

// Navigation: Previous question
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion(currentIndex);
  }
});

// Navigation: Next question
nextBtn.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
  }
});

// Submit button: submit current answer
submitBtn.addEventListener("click", () => {
  handleSubmit();
});

// End Quiz button: show results and hide quiz UI
endBtn.addEventListener("click", () => {
  clearInterval(timer);

  // Hide quiz and footer
  document.querySelector(".main").style.display = "none";
  document.querySelector(".footer").style.display = "none";

  // Build results summary HTML
  let resultsHTML = `<h2>Quiz Results</h2>`;
  resultsHTML += `<p>Your Score: <strong>${score} / ${questions.length}</strong></p>`;
  resultsHTML += `<ol>`;
  questions.forEach((q, i) => {
    const userAns = userAnswers[i]?.selected || userAnswers[i] || "No answer";
    const correct = userAns === q.answer;
    resultsHTML += `<li>
      <strong>${q.question}</strong><br>
      Your answer: <span class="user-answer ${
        correct ? "correct" : "incorrect"
      }">${userAns}</span><br>
      Correct answer: <span class="correct">${q.answer}</span>
    </li>`;
  });
  resultsHTML += `</ol>`;

  // Show results
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = resultsHTML;
  resultsDiv.style.display = "block";
});

// Load the first question on page load
loadQuestion(currentIndex);
