const preview = document.querySelector('.image-preview');

document.getElementById('file').onchange = function (evt) {
    const [file] = this.files;
    if (file) {

        // Set the src of the image to the local file path
        preview.src = URL.createObjectURL(file);
    }
}
