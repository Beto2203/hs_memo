const cardUrl = 'https://art.hearthstonejson.com/v1/render/latest/enUS/256x/';

const cards = document.getElementById('cards');

function shuffle(deck) {
  let index = deck.length;
  let randomIndex;

  while (index !== 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;

    const swap = deck[index];
    deck[index] = deck[randomIndex];
    deck[randomIndex] = swap;
  }
}

function startGame() {
  const deckSize = 12;
  const deck = [];
  const repeatedNum = {};
  const cardBack = `/media/back${Math.floor(Math.random() * 10)}.png`;

  while (cards.hasChildNodes()) {
    cards.removeChild(cards.firstChild);
  }

  for (let i = 0; i < deckSize; i += 2) {

    while (true) {
      let id = Math.ceil(Math.random() * 99);
      id += '';
      if (id.length === 1) id = '00' + id;
      else if (id.length === 2) id = '0' + id;

      if (!(id in repeatedNum)) {
        repeatedNum[id] = 0b0;
        deck.push(id);
        deck.push(id);
        break;
      }
    }
  }

  shuffle(deck);

  const pairs = [];
  let debounceActive = false;

  for (let i = 0; i < deck.length; i++) {

    const card = {
      cardContainer: document.createElement('div'),
      innerCard: document.createElement('div'),
      back: document.createElement('img'),
      front: document.createElement('img'),
      id: deck[i]
    };

    const fullUrl = `${cardUrl}AT_${card.id}.png`

    card.front.classList.add('front');
    card.front.src = fullUrl;
    card.back.src = cardBack;

    card.front.setAttribute('draggable', 'false');
    card.back.setAttribute('draggable', 'false');

    card.cardContainer.addEventListener('click', () => {

      if (pairs.length < 2 && !card.front.classList.contains('done') && pairs[0] !== card) {
        pairs.push(card);
        card.innerCard.classList.add('rotateInner');
      }
      if (pairs.length === 2 && !debounceActive) {
        debounceActive = true;

        if (pairs[0].id === pairs[1].id && pairs[0] !== pairs[1]) {
          pairs[0].front.classList.add('done');
          pairs[1].front.classList.add('done');
          debounceActive = false;
        }

        setTimeout(() => {
          if (!(pairs[0].front.classList.contains('done') || pairs[1].front.classList.contains('done'))) {
            pairs[0].innerCard.classList.toggle('rotateInner');
            pairs[1].innerCard.classList.toggle('rotateInner');
          }
          pairs.pop();
          pairs.pop();
          debounceActive = false;
        }, (debounceActive) ? 1300 : 100);
      }
    });
    card.innerCard.appendChild(card.front);
    card.innerCard.appendChild(card.back);
    card.cardContainer.appendChild(card.innerCard);

    card.cardContainer.classList.add('flip');
    card.innerCard.classList.add('card');
    card.back.classList.add('back');


    cards.appendChild(card.cardContainer);
  }
}

const restart = document.getElementById('restart');
restart.addEventListener('click', () => {
  startGame();
});

startGame();