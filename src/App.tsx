import React from 'react'
import Card from 'Card'
//  import { ReactComponent as Logo } from 'assets/winner.svg'

import shuffle from 'deck'

// eslint-disable-next-line
import { Game, CardDatum } from 'types'

const TOTAL_CARDS = 52
const ONE_HAND = 5
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const initGame = () => {
  return {
    cardsLeft: TOTAL_CARDS,
    cardsUsed: [] as CardDatum[],
    deck: shuffle(),
    board: [] as CardDatum[],
  }
}
const deal = ({ cardsLeft, cardsUsed, deck }: Game, board: CardDatum[]) => {
  const outBoard = [...board]
  let outCardsLeft = cardsLeft
  const outCardsUsed = [...cardsUsed]
  const outDeck = [...deck]
  for (let i = 0; i < ONE_HAND; i += 1) {
    const nextCard = outDeck.pop()

    if (typeof nextCard === 'undefined') break

    outCardsUsed.push(nextCard)
    outBoard.push(nextCard)
    outCardsLeft = cardsLeft - 1
    if (outCardsLeft < 0) throw new Error('Unexpected condition -cardsLeft<0')
  }
  return { cardsLeft: outCardsLeft, cardsUsed: outCardsUsed, deck: outDeck, board: outBoard }
}
function App() {
  const [game, setGame] = React.useState(initGame())
  const doDeal = async () => {
    let gameUpdate = game
    let board: CardDatum[] = []
    setGame({ ...game, ...{ board } })
    await sleep(50)
    for (let pass = 1; pass <= ONE_HAND; pass += 1) {
      gameUpdate = deal(gameUpdate, board)
      board = gameUpdate.board
      setGame(gameUpdate)
      console.info('Inside deal pass', JSON.stringify({ gameUpdate, pass }))
      // eslint-disable-next-line
      await sleep(150)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <div className="w-auto relative h-full bg-gradient-to-b from-card-light via-card-medium to-card-dark">
        <div className="absolute p-6 w-auto mx-auto ">
          <button
            type="button"
            onClick={doDeal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          >
            Deal
          </button>
        </div>
        {game.board.map((card, i) => {
          return <Card key={`${i + 1}:key`} x={0} y={0} position={i} value={card} />
        })}
      </div>
    </div>
  )
}

export default App
