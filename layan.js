document.getElementById('harry-btn').addEventListener('click', () => {
    setActiveCategory('harry-btn');
    fetchData('harry');
});

document.getElementById('cat-btn').addEventListener('click', () => {
    setActiveCategory('cat-btn');
    fetchData('cat');
});

document.getElementById('dog-btn').addEventListener('click', () => {
    setActiveCategory('dog-btn');
    fetchData('dog');
});

document.getElementById('play-again-btn').addEventListener('click', () => {
    playAgain();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    resetGame();
});

// Hide play again button
document.getElementById('play-again-btn').style.display = 'none';

function setActiveCategory(buttonId) {
    document.querySelectorAll('.category').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

async function fetchData(category) {
    let url = '';
    console.log(category);
    if (category === 'harry') {
        url = 'https://hp-api.onrender.com/api/characters';
    } else if (category === 'cat') {
        url = 'https://api.thecatapi.com/v1/images/search?limit=6';
    } else if (category === 'dog') {
        url = 'https://dog.ceo/api/breeds/image/random/6';
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        prepareGame(data, category);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function prepareGame(data, category) {
    let images = [];
    if (category === 'harry') {
        let selectedCharacters = getRandomItems(data.filter(character => character.image), 6); // Ensure there are image URLs
        images = selectedCharacters.map(character => character.image);
    } else if (category === 'cat') {
        let selectedCats = getRandomItems(data, 6);
        images = selectedCats.map(cat => cat.url);
    } else if (category === 'dog') {
        images = data.message; 
    }

    images = images.concat(images);
    images = shuffleArray(images);

   
    displayCards(images);


    document.getElementById('play-again-btn').style.display = 'none';
}

function getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayCards(images) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; 

    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<img src="${image}" alt="Card image">`;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0;

function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.innerHTML === secondCard.innerHTML;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', () => flipCard(firstCard));
    secondCard.removeEventListener('click', () => flipCard(secondCard));

    matchedCards += 2;
    resetBoard();

    
    if (matchedCards === document.querySelectorAll('.card').length) {
        document.getElementById('play-again-btn').style.display = 'inline';
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}


function resetGame() {
    const gameBoard = document.getElementById('game-board');
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.remove('flipped')); 
    gameBoard.innerHTML = ''; 
    resetBoard();
    matchedCards = 0;
}


function playAgain() {
    const activeCategoryButton = document.querySelector('.active');
    if (!activeCategoryButton) {
        console.error('No active category found.');
        return;
    }
    console.log('ID is'+activeCategoryButton.id);
    const category = activeCategoryButton.id.replace('-btn', '');
    fetchData(category);
    matchedCards = 0;
    document.getElementById('play-again-btn').style.display = 'none';
}
