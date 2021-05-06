import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initGame, dealOne } from 'deck.ts'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
it('initGame, shuffle the deck. Correct deck is served', () => {
  const game = initGame()
  expect(game.board.length).toEqual(0)
  expect(game.deck.length).toEqual(52)
  expect(game.cardsLeft).toEqual(52)
  expect(game.cardsUsed.length).toEqual(0)
  expect(game.ended).toEqual(false)
  expect(game.inflight).toEqual(false)
  const uniqueCards = new Set()
  const possibleCards = new Set(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'])
  const suitCounts = {
    hearts: 0,
    diamonds: 0,
    spades: 0,
    clubs: 0,
  }
  for (let i = 0; i < 52; i += 1) {
    const card = game.deck[i]
    uniqueCards.add(`${card.suit}:${card.card}`)
    suitCounts[card.suit] += 1
    expect(possibleCards.has(card.card)).toEqual(true)
  }
  expect(uniqueCards.size).toEqual(52) // no duplicates
  expect(suitCounts.hearts).toEqual(13)
  expect(suitCounts.diamonds).toEqual(13)
  expect(suitCounts.spades).toEqual(13)
  expect(suitCounts.clubs).toEqual(13)
})
it('deal one card of the top', () => {
  const game = initGame()

  const afterDealGame = dealOne(game, game.board)
  expect(afterDealGame.cardsLeft).toEqual(51)
  expect(afterDealGame.board.length).toEqual(1)
  expect(afterDealGame.cardsUsed.length).toEqual(1)
})
