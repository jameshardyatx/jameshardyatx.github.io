const lastDiv = document.getElementById("col1");
const currentDiv = document.getElementById("col2");
const nextDiv = document.getElementById("col3");
const scoreDiv = document.getElementById("scoreCount");
const highDiv = document.getElementById("highScore");
const bestStreakDiv = document.getElementById("bestStreak");
const currentStreakDiv = document.getElementById("currentStreak");
const tutorialButtonDiv = document.getElementById("tutorialDropdown");
const infoBoxDiv = document.getElementById("infobox");
const closeTutorialButton = document.getElementById("close");
const resetButton = document.getElementById("reset");
const goalText = document.getElementById("goalReached");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

let gameSize = 10000;
let score = 0;
let position = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let currentStreak = 0;
const initialDrain = 1000;
let drain = initialDrain;
const initialScoreGoal = 10;
let scoreGoal = initialScoreGoal;

scoreDiv.textContent = score;
highDiv.textContent = highScore;
bestStreakDiv.textContent = bestStreak;
currentStreakDiv.textContent = currentStreak;

let nums = [];

const randNum = () => {
  return Math.floor(Math.random()*10);
}

const fillNums = () => {
  for(let i = 0; i < gameSize; i++) {
    nums.push(randNum());
  }
}

fillNums();

let current = nums[position].toString();
let next = nums[position+1].toString();
let last = "0";

const updateGame = () => {
  current = nums[position].toString();
  next = nums[position+1].toString();
  currentDiv.textContent = current;
  currentStreakDiv.textContent = currentStreak;
  nextDiv.textContent = next;
}

const updateScore = () => {
  scoreDiv.textContent = score;
}

const updateHighscore = () => {
    highDiv.textContent = highScore.toString();
}

const updateBestStreak = () => {
    bestStreakDiv.textContent = bestStreak.toString();
}

const resetCurrentStreak = () => {
    currentStreakDiv.textContent = 0;
}

lastDiv.textContent = "-";

currentDiv.textContent = current;

nextDiv.textContent = next;

const scoreDown = () => {
  score -=1;
  updateScore();
}

const wrongKey = () => {
  score -= 2;
  resetCurrentStreak();
  console.log("wrong");
  updateScore();
  currentDiv.classList.add("errorText");
  sleep(200).then(() => {currentDiv.classList.remove("errorText")});
}

let gameStarted = false;
let timerId;

document.addEventListener("keydown", (event) => {
  const key = event.key;
  
  if(!gameStarted) {
    const timer = setInterval(scoreDown, drain);
    timerId = timer;
    gameStarted = true;
  }
  
  if(key == nums[position].toString()) {
    console.log(key);
    last = nums[position].toString();
    lastDiv.textContent = last;
    position++;
      if(position > gameSize-3) {
        gameSize = gameSize*1.5;
        fillNums();
      }
    score++;
      if(score > highScore) {
        highScore = score;
        updateHighscore();
        localStorage.setItem("highScore", highScore);
      }
      if(score > scoreGoal) {
        console.log("goal reached");
        goalReached();
        scoreGoal = Math.floor(scoreGoal * 1.75);
        clearInterval(timerId);
        drain = Math.floor(drain * .8);
        const timer = setInterval(scoreDown, drain);
        timerId = timer;
      }
    currentStreak++;
      if(currentStreak > bestStreak) {
        bestStreak = currentStreak;
        updateBestStreak();
        localStorage.setItem("bestStreak", bestStreak);
      }
    
    updateGame();
    updateScore();
    
  } else {
      currentStreak = 0;
      wrongKey();
    }
});

const closeInfoBox = () => {
    if(infoBoxDiv.classList.contains("hidden")) {
        infoBoxDiv.classList.remove("hidden");
      } else {
        infoBoxDiv.classList.add("hidden");
      }
}

tutorialButtonDiv.addEventListener("click", (event) => {
    closeInfoBox();
});

closeTutorialButton.addEventListener("click", (event) => {
  closeInfoBox();
});

const resetScore = () => {
    bestStreak = 0;
    highScore = 0;
    score = 0;
    currentStreak = 0;
    drain = initialDrain;
    scoreGoal = initialScoreGoal;
    updateBestStreak();
    updateHighscore();
    updateScore();
    resetCurrentStreak();
    localStorage.setItem("highScore", highScore);
    localStorage.setItem("bestStreak", bestStreak);
    updateGame();
    updateScore();
}

let confirmed = false;

resetButton.addEventListener("click", (event) => {
    if(!confirmed) {
        resetButton.textContent = "ARE YOU SURE?";
        confirmed = true;
    } else {
        resetScore();
        resetButton.textContent = "SCORE RESET!";
        sleep(2000).then(() => {resetButton.textContent = "RESET HIGHSCORE/STREAK";});
        clearInterval(timerId);
        gameStarted = false;
        confirmed = false;
    }
})

const goalReached = () => {
    if(goalText.classList.contains("hidden")) {
        goalText.classList.remove("hidden");
        goalText.classList.add("floatAnim");
        sleep(3000).then(() => {
            goalText.classList.remove("floatAnim");
            goalText.classList.add("hidden");
        })
    }
}