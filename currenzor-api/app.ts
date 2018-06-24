import * as express from 'express'
import * as logger from 'morgan'
import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import lazyRates from './rateService'

interface ConversionModel {
  value: number
  sourceCurrency: string
  targetCurrency: string
}

const app = express()

app.use(logger('dev'))

const schema = buildSchema(`
  type Query {
    users: [String]
    search(namePart: String): [String]
    convert(value: Float, sourceCurrency: String, targetCurrency: String): Float
  }
`)

const users = ['Pavel', 'Andrea', 'Petr']

const root = {
  users: async () => await new Promise((resolve) => resolve(users)),
  search: ({namePart}: {namePart: string}) => users.filter(u => u.toLowerCase().indexOf(namePart.toLowerCase()) !== -1),
  convert: async (model: ConversionModel) => await convertToCurrency(model)
}

/**
 * Converts the value from a sourceCurrency to a targetCurrency.
 * This conversion is not accurate since it uses intermendiate currency, in this case EUR.
 */
async function convertToCurrency({value, sourceCurrency, targetCurrency}: ConversionModel): Promise<number> {
  const rates = (await lazyRates).rates
  const fromRate = rates[sourceCurrency]
  const toRate = rates[targetCurrency]
  return value*toRate/fromRate
}


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,

}))

export default app
