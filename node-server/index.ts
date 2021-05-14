import fs from 'fs'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { resolvers } from './resolvers'
// eslint-disable-next-line
import { test } from './tests/db_setup'

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8').toString()

const context = async ({ req }: { req: any }) => {
  console.info('GraphQL Server, body.variables:', req.body.variables)
  console.info('QUERY:', req.query, JSON.stringify(req.body, null, 4))
  let { sessionID } = req.query
  console.info({ sessionID })
  if (!sessionID) {
    sessionID = `test-${Math.floor(Math.random() * 10000000000)}`
  }

  return {
    sessionID, // from the request (client)
  }
}
const server = new ApolloServer({ typeDefs, resolvers, context })

const app = express()
server.applyMiddleware({ app })

const PORT = 8000

// Start the server
app.listen({ port: PORT }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
)
