import express from 'express'
import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())

app.set('views', './views')

const baseURL = 'https://fdnd-agency.directus.app/items'
const groupEndpoint = `${baseURL}/snappthis_group`
const snappmapEndpoint = `${baseURL}/snappthis_snapmap`
const snappEndpoint = `${baseURL}/snappthis_snap`
const actionEndpoint = `${baseURL}/snappthis_action`
const userEndpoint = `${baseURL}/snappthis_user`

app.get('/', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*,snaps.*')
  params.set('sort','-time_end')
  params.set('deep[snaps][_sort]', '-date_created')

  const allSnappmapsApiResponse = await fetch(`${snappmapEndpoint}?${params.toString()}`)
  const allSnappmapsApiResponseJSON = await allSnappmapsApiResponse.json()
  const allSnappmaps = allSnappmapsApiResponseJSON.data

  console.log(allSnappmaps)

  response.render('index.liquid', { allSnappmaps })
})

app.get('/groups', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', 'name,slug,snappmap.snappthis_snapmap_uuid.*,count(users)')

  const allGroupsApiResponse = await fetch(`${groupEndpoint}?${params.toString()}`)
  const allGroupsApiResponseJSON = await allGroupsApiResponse.json()
  const allGroups = allGroupsApiResponseJSON.data

  response.render('groups.liquid', { allGroups })
})

app.get('/groups/:slug', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*.*,snappmap.snappthis_snapmap_uuid.*')
  params.set('filter[slug]', request.params.slug)

  const snappMapsApiResponse = await fetch(`${groupEndpoint}?${params.toString()}`)
  const snappMapsApiResponseJSON = await snappMapsApiResponse.json()
  const snappMapslist = snappMapsApiResponseJSON.data

  response.render('groups.liquid', { snappMapslist })
})


app.get('/snappmaps/:slug', async function (request, response) {
  const params = new URLSearchParams()

  params.set('fields', '*.*,groups.snappthis_group_uuid.name,groups.snappthis_group_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.name,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.uuid')
  params.set('filter[slug]', request.params.slug)

  const snappmapApiResponse = await fetch(`${snappmapEndpoint}?${params.toString()}`)
  const snappmapApiResponseJSON = await snappmapApiResponse.json()
  const snappmap = snappmapApiResponseJSON.data

  response.render('snappmap.liquid', { snappmap })
})

// app.post('/snappmaps/:slug',async function (request, response) {
// })


app.get('/snapps', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*,snapmap.groups.snappthis_group_uuid.name')
  params.set('filter[picture][_neq]', 'null')

  const allSnappsApiResponse = await fetch(`${snappEndpoint}?${params.toString()}`)
  const allSnappsApiResponseJSON = await allSnappsApiResponse.json()
  const allSnapps = allSnappsApiResponseJSON.data

  const path = request.path

  response.render('snappmap.liquid', { allSnapps, path })
})




app.get('/snapps/location/:location', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*,snapmap.groups.snappthis_group_uuid.name')
  params.set('filter[picture][_neq]', 'null')
  params.set('filter[location]', request.params.location)

  const allSnappsApiResponse = await fetch(`${snappEndpoint}?${params.toString()}`)
  const allSnappsApiResponseJSON = await allSnappsApiResponse.json()
  const allSnapps = allSnappsApiResponseJSON.data

  const path = request.path

  response.render('snappmap.liquid', { allSnapps, path })
})



// Aanpassen

app.get('/snapps/user/:uuid', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*,snapmap.groups.snappthis_group_uuid.name')
  params.set('filter[picture][_neq]', 'null')
  params.set('filter[user]', request.params.location)

  const allSnappsApiResponse = await fetch(`${snappEndpoint}?${params.toString()}`)
  const allSnappsApiResponseJSON = await allSnappsApiResponse.json()
  const allSnapps = allSnappsApiResponseJSON.data

  const path = request.path

  response.render('snappmap.liquid', { allSnapps, path })
})




// Aanpassen

app.get('/snapps/:uuid', async function (request, response) {
  const params = new URLSearchParams()

  const allGroupsApiResponse = await fetch(`${groupEndpoint}?${params.toString()}`)
  const allGroupsApiResponseJSON = await allGroupsApiResponse.json()
  const allGroups = allGroupsApiResponseJSON.data

  response.render('snapp.liquid', { allGroups })
})






// Aanpassen

app.get('/user', async function (request, response) {
  const params = new URLSearchParams()

  response.render('snapp.liquid', { user })
})




app.use((req, res) => {
  res.status(404).render('404.liquid')
})

app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}`)
})