/*
 * BASES DE DADOS
 *
 * Para adicionar um assunto, crie uma nova propriedade
 * dentro de "topics", seguindo a mesma estrutura.
 */

const topics = {
  directions: {
    name: "Direções",
    description: "Aprenda a indicar posições e caminhos.",
    vocabulary: [
      { italian: "Destra", portuguese: ["direita", "direito"] },
      { italian: "Sinistra", portuguese: ["esquerda", "esquerdo"] },
      { italian: "Dritto", portuguese: ["direto", "reto", "em frente"] },
      { italian: "Vicino", portuguese: ["perto", "próximo", "próxima"] },
      { italian: "Lontano", portuguese: ["longe", "distante"] },
      { italian: "Qui", portuguese: ["aqui"] },
      { italian: "Lì", portuguese: ["ali", "alí"] },
      { italian: "Sopra", portuguese: ["acima", "em cima", "sobre"] },
      { italian: "Sotto", portuguese: ["abaixo", "embaixo", "debaixo"] }
    ]
  },

  clothing: {
    name: "Peças de roupa",
    description: "Conheça nomes de roupas e acessórios.",
    vocabulary: [
      { italian: "Maglietta", portuguese: ["camiseta"] },
      { italian: "Camicia", portuguese: ["camisa"] },
      { italian: "Pantalone", portuguese: ["calça", "calcas", "calças"] },
      { italian: "Jeans", portuguese: ["jeans"] },
      { italian: "Gonna", portuguese: ["saia"] },
      { italian: "Vestito", portuguese: ["vestido"] },
      { italian: "Giacca", portuguese: ["jaqueta"] },
      { italian: "Cappotto", portuguese: ["casaco", "sobretudo"] },
      {
        italian: "Maglione",
        portuguese: ["suéter", "sueter", "blusão", "pulôver", "pulover"]
      },
      { italian: "Calzino", portuguese: ["meia", "meias"] },
      { italian: "Scarpe", portuguese: ["sapato", "sapatos"] },
      { italian: "Stivali", portuguese: ["bota", "botas"] },
      { italian: "Cappello", portuguese: ["chapéu", "chapeu"] },
      { italian: "Sciarpa", portuguese: ["cachecol"] },
      { italian: "Guanti", portuguese: ["luva", "luvas"] },
      { italian: "Cintura", portuguese: ["cinto"] },
      { italian: "Borsa", portuguese: ["bolsa"] },
      { italian: "Zaino", portuguese: ["mochila"] },
      { italian: "Occhiali", portuguese: ["óculos", "oculos"] },
      { italian: "Orologio", portuguese: ["relógio", "relogio"] },
      { italian: "Collana", portuguese: ["colar"] },
      { italian: "Braccialetto", portuguese: ["pulseira"] }
    ]
  },

  foods: {
    name: "Comidas",
    description: "Aprenda sobre comidas e bebidas",
    vocabulary: [
      { italian: "mela", portuguese: ["maçã"] },
      { italian: "banana", portuguese: ["banana"] },
      { italian: "uva", portuguese: ["uva"] },
      { italian: "arancia", portuguese: ["laranja"] },
      { italian: "pera", portuguese: ["pera"] },
      { italian: "fragola", portuguese: ["morango"] },
      { italian: "mirtillo", portuguese: ["mirtilo"] },
    ]
  },
};

/*
 * ELEMENTOS DA INTERFACE
 */

const selectionScreen = document.querySelector("#selection-screen");
const topicList = document.querySelector("#topic-list");
const playScreen = document.querySelector("#play-screen");
const endScreen = document.querySelector("#end-screen");
const statsElement = document.querySelector(".stats");

const wordElement = document.querySelector("#word");
const answerInput = document.querySelector("#answer");
const answerForm = document.querySelector("#answer-form");
const feedback = document.querySelector("#feedback");

