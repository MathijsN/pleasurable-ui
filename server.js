import express, { response } from 'express'
import { Liquid } from 'liquidjs';
import multer from 'multer';

const app = express()

const upload = multer({ storage: multer.memoryStorage() });

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

// Gebruikers id Anne-Fleur Pietersen
const userUuid = "5e9589a5-ebfa-4a99-87a6-010f2f571444"

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

app.get('/login', async function (request, response) {

  response.render('login.liquid')
})

app.get('/offline', async function (request, response) {

  response.render('offline.liquid')
})

app.post("/login", async function (request, response) {
  const loginInfo = {
    email: request.body.email,
    password: request.body.password,
  };

  const testEmail = "anne-fleur@snappthis.com";
  const testPassword = "snappthis";

  if (loginInfo.email == testEmail && loginInfo.password == testPassword) {
    response.redirect(303, '/');
    console.log("succesvol Ingelogd");
  } else {
    response.render('login.liquid', { error: true })
    console.log("inloggen mislukt");
  }

});

app.get('/groups', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', 'name,slug,snappmap.snappthis_snapmap_uuid.*,count(users)')

  const allGroupsApiResponse = await fetch(`${groupEndpoint}?${params.toString()}`)
  const allGroupsApiResponseJSON = await allGroupsApiResponse.json()
  const allGroups = allGroupsApiResponseJSON.data

  const path = request.path

  response.render('groups.liquid', { allGroups, path })
})

app.get('/groups/:slug', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*.*,snappmap.snappthis_snapmap_uuid.*')
  params.set('filter[slug]', request.params.slug)

  const snappMapsApiResponse = await fetch(`${groupEndpoint}?${params.toString()}`)
  const snappMapsApiResponseJSON = await snappMapsApiResponse.json()
  const snappMapslist = snappMapsApiResponseJSON.data

  const path = request.path

  response.render('groups.liquid', { snappMapslist, path })
})

app.get('/snappmaps/:slug', async function (request, response) {
  const params = new URLSearchParams()

  params.set('fields', '*.*,groups.snappthis_group_uuid.name,groups.snappthis_group_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.name,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.uuid')
  params.set('filter[slug]', request.params.slug)

  const snappmapApiResponse = await fetch(`${snappmapEndpoint}?${params.toString()}`)
  const snappmapApiResponseJSON = await snappmapApiResponse.json()
  const snappmap = snappmapApiResponseJSON.data

  const userParams = new URLSearchParams()

  userParams.set('fields', '*.*.*')
  userParams.set('filter[name][_icontains]', 'anne-fleur')

  const userApiResponse = await fetch(`${userEndpoint}?${userParams.toString()}`)
  const userApiResponseJSON = await userApiResponse.json()
  const user = userApiResponseJSON.data

  const status = request.query.status
  const path = request.path

  console.log(user[0].groups)

  response.render('snappmap.liquid', { snappmap, status, path, user })
})

// Maak een functie aan die van coördinaten een plaatsnaam maakt
async function reverseGeocode(latitude, longitude) {

  // Vraag aan Photon wat de plaatsnaam is van de coördinaten
  const reverseGeocodeResponse = await fetch(
    `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`,
    { headers: { 'User-Agent': 'snappmaps-app/1.0 (yourname@email.com)' } }
  )

  // Controleer of de response wel JSON is voordat we hem parsen
  const contentType = reverseGeocodeResponse.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return 'Unknown'
  }
  const reverseGeocodeData = await reverseGeocodeResponse.json()

  // Photon geeft data terug in features[0].properties
  const properties = reverseGeocodeData.features?.[0]?.properties
  // Zoek de stadsnaam op, probeer eerst 'city', dan 'town', dan 'village'
  const city = properties?.city ?? properties?.town ?? properties?.village
  // Zoek de wijknaam op, probeer eerst 'district', dan 'suburb', dan 'neighbourhood'
  const district = properties?.district ?? properties?.suburb ?? properties?.neighbourhood

  // Als we zowel een stad als een wijk hebben, combineer ze dan (vb: Amsterdam-Zuid)
  if (city && district) return `${city}-${district}`
  // Als we alleen een stad hebben, geef dan alleen de stad terug (vb: Amsterdam)
  if (city) return city
  // Als we niks hebben, geef dan 'Unknown' terug
  return 'Unknown'
}

