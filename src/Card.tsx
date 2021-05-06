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
