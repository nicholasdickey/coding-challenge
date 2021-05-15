import { GameResult, StreakResult } from './graphql-types'
import { shuffle, nextHand, streak, clearSession } from './model'

export const resolvers = {
  Query: {
    getStreak: async (parent: any, args: any, context: any): Promise<StreakResult> => {
      // eslint-disable-next-line
      const { sessionID } = context ? context : args
      const streakResult: StreakResult = {
        success: false,
      }
      try {
        const streakWrapper = await streak(sessionID)
        console.info('STREAK RESOLVER', JSON.stringify({ streakWrapper }, null, 4))
        streakResult.success = true
        streakResult.streak = {
          winner: streakWrapper.winner,
          length: streakWrapper.streak,
        }
      } catch (error) {
        console.error(error)
        streakResult.msg = error // in the real world, message would be less revealing, perhaps some code
      }
      return streakResult
    },
  },
  Mutation: {
    shuffle: async (parent: any, args: any, context: any): Promise<GameResult> => {
      //  console.info('STARTING shuffle mutation')
      // eslint-disable-next-line
      const { sessionID } = context ? context : args
      const gameResult: GameResult = {
        success: false,
      }
      try {
        gameResult.game = await shuffle(sessionID)
        gameResult.success = true
      } catch (error) {
        console.error(error)
        gameResult.msg = error // in the real world, message would be less revealing, perhaps some code
      }
      /* console.info(
        'Resolver returning game:',
        JSON.stringify(
          {
            gameResult,
          },
          null,
          4
        )
      ) */
      return gameResult
    },
    nextHand: async (parent: any, args: any, context: any): Promise<GameResult> => {
      // eslint-disable-next-line
      const { sessionID } = context ? context : args
      const { gameId } = args
      const gameResult: GameResult = {
        success: false,
      }
      try {
        gameResult.game = await nextHand(sessionID, gameId)
        gameResult.success = true
      } catch (error) {
        console.error(error)
        gameResult.msg = error // in the real world, message would be less revealing, perhaps some code
      }
      /*  console.info(
        'Deal Resolver returning game:',
        JSON.stringify(
          {
            gameResult,
          },
          null,
          4
        )
      ) */
      return gameResult
    },
    resetSession: async (parent: any, args: any, context: any): Promise<{ success: boolean }> => {
      // eslint-disable-next-line
      const { sessionID } = context ? context : args
      return { success: await clearSession(sessionID) }
    },
  },
}
