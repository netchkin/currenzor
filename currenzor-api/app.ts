import * as express from 'express'
import * as logger from 'morgan'
import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'


const app = express()

app.use(logger('dev'))

const schema = buildSchema(`
  type Query {
    users: [String]
  }
`)
var root = {
  users: () => ['Pavel', 'Andrea', 'Petr'],
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,

}))

export default app
