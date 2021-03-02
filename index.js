'use strict';

const field = document.querySelector('.field');
const timerMinutes = document.querySelector('.minutes');
const timerSeconds = document.querySelector('.seconds');
const modal = document.querySelector('.modal');
const message = document.querySelector('.message');
const buttonPlayAgain = document.querySelector('.btn-again');

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵', '🦄', '🐞', '🦀', '🐟', '🐊', '🐓', '🦃'];
let currentEmojis = {};

const openCards = [];
let countOpenCards = 0;
let isTimerOn = false;
let time = 60;
let timer = null;

function getRandomElement(container) {
    const index = ~~(Math.random() * container.length);
    return container[index];
}

function getEmojiSet() {
    for (let i = 0; i < 6; i++) {
        const emoji = getRandomElement(emojis);
        if (currentEmojis.hasOwnProperty(emoji)) {
            i--;
        } else {
            currentEmojis[emoji] = 2;
        }
    }
}

function setCardValue() {
    const backOfCards = [...document.querySelectorAll('.emoji')];
    getEmojiSet();
    while (backOfCards.length) {
        const card = getRandomElement(backOfCards);
        while (true) {
            if (!setCardEmoji(card)) {
                break;
            }
        }
        backOfCards.splice(backOfCards.indexOf(card), 1);
    }
}

function setCardEmoji(card) {
    const [ emoji ] = Object.keys(currentEmojis);
    if (currentEmojis[emoji]) {
        card.textContent = emoji;
        card.parentElement.dataset.value = emoji;
        currentEmojis[emoji]--;
        return false;
    } else {
        delete currentEmojis[emoji];
        return true;
    }
}

function cardReverse(event) {
    let _this = event.target.closest('.card');

    if (!_this || !field.contains(_this)) {
        return;
    }

    if (!isTimerOn) {
        isTimerOn = true;
        timerOn();
    }

    if (openCards.includes(_this)) {
        return;
    }

    if (!_this.classList.contains('reverse') && openCards.length < 2) {
        _this.classList.add('reverse');

        if (!openCards.length) {
            openCards.push(_this);
        } else if (openCards.length === 1) {
            openCards.push(_this);

            if (isCardsEqual(openCards[0], openCards[1])) {
                setClass(openCards[0], 'correct');
                setClass(openCards[1], 'correct');
                openCards.length = 0;
                countOpenCards += 2;

                if (isAllCardsOpen()){
                    setMessage('win');
                    openModal();
                }

            } else {
                setClass(openCards[0], 'incorrect');
                setClass(openCards[1], 'incorrect');
            }

        }
    } else if (!_this.classList.contains('reverse') && openCards.length === 2) {
        removeIncorrectClass(openCards[0]);
        removeIncorrectClass(openCards[1]);

        openCards.length = 0;
        _this.classList.add('reverse');
        openCards.push(_this);
    }
}

function setMessage(text) {
    if (text === 'win') {
        message.innerHTML = `<span>W</span>
                             <span>i</span>
                             <span>n</span>`;
    } else {
        message.innerHTML = `<span>L</span>
                             <span>o</span>
                             <span>s</span>
                             <span>e</span>`;
    }
}

function isAllCardsOpen() {
    return countOpenCards === 12;
}

function openModal() {
    clearInterval(timer);
    modal.classList.remove('off');
    modal.classList.add('on');
}

function closeModal() {
    modal.classList.remove('on');
    modal.classList.add('off');
}

function timerOn() {
    timer = setInterval(() => {
        time--;
        setMinutes();
        setSeconds(time);

        if (!time) {
            openModal();
            if (isAllCardsOpen()) {
                setMessage('win');
            } else {
                setMessage('lose');
            }
        }
    }, 1000);
}

function setMinutes() {
    if (timerMinutes.textContent === '00') {
        return;
    }
    timerMinutes.textContent = '00';
}

function setSeconds(seconds) {
    let content;
    if (seconds < 10) {
        content = '0' + seconds;
    } else if (seconds <= 0) {
        content = '00';
    }

    timerSeconds.textContent = content;
}

function isCardsEqual(firstCard, secondCard) {
    return firstCard.dataset.value === secondCard.dataset.value;
}

function setClass(card, Class) {
    card.lastElementChild.classList.add(Class);
}

function removeExistingClass(card, Class) {
    if (card.classList.contains(Class)) {
        card.classList.remove(Class);
    }
}

function removeIncorrectClass(card) {
    removeExistingClass(card, 'reverse');
    removeExistingClass(card.lastElementChild, 'incorrect');
}

function resetGame() {
    currentEmojis = {};
    openCards.length = 0;
    countOpenCards = 0;
    isTimerOn = false;
    time = 60;
    timer = null;
    timerMinutes.textContent = '01';
    timerSeconds.textContent = '00';
    message.innerHTML = '';

    field.querySelectorAll('.card').forEach(card => {
        removeExistingClass(card.lastElementChild, 'correct');
        removeIncorrectClass(card, 'incorrect');
    });

    field.removeEventListener('click', cardReverse);
}

const newGame = () => {
    resetGame();
    setCardValue();
    field.addEventListener('click', cardReverse);
};

newGame();

buttonPlayAgain.addEventListener('click', () => {
    closeModal();
    newGame();
});