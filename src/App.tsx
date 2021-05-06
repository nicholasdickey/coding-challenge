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
  console.info('  inside deal', { cardsLeft, board })
  const outBoard = [...board]
  let outCardsLeft = cardsLeft
  const outCardsUsed = [...cardsUsed]
  const outDeck = [...deck]
  // for (let i = 0; i < ONE_HAND; i += 1) {
  const nextCard = outDeck.pop()

  if (typeof nextCard === 'undefined') return { cardsLeft, cardsUsed, deck, board }

  outCardsUsed.push(nextCard)
  outBoard.push(nextCard)
  outCardsLeft -= 1
  if (outCardsLeft < 0) throw new Error('Unexpected condition -cardsLeft<0')
  // }
  return { cardsLeft: outCardsLeft, cardsUsed: outCardsUsed, deck: outDeck, board: outBoard }
}
function App() {
  const [game, setGame] = React.useState(initGame())
  const reset = () => {
    setGame(initGame())
  }
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
  const ended = game.board.length === 2
  console.info('inside before render', { game })
  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <div className="w-auto relative h-full bg-gradient-to-b from-card-light via-card-medium to-card-dark">
        {game.board.map((card, i) => {
          console.info('inside render card', i)
          return <Card key={`${i + 1}:key`} x={0} y={0} position={i} value={card} />
        })}
      </div>
      <div className="absolute bottom-0 w-full h-2/5">
        {ended ? null : (
          <div className="relative h-full flex items-center justify-center ">
            <button
              type="button"
              onClick={doDeal}
              disabled={ended}
              className={`"w-1/6 p-6 h-19  text-opacity-100 ${
                ended ? 'bg-red-800' : 'bg-yellow-400'
              }
                opacity-80 ${
                  ended ? '' : 'hover:bg-blue-700'
                }  py-2 px-4 border border-black rounded"`}
            >
              <div className="font-rock font-black text-4xl">DEAL</div>
            </button>
          </div>
        )}
        <div className="absolute bottom-0 w-full h-2/5">
          <div className="relative h-full flex items-center justify-end mr-11">
            <button
              type="button"
              onClick={reset}
              className="w-1/8 p-6 h-19  opacity-80 hover:bg-blue-700  py-2 px-4 border border-yellow-400 rounded "
            >
              <div className="font-rock text-yellow-400 text-lg">Reset</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
