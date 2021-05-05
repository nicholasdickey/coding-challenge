const ACE = 1
const KING = 13

function shuffle(deck: Array<number>): Array<number> {
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
export default function init(): Array<number> {
  const deck = []
  for (let suit = 1; suit <= 4; suit += 1) {
    const shift = 10 ** 1 - 10
    // assign codes to cards 1(Ace) to 13 (King)

    for (let cardNumber = ACE; cardNumber <= KING; cardNumber += 1) {
      const card = shift + cardNumber
      console.info('generating card', card)
      deck.push(card)
    }
    console.info('deck created', deck)
  }
  return shuffle(deck)
}