app.post('/snappmaps/:slug', upload.single('file'), async function (request, response) {
  const snappmapid = request.body.uuid
  const snappmapSlug = request.params.slug
  const file = request.file

  // Haal de lengte- en breedtegraad op uit de 'hidden' inputs
  const latitude = request.body.latitude
  const longitude = request.body.longitude

  let location
  if (latitude && longitude) {
    // Als we beide coördinaten hebben, zet ze om naar een plaatsnaam
    location = await reverseGeocode(latitude, longitude)
  } else {
    // Als één van de twee er niet is, gebruik dan 'Unknown'
    location = 'Unknown'
  }

  const formData = new FormData()
  const blob = new Blob([file.buffer], { type: file.mimetype })
  formData.append("file", blob, file.originalname)

  const uploadResponse = await fetch('https://fdnd-agency.directus.app/files', {
    method: "POST",
    body: formData,
  })

  const uploadResponseData = await uploadResponse.json()

  if (uploadResponseData.data.id != null) {
    let newSnap = {
      location: location,
      snapmap: snappmapid,
      author: '5e9589a5-ebfa-4a99-87a6-010f2f571444',
      picture: uploadResponseData.data.id,
    }

    const snapResponse = await fetch(`${snappEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSnap),
    })

    if (snapResponse.ok) {
      response.redirect(303, `/snappmaps/${snappmapSlug}?status=succes`)
    } else {
      response.redirect(303, `/snappmaps/${snappmapSlug}?status=upload_failed`)
    }

  } else {
    return response.redirect(303, `/snappmaps/${snappmapSlug}?status=upload_failed`)
  }
})

app.get('/snapps', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*,snapmap.groups.snappthis_group_uuid.name')
  params.set('filter[picture][_neq]', 'null')
  params.set('sort', '-date_created')

  const allSnappsApiResponse = await fetch(`${snappEndpoint}?${params.toString()}`)
  const allSnappsApiResponseJSON = await allSnappsApiResponse.json()
  const allSnapps = allSnappsApiResponseJSON.data

  const path = request.path

  response.render('snapps.liquid', { allSnapps, path })
})

// Geef 404 error bij '/snapps/location'
app.get('/snapps/location', (req, res) => {
  res.status(404).render('404.liquid')
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

  response.render('snapps.liquid', { allSnapps, path })
})

// Geef 404 error bij '/snapps/user'
app.get('/snapps/user', (req, res) => {
  res.status(404).render('404.liquid')
})

app.get('/snapps/user/:name', async function (request, response) {
  const params = new URLSearchParams()
  params.set('fields', '*,author.name,snapmap.groups.snappthis_group_uuid.name')
  params.set('filter[picture][_neq]', 'null')
  params.set('filter[author][name]', request.params.name)

  const allSnappsApiResponse = await fetch(`${snappEndpoint}?${params.toString()}`)
  const allSnappsApiResponseJSON = await allSnappsApiResponse.json()
  const allSnapps = allSnappsApiResponseJSON.data

  const path = request.path

  response.render('snapps.liquid', { allSnapps, path })
})

app.get('/snapps/:uuid', async function (request, response) {
  const snappUuid = request.params.uuid
  const status = request.query.status

  const params = new URLSearchParams()
  params.set('fields', '*,snapmap.name,snapmap.uuid,snapmap.slug,snapmap.groups.snappthis_group_uuid.*.*,author.*')
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

  response.render('snapp.liquid', { userUuid, snappUuid, oneSnappInfo, likesCount, tomatoCount, starCount, hasLike, hasTomato, hasStar, status })
})

app.post('/snapps/:uuid/action', async function (request, response) {
  const actionType = request.body.action
  const snappUuid = request.params.uuid

  const params = new URLSearchParams()
  params.set('filter[snap][_eq]', `${snappUuid}`)
  params.set('filter[user][_eq]', `${userUuid}`)

  const starResponse = await fetch(`${actionEndpoint}?${params.toString()}&filter[action][_eq]=star`)
  const starData = await starResponse.json()
  const starAction = starData.data[0]

  const likeOrTomatoResponse = await fetch(`${actionEndpoint}?${params.toString()}&filter[action][_neq]=star`)
  const likeOrTomatoData = await likeOrTomatoResponse.json()
  const likeOrTomatoAction = likeOrTomatoData.data[0]

  try {
    if (actionType === "star") {
      if (starAction) {
        await fetch(`${actionEndpoint}/${starAction.uuid}`, {
          method: "DELETE",
        })

        return response.redirect(303, `/snapps/${snappUuid}?status=star-removed`)

      } else {
        await fetch(`${actionEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            snap: snappUuid,
            user: userUuid,
            action: "star"
          })
        })

        return response.redirect(303, `/snapps/${snappUuid}?status=star-added`)
      }

    } else {
      if (!likeOrTomatoAction) {
        await fetch(`${actionEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            snap: snappUuid,
            user: userUuid,
            action: actionType
          })
        })

        return response.redirect(303, `/snapps/${snappUuid}?status=${actionType}-added`)

      } else {

        if (likeOrTomatoAction.action === actionType) {
          await fetch(`${actionEndpoint}/${likeOrTomatoAction.uuid}`, {
            method: "DELETE",
          })

          return response.redirect(303, `/snapps/${snappUuid}?status=${actionType}-removed`)

        } else {
          await fetch(`${actionEndpoint}/${likeOrTomatoAction.uuid}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              action: actionType
            })
          })

          return response.redirect(303, `/snapps/${snappUuid}?status=switched-to-${actionType}`)
        }
      }
    }

  } catch (error) {
    console.error(error)
    return response.redirect(303, `/snapps/${snappUuid}?status=error`)
  }
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