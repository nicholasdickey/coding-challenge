import { Card, Game } from './db'

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
enum Suits {
  hearts,
  diamonds,
  clubs,
  spades,
}
const ACE = 1
const KING = 13

export const cardLiteralA = 'A'
export const cardLiteralJ = 'J'
export const cardLiteralQ = 'Q'
export const cardLiteralK = 'K'

export const TOTAL_CARDS = 52
export const ONE_HAND = 5

function innerShuffle(deck: Card[]): Card[] {
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
export function shuffle(): Card[] {
  const deck: Card[] = []
  const suits: Suits[] = [Suits.hearts, Suits.diamonds, Suits.clubs, Suits.spades]
  suits.forEach(suit => {
    for (let card = ACE; card <= KING; card += 1) {
      deck.push({
        suit,
        value: card,
      })
    }
  })
  return innerShuffle(deck)
}
export const dealOne = ({
  gameId,
  cardsUsed,
  deck,
  board,
  ended,
  winner,
}: {
  gameId: number
  cardsUsed: Card[]
  deck: Card[]
  board: Card[]
  winner: boolean
  ended: boolean
}): Game => {
  const nextCard = deck.pop()
  if (typeof nextCard !== 'undefined') {
    cardsUsed.push(nextCard)
    board.push(nextCard)
  }

  return {
    gameId,
    cardsUsed,
    deck,
    board,
    ended,
    winner,
  }
}
