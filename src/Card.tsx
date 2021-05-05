import React from 'react'
// import { ReactComponent as Logo } from 'assets/winner.svg'

// eslint-disable-next-line
import { CardParams } from 'types'

export default function Card({ x, y, offset, value }: CardParams) {
  return <div style={{ position: 'absolute', left: x + offset, top: y }}>{value}</div>
}
