const cardUrl = 'https://art.hearthstonejson.com/v1/render/latest/enUS/256x/';

const cards = document.getElementById('cards');

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

  deck.sort(() => 0.5 - Math.random());

  const pairs = [];
  let debounceActive = false;

  for (let i = 0; i < deck.length; i++) {

    const card = {
      cardContainer: document.createElement('div'),
      back: document.createElement('img'),
      front: document.createElement('img'),
      id: deck[i]
    };

    const fullUrl = `${cardUrl}AT_${card.id}.png`

    card.front.classList.add('hide');
    card.front.classList.add('front');
    card.front.src = fullUrl;
    card.back.src = cardBack;

    card.front.setAttribute('draggable', 'false');
    card.back.setAttribute('draggable', 'false');

    card.cardContainer.addEventListener('click', () => {

      if (pairs.length < 2 && card.front.classList.contains('hide')) {
        pairs.push(card);
        card.front.classList.remove('hide');
        card.back.classList.add('hide');
      }
      if (pairs.length === 2 && !debounceActive) {
        debounceActive = true;

        if (pairs[0].id === pairs[1].id) {
          pairs[0].front.classList.add('done');
          pairs[1].front.classList.add('done');
          debounceActive = false;
        }

        setTimeout(() => {
          if (!(pairs[0].front.classList.contains('done') || pairs[1].front.classList.contains('done'))) {
            pairs[0].front.classList.toggle('hide');
            pairs[0].back.classList.toggle('hide');
            pairs[1].front.classList.toggle('hide');
            pairs[1].back.classList.toggle('hide');
          }
          pairs.pop();
          pairs.pop();
          debounceActive = false;
        }, (debounceActive) ? 1000 : 100);
      }
    });
    card.cardContainer.appendChild(card.front);
    card.cardContainer.appendChild(card.back);

    card.cardContainer.classList.add('card');

    cards.appendChild(card.cardContainer);
  }
}

const restart = document.getElementById('restart');
restart.addEventListener('click', () => {
  startGame();
});

startGame();