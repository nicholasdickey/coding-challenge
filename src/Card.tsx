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
  key: string
}
const destinations = [
  { inset: 20, rotation: 10 },
  { inset: 17, rotation: 5 },
  { inset: 16, rotation: 0 },
  { inset: 17, rotation: -5 },
  { inset: 20, rotation: -10 },
]
export default function Card({ x, y, position, value, key }: CardParams) {
  /* console.info(
    `position ${JSON.stringify({
      x,
      y,
      position,
      rotate: destinations[position].rotation,
    })}`
  ) */
  let suit: ReactElement

  switch (value.suit) {
    case 'clubs':
      suit = <Club className="h-full mb-1 mr-4" />
      break
    case 'spades':
      suit = <Spade className="h-full mb-1 mr-4" />
      break
    case 'hearts':
      suit = <Heart className="h-full mb-1 mr-4" />
      break
    default:
      suit = <Diamond className="h-full mb-1 mr-4" />
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
   * Of course, given my drathers, I would use Next.js and Styled-components to begin with, and the implementation would have been 100% responsive. As is, the app stays fully responsive to the minimum height of 540 and then gracefully degrades (vertical supported is 480px which should be sufficient for phones.
   *
   * Nick
   *
   *
   */
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
        bottom: spring(y + 28 + destinations[position].inset),
        rotate: spring(destinations[position].rotation),
      }}
    >
      {interpolatedStyle => (
        <div
          className="absolute w-12 h-18 sm:h-18 md:h-20 l:h-48 2xl:h-60 rounded-lg bg-white shadow-2xl  max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-20 xl:max-h-28  z-30"
          style={{
            left: `${interpolatedStyle.left}%`,
            bottom: `${interpolatedStyle.bottom}%`,
            transform: `rotate(${interpolatedStyle.rotate}deg)`,
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute w-full flex flex-col items-start justify-begin p-4">
              <div className="  font-rock top-0  2xl:top-6 left-6 text-2xl md:text-4xl lg:left-4 lg:text-5xl xl:text-6xl ">
                {value.card}
              </div>
              <div className="relative flex ml-4 w-20">{suit}</div>
            </div>
            <div className="absolute w-full flex items-center justify-end pr-4 h-26 sm:h-32 md:h-32 lg:h-1/2 xl:h-1/3 top-44  md:top-50 lg:top-1/2 z-30">
              {suit}
            </div>
          </div>
        </div>
      )}
    </Motion>
  )
}
