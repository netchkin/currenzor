import {existsSync, writeFileSync, readFileSync} from 'fs'
import {join} from 'path'
import axios from 'axios'

const fixerApiUrl = `http://data.fixer.io/api/latest?access_key=`
const ratesFileName = join('.', 'tmp', 'rates.json')
const fixerApiKeys = 'fixer.api.json'

function readFixerApiKey() {
  return JSON.parse(readFileSync(fixerApiKeys, 'utf-8')).apikey
}

async function loadOrDownloadRates() {
  if (existsSync(ratesFileName)) {
    try {
      return JSON.parse(readFileSync(ratesFileName, 'utf-8'))
    }
    catch(e) {
      console.log('ERROR!!! rates from file')
      throw(e)
    }
  }
  else {
    const response = await axios.get<string>(fixerApiUrl + readFixerApiKey())
    const json = response.data
    console.log(typeof(response.data))
    writeFileSync(ratesFileName, JSON.stringify(json))
    return json
  }   
}

const rates: Promise<any> = loadOrDownloadRates()

export default rates
