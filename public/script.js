if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
}

const offlineMelding = document.querySelector(".offline-melding")
//met window wordt er naar de browser geluisterd of er een internet verbinding is
window.addEventListener("offline", () => {
    offlineMelding.hidden = false
})

window.addEventListener("online", () => {
    offlineMelding.hidden = true
})

const preview = document.querySelector('.image-preview');

document.getElementById('file').onchange = function (evt) {
    const [file] = this.files;
    if (file) {

        // Set the src of the image to the local file path
        preview.src = URL.createObjectURL(file);
    }
}

const pictureForm = document.querySelector("form.picture")
const snapps = document.getElementById("grid")

pictureForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    document.querySelector(".loader").style.display = 'block'
    document.querySelector(".submit-text").style.display = 'none'

    // Voor het opvragen van de geolocatie van de gebruiker
    await new Promise(function (resolve) {
        // Als de browser geen toegang heeft tot geolocatie, stop dan meteen
        if (!navigator.geolocation) return resolve()
         
        // Vraag de browser om de huidige locatie van de gebruiker
        navigator.geolocation.getCurrentPosition(
            // Als het ophalen van de locatie gelukt is, sla dan de coördinaten op in de 'hidden' inputs
            function (location) {
                // Sla de lengte- en breedtegraad op in de 'hidden' inputs
                document.getElementById('latitude').value = location.coords.latitude
                document.getElementById('longitude').value = location.coords.longitude

                // Geef aan dat de Promise klaar is, zodat de rest van de code verder kan
                resolve()
            },

            // Als de gebruiker de locatie weigert of er een fout optreedt, ga dan gewoon verder
            function () { resolve() }
        )
    })

    let formData = new FormData(pictureForm);

    const response = await fetch(pictureForm.action, {
        method: 'POST',
        body: formData // <<< Dit moet omdat server.js anders niet met de formulier data kan werken
    })

    if (response.ok) {

        const responseData = await response.text()

        const parser = new DOMParser()
        const responseDOM = parser.parseFromString(responseData, 'text/html')

        // Zoek in die nieuwe HTML DOM onze nieuwe UI state op, die we via Liquid hebben klaargemaakt
        const newState = responseDOM.querySelector('ul#grid')

        snapps.innerHTML = newState.innerHTML

        document.getElementById('file').value = ''
        document.getElementById('succes-dialog').show()
        document.querySelector('#succes-dialog button').style.display = 'none'

        setTimeout(() => {
            document.getElementById('succes-dialog').close()
        }, 3000)
    } else {
        document.getElementById('failure-dialog').show()
        document.querySelector('#succes-dialog button').style.display = 'none'

        setTimeout(() => {
            document.getElementById('failure-dialog').close()
        }, 3000)
    }



    // Loading state weghalen
    // Nu kan je waarschijnlijk de Loading state vervangen door een Success state
    document.querySelector(".loader").style.display = 'none'
    document.querySelector(".submit-text").style.display = 'block'
})

const snappGrid = document.getElementById('grid')
const viewPopover = document.getElementById('menu-view')
const headerIconButton = document.querySelector('.view-toggle')

if (snappGrid && viewPopover) {
    const viewOptions = viewPopover.querySelectorAll('.view-options button')

    viewOptions.forEach(clickedOption => {
        clickedOption.addEventListener('click', () => {

            const viewClass = clickedOption.classList[0]
            snappGrid.className = 'grid ' + viewClass

            //haal is-active bij alle opties weg zet het op de geklikte
            viewOptions.forEach(option => option.classList.remove('is-active'))
            clickedOption.classList.add('is-active')

            //Vervang het icon in de header door dat van de gekozen view
            if (headerIconButton) {
                const optionIcon = clickedOption.querySelector('svg')
                const headerIcon = headerIconButton.querySelector('svg')
                if (optionIcon && headerIcon) {
                    headerIcon.replaceWith(optionIcon.cloneNode(true))
                }
            }

            viewPopover.hidePopover()
        })
    })
}