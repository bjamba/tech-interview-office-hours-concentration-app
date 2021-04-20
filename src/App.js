import './App.css';
import React, { useState } from 'react';

/**
 * Objects
 *    Card - This is the primary element that we interact with.
 *    Board (App) - This is where our main logic is going to reside
 *    Marquee - This could just be an h1 element
 *    Button (Reset) - Only used so far to reset the app, but let's generalize
 *    State - cards, cardOne, cardTwo
 */

function Card(props) {
  const cardValue = props.displayCard ? props.cardValue : '*';
  return (
    <div className='card' onClick={() => props.onClick() }>
      {cardValue}
    </div>
  )
}

function Marquee(props) {
  return (
    <div className='marquee'>
      { props.displayMarquee && <h1>{props.marqueeText}</h1> }
    </div>
  );

}

function Button(props) {
  return (
    <div className = 'button'>
      <button onClick={() => props.onClick()}>{props.buttonText}</button>
    </div>
  );
}

function App() {
  // Cards should be an array of objects with attributes displayCard, cardValue
  const [cards, setCards] = useState(generateCards());
  const [cardOneIdx, setCardOneIdx] = useState(-1);
  const [cardTwoIdx, setCardTwoIdx] = useState(-1);


  async function revealCard(i) {
    // Set appropriate state for card
    const revealedCard = { displayCard: 1, cardValue: cards[i].cardValue };
    setCards(cards.map((c, idx) => i === idx ? revealedCard : c));
    if (cardOneIdx === -1) {
      // Set card one
      setCardOneIdx(i);

    } else if (cardTwoIdx === -1) {
      // Evaluate match
      setCardTwoIdx(i);
      await evaluateMatch(cardOneIdx, i);
    }
  }

  async function evaluateMatch(cardOneIdx, cardTwoIdx) {
    // some kind of a sleep function so that you can see both cards
    // If there's no match, set state appropriately
    await sleep(250);
;   if (
      cards[cardOneIdx].cardValue 
      !== cards[cardTwoIdx].cardValue
    ) {
      setCards(cards.map((c, i) => {
        if ([cardOneIdx, cardTwoIdx].includes(i)) {
          return { displayCard: 0, cardValue: c.cardValue };
        }
        return c;
      }));
    }
    setCardOneIdx(-1);
    setCardTwoIdx(-1);

    // evaluateWin
    evaluateWin();
  }

  function evaluateWin() {
    return cards.reduce((a,c) => a + c.displayCard, 0) === 16;
  }


  function resetGame() {
    setCards(generateCards());
  }

  return (
    <div className="App">
      <Marquee displayMarquee={true} marqueeText={'Concentration'} />
      <Button buttonText={'Reset Game!'} onClick={() => resetGame()}/>
      <br />
      { cards.map((e, i) => <Card
          key={i}
          displayCard={e.displayCard}
          cardValue={e.cardValue}
          onClick={() => revealCard(i)}
        />) }
      <br />
      <Marquee displayMarquee={evaluateWin()} marqueeText={'You won!'} />
    </div>
  );
}

/**
 * Functions
 *    generateCard
 *    revealCard
 *    evaluateMatch
 *    evaluateWin
 *    resetGame
 */
function generateCards() {
  // We need eight cards
  const cardValues = ['a','b','c','d','e','f','g','h'];
  const cards = [];

  // Create the deck, unshuffled
  for (const cardValue of cardValues) {
    const card = { displayCard: 0, cardValue };
    cards.push(card);
    cards.push(card);
  }
  
  // Shuffle the deck
  for (let k = 0; k < 128; k += 1) {
    let i = 0;
    let j = 0;
    while (i === j) {
      i = Math.floor(Math.random()*16);
      j = Math.floor(Math.random()*16);
    }
    const cardOne = cards[i];
    const cardTwo = cards[j];
    cards[i] = cardTwo;
    cards[j] = cardOne;
  }

  return cards;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default App;
