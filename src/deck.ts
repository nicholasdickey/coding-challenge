// ./src/deck.ts
// All game logic and state manipulation
// eslint-disable-next-line
import { Dispatch, SetStateAction } from 'react'
import {
  // eslint-disable-next-line
  Game,
  // eslint-disable-next-line
  CardDatum,
  // eslint-disable-next-line
  Suits,
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
const NUM_SHUFFLES = 50
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
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
  suits.forEach(suit => {
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
export const initGame = (): Game => {
  return {
    cardsLeft: TOTAL_CARDS,
    cardsUsed: [] as CardDatum[],
    deck: shuffle(),
    board: [] as CardDatum[],
    ended: false,
    inflight: false,
  }
}
export const dealOne = ({ cardsLeft, cardsUsed, deck }: Game, board: CardDatum[]): Game => {
  const outBoard = [...board]
  let outCardsLeft = cardsLeft
  const outCardsUsed = [...cardsUsed]
  const outDeck = [...deck]

  const nextCard = outDeck.pop()

  if (typeof nextCard === 'undefined')
    return { cardsLeft, cardsUsed, deck, board, ended: false, inflight: true }

  outCardsUsed.push(nextCard)
  outBoard.push(nextCard)
  outCardsLeft -= 1
  if (outCardsLeft < 0) throw new Error('Unexpected condition -cardsLeft<0')

  return {
    cardsLeft: outCardsLeft,
    cardsUsed: outCardsUsed,
    deck: outDeck,
    board: outBoard,
    ended: false,
    inflight: true,
  }
}
export const deal = async (game: Game, setGame: Dispatch<SetStateAction<Game>>): Promise<void> => {
  let gameUpdate = game
  let board: CardDatum[] = []
  setGame({ ...game, ...{ board, inflight: true } })
  await sleep(50)
  for (let pass = 1; pass <= ONE_HAND; pass += 1) {
    gameUpdate = dealOne(gameUpdate, board)
    board = gameUpdate.board
    setGame(gameUpdate)
    // eslint-disable-next-line
    await sleep(150)
    if (pass === ONE_HAND && board.length <= 2) {
      setGame({ ...gameUpdate, ended: true, inflight: false })
      console.info('setEnded')
    } else if (pass === ONE_HAND) {
      // eslint-disable-next-line
      setTimeout(() => setGame({ ...gameUpdate, ...{ inflight: false } }), 500)
    }
  }
}

export const reset = (setGame: Dispatch<SetStateAction<Game>>): void => {
  setGame(initGame())
  // eslint-disable-next-line
  console.info('reset')
}
