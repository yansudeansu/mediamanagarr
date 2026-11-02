import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'

export const SONARR_TEST_API_KEY = 'e2e-sonarr-api-key'

export type MockSonarrServer = {
  url: string
  setStatus: (status: number) => void
  requests: () => number
  resetRequests: () => void
  close: () => Promise<void>
}

export async function startMockSonarrServer(): Promise<MockSonarrServer> {
  let status = 200
  let requestCount = 0

  const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    if (request.method !== 'GET' || request.url !== '/api/v3/system/status') {
      response.writeHead(404)
      response.end()
      return
    }

    requestCount++

    if (request.headers['x-api-key'] !== SONARR_TEST_API_KEY) {
      response.writeHead(401)
      response.end()
      return
    }

    response.writeHead(status, {
      'Content-Type': 'application/json',
    })

    response.end(
      JSON.stringify({
        appName: 'Sonarr',
        version: '4.0.0',
      }),
    )
  })

  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', resolve)
    })
  } catch (error) {
    server.close()
    throw error
  }

  const address = server.address() as AddressInfo

  return {
    url: `http://127.0.0.1:${address.port}`,
    setStatus: (value: number) => {
      status = value
    },
    requests: () => requestCount,
    resetRequests: () => {
      requestCount = 0
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      }),
  }
}
