import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { SHUFFLE_MUTATION, NEXTHAND_MUTATION, STREAK_QUERY,CURRENT_GAME_QUERY } from './gql'
import Card from 'Card'
import { ReactComponent as Winner } from 'assets/winner.svg'
import { initGame, importGQLGame, deal } from 'deck'
// eslint-disable-next-line
import type { CardDatum } from 'types'

function App() {
  const [game, setGame] = React.useState((initGame()))
  useQuery(CURRENT_GAME_QUERY, {
    variables: { sessionID: 'uplifty-client-session' },
    onCompleted: data => {
      const inGame = data.getCurrentGame.game
      const outGame = importGQLGame(inGame)
      setGame(outGame) 
    },
  })
  let streak = { winner: false, length: 0 };
  const [shuffle] = useMutation(SHUFFLE_MUTATION, {
    variables: { sessionID: 'uplifty-client-session' },
    onCompleted: data => {
      const inGame = data.shuffle.game
      const outGame = importGQLGame(inGame)
      setGame(outGame)
    },
  })
  
  const { data:streakData,refetch:getStreak } = useQuery(STREAK_QUERY, {
    variables: { sessionID: 'uplifty-client-session' },
  })
  if (streakData)
    streak = streakData.getStreak.streak;
  const [nextHand] = useMutation(NEXTHAND_MUTATION, {
    onCompleted: data => {
      const inGame = data.nextHand.game
      const outGame = importGQLGame(inGame)
      deal(outGame, game, setGame)
      if (outGame.ended) {
        getStreak()
      }
    },
  })

  const { winner } = game
  const firstGame = game.deck.length === 0 && game.cardsUsed.length === 0
  /**
   * See note in Card.tsx on the reason for using style React attribute.
   * In this case it is to override h-screen property of Tailwind and provide graceful degrading of responsive appearance when window height is below 600px
   *
   */
  return (
    <div className="h-screen flex flex-col bg-gray-300 pb-0">
      <div
        className="w-auto relative h-full bg-gradient-to-b from-card-light via-card-medium to-card-dark"
        style={{ minHeight: 400 }}
      >
        {game.board.map((card: CardDatum, i: number) => {
          return (
            <Card
              key={`${card.card}-${card.suit}:card`}
              x={0}
              y={0}
              position={i}
              value={card}
              ended={game.ended}
            />
          )
        })}
      </div>
      <div className="absolute top-0 flex items-start justify-start w-full ">
        <div className=" mx-auto  mt-1 h-full xl:h-1/2 w-1/4 lg:w-1/5 bg-black border rounded border-yellow-400 text-white font-rock text-xl sm:text-2xl text-center max-h-20 xl:max-h-30 ">
          <div className="my-2">{game.cardsLeft}</div>
          <div className="my-4">Cards Left</div>
          {streak.length > 0 ? <div className="my-4">{streak.winner ? `Winning Streak: ${streak.length}` : `Losing Streak: ${streak.length}`}</div>:null}
        </div>
        {winner ? (
          <div className="absolute top-18 flex items-start justify-start w-full h-40">
            <div className=" mx-auto w-full">
              <Winner className="w-full px-4" />
            </div>
          </div>
        ) : null}
      </div>
      <div className="absolute bottom-0 w-full h-1/2">
        <div
          className="relative h-full flex items-center justify-center z-10"
          style={{ minHeight: 300 }}
        >
          <div className="m-auto w-full flex items-center justify-center z-20">
            {game.ended || firstGame ? (
              <div className="w-full">
                <div className="w-full font-rock text-white  text-2xl lg:text-5xl w-full text-center px-4">
                  {winner ? (
                    <div>Great job! You won the game!</div>
                  ) : firstGame ? (
                    <div>Welcome to Card Challenge!</div>
                  ) : (
                    <div>You Lose, Sucker!</div>
                  )}
                </div>
                <div className="w-full flex items-center justify-center m-auto pt-6">
                  <button
                    type="button"
                    onClick={() => shuffle()}
                    className="m-auto w-1/8 p-2 opacity-80 hover:bg-blue-800 py-1 px-4 border border-yellow-400 rounded "
                  >
                    <div className="font-rock text-yellow-400 text-lg">
                      {firstGame ? 'Play' : 'Play Again'}
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  nextHand({
                    variables: {
                      sessionID: 'uplifty-client-session',
                      gameId: game.gameId,
                    },
                  })
                }
                disabled={game.inflight}
                className={`"m-auto w-1/8 p-6 h-18  bg-yellow-400 opacity-80  hover:bg-blue-800 py-1 px-2 border border-black rounded"`}
              >
                <div className="font-rock font-black text-4xl">
                  {game.inflight ? 'Dealing' : 'DEAL'}
                </div>
              </button>
            )}
          </div>

          <div className="absolute bottom-28 w-full ">
            <div className=" h-full flex items-end justify-end mb-0 pb-0 mr-12">
              <button
                type="button"
                onClick={() => shuffle()}
                className="w-1/8 h-20 mb-2 py-1  opacity-80 hover:bg-blue-800  px-2 border border-yellow-400 rounded "
              >
                <div className="font-rock text-yellow-400 text-lg">Reset</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App