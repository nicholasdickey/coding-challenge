import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'

const { REACT_APP_GRAPHQL_URI } = process.env
console.info('graphql setup', { REACT_APP_GRAPHQL_URI })
const client = new ApolloClient({
  uri: REACT_APP_GRAPHQL_URI || window.REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
  credentials: 'same-origin',
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
