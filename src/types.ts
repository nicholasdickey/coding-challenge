export type Suits = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type CardDatum = { suit: Suits; card: number }
export type Game = {
  cardsLeft: number
  cardsUsed: CardDatum[]
  deck: CardDatum[]
  board: CardDatum[]
}