const submitButton = document.querySelector("#submit-btn");
const skipButton = document.querySelector("#skip-btn");
const stopButton = document.querySelector("#stop-btn");
const backButton = document.querySelector("#back-btn");

const restartButton = document.querySelector("#restart-btn");
const topicsButton = document.querySelector("#topics-btn");

const roundLabel = document.querySelector("#round-label");
const progressPercent = document.querySelector("#progress-percent");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector("#progress-track");
const topicLabel = document.querySelector("#topic-label");
const finalMessage = document.querySelector("#final-message");

const resultTopic = document.querySelector("#result-topic");
const resultTotal = document.querySelector("#result-total");
const resultCorrect = document.querySelector("#result-correct");
const resultWrong = document.querySelector("#result-wrong");
const resultPercentage = document.querySelector("#result-percentage");


/*
 * ESTADO DO JOGO
 */

let selectedTopic = null;
let questions = [];
let currentIndex = 0;
let round = 1;
let correct = 0;
let wrong = 0;
let correctTimer = 500;
let wrongTimer = 2000;
let nextQuestionTimer = 0;
let answered = false;
let lastItalian = null;
let transitionTimer = null;

/*
 * FUNÇÕES AUXILIARES
 */

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalize(text) {
  return text
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/*
 * SELEÇÃO DE ASSUNTOS
 */

function renderTopics() {
  topicList.replaceChildren();

  for (const [topicId, topic] of Object.entries(topics)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "topic-card";
    button.dataset.topic = topicId;

    const info = document.createElement("span");
    info.className = "topic-info";

    const img = document.createElement("img");
    img.className = "topic-image";
    img.src = `./img/topic-${topicId}.jpg`;

    const name = document.createElement("span");
    name.className = "topic-name";
    name.textContent = topic.name;

    const description = document.createElement("span");
    description.className = "topic-description";
    description.textContent = topic.description;

    const count = document.createElement("span");
    count.className = "topic-count";
    count.textContent = `${topic.vocabulary.length} palavras`;

    info.append(name, description);
    button.append(img, info, count);

    topicList.append(button);
  }
}

function selectTopic(topicId) {
  if (!Object.hasOwn(topics, topicId)) {
    return;
  }

  selectedTopic = topicId;
  startGame();
}

function showTopicSelection() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  selectedTopic = null;

  selectionScreen.hidden = false;
  playScreen.hidden = true;
  endScreen.hidden = true;
  statsElement.hidden = true;
}

/*
 * PLACAR E PROGRESSO
 */

function updateStats() {
  document.querySelector("#correct-count").textContent = correct;
  document.querySelector("#wrong-count").textContent = wrong;

  const attempted = correct + wrong;
  const percentage = attempted ? Math.round((correct / attempted) * 100) : 0;

  document.querySelector("#score-percent").textContent = `${percentage}%`;
}

function updateProgress() {
  const total = questions.length;
  const percent = Math.round((currentIndex / total) * 100);

  roundLabel.textContent = `Palavra ${currentIndex + 1} de ${total} · Rodada ${round}`;

  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", percent);
}

/*
 * FLUXO DA PARTIDA
 */

function nextQuestion() {
  if (currentIndex >= questions.length) {
    questions = shuffle(topics[selectedTopic].vocabulary);

    // Evita repetir imediatamente a última palavra da rodada anterior.
    if (questions.length > 1 && questions[0].italian === lastItalian) {
      [questions[0], questions[1]] = [questions[1], questions[0]];
    }

    currentIndex = 0;
    round++;
  }

  showQuestion();
}

function showQuestion() {
  answered = false;

  const question = questions[currentIndex];

  wordElement.textContent = question.italian;
  answerInput.value = "";
  answerInput.disabled = false;

  submitButton.disabled = false;
  submitButton.textContent = "Responder";

  skipButton.disabled = false;
  stopButton.disabled = false;

  feedback.className = "feedback";
  feedback.textContent = "Digite sua resposta e pressione Enter.";

  updateProgress();
  answerInput.focus();
}

