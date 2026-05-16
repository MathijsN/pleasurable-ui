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
  params.set('sort', '-time_end')
  params.set('deep[snaps][_sort]', '-date_created')

  const allSnappmapsApiResponse = await fetch(`${snappmapEndpoint}?${params.toString()}`)
  const allSnappmapsApiResponseJSON = await allSnappmapsApiResponse.json()
  const allSnappmaps = allSnappmapsApiResponseJSON.data

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
  const userUuid = "467a4442-69e4-44ae-829a-b95e25c4dd7b"
  const snappUuid = request.params.uuid
  const status = request.query.status

  const params = new URLSearchParams()
  params.set('fields', '*,snapmap.name,snapmap.uuid,snapmap.slug,snapmap.groups.snappthis_group_uuid.name,author.*')
  params.set('filter[uuid]', `${snappUuid}`)

  const oneSnappApiResponse = await fetch(`${snappEndpoint}?${params.toString()}`)
  const oneSnappApiResponseJSON = await oneSnappApiResponse.json()
  const oneSnappInfo = oneSnappApiResponseJSON.data


  const paramsAction = new URLSearchParams()
  paramsAction.set('fields', '*,user.name,snap.*,snap.author.*,snap.snapmap.name,snap.snapmap.groups.snappthis_group_uuid.name')
  paramsAction.set('filter[snap]', `${snappUuid}`)

  const likesCountApiResponse = await fetch(`${actionEndpoint}?${paramsAction.toString()}&filter[action]=like`)
  const likesCountApiResponseJSON = await likesCountApiResponse.json()
  const likesCount = likesCountApiResponseJSON.data

  const tomatoCountApiResponse = await fetch(`${actionEndpoint}?${paramsAction.toString()}&filter[action]=tomato`)
  const tomatoCountApiResponseJSON = await tomatoCountApiResponse.json()
  const tomatoCount = tomatoCountApiResponseJSON.data

  const starCountApiResponse = await fetch(`${actionEndpoint}?${paramsAction.toString()}&filter[action]=star`)
  const starCountApiResponseJSON = await starCountApiResponse.json()
  const starCount = starCountApiResponseJSON.data


  const paramsUserActionState = new URLSearchParams()
  paramsUserActionState.set('filter[user][_eq]', `${userUuid}`)
  paramsUserActionState.set('filter[snap][_eq]', `${snappUuid}`)

  const userActionResponse = await fetch(`${actionEndpoint}?${paramsUserActionState.toString()}`)
  const userActionData = await userActionResponse.json()

  const actions = userActionData.data || []
  const hasLike = actions.some(a => a.action === "like")
  const hasTomato = actions.some(a => a.action === "tomato")
  const hasStar = actions.some(a => a.action === "star")

  response.render('snapp.liquid', { snappUuid, oneSnappInfo, likesCount, tomatoCount, starCount, hasLike, hasTomato, hasStar, status })
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