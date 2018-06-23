import * as express from 'express'
import * as logger from 'morgan'
import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'


const app = express()

app.use(logger('dev'))

const schema = buildSchema(`
  type Query {
    users: [String]
    search(namePart: String): [String]
  }
`)

const users = ['Pavel', 'Andrea', 'Petr']

const  root = {
  users: () => users,
  search: ({namePart}: {namePart: string}) => users.filter(u => u.toLowerCase().indexOf(namePart.toLowerCase()) !== -1)
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,

}))

export default app
