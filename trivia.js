document.addEventListener('DOMContentLoaded', () => {
  const questionElement = document.getElementById('question');
  const optionsContainer = document.querySelector('.options');
  const feedbackElement = document.getElementById('feedback');
  const backToHomeButton = document.getElementById('back-to-home');
  const finalScoreDisplay = document.getElementById('final-score-display'); // Nuevo

  let currentQuestionIndex = 0;
  let correctAnswersCount = 0; // Variable para el puntaje

  const questions = [
    {
      question: "¿Qué tipo de orquídea se plantó?",
      options: {
        a: "Dendrobium",
        b: "Cymbidium",
        c: "Phalaenopsis",
        d: "Cattleya",
      },
      correctAnswer: "c",
    },
    {
      question: "¿De qué color era la orquídea dominante?",
      options: {
        a: "Amarillo",
        b: "Morado",
        c: "Azul",
        d: "Blanco",
      },
      correctAnswer: "d",
    },
    {
      question: "¿Qué tipo de técnica se usó para cruzar las plantas?",
      options: {
        a: "Injerto",
        b: "Polinización cruzada",
        c: "Esqueje",
        d: "Cultivo in vitro",
      },
      correctAnswer: "a",
    },
  ];

  function loadQuestion() {
    const q = questions[currentQuestionIndex];
    questionElement.textContent = q.question;
    optionsContainer.innerHTML = ''; // Limpiar opciones anteriores
    for (const key in q.options) {
      const button = document.createElement('button');
      button.classList.add('option-btn');
      button.dataset.option = key;
      button.textContent = `${key.toUpperCase()}. ${q.options[key]}`;
      optionsContainer.appendChild(button);
    }
    feedbackElement.textContent = '';
    feedbackElement.classList.remove('show', 'correct', 'incorrect');
    finalScoreDisplay.textContent = ''; // Limpiar el puntaje final al cargar nueva pregunta
    // Habilitar todos los botones para la nueva pregunta
    Array.from(optionsContainer.children).forEach(button => {
      button.disabled = false;
      button.classList.remove('correct', 'incorrect', 'correct-answer-reveal');
    });
  }

  optionsContainer.addEventListener('click', (event) => {
    const selectedButton = event.target.closest('.option-btn');
    if (selectedButton) {
      const selectedOption = selectedButton.dataset.option;
      const currentQuestion = questions[currentQuestionIndex];

      // Deshabilitar todos los botones después de una selección
      Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
      });

      if (selectedOption === currentQuestion.correctAnswer) {
        selectedButton.classList.add('correct');
        feedbackElement.textContent = '¡Correcto!';
        feedbackElement.style.color = 'green';
        correctAnswersCount++; // Incrementar el puntaje
      } else {
        selectedButton.classList.add('incorrect');
        feedbackElement.textContent = `Incorrecto. La respuesta correcta era la ${currentQuestion.correctAnswer.toUpperCase()}.`;
        feedbackElement.style.color = 'red';
        // Resaltar la respuesta correcta
        document.querySelector(`.option-btn[data-option="${currentQuestion.correctAnswer}"]`).classList.add('correct-answer-reveal');
      }
      feedbackElement.classList.add('show');

      // Cargar la siguiente pregunta después de un breve retraso
      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          loadQuestion();
        } else {
          // Todas las preguntas respondidas, mostrar puntaje final
          questionElement.textContent = "¡Has completado la trivia!";
          optionsContainer.innerHTML = '';
          feedbackElement.textContent = '';
          feedbackElement.classList.remove('show');
          finalScoreDisplay.textContent = `Tu puntaje final es: ${correctAnswersCount} de ${questions.length}`; // Mostrar el puntaje en el nuevo elemento
          finalScoreDisplay.classList.add('show-score'); // Añadir clase para animación
        }
      }, 2000); // 2 segundos de retraso
    }
  });

  backToHomeButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Cargar la primera pregunta al iniciar
  loadQuestion();
});