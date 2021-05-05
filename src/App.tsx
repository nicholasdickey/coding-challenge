import React from 'react'
import Card from 'Card'
//  import { ReactComponent as Logo } from 'assets/winner.svg'

import shuffle from 'deck'

// eslint-disable-next-line
import { Game } from 'types'

const TOTAL_CARDS = 52
const ONE_HAND = 5

const initGame = () => {
  return {
    cardsLeft: TOTAL_CARDS,
    cardsUsed: new Array<number>(),
    deck: shuffle(),
    board: new Array<number>(),
  }
}
const deal = ({ cardsLeft, cardsUsed, deck }: Game) => {
  const board = new Array<number>()
  for (let i = 0; i < ONE_HAND; i += 1) {
    const nextCard = deck.pop()

    if (typeof nextCard === 'undefined') break

    cardsUsed.push(nextCard)
    board.push(nextCard)
    cardsLeft -= 1
    if (cardsLeft < 0) throw new Error('Unexpected condition -cardsLeft<0')
  }
  return { cardsLeft, cardsUsed, deck, board }
}
function App() {
  const [game, setGame] = React.useState(initGame())
  const doDeal = () => {
    setGame(deal(game))
  }
  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <div className="h-screen bg-gradient-to-b from-card-light via-card-medium to-card-dark">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <button
            type="button"
            onClick={doDeal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          >
            Deal
          </button>
        </div>
        {game.board.map((card, i) => {
          return <Card x={i * 200} y={600} offset={i * 150} value={card} />
        })}
      </div>
    </div>
  )
}

export default App
