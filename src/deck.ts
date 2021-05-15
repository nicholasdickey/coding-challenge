// ./src/deck.ts
// All game logic and state manipulation



import Immutable from 'immutable'
// eslint-disable-next-line
import type {
  Game,
  CardDatum,
  Suits,
} from 'types'

import {
  cardLiteralA,
  cardLiteralJ,
  cardLiteralQ,
  cardLiteralK,
  TOTAL_CARDS,
  ONE_HAND,
} from 'types'

const ACE = 1
const JOHN = 11
const QUEEN = 12
const KING = 13

export function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
/* refactor for GQL */
/*
function innerShuffle(deck: CardDatum[]): CardDatum[] {
  const returnDeck = deck
  let curId = deck.length
  // There remain elements to shuffle
  while (curId !== 0) {
    // Pick a remaining element
    const randId = Math.floor(Math.random() * curId)
    curId -= 1
    // Swap it with the current element.
    const tmp = returnDeck[curId]
    returnDeck[curId] = returnDeck[randId]
    returnDeck[randId] = tmp
  }
  return returnDeck
}
export function shuffle(): CardDatum[] {
  let deck: CardDatum[] = []
  const suits: Suits[] = ['hearts', 'diamonds', 'clubs', 'spades']
  suits.forEach((suit) => {
    for (let card = ACE; card <= KING; card += 1) {
      let cardString
      switch (card) {
        case ACE:
          cardString = cardLiteralA
          break
        case JOHN:
          cardString = cardLiteralJ
          break
        case QUEEN:
          cardString = cardLiteralQ
          break
        case KING:
          cardString = cardLiteralK
          break
        default:
          cardString = `${card}`
      }
      deck.push({
        suit,
        card: cardString,
      })
    }
  })

  for (let i = 0; i < NUM_SHUFFLES; i += 1) deck = innerShuffle(deck)
  return deck
}
*/
/* refactor for GQL 
export const initGame = (): Game => {
  return {
    cardsLeft: TOTAL_CARDS,
    cardsUsed: [] as CardDatum[],
    deck: shuffle(),
    board: [] as CardDatum[],
    ended: false,
    inflight: false,
  }
} */

export const initGame = (): Game => {
  return {
    cardsLeft: TOTAL_CARDS,
    cardsUsed: [] as CardDatum[],
    deck: [] as CardDatum[],
    board: [] as CardDatum[],
    ended: false,
    winner: false,
    gameId:0,
    inflight: false,
  }
}
declare type ImmutableValue=string|number|boolean|Record<string,unknown>
export const dealOne = (inGame:  Immutable.Map<string,ImmutableValue>, stateGame: Immutable.Map<string,ImmutableValue>):  Immutable.Map<string,ImmutableValue> => {
  const inGameJS=inGame.toJS() as Game
  const outGame: Game = stateGame.set("inflight", true).toJS() as Game

  outGame.winner = inGameJS.winner;
  outGame.ended = inGameJS.ended;
  console.info("dealOne created outGame",outGame)
  const boardLength = outGame.board.length
  if (boardLength < ONE_HAND) {
    const nextCard = inGameJS.board[boardLength]
    if (typeof nextCard === 'undefined') {
      outGame.inflight = false;
        return Immutable.fromJS(outGame)
    }
    outGame.deck.pop()
    outGame.cardsUsed.push(nextCard);
    outGame.board.push(nextCard)
    outGame.cardsLeft -= 1;
    if (outGame.cardsLeft < 0) throw new Error('Unexpected condition -cardsLeft<0')
  }
  return Immutable.fromJS(outGame)
}
export const reset = (setGame: (game: Game) => void): void => {
  setGame(initGame())
}
export const deal = async (inGameJS: Game,gameJS: Game, setGame: (game: Game) => void): Promise<number> => {
  
  const inGame = Immutable.fromJS(inGameJS);
  let game = Immutable.fromJS(gameJS)
  const emptyBoard: CardDatum[] = []
  game=game.merge({
    board:emptyBoard,
    inflight: true
  })
  setGame(game.toJS())
  const p = await sleep(50)
  let currentGame = game;
  for (let pass = 1; pass <= ONE_HAND; pass += 1) {
    console.info("deal: inGame",inGame.toJS())
    const outGame = dealOne(inGame, currentGame)
    console.info("deal after dealOne ",outGame.toJS())
    setGame(outGame.toJS() as Game)
    currentGame = outGame;
    // eslint-disable-next-line
    await sleep(150)
  
    if (pass === ONE_HAND && inGameJS.board.length <= 2) {
      setGame(outGame.merge({ended: true, inflight: false }).toJS() as Game)
    } else if (pass === ONE_HAND) {
      
      setTimeout(() => setGame(outGame.merge({ inflight: false } ).toJS() as Game), 500)
    }
  }
  return p
}
export function importGQLCards(cards: { value: number, suit: number }[]): CardDatum[] {
  const suits: Suits[] = ['hearts', 'diamonds', 'clubs', 'spades']
  return cards.map((card: { value: number, suit: number }) => {
    let cardString: string = card.value.toString();
    if (card.value===1||card.value > 10)
        switch (card.value) {
        case ACE:
          cardString = cardLiteralA
          break
        case JOHN:
          cardString = cardLiteralJ
          break
        case QUEEN:
          cardString = cardLiteralQ
          break
        case KING:
          cardString = cardLiteralK
          break
        default:
          cardString = `${card}`
      }
    
    return {
    card: cardString,
    suit: suits[card.suit]
  }})
}
export function importGQLGame(inGame: { gameId: number, winner: boolean, ended: boolean, deck: { value: number, suit: number }[], board: { value: number, suit: number }[], cardsUsed: { value: number, suit: number }[] }): Game {
  return {
    deck: importGQLCards(inGame.deck),
    board: importGQLCards(inGame.board),
    cardsUsed: importGQLCards(inGame.cardsUsed),
    cardsLeft: inGame.deck.length,
    ended: inGame.ended,
    winner: inGame.winner,
    gameId: inGame.gameId,
    inflight: false,
  }
}