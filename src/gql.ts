import { gql } from '@apollo/client'

export const RESET_MUTATION = gql`
  mutation ResetSession($sessionID: String) {
    resetSession(sessionID: $sessionID) {
      success
    }
  }
`

export const SHUFFLE_MUTATION = gql`
  mutation Shuffle($sessionID: String) {
    shuffle(sessionID: $sessionID) {
      success
      game {
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
`

export const NEXTHAND_MUTATION = gql`
  mutation NextHand($sessionID: String, $gameId: Int!) {
    nextHand(sessionID: $sessionID, gameId: $gameId) {
      success
      game {
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
`

export const STREAK_QUERY = gql`
  query GetStreak($sessionID: String) {
    getStreak(sessionID: $sessionID) {
      success
      streak {
        winner
        length
      }
    }
  }
`
