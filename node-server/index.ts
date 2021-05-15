import fs from 'fs'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { resolvers } from './resolvers'

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8').toString()

const context = async ({ req }: { req: any }) => {
  console.info('GraphQL Server, body.variables:', req.body.variables)
  console.info('QUERY:', req.query, JSON.stringify(req.body, null, 4))

  const sessionID = req.query.sessionID || req.body.variables.sessionID || req.sessionID
  console.info('SessionID', { sessionID })
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
