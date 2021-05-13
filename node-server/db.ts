import { Pool, QueryResult } from 'pg'

export enum CollectionType {
  Deck,
  Board,
  CardsUsed,
}
export type Card = { value: number; suit: number }
export type Game = {
  gameId: number
  ended: boolean
  winner: boolean
  deck: Card[]
  board: Card[]
  cardsUsed: Card[]
}
const pool: Pool = new Pool({
  user: 'postgres',
  host: process.env.GITHUB === '1' ? 'localhost' : 'db',
  database: 'uplifty',
  port: 5432,
})
/* pool.on('error', err => {
  console.error('Unexpected error on idle client', err)
  throw new Error(`Unexpected error on idle client ${err}`)
})  */
async function query(q: string, v?: any[]): Promise<QueryResult> {
  const client = await pool.connect()

  // console.info('query:', q, v)

  let res
  try {
    await client.query('BEGIN')
    try {
      res = await client.query(q, v)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } finally {
    client.release()
  }
  return res
}
export async function lazyInitSchema() {
  try {
    const schemaResponse = await query(`SELECT * from pg_tables where tablename like $1`, [
      'node_%',
    ])
    if (schemaResponse.rows?.length < 2) {
      // console.info('schema is missing')
      // eslint-disable-next-line
      let createResult = await query(
        'CREATE TABLE IF NOT EXISTS node_games (game_id SERIAL PRIMARY KEY,session_id VARCHAR(126),ended BOOLEAN ,time_started TIMESTAMP,time_ended TIMESTAMP,winner BOOLEAN)'
      )
      // console.info('table node_games create result', JSON.stringify(createResult))
      // eslint-disable-next-line
      createResult = await query(
        `CREATE TABLE IF NOT EXISTS node_cards (card_id SERIAL PRIMARY KEY ,game_id INT, collection_type INT, ordinal INT, value INT, suit INT);`
      )
      // console.info('table node_cards create result', createResult)
    } else {
      // console.info('schema is present')
      // console.info('rows', JSON.stringify(schemaResponse.rows))
    }
  } catch (error) {
    console.error('Caught exception in lazyInitSchema:', error)
    throw error
  }
}

async function getCards(gameId: number, collectionType: CollectionType): Promise<Card[]> {
  try {
    const cardsResult = await query(
      `SELECT value,suit from node_cards where game_id=$1 and collection_type=$2 order by ordinal ASC; `,
      [gameId, collectionType as number]
    )
    let cards: Card[] = cardsResult.rows
    if (!cards || !cards.length) cards = []
    return cards
  } catch (error) {
    console.error('Caught exception in getCards:', error)
    throw error
  }
}
async function updateCards(gameId: number, collectionType: CollectionType, cards: Card[]) {
  try {
    await query(`DELETE from node_cards where game_id=$1;`, [gameId])
    const inserts = []
    for (let ordinal = 0; ordinal < cards.length; ordinal += 1) {
      inserts.push(
        query(
          `INSERT INTO node_cards(game_id,collection_type,ordinal,value,suit) VALUES($1,$2,$3,$4,$5); `,
          [gameId, collectionType as number, ordinal, cards[ordinal].value, cards[ordinal].suit]
        )
      )
    }
    // eslint-disable-next-line
    const cardsResult = await Promise.all(inserts)
  } catch (error) {
    console.error('Caught exception in updateCards:', error)
    throw error
  }
}
export async function startGame(sessionID: string, deck: Card[]): Promise<number> {
  try {
    await lazyInitSchema()

    const gameResult = await query(
      'INSERT INTO node_games(session_id,ended, time_started,time_ended,winner) VALUES( $1 ,FALSE,NOW(),NOW(),FALSE) RETURNING game_id;',
      [sessionID]
    )
    // console.info('startGame:gamekResult', gameResult.rows[0])
    const gameId = gameResult.rows[0].game_id
    const inserts = []
    for (let ordinal = 0; ordinal < deck.length; ordinal += 1) {
      inserts.push(
        query(
          `INSERT INTO node_cards(game_id,collection_type,ordinal,value,suit) VALUES($1,0,$2,$3,$4); `,
          [gameId, ordinal, deck[ordinal].value, deck[ordinal].suit]
        )
      )
    }
    await Promise.all(inserts)

    return gameId
  } catch (error) {
    console.error('Caught exception in startGame:', error)
    throw error
  }
}
// Note that gameId is not really needed, just added it to demonstrate passing arguments with GQL
export async function getGame(sessionID: string, gameId: number): Promise<Game> {
  try {
    await lazyInitSchema()
    const deckPromise = getCards(gameId, CollectionType.Deck)
    const boardPromise = getCards(gameId, CollectionType.Board)
    const cardsUsedPromise = getCards(gameId, CollectionType.CardsUsed)
    const gamePromise = query(
      `SELECT game_id,ended,winner from node_games where session_id=$1 and game_id=$2; `,
      [sessionID, gameId]
    )
    const results = await Promise.all([deckPromise, boardPromise, cardsUsedPromise, gamePromise])

    // console.info('game from db:', results[3].rows[0])
    if (!results[3].rows?.length)
      throw new Error(`The game ${gameId} for session ${sessionID} is missing`)
    const game = {
      gameId: results[3].rows[0].game_id,
      ended: results[3].rows[0].ended,
      winner: results[3].rows[0].winner,
    }
    const deck = results[0]
    const board = results[1]
    const cardsUsed = results[2]
    return (Object.assign(game, { deck, board, cardsUsed }) as unknown) as Game
  } catch (error) {
    console.error('Caught exception in getGame:', error)
    throw error
  }
}
export async function updateGame(sessionID: string, game: Game) {
  try {
    const deckPromise = updateCards(game.gameId, CollectionType.Deck, game.deck)
    const boardPromise = updateCards(game.gameId, CollectionType.Board, game.board)
    const cardsUsedPromise = updateCards(game.gameId, CollectionType.CardsUsed, game.cardsUsed)
    const gamePromise = query(
      `UPDATE node_games set ended=$1,winner=$2, time_ended=NOW() where session_id=$3 and game_id=$4;`,
      [game.ended, game.winner, sessionID, game.gameId]
    )
    await Promise.all([deckPromise, boardPromise, cardsUsedPromise, gamePromise])
  } catch (error) {
    console.error('Caught exception in updateGame:', error)
    throw error
  }
}

export async function getStreak(
  sessionID: string
): Promise<{
  winner: boolean
  streak: number
}> {
  try {
    let streak
    const singleGame = async (ordinal: number): Promise<boolean> => {
      const result = await query(
        `SELECT winner from node_games where session_id=$1 order by time_ended DESC LIMIT 1 OFFSET ${ordinal};`,
        [sessionID]
      )
      return result.rows[0]?.winner
    }
    let ordinal = 0

    const winner = await singleGame(ordinal++)
    // console.info('singleGame after first game', { winner, ordinal })
    let currentWinner = winner
    streak = 0
    while (winner === currentWinner) {
      // eslint-disable-next-line no-await-in-loop
      currentWinner = await singleGame(ordinal++)
      if (typeof currentWinner !== 'undefined') {
        streak += 1
        // console.info('singleGame after next game', { currentWinner, ordinal, streak })
      }
    }

    return { winner, streak }
  } catch (error) {
    console.error('Caught exception in getStreak:', error)
    throw error
  }
}

// for testing
export async function dropSchema() {
  console.info('starting db test')
  await query(`DROP TABLE IF EXISTS node_games;`)
  console.info('after drop node_games')
  await query(`DROP TABLE IF EXISTS node_cards;`)
  console.info('after drop node_cards')
}
