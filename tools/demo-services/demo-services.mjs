import { createServer } from 'node:http'

// Standalone simulated services. No imports from the extension or test runner.
const key = 'demo-api-key'
const userId = 'demo-user'
const definitions = [
  ['jellyfin', 18961],
  ['seerr', 18962],
  ['sonarr', 18963],
  ['radarr', 18964],
  ['qbittorrent', 18965],
]
const servers = []
const now = new Date()
const iso = (offset = 0) => {
  const date = new Date(now)
  date.setDate(date.getDate() + offset)
  date.setHours(12, 0, 0, 0)
  return date.toISOString()
}
const arrivals = Array.from({ length: 15 }, (_, i) => ({
  Id: `demo-item-${i + 1}`,
  Name: i % 2 ? `Demo episode ${i + 1}` : `Demo movie ${i + 1}`,
  Type: i % 2 ? 'Episode' : 'Movie',
  DateCreated: iso(-i),
  ProductionYear: now.getFullYear(),
  SeriesName: 'Demo series',
  SeriesId: 'demo-series',
  ParentIndexNumber: 1,
  IndexNumber: i + 1,
  UserData: { Played: false },
  ImageTags: {},
}))
const requests = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  status: (i % 3) + 1,
  type: i % 2 ? 'tv' : 'movie',
  createdAt: iso(-i),
  requestedBy: { displayName: 'Demo User' },
  media: { tmdbId: i + 1, status: (i % 4) + 2, posterPath: null },
}))
const episodes = [-3, 0, 1, 3, 7].map((offset, i) => ({
  id: i + 1,
  seriesId: 1,
  title: `Demo episode ${i + 1}`,
  seasonNumber: 1,
  episodeNumber: i + 1,
  airDateUtc: iso(offset),
  series: { id: 1, title: 'Demo series', images: [] },
}))
const movies = [-2, 0, 2, 5, 10].map((offset, i) => ({
  id: i + 1,
  title: `Demo movie ${i + 1}`,
  year: now.getFullYear(),
  digitalRelease: iso(offset).slice(0, 10),
  images: [],
}))
const initialTorrents = () => [
  {
    hash: 'a'.repeat(40),
    name: 'Simulated demo download',
    progress: 0.48,
    state: 'downloading',
    dlspeed: 2097152,
    upspeed: 0,
    eta: 1800,
    size: 1000000,
    downloaded: 480000,
  },
  {
    hash: 'b'.repeat(40),
    name: 'Simulated stopped download',
    progress: 0.72,
    state: 'stoppedDL',
    dlspeed: 0,
    upspeed: 0,
    eta: 8640000,
    size: 1000000,
    downloaded: 720000,
  },
  {
    hash: 'c'.repeat(40),
    name: 'Simulated completed download',
    progress: 1,
    state: 'uploading',
    dlspeed: 0,
    upspeed: 262144,
    eta: 8640000,
    size: 1000000,
    downloaded: 1000000,
  },
]
let torrents = initialTorrents()

