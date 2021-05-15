import fs from 'fs'
import { graphql } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { Card } from './graphql-types'
import { resolvers } from './resolvers'

const RESET_MUTATION = (sessionID: string) => {
  return {
    id: 'Mutation to reset the session - delete all the games and associated card collections',
    query: `
      mutation {
        resetSession(sessionID:"${sessionID}") {
            success
        }
      }
    `,
  }
}
const SHUFFLE_MUTATION = (sessionID: string) => {
  return {
    id: 'Mutation to get a new game with a freshly shuffled deck',
    query: `
      mutation {
        shuffle(sessionID:"${sessionID}") {
            success
            game{
                gameId
                deck {
                    value
                    suit
                }
                board {
                    value
                    suit
                }
                cardsUsed {
                    value
                    suit
                }
                ended
           }
        }
      }
    `,
  }
}
const NEXTHAND_MUTATION = (sessionID: string, gameId: number) => {
  return {
    id: 'Mutation to get a top the five cards from existing game/deck',
    query: `
      mutation {
        nextHand(sessionID:"${sessionID}", gameId:${gameId}) {
            success
            game{
                gameId
                deck {
                    value
                    suit
                }
                board {
                    value
                    suit
                }
                cardsUsed {
                    value
                    suit
                }
                ended
                winner
           }
        }
      }
    `,
  }
}
const STREAK_QUERY = (sessionID: string) => {
  return {
    id: 'Query to get a winning/losing streak fro the session',
    query: `
      query {
        getStreak(sessionID:"${sessionID}") {
            success
            streak{
                winner
                length
            }
        }
      }
    `,
  }
}
// eslint-disable-next-line

const typeDefs = fs.readFileSync('./schema.graphql', 'utf8')
const schema = makeExecutableSchema({ typeDefs, resolvers })
const winners: boolean[] = []
describe(`GQL Test`, () => {
  // running the test for each case in the cases array
  const { query: resetQuery } = RESET_MUTATION('gql-test-session')
  const { id: shuffleId, query: shuffleQuery } = SHUFFLE_MUTATION('gql-test-session')
  it(`query: ${shuffleId}`, async () => {
    const resetResult = await graphql(schema, resetQuery)
    expect(resetResult.data?.resetSession?.success).toEqual(true)
    const resultWrap = await graphql(schema, shuffleQuery)
    // console.info('graphql result', JSON.stringify(resultWrap))
    const result = resultWrap?.data?.shuffle

    console.info(
      JSON.stringify(
        {
          result: {
            success: result.success,
            deckLength: result.game?.deck?.length,
            boardLength: result.game?.board?.length || 0,
            cardsUsedLength: result.game?.cardsUsed?.length,
          },
        },
        null,
        4
      )
    )
    return expect({
      success: result.success,
      deckLength: result.game?.deck?.length,
      boardLength: result.game?.board?.length || 0,
      cardsUsedLength: result.game?.cardsUsed?.length,
    }).toEqual({
      success: true,
      deckLength: 52,
      boardLength: 0,
      cardsUsedLength: 0,
    })
  })
  it(`Test nextHand`, async () => {
    // describe(`Deal`, async () => {

    await graphql(schema, resetQuery)

    for (let gameIndex = 0; gameIndex < 6; gameIndex += 1) {
      let ended = false
      let firstRun = true

      // eslint-disable-next-line no-await-in-loop
      const shuffleResultWrap = await graphql(schema, shuffleQuery)
      const gameId = shuffleResultWrap?.data?.shuffle?.game?.gameId
      const { id: dealId, query: dealQuery } = NEXTHAND_MUTATION('gql-test-session', gameId)
      console.info(JSON.stringify({ dealId, dealQuery }, null, 4))
      while (!ended) {
        // eslint-disable-next-line no-await-in-loop
        const resultWrap = await graphql(schema, dealQuery)
        // console.info(JSON.stringify({ resultWrap }, null, 4))
        const result = resultWrap?.data?.nextHand
        // console.info(JSON.stringify({ result }, null, 4))
        if (firstRun) {
          // eslint-disable-next-line no-constant-condition
          firstRun = false
          if (gameIndex === 0) {
            // run jest test only once

            expect({
              success: result?.success,
              deckLength: result?.game?.deck?.length,
              boardLength: result?.game?.board?.length || 0,
              cardsUsedLength: result?.game?.cardsUsed?.length,
              ended: result?.game?.ended,
              winner: result?.game?.winner,
            }).toEqual({
              success: true,
              deckLength: 47,
              boardLength: 5,
              cardsUsedLength: 5,
              ended: false,
              winner: false,
            })
          }
        }
        ended = result.game?.ended as boolean
        if (ended) {
          // console.info('pushing winner:', result.game?.winner)
          winners.push(result.game?.winner as boolean)
          if (gameIndex === 0) {
            const board: Card[] = result.game?.board as Card[]
            let localWinner = false
            board.forEach((card: Card) => {
              if (card.value === 1) localWinner = true
            })
            // console.info('gameIndex=0', JSON.stringify({ board }))

            const winner: boolean = result.game?.winner as boolean
            expect(winner).toEqual(localWinner)
          }
        }
      }
    }
  }, 60000)

  it(`Testing getStreak, comparing to actual results`, async () => {
    const { id: streakId, query: streakQuery } = STREAK_QUERY('gql-test-session')
    console.info(JSON.stringify({ streakId, streakQuery }, null, 4))
    const streakResultWrap = await graphql(schema, streakQuery)
    const result = streakResultWrap?.data?.getStreak
    // console.info('streak', JSON.stringify({ result }, null, 4))
    // calc streak independently:
    const winner = winners[winners.length - 1]
    let streakLength = 1
    // console.info(JSON.stringify({ winners: [...winners] }, null, 4))
    for (let i = winners.length - 2; i >= 0; i--) {
      // console.info('for each winner', i)
      const currentWinner = winners[i]

      // if (i === 0) winner = currentWinner || false
      if (winner !== currentWinner) break
      streakLength++
    }
    console.info('WINNERS:', JSON.stringify({ winners, winner, length: streakLength }, null, 4))
    return expect({
      success: result.success,
      winner: result.streak?.winner,
      length: result.streak?.length,
    }).toEqual({ success: true, winner, length: streakLength })
  })
})
