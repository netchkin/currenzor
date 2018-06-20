
import application from './app'

const port = normalizePort(getPortFromArgs() || process.env.PORT || '3000')

application.listen(port)

function getPortFromArgs() {
  const portSubstring = '--port='
  const portArg = process.argv.find(a => a.startsWith(portSubstring))
  return portArg && portArg.slice(portSubstring.length)
}

function normalizePort(val: any) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}
