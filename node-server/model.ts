import { startGame, getGame, updateGame, getStreak, resetSession, Game, Card, Streak } from './db'

enum Suits {
  hearts,
  diamonds,
  clubs,
  spades,
}
const ACE = 1
const KING = 13
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
function deckShuffle(): Card[] {
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
const dealHand = ({
  gameId,
  cardsUsed,
  deck,
}: {
  gameId: number
  cardsUsed: Card[]
  deck: Card[]
  winner: boolean
  ended: boolean
}): Game => {
  let outWinner = false
  let outEnded = false
  const outDeck = [...deck]
  const outCardsUsed = [...cardsUsed]
  const board: Card[] = []
  for (let i = 0; i < ONE_HAND; i += 1) {
    const nextCard = outDeck.pop()
    if (typeof nextCard !== 'undefined') {
      outCardsUsed.push(nextCard)
      board.push(nextCard)
    } else break
  }
  if (outDeck.length === 0) {
    for (let i = 0; i < board.length - 1; i += 1) {
      if (board[i].value === ACE) {
        outWinner = true
        break
      }
    }
    outEnded = true
  }
  return {
    gameId,
    cardsUsed: outCardsUsed,
    deck: outDeck,
    board,
    ended: outEnded,
    winner: outWinner,
  }
}
export async function shuffle(sessionID: string): Promise<Game> {
  const gameId = await startGame(sessionID, deckShuffle())

  return getGame(sessionID, gameId)
}
export async function nextHand(sessionID: string, gameId: number): Promise<Game> {
  const preGame = await getGame(sessionID, gameId)
  const postGame = dealHand(preGame)
  await updateGame(sessionID, postGame)
  return postGame
}
export async function streak(sessionID: string): Promise<Streak> {
  return getStreak(sessionID)
}
export async function clearSession(sessionID: string): Promise<boolean> {
  return resetSession(sessionID)
}