function scheduleNextQuestion() {
  transitionTimer = window.setTimeout(() => {
    transitionTimer = null;

    lastItalian = questions[currentIndex].italian;
    currentIndex++;

    nextQuestion();
  }, nextQuestionTimer);
}

/*
 * RESPOSTAS
 */

function submitAnswer(event) {
  event.preventDefault();

  if (answered) return;

  const value = normalize(answerInput.value);

  if (!value) {
    feedback.className = "feedback error";
    feedback.textContent = "Digite uma tradução antes de responder.";

    answerInput.focus();
    return;
  }

  answered = true;

  const question = questions[currentIndex];
  const accepted = question.portuguese.map(normalize);

  answerInput.disabled = true;
  submitButton.disabled = true;
  skipButton.disabled = true;

  if (accepted.includes(value)) {
    correct++;
    nextQuestionTimer = correctTimer;

    feedback.className = "feedback success";
    feedback.textContent = "Correto! Muito bem.";
  } else {
    wrong++;
    nextQuestionTimer = wrongTimer;

    feedback.className = "feedback error";
    feedback.textContent =
      `Não foi dessa vez. "${question.italian}" significa: ` +
      `${question.portuguese[0]}.`;
  }

  updateStats();
  scheduleNextQuestion();
}

function skipQuestion() {
  if (answered) return;

  answered = true;
  wrong++;
  nextQuestionTimer = wrongTimer;

  const question = questions[currentIndex];

  feedback.className = "feedback error";
  feedback.textContent =
    `Palavra pulada. "${question.italian}" significa: ` +
    `${question.portuguese[0]}.`;

  answerInput.disabled = true;
  submitButton.disabled = true;
  skipButton.disabled = true;

  updateStats();
  scheduleNextQuestion();
}

/*
 * ENCERRAMENTO
 */


function stopGame() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  answered = true;

  const total = correct + wrong;
  const percentage = total
    ? Math.round((correct / total) * 100)
    : 0;

  // Atualiza os dados da tela de resultados.
  resultTopic.textContent = topics[selectedTopic].name;
  resultTotal.textContent = total;
  resultCorrect.textContent = correct;
  resultWrong.textContent = wrong;
  resultPercentage.textContent = `${percentage}%`;

  // Exibe os resultados e oculta o jogo e seu placar.
  playScreen.hidden = true;
  endScreen.hidden = false;
  statsElement.hidden = true;

  roundLabel.textContent = "Partida encerrada";
  progressPercent.textContent = "100%";
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", 100);
}


function startGame() {
  if (transitionTimer !== null) {
    window.clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  if (selectedTopic === null || !Object.hasOwn(topics, selectedTopic)) {
    showTopicSelection();
    return;
  }

  questions = shuffle(topics[selectedTopic].vocabulary);

  currentIndex = 0;
  round = 1;
  correct = 0;
  wrong = 0;
  nextQuestionTimer = 0;
  answered = false;
  lastItalian = null;

  selectionScreen.hidden = true;
  playScreen.hidden = false;
  endScreen.hidden = true;
  statsElement.hidden = false;

  topicLabel.textContent = topics[selectedTopic].name;

  updateStats();
  showQuestion();
}

/*
 * EVENTOS
 */

topicList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-topic]");

  if (!button || !topicList.contains(button)) {
    return;
  }

  selectTopic(button.dataset.topic);
});

answerForm.addEventListener("submit", submitAnswer);
skipButton.addEventListener("click", skipQuestion);
stopButton.addEventListener("click", stopGame);

restartButton.addEventListener("click", startGame);
topicsButton.addEventListener("click", showTopicSelection);
backButton.addEventListener("click", showTopicSelection);

/*
 * INICIALIZAÇÃO
 */

renderTopics();
showTopicSelection();
