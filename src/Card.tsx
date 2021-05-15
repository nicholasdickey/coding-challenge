// eslint-disable-next-line
import React, { ReactElement } from 'react'
import { Motion, spring } from 'react-motion'

import { ReactComponent as Club } from 'assets/Clover.svg'
import { ReactComponent as Diamond } from 'assets/Diamond.svg'
import { ReactComponent as Heart } from 'assets/Heart.svg'
import { ReactComponent as Spade } from 'assets/Spade.svg'
// eslint-disable-next-line
import { CardDatum } from 'types'

// eslint-disable-next-line
type CardParams = {
  x: number
  y: number
  position: number
  value: CardDatum
  ended: boolean
}
const destinations = [
  { inset: 20, rotation: 10 },
  { inset: 17, rotation: 5 },
  { inset: 16, rotation: 0 },
  { inset: 17, rotation: -5 },
  { inset: 20, rotation: -10 },
]
const endDestinations = [
  { inset: 15, rotation: 5 },
  { inset: 15, rotation: -5 },
]
export default function Card({ x, y, position, value, ended }: CardParams) {
  let suit: ReactElement

  switch (value.suit) {
    case 'clubs':
      suit = <Club className="h-full w-2/3 mt-2 mb-4 mr-4" />
      break
    case 'spades':
      suit = <Spade className="h-full w-2/3 mt-2 pl-4 mb-1 mr-4" />
      break
    case 'hearts':
      suit = <Heart className="h-full w-2/3  mt-2 pl-8 mb-1 mr-4" />
      break
    default:
      suit = <Diamond className="h-full w-2/3 mt-2 pl-2 ml-2 mb-2 mr-4" />
  }
  /**
   * Why I am using React style instead of TailwindCSS class notation for left, bottom and rotate dynamic attributes?
   *
   * Short answer: the combination of Create React App and TailwindCSS as a hard requirement for the project.
   *
   * Longer answer: I need pixel perfect positioning for the card movement animation and it is only available with TailwindCSS 2.1 which does not have the postCSS 7 compatibility implementation.
   * Unfortunately Create React App does not support postCSS 8 at the moment. So have to resort to using React style attribute, which severely limits the responsive quality of the positioning of the cards.
   * I could have added Styled-Components to the project but that would be an overkill for a simple test task and would negate the whole rational for using TailwindCSS in the first place.
   *
   * Nick
   *
   *
   */
  console.info('card ', position, ended)
  return (
    <Motion
      defaultStyle={{
        left: 50,
        bottom: 4000,
        rotate: 0,
      }}
      style={{
        left: spring(ended ? x + 36 + position * 15 : x + 14 + position * 15),
        bottom: spring(
          y + 28 + (ended ? endDestinations[position].inset : destinations[position].inset)
        ),
        rotate: spring(
          ended ? endDestinations[position].rotation : destinations[position].rotation
        ),
      }}
    >
      {interpolatedStyle => (
        <div
          className="absolute w-12 h-18 sm:h-18 md:h-24 lg:h-44 xl:h-44 2xl:h-60 rounded-lg bg-white shadow-2xl  max-h-12  sm:max-h-14 md:max-h-16 lg:max-h-14 xl:max-h-24  2xl:max-h-30  z-30"
          style={{
            left: `${interpolatedStyle.left}%`,
            bottom: `${interpolatedStyle.bottom}%`,
            transform: `rotate(${interpolatedStyle.rotate}deg)`,
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute w-full flex flex-col items-start justify-begin p-4">
              <div className=" font-rock top-0  2xl:top-6 left-6 text-xl sm:text-2xl md:text-4xl lg:left-4 lg:text-5xl xl:text-7xl ">
                {value.card}
              </div>
              <div className="relative flex ml-4 mb-4 w-32">{suit}</div>
            </div>
            <div className="absolute w-full flex items-center justify-center pr-4 h-26 sm:h-32 md:h-32 lg:h-1/2 xl:h-1/2 2xl:h-2/3  top-44  md:top-50 lg:top-1/2 xl:top-1/3 z-30">
              {suit}
            </div>
          </div>
        </div>
      )}
    </Motion>
  )
}
