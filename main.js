// IMAGE LOADER
const imageUrls = [
  "img/c0.png",
  "img/c1.png",
  "img/c2.png",
  "img/c3.png",
  "img/c4.png",
  "img/c5.png",
  "img/c6.png",
  "img/c7.png",
  "img/c8.png",
  "img/cover.png",
];

const preloadedImagesMap = {}; // <url, Image>

imageUrls.forEach((url) => {
  const img = new Image();
  img.src = url;
  preloadedImagesMap[url] = img;
});

//GLOBAL VARIABLES
const cardsDivs = document.querySelectorAll(".card"); //cards div's
const cardsDeal = []; //drawn array of cards
const activeCards = []; //2 active cards
let firstCardNr;
let turnCounter = 0;
let pairsLeft = 9;
let lock = false; //blocks clicking after 2 times
let score = 0;
const hpaudio = new Audio("audio/hpaudio.wav");

//FUNCTIONS

const countScore = () => {
  if (turnCounter < 10) {
    score += 10;
  } else if (turnCounter < 20) {
    score += 5;
  } else if (turnCounter < 30) {
    score += 2;
  } else {
    score += 1;
  }

  document.querySelector(".game-score").textContent = `Game score: ${score}`;
};

const hide2Cards = (nr1, nr2) => {
  cardsDivs[nr1].style.opacity = "0";
  cardsDivs[nr2].style.opacity = "0";
  pairsLeft--;

  if (pairsLeft === 0) {
    document.querySelector(
      ".board"
    ).innerHTML = `<div class="end-message"><p>Congratulations!</p>
    <p>You won and earned ${score} points! </p><div class="reset" style="cursor:pointer;" onclick="location.reload()"><a>Again?</a></span></div>`;
    document.querySelector(".score").innerHTML = "";
  }

  lock = false;
  firstCardNr = ""; //resets the card number from memory
};

const restore2Cards = (nr1, nr2) => {
  const coverImg = preloadedImagesMap["img/cover.png"];
  cardsDivs[nr1].style.backgroundImage = `url(${coverImg.src})`;
  cardsDivs[nr2].style.backgroundImage = `url(${coverImg.src})`;
  cardsDivs[nr1].classList.add("card");
  cardsDivs[nr2].classList.add("card");
  cardsDivs[nr1].classList.remove("cardA");
  cardsDivs[nr2].classList.remove("cardA");

  lock = false;
  firstCardNr = "";
};

const revealCard = function (nr) {
  let cardOpacity = cardsDivs[nr].style.opacity;

  if (lock === false && cardOpacity !== "0") {
    //prevents from clicking on more than 2 cards

    if (firstCardNr === nr) return; //prevents from double click on same card

    //getting path of clicked card
    const imgObj = preloadedImagesMap[`img/${cardsDeal[nr]}`];

    cardsDivs[nr].style.backgroundImage = `url(${imgObj.src})`;
    cardsDivs[nr].classList.add("cardA");
    cardsDivs[nr].classList.remove("card");

    if (activeCards.length === 0) {
      //1st card
      activeCards[0] = cardsDeal[nr];
      firstCardNr = nr;
    } else {
      //2nd card
      lock = true;
      activeCards[1] = cardsDeal[nr];

      if (activeCards[0] === activeCards[1]) {
        //reveal 2 identical cards
        setTimeout(function () {
          hide2Cards(firstCardNr, nr);
        }, 1000);
        countScore();
      } else {
        //reveal 2 different cards
        setTimeout(function () {
          restore2Cards(firstCardNr, nr);
        }, 1000);
      }

      activeCards.length = 0; //clearing the array
      turnCounter++; //counter's update
      document.querySelector(
        ".turn-counter"
      ).textContent = `Turn counter: ${turnCounter}`;
    }
  }
};

const prepareCards = function () {
  const cards = [];

  //generating an array: ["c0.png", "c0.png", "c1.png", "c1.png"...itd]
  for (let i = 0, j = 0; i < cardsDivs.length / 2; i++, j = j + 2) {
    let cardName = `c${i}.png`;
    cards[j] = cardName;
    cards[j + 1] = cardName;
  }

  //card draw
  let maxIndex = 17;
  for (let i = 0; i < cardsDivs.length; i++) {
    const index = Math.floor(Math.random() * maxIndex);
    cardsDeal[i] = cards[index];
    cards[index] = cards[maxIndex];
    maxIndex--;
  }
};

const playMusic = function () {
  this.classList.toggle("pause-btn");
  if (this.classList.contains("pause-btn")) {
    // music plays
    console.log("pauza");
    hpaudio.play();
    hpaudio.loop = true;
  } else {
    //music pause
    hpaudio.currentTime = 0;
    hpaudio.pause();
  }
};

const playGame = function () {
  prepareCards();
};
playGame();

//assigning a number to divs
cardsDivs.forEach((card, i) => {
  card.addEventListener("click", function () {
    revealCard(i);
  });
});

// button animation
document.querySelector(".button").addEventListener("click", playMusic);