function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(value))
}
function authenticated(service, req) {
  if (service === 'jellyfin') {
    return req.headers.authorization?.includes(`Token="${key}"`) === true
  }
  if (service === 'qbittorrent') return req.headers.authorization === `Bearer ${key}`
  return req.headers['x-api-key'] === key
}
function numberParam(url, name, fallback, max) {
  const raw = url.searchParams.get(name)
  if (raw === null) return fallback
  const value = Number(raw)
  if (!Number.isSafeInteger(value) || value < 0 || value > max)
    throw new Error('Invalid pagination')
  return value
}
function inRange(value, url) {
  const start = Date.parse(url.searchParams.get('start') ?? '')
  const end = Date.parse(url.searchParams.get('end') ?? '')
  const date = Date.parse(value)
  return Number.isFinite(start) && Number.isFinite(end) && date >= start && date <= end
}
async function body(req) {
  let text = ''
  for await (const chunk of req) {
    text += chunk
    if (text.length > 16384) throw new Error('Request too large')
  }
  return new URLSearchParams(text)
}
async function handle(service, req, res) {
  const url = new URL(req.url, 'http://127.0.0.1')
  const path = url.pathname
  if (!authenticated(service, req)) return json(res, 401, { error: 'Invalid demo API key' })
  if (req.method === 'GET') {
    if (service === 'jellyfin') {
      if (path === '/Library/MediaFolders')
        return json(res, 200, { Items: [], TotalRecordCount: 0 })
      if (path === '/Users') return json(res, 200, [{ Id: userId, Name: 'Demo User' }])
      if (path === `/Users/${userId}/Items`) {
        const skip = numberParam(url, 'StartIndex', 0, 10000)
        const limit = numberParam(url, 'Limit', 10, 100)
        return json(res, 200, {
          Items: arrivals.slice(skip, skip + limit),
          TotalRecordCount: arrivals.length,
        })
      }
      if (/^\/Items\/[^/]+\/Images\/Primary$/.test(path))
        return json(res, 404, { error: 'No demo poster' })
    }
    if (service === 'seerr') {
      if (path === '/api/v1/status') return json(res, 200, { version: 'demo-simulator' })
      if (path === '/api/v1/request') {
        const skip = numberParam(url, 'skip', 0, 10000)
        const take = numberParam(url, 'take', 10, 100)
        const filter = url.searchParams.get('filter')
        const selected =
          filter === 'pending'
            ? requests.filter((x) => x.status === 1)
            : filter === 'approved'
              ? requests.filter((x) => x.status === 2)
              : requests
        return json(res, 200, {
          results: selected.slice(skip, skip + take),
          pageInfo: { results: selected.length },
        })
      }
      const metadata = path.match(/^\/api\/v1\/(movie|tv)\/(\d+)$/)
      if (metadata)
        return json(res, 200, { title: `Demo ${metadata[1]} ${metadata[2]}`, posterPath: null })
    }
    if (service === 'sonarr' || service === 'radarr') {
      if (path === '/api/v3/system/status')
        return json(res, 200, { appName: service, version: 'demo-simulator' })
      const detail = path.match(/^\/api\/v3\/(series|movie)\/(\d+)$/)
      if (detail) {
        const id = Number(detail[2])
        const media =
          service === 'sonarr' && detail[1] === 'series'
            ? episodes.find((episode) => episode.series.id === id)?.series
            : service === 'radarr' && detail[1] === 'movie'
              ? movies.find((movie) => movie.id === id)
              : undefined
        return media
          ? json(res, 200, media)
          : json(res, 404, { error: 'Simulated media not found' })
      }
      if (path === '/api/v3/calendar') {
        const selected =
          service === 'sonarr'
            ? episodes.filter((x) => inRange(x.airDateUtc, url))
            : movies.filter((x) => inRange(x.digitalRelease, url))
        return json(res, 200, selected)
      }
    }
    if (service === 'qbittorrent') {
      if (path === '/api/v2/torrents/info') return json(res, 200, torrents)
      if (path === '/api/v2/transfer/info')
        return json(res, 200, {
          dl_info_speed: torrents.reduce((sum, x) => sum + x.dlspeed, 0),
          up_info_speed: torrents.reduce((sum, x) => sum + x.upspeed, 0),
        })
    }
  }
  if (
    service === 'qbittorrent' &&
    req.method === 'POST' &&
    ['/api/v2/torrents/start', '/api/v2/torrents/stop', '/api/v2/torrents/delete'].includes(path)
  ) {
    const data = await body(req)
    const hashes = data.get('hashes')?.split('|') ?? []
    const selected = (x) => hashes.includes('all') || hashes.includes(x.hash)
    if (path.endsWith('/delete')) torrents = torrents.filter((x) => !selected(x))
    else
      for (const torrent of torrents.filter(selected)) {
        const stopped = path.endsWith('/stop')
        torrent.state = stopped
          ? torrent.progress === 1
            ? 'stoppedUP'
            : 'stoppedDL'
          : torrent.progress === 1
            ? 'uploading'
            : 'downloading'
        torrent.dlspeed = !stopped && torrent.progress < 1 ? 2097152 : 0
        torrent.upspeed = !stopped && torrent.progress === 1 ? 262144 : 0
      }
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end('Ok.')
  }
  console.warn(`Unhandled simulator route: ${service} ${req.method} ${path}`)
  json(res, 404, { error: 'Route not implemented by demo simulator' })
}

async function close() {
  await Promise.all(
    servers.map(
      (server) =>
        new Promise((resolve) => {
          server.close(resolve)
          server.closeAllConnections()
        }),
    ),
  )
}
try {
  for (const [service, port] of definitions) {
    const server = createServer((req, res) => {
      handle(service, req, res).catch((error) => {
        console.error(`${service}: ${error.message}`)
        if (!res.headersSent) json(res, 400, { error: 'Invalid simulator request' })
        else res.end()
      })
    })
    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(port, '127.0.0.1', resolve)
    })
    servers.push(server)
    console.log(`${service.padEnd(12)} http://127.0.0.1:${port}`)
  }
  console.log(`API key for all services: ${key}`)
  console.log('SIMULATED DATA ONLY. No media is downloaded, uploaded, or deleted.')
  console.log('Restart this process to reset data. Ctrl+C stops all five servers.')
} catch (error) {
  console.error(`Simulator startup failed: ${error.message}`)
  await close()
  process.exitCode = 1
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    void close()
  })
}
