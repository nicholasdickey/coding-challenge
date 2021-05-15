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
  ended,
  winner,
}: {
  gameId: number
  cardsUsed: Card[]
  deck: Card[]
  winner: boolean
  ended: boolean
}): Game => {
  const board: Card[] = []
  for (let i = 0; i < ONE_HAND; i += 1) {
    const nextCard = deck.pop()
    if (typeof nextCard !== 'undefined') {
      cardsUsed.push(nextCard)
      board.push(nextCard)
    } else break
  }
  if (board.length === 2) {
    for (let i = 0; i < 2; i += 1) {
      if (board[i].value === ACE) {
        // eslint-disable-next-line  no-param-reassign
        winner = true
      }
    }
    // eslint-disable-next-line  no-param-reassign
    ended = true
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
export async function shuffle(sessionID: string): Promise<Game> {
  const gameId = await startGame(sessionID, deckShuffle())
  // console.info('modl:shuffle: gameId:', gameId)
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
