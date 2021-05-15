import React from 'react'

import { ApolloClient, InMemoryCache } from '@apollo/client'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import ReactDOM from 'react-dom'

import { ApolloProvider } from '@apollo/client/react'

import './index.css'
import App from './App'

const { REACT_APP_GRAPHQL_URI } = process.env
console.info('graphql setup', { REACT_APP_GRAPHQL_URI })
const client = new ApolloClient({
  uri: REACT_APP_GRAPHQL_URI || window.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
  credentials: 'same-origin',
})
// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()
;(async () => {
  const fp = await fpPromise
  const result = await fp.get()
  const sId = result.visitorId
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App sessionID={sId} />
    </ApolloProvider>,
    document.getElementById('root')
  )
})()
