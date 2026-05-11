document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript is connected!");

  // --- Toggle buttons for articles ---
  const toggleButtons = document.querySelectorAll(".toggle-details");

  toggleButtons.forEach((btn) => {
    const detailsId = btn.getAttribute("aria-controls");
    const details = document.querySelector("#" + detailsId);
    if (!btn || !details) return;

    btn.addEventListener("click", () => {
      const isHidden = details.hasAttribute("hidden");
      if (isHidden) {
        details.removeAttribute("hidden");
        btn.textContent = "Hide details";
        btn.setAttribute("aria-expanded", "true");
      } else {
        details.setAttribute("hidden", "");
        btn.textContent = "Show details";
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // --- Pathology Quiz ---

  const questions = [
    {
      text: "What does H&E stand for in histology?",
      options: [
        "Haematoxylin and Eosin",
        "Hydrogen and Enzyme",
        "Histology and Evaluation",
        "Haemoglobin and Elastin"
      ],
      correct: 0
    },
    {
      text: "What is the term for programmed cell death?",
      options: [
        "Necrosis",
        "Mitosis",
        "Apoptosis",
        "Fibrosis"
      ],
      correct: 2
    },
    {
      text: "Which cell type is primarily responsible for producing collagen in fibrosis?",
      options: [
        "Neutrophil",
        "Fibroblast",
        "Erythrocyte",
        "Macrophage"
      ],
      correct: 1
    },
    {
      text: "What does 'benign' mean when describing a tumour?",
      options: [
        "Rapidly spreading to other tissues",
        "Caused by infection",
        "Non-invasive and not cancerous",
        "Found only in bone"
      ],
      correct: 2
    },
    {
      text: "What is a biopsy?",
      options: [
        "A type of medical imaging scan",
        "A blood test for infection markers",
        "A sample of tissue taken for examination",
        "A surgical procedure to remove a tumour"
      ],
      correct: 2
    }
  ];

  const feedbackMessages = [
    "Correct",
    "Not quite. Have a look at the correct answer below.",
    "Please select an answer before submitting."
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const questionNumber = document.querySelector("#question-number");
  const questionText   = document.querySelector("#question-text");
  const optionsContainer = document.querySelector("#options-container");
  const feedback       = document.querySelector("#feedback");
  const submitBtn      = document.querySelector("#submit-btn");
  const nextBtn        = document.querySelector("#next-btn");
  const quizResult     = document.querySelector("#quiz-result");
  const resultText     = document.querySelector("#result-text");
  const restartBtn     = document.querySelector("#restart-btn");

  function loadQuestion() {
    answered = false;
    feedback.textContent = "";
    nextBtn.setAttribute("hidden", "");
    submitBtn.removeAttribute("hidden");

    const q = questions[currentQuestion];
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    questionText.textContent = q.text;

    optionsContainer.innerHTML = "";
    q.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.classList.add("quiz-option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "quiz-answer";
      input.value = index;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + option));
      optionsContainer.appendChild(label);
    });
  }

  function checkAnswer() {
    const selected = document.querySelector("input[name='quiz-answer']:checked");

    if (!selected) {
      feedback.textContent = feedbackMessages[2];
      return;
    }

    if (answered) return;
    answered = true;

    const userAnswer = parseInt(selected.value);
    const correct = questions[currentQuestion].correct;

    if (userAnswer === correct) {
      score++;
      feedback.textContent = "✅ " + feedbackMessages[0];
    } else {
      feedback.textContent = "❌ " + feedbackMessages[1] + " (" + questions[currentQuestion].options[correct] + ")";
    }

    submitBtn.setAttribute("hidden", "");
    nextBtn.removeAttribute("hidden");
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    document.querySelector("#quiz-container > *:not(#quiz-result)") ;
    questionNumber.setAttribute("hidden", "");
    questionText.setAttribute("hidden", "");
    optionsContainer.setAttribute("hidden", "");
    feedback.textContent = "";
    document.querySelector("#quiz-controls").setAttribute("hidden", "");

    quizResult.removeAttribute("hidden");
    resultText.textContent = `You scored ${score} out of ${questions.length}. ${getResultMessage()}`;
  }

  function getResultMessage() {
    if (score === 5) return "Excellent — full marks!";
    if (score >= 3) return "Good effort — review any you missed.";
    return "Keep exploring — pathology takes time to learn.";
  }

  function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;

    questionNumber.removeAttribute("hidden");
    questionText.removeAttribute("hidden");
    optionsContainer.removeAttribute("hidden");
    document.querySelector("#quiz-controls").removeAttribute("hidden");
    quizResult.setAttribute("hidden", "");

    loadQuestion();
  }

  submitBtn.addEventListener("click", checkAnswer);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", resetQuiz);

  loadQuestion();
});