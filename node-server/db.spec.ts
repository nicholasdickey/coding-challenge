import { startGame, getGame, updateGame, getStreak, dropSchema, resetSession, Game } from './db'
import { shuffle, dealOne } from './test.fixings'

const SESSION_ID = 'test-session-ID'
// eslint-disable-next-line
describe('Test db layer', function() {
  let game: Game
  let gameId: number
  // eslint-disable-next-line
  it('Start Game, store and read back', async () => {
    // await lazyInitSchema()
    /* 
    This can't be used for the routine CI regression testing for obvious reasons
    await dropSchema()
    
    */
    //    console.log('after drop schema')
    await resetSession(SESSION_ID)

    try {
      const noGame = await getGame(SESSION_ID, 1)
      console.info('noGame:', noGame)
    } catch (error) {
      expect(error.toString()).toEqual('Error: The game 1 for session test-session-ID is missing')
    }
    const deck = shuffle()
    // console.info('in: deck:', deck)
    gameId = await startGame(SESSION_ID, deck)
    // console.info('test initGame gameId:', gameId)
    game = await getGame(SESSION_ID, gameId)
    console.info('game', game)
    expect({
      gameId,
      board: [],
      cardsUsed: [],
      ended: false,
      winner: false,
      deck,
    }).toEqual(game)
  })
  it('Update game', async () => {
    const modifiedGame = dealOne(game)
    // console.info(JSON.stringify({ modifiedGame }))
    await updateGame(SESSION_ID, modifiedGame)
    const updatedGame = await getGame(SESSION_ID, gameId)
    expect(updatedGame).toEqual(modifiedGame)
  })
  it('Test streak', async () => {
    const lostGames: Game[] = []
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line
      let gid = await startGame(SESSION_ID, shuffle())
      // eslint-disable-next-line
      lostGames[i] = await getGame(SESSION_ID, gid)
    }
    const streak: { winner: boolean; streak: number } = await getStreak(SESSION_ID)
    expect(streak).toEqual({
      winner: false,
      streak: 5,
    })
  })
})
