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

        setTimeout(() => {
            document.getElementById('succes-dialog').close()
        }, 3000)
    } else {
        document.getElementById('failure-dialog').show()
    }



    // Loading state weghalen
    // Nu kan je waarschijnlijk de Loading state vervangen door een Success state
    document.querySelector(".loader").style.display = 'none'
    document.querySelector(".submit-text").style.display = 'block'
})