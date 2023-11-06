const playerScoreSpan = document.getElementById("player-score");
const computerScoreSpan = document.getElementById("computer-score");
const playerChoiceDiv = document.getElementById("player-choice");
const computerChoiceDiv = document.getElementById("computer-choice");
const outcomeDiv = document.getElementById("outcome");
const choiceButtons = document.querySelectorAll(".choice-button");
const tossButton = document.getElementById("toss-button");
const tossResult = document.getElementById("toss-result");
const choicesContainer = document.getElementById("choices");
const oversInput = document.getElementById("overs-input");

let playerScore = 0;
let computerScore = 0;
let currentPlayer = "";
let totalOvers = 1;
let currentOver = 0;
let ballsInOver = 0;
let targetScore = 0;
let firstInningsComplete = false;

function initializeGame() {
  playerScore = 0;
  computerScore = 0;
  currentPlayer = "";
  currentOver = 0;
  ballsInOver = 0;
  targetScore = 0;
  firstInningsComplete = false;
  tossResult.textContent = "";
  playerScoreSpan.textContent = "0 Runs";
  computerScoreSpan.textContent = "0 Runs";
  playerChoiceDiv.textContent = "";
  computerChoiceDiv.textContent = "";
  outcomeDiv.textContent = "";
  choicesContainer.style.display = "none"; // This is hidden when the game is over CHANGE this to none when done.
  tossButton.style.display = "block";
}

tossButton.addEventListener("click", function () {
  let toss = Math.floor(Math.random() * 2); // 0 for player, 1 for computer
  totalOvers = parseInt(oversInput.value);
  if (toss === 0) {
    tossResult.textContent = "You won the toss! You bat first.";
    currentPlayer = "player";
  } else {
    tossResult.textContent = "Computer won the toss! Computer bats first.";
    currentPlayer = "computer";
    computerBats();
  }
  tossButton.style.display = "none";
  choicesContainer.style.display = "block";
});

choiceButtons.forEach((button) => {
  button.addEventListener("click", function () {
    userPlays(parseInt(this.getAttribute("data-number")));
  });
});

function userPlays(number) {
  if (currentPlayer === "player") {
    playTurn(number);
  } else {
    // The user is bowling to the computer
    let computerNumber = Math.floor(Math.random() * 6) + 1;
    playerChoiceDiv.textContent = `You bowled: ${number}`;
    computerChoiceDiv.textContent = `Computer picked: ${computerNumber}`;
    if (number === computerNumber) {
      outcomeDiv.textContent = "Computer is out!";
      Toastify({
        text: "Computer is out!",
        gravity: "bottom",
        position: "center",
        duration: 3000,
        style: {
          background: "#1d1d1d",
          color: "#fff",
        },
      }).showToast();
      switchInnings();
    } else {
      computerScore += computerNumber;
      Toastify({
        text: "Computer scored!",
        gravity: "bottom",
        position: "center",
        duration: 3000,
        style: {
          background: "#1d1d1d",
          color: "#fff",
        },
      }).showToast();
      outcomeDiv.textContent = "Computer scored!";
      checkInningsEnd();
    }
    updateScoreboard();
  }
}

function playTurn(selectedNumber) {
  let computerNumber = Math.floor(Math.random() * 6) + 1;
  playerChoiceDiv.textContent = `You picked: ${selectedNumber}`;
  computerChoiceDiv.textContent = `Computer bowled: ${computerNumber}`;

  if (selectedNumber === computerNumber) {
    outcomeDiv.textContent = "You are out!";
    Toastify({
      text: "You are out!",
      gravity: "bottom",
      position: "center",
      duration: 3000,
      style: {
        background: "#1d1d1d",
        color: "#fff",
      },
    }).showToast();

    switchInnings();
  } else {
    playerScore += selectedNumber;
    outcomeDiv.textContent = "You scored!";
    Toastify({
      text: "You scored!",
      gravity: "bottom",
      position: "center",
      duration: 3000,
      style: {
        background: "#1d1d1d",
        color: "#fff",
      },
    }).showToast();
    checkInningsEnd();
  }
  updateScoreboard();
}

function switchInnings() {
  firstInningsComplete = true;
  targetScore = currentPlayer === "player" ? playerScore : computerScore;
  currentPlayer = currentPlayer === "player" ? "computer" : "player";
  ballsInOver = 0;
  currentOver = 0;

  if (currentPlayer === "computer") {
    computerBats();
  } else {
    outcomeDiv.textContent = "Your turn to bat. Please select a number.";
  }
}

function computerBats() {
  outcomeDiv.textContent =
    "Computer's turn to bat. Please select a number to bowl.";
}

function updateScoreboard() {
  playerScoreSpan.textContent = `${playerScore} Runs`;
  computerScoreSpan.textContent = `${computerScore} Runs`;
}

function checkInningsEnd() {
  ballsInOver++;
  if (ballsInOver === 6) {
    ballsInOver = 0;
    currentOver++;
    if (currentOver === totalOvers) {
      switchInnings();
    }
  }

  if (
    firstInningsComplete &&
    ((currentPlayer === "player" && playerScore > targetScore) ||
      (currentPlayer === "computer" && computerScore > targetScore))
  ) {
    determineWinner();
  }
}

function determineWinner() {
  choicesContainer.style.display = "none";
  if (playerScore > computerScore) {
    outcomeDiv.textContent = "You win!";
    Toastify({
      text: "You win!",
      gravity: "bottom",
      position: "center",
      duration: 3000,
      style: {
        background: "#1d1d1d",
        color: "#fff",
      },
    }).showToast();
  } else if (playerScore < computerScore) {
    outcomeDiv.textContent = "Computer wins!";
    Toastify({
      text: "Computer wins!",
      gravity: "bottom",
      position: "center",
      duration: 3000,
      style: {
        background: "#1d1d1d",
        color: "#fff",
      },
    }).showToast();
  } else {
    outcomeDiv.textContent = "It's a tie!";
  }
}

initializeGame();
