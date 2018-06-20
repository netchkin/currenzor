import * as express from 'express'
import * as logger from 'morgan'
import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'


const app = express()

app.use(logger('dev'))

const schema = buildSchema(`
  type Query {
    hello: String
  }
`)
var root = {
  hello: () => 'Hello world!',
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,

}))

export default app
