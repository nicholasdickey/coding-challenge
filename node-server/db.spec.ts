import {
  startGame,
  getGame,
  updateGame,
  getStreak,
  getCurrentGame,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dropSchema,
  resetSession,
  Game,
  Streak,
} from './db'
import { shuffle, dealOne } from './test.fixings'

const SESSION_ID = 'test-session-ID'
// eslint-disable-next-line
describe('Test db layer', function() {
  let game: Game
  let gameId: number
  // eslint-disable-next-line
  it('Start Game, store and read back', async () => {
    /* 
    This can't be used for the routine CI regression testing for obvious reasons
    await dropSchema()
    
    */

    await resetSession(SESSION_ID)

    try {
      const noGame = await getGame(SESSION_ID, -1)
      expect(typeof noGame).toEqual('undefined')
    } catch (error) {
      expect(error.toString()).toEqual('Error: The game -1 for session test-session-ID is missing')
    }
    const deck = shuffle()
    gameId = await startGame(SESSION_ID, deck)
    game = await getGame(SESSION_ID, gameId)
    expect({
      gameId,
      board: [],
      cardsUsed: [],
      ended: false,
      winner: false,
      deck,
    }).toEqual(game)
    const currentGame = await getCurrentGame(SESSION_ID)
    expect(currentGame).toEqual(game)
  })

  it('Update game', async () => {
    const modifiedGame = dealOne(game)
    await updateGame(SESSION_ID, modifiedGame)
    const updatedGame = await getGame(SESSION_ID, gameId)
    expect(updatedGame).toEqual(modifiedGame)
    const currentGame = await getCurrentGame(SESSION_ID)
    expect(currentGame).toEqual(updatedGame)
  })
  it('Test streak', async () => {
    await resetSession(SESSION_ID)
    const lostGames: Game[] = []
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line
      let gid = await startGame(SESSION_ID, shuffle())
      // eslint-disable-next-line
      lostGames[i] = await getGame(SESSION_ID, gid)
    }
    const streak: Streak = await getStreak(SESSION_ID)
    expect(streak).toEqual({
      winner: false,
      streak: 0,
    })
  })
}