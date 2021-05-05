import React from 'react'
import { CardDatum, Suits } from 'types'
// import { ReactComponent as Logo } from 'assets/winner.svg'

// eslint-disable-next-line
type CardParams = {
  x: number
  y: number
  offset: number
  value: CardDatum
}

export default function Card({ x, y, offset, value }: CardParams) {
  return (
    <div style={{ position: 'absolute', left: x + offset, top: y }}>{JSON.stringify(value)}</div>
  )
}
