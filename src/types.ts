export type Suits = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type CardDatum = { suit: Suits; card: string }
export type Game = {
  cardsLeft: number
  cardsUsed: CardDatum[]
  deck: CardDatum[]
  board: CardDatum[]
  ended: boolean
  inflight: boolean
}
export const cardLiteralA = 'A'
export const cardLiteralJ = 'J'
export const cardLiteralQ = 'Q'
export const cardLiteralK = 'K'

export const TOTAL_CARDS = 52
export const ONE_HAND = 5
