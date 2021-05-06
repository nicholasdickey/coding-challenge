import React from 'react'
import { Motion, spring } from 'react-motion'

import { ReactComponent as Club } from 'assets/Clover.svg'
import { ReactComponent as Diamond } from 'assets/Diamond.svg'
import { ReactComponent as Heart } from 'assets/Heart.svg'
import { ReactComponent as Spade } from 'assets/Spade.svg'

import { CardDatum, Suits } from 'types'

// eslint-disable-next-line
type CardParams = {
  x: number
  y: number
  position: number
  value: CardDatum
  key: string
}
const destinations = [
  { inset: 130, rotation: 10 },
  { inset: 100, rotation: 5 },
  { inset: 90, rotation: 0 },
  { inset: 100, rotation: -5 },
  { inset: 130, rotation: -10 },
]
export default function Card({ x, y, position, value, key }: CardParams) {
  console.info(
    `position ${JSON.stringify({
      x,
      y,
      position,
      rotate: destinations[position].rotation,
    })}`
  )
  let suit: any
  switch (value.suit) {
    case 'clubs':
      suit = <Club className="w-full" />
      break
    case 'spades':
      suit = <Spade className="w-full" />
      break
    case 'hearts':
      suit = <Heart className="w-full" />
      break
    default:
      suit = <Diamond className="w-full" />
  }
  return (
    <Motion
      key={key}
      defaultStyle={{
        left: 50,
        bottom: 4000,
        rotate: 0,
      }}
      style={{
        left: spring(x + 14 + position * 15),
        bottom: spring(y + 200 + destinations[position].inset),
        rotate: spring(destinations[position].rotation),
      }}
    >
      {interpolatedStyle => (
        <div
          className="absolute pb-4 h-12 md:h-16 lg:h-22 xl:h-28 2xl:h-32 w-12 rounded-lg bg-white shadow-2xl "
          style={{
            // height: '28%',
            // width: '12%',
            //  margin: '1%',
            // borderRadius: '8%',
            left: `${interpolatedStyle.left}%`,
            bottom: interpolatedStyle.bottom,
            transform: `rotate(${interpolatedStyle.rotate}deg)`,
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute  top-1 left-2  sm:left-4 w-14 h-11 xl:w-28 xl:h-28 font-rock text-2xl md:text-3xl lg:text-5xl xl:text-7xl">
              {value.card}
            </div>
            <div className="absolute left-2 w-3 h-3 md:top-12  sm:left-4 lg:top-16 lg:left-4 xl:top-22 xl:left-8 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-7 xl:h-7">
              <div className="relative w-full h-full">{suit}</div>
            </div>
            <div className="absolute pb-4 w-6 h-6 top-32 md:top-40 lg:top-36 xl:top-42 left-1/3 w-1/8 h-1/8 sm:w-1/3 sm:h-1/3 md:w-1/3 md:h-1/3 lg:w-1/2 lg:h-1/2 xl:w-1/2 xl:h-1/2 ">
              <div className="relative w-full h-full ">{suit}</div>
            </div>
          </div>
        </div>
      )}
    </Motion>
  )
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
  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <div className="w-auto relative h-full bg-gradient-to-b from-card-light via-card-medium to-card-dark">
        {game.board.map((card, i) => {
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
