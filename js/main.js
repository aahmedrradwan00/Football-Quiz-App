let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let infoContainer = document.querySelector(".info");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let activeq = document.querySelector(".results .active");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

async function loadNames() {
  const response = await fetch("json/football-questions.json");
  const questionsObject = await response.json();

  let qCount = questionsObject.length;

  createBullets(qCount);
  addQuestionsData(questionsObject[currentIndex], qCount);

  countdown(10, qCount);

  submitButton.onclick = () => {
    let theRightAnswer = questionsObject[currentIndex].right_answer;
    currentIndex++;
    checkAnswer(theRightAnswer, qCount);

    quizArea.innerHTML = "";
    answersArea.innerHTML = "";
    resultsContainer.innerHTML = "";
    infoContainer.innerHTML = "";
    addQuestionsData(questionsObject[currentIndex], qCount);
    hundleBullets();
    clearInterval(countdownInterval);
    countdown(10, qCount);
    info(qCount);

    showResults(qCount);
  };
}
loadNames();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    bulletsSpanContainer.appendChild(theBullet);
    if (i === 0) {
      theBullet.classList.add("on");
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionTitleText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionTitleText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === choosenAnswer) {
    rightAnswers++;
    console.log(`Good Answer`);
  }
}

function hundleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");

  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

function info(count) {
  if (currentIndex < count) {
    let ahmed = `You answered ${currentIndex}
    from ${count}`;
    let ahmedspan = document.createElement("span");
    let ahmedspanText = document.createTextNode(ahmed);
    ahmedspan.appendChild(ahmedspanText);
    infoContainer.appendChild(ahmedspan);
  }
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `You Answered , ${rightAnswers} from ${count} <h2 class="good">Good</h2> `;
    } else if (rightAnswers === count) {
      theResults = `You Answered , ${rightAnswers} from ${count}  <h2 class="perfect">Perfect</h2>`;
    } else {
      theResults = `You Answered , ${rightAnswers} from ${count} <h2 class="bad">Bad</h2>`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
