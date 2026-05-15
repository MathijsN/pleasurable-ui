const preview = document.querySelector('.image-preview');

document.getElementById('file').onchange = function (evt) {
    const [file] = this.files;
    if (file) {

        // Set the src of the image to the local file path
        preview.src = URL.createObjectURL(file);
    }
}


const makeSnappIcon = document.getElementById("make-snapp")

function enterOnLabel(e) {
    if (e.key === "Enter") {
        e.preventDefault()
        makeSnappIcon.click()
    }
}

if (makeSnappIcon) {
    makeSnappIcon.addEventListener('keydown', enterOnLabel)
}