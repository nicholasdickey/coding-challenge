import React from 'react'
import Card from 'Card'

import shuffle from 'deck'

// eslint-disable-next-line
import { Game, CardDatum, cardLiteralA } from 'types'

const TOTAL_CARDS = 52
const ONE_HAND = 5
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const initGame = (comment: string) => {
  // eslint-disable-next-line
  console.info('initGame', comment)
  return {
    cardsLeft: TOTAL_CARDS,
    cardsUsed: [] as CardDatum[],
    deck: shuffle(),
    board: [] as CardDatum[],
    ended: false,
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

  if (typeof nextCard === 'undefined') return { cardsLeft, cardsUsed, deck, board, ended: false }

  outCardsUsed.push(nextCard)
  outBoard.push(nextCard)
  outCardsLeft -= 1
  if (outCardsLeft < 0) throw new Error('Unexpected condition -cardsLeft<0')
  // }
  return {
    cardsLeft: outCardsLeft,
    cardsUsed: outCardsUsed,
    deck: outDeck,
    board: outBoard,
    ended: false,
  }
}
function App() {
  const [game, setGame] = React.useState(initGame('default'))

  const reset = () => {
    setGame(initGame('reset'))
    // eslint-disable-next-line
    console.info('reset')
  }

  const doDeal = async () => {
    let gameUpdate = game
    let board: CardDatum[] = []
    setGame({ ...game, ...{ board } })
    await sleep(50)
    console.info('doDeal')
    for (let pass = 1; pass <= ONE_HAND; pass += 1) {
      gameUpdate = deal(gameUpdate, board)
      board = gameUpdate.board
      setGame(gameUpdate)

      // eslint-disable-next-line
      await sleep(150)
      if (pass === ONE_HAND && board.length <= 2) {
        setGame({ ...game, ended: true })
        console.info('setEnded')
      }
    }
  }
  const winner =
    game.ended && (game.board[0].card === cardLiteralA || game.board[1].card === cardLiteralA)
      ? true
      : false
  /**
   * See note in Card.tsx on the reason for using style React attribute.
   * In this case it is to override h-screen property of Tailwind and provide graceful degrading of responsive appearance when window height is below 600px
   *
   */
  return (
    <div className="h-screen flex flex-col bg-gray-300 pb-0">
      <div
        className="w-auto relative h-full bg-gradient-to-b from-card-light via-card-medium to-card-dark"
        style={{ minHeight: 240 }}
      >
        {game.board.map((card, i) => {
          return <Card key={`${i + 1}:key`} x={0} y={0} position={i} value={card} />
        })}
      </div>
      <div className="absolute bottom-0 w-full h-1/2">
        <div
          className="relative h-full flex items-center justify-center z-10"
          style={{ minHeight: 200 }}
        >
          <div className="m-auto w-full flex items-center justify-center z-20">
            {game.ended ? (
              <div>
                <div className="font-rock text-white  text-5xl">
                  {winner ? <div>Gret job! You won the game!</div> : <div>You Lose, Sucker!</div>}
                </div>
                <div className="w-full flex items-center justify-center m-auto pt-6">
                  <button
                    type="button"
                    onClick={reset}
                    className="m-auto w-1/8 p-2 opacity-80 hover:bg-blue-800 py-1 px-4 border border-yellow-400 rounded "
                  >
                    <div className="font-rock text-yellow-400 text-lg">Play Again</div>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={doDeal}
                className={`"m-auto w-1/8 p-6 h-18  bg-yellow-400 opacity-80  hover:bg-blue-800 py-1 px-2 border border-black rounded"`}
              >
                <div className="font-rock font-black text-4xl">DEAL</div>
              </button>
            )}
          </div>
          <div className="absolute bottom-8 w-full h-2/7">
            <div className=" h-full flex items-end justify-end mb-0 pb-0 mr-12">
              <button
                type="button"
                onClick={reset}
                className="w-1/8 mb-8 py-1  opacity-80 hover:bg-blue-800  px-2 border border-yellow-400 rounded "
              >
                <div className="font-rock text-yellow-400 text-lg">Reset</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
