export interface Game {
  cardsLeft: number
  cardsUsed: Array<number>
  deck: Array<number>
  board: Array<number>
}
export interface CardParams {
  x: number
  y: number
  offset: number
  value: number
}
