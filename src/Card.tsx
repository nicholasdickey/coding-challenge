import React from 'react'
import { Motion, spring } from 'react-motion'
import { CardDatum, Suits } from 'types'
// import { ReactComponent as Logo } from 'assets/winner.svg'

// eslint-disable-next-line
type CardParams = {
  x: number
  y: number
  position: number
  value: CardDatum
  key: string
}
const destinations = [
  { inset: 140, rotation: 10 },
  { inset: 100, rotation: 5 },
  { inset: 80, rotation: 0 },
  { inset: 100, rotation: -5 },
  { inset: 140, rotation: -10 },
]
export default function Card({ x, y, position, value, key }: CardParams) {
  console.info(
    `position ${JSON.stringify({ x, y, position, rotate: destinations[position].rotation })}`
  )
  const vw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth // Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

  // eslint-disable-next-line

  return (
    <Motion
      key={key}
      defaultStyle={{
        left: 50,
        bottom: 4000,
        rotate: 0,
      }}
      style={{
        left: spring(x + 12.5 + position * 15),
        bottom: spring(y + destinations[position].inset),
        rotate: spring(destinations[position].rotation),
      }}
    >
      {interpolatedStyle => (
        <div
          className="absolute h-16 md:h-22 lg:h-28 xl:h-32 w-12 rounded-lg bg-white shadow-2xl "
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
          {JSON.stringify(value)}
        </div>
      )}
    </Motion>
  )
}
