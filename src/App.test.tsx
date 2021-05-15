import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App'
import { initGame, dealOne } from 'deck.ts'

let game
let uniqueCards
let suitCounts
let afterDealGame

const { REACT_APP_GRAPHQL_URI } = process.env
console.info('graphql setup', { REACT_APP_GRAPHQL_URI })
const client = new ApolloClient({
  uri: REACT_APP_GRAPHQL_URI || window.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
  credentials: 'same-origin',
})
it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})

/*
// eslint-disable-next-line
describe('Init Deck', function() {
  it('initGame, shuffle the deck', () => {
    game = initGame()
  })
  it('board is not populated yet', () => {
    expect(game.board.length).toEqual(0)
  })
  it('deck is 52 cards long', () => {
    expect(game.deck.length).toEqual(52)
  })
  it('52 cards left', () => {
    expect(game.cardsLeft).toEqual(52)
  })
  it('Cards used=0', () => {
    expect(game.cardsUsed.length).toEqual(0)
  })
  it('game.ended is false', () => {
    expect(game.ended).toEqual(false)
  })
  it('dealing is not in progress', () => {
    expect(game.inflight).toEqual(false)
  })
  it('deck has every card', () => {
    uniqueCards = new Set()
    const possibleCards = new Set([
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
    ])
    suitCounts = {
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
  })
  it('no duplicate', () => {
    expect(uniqueCards.size).toEqual(52)
  })
  it('13 hearts', () => {
    expect(suitCounts.hearts).toEqual(13)
  })
  it('13 diamonds', () => {
    expect(suitCounts.diamonds).toEqual(13)
  })
  it('13 spades', () => {
    expect(suitCounts.spades).toEqual(13)
  })
  it('13 clubs', () => {
    expect(suitCounts.clubs).toEqual(13)
  })
})

// eslint-disable-next-line
describe('Deal one card of the top', function() {
  it('init deck', () => {
    game = initGame()
  })
  it('dealOne does not crash', () => {
    afterDealGame = dealOne(game, game.board)
  })

  it('51 cards left', () => {
    expect(afterDealGame.cardsLeft).toEqual(51)
  })
  it('one card on the board', () => {
    expect(afterDealGame.board.length).toEqual(1)
  })
  it('cardUsed has one card ', () => {
    expect(afterDealGame.cardsUsed.length).toEqual(1)
  })
})
*/
