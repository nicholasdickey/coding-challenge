import { CardDatum, Suits } from 'types'

const ACE = 1
const KING = 13
const NUM_SHUFFLES = 50

function shuffle(deck: CardDatum[]): CardDatum[] {
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
export default function init(): CardDatum[] {
  let deck: CardDatum[] = []

  const suits: Suits[] = ['hearts', 'diamonds', 'clubs', 'spades']
  suits.forEach(suit => {
    for (let card = ACE; card <= KING; card += 1) {
      console.info('generating card', { suit, card })
      deck.push({ suit, card })
    }
  })
  console.info('deck created', deck)
  for (let i = 0; i < NUM_SHUFFLES; i += 1) deck = shuffle(deck)
  return deck
}
