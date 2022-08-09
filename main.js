let template = document.querySelector(".template").content,
song = document.querySelector(".cancion"),
artist = document.querySelector(".artista"),
songText = document.querySelector("#cancion"),
artistText = document.querySelector("#artista"),
search = document.getElementById("buscar"),
loader = document.querySelectorAll(".loader"),
fragment = document.createDocumentFragment()

async function load() {   
    try {
    let valueSong = songText.value.toLowerCase(),
    valueArtist = artistText.value.toLowerCase()
    let apiSong = fetch(`https://api.lyrics.ovh/v1/${valueArtist}/${valueSong}`),
    apiArtist = fetch (`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${valueArtist}`),
    [artistR, songR] = await Promise.all([apiArtist, apiSong])
    artistJson = await artistR.json(),
    songJson = await songR.json()
    console.log(artistJson);
    console.log(songJson);
    if (artistJson.artists===null) {
        artist.innerHTML = ""
        document.querySelector(".errorA").innerHTML = `no se pudo encontrar al artista <b>${artistText.value.toUpperCase()}</b>`
        loader.forEach(el => el.classList.add("d-none"));
    }else{
        document.querySelector(".errorA").innerHTML = ""
        let art = artistJson.artists[0] 
            template.querySelector(".nombre").textContent = art.strArtist
            template.querySelector(".nacimiento").innerHTML = `${art.intBornYear} - ${art.intDiedYear || "presente"}`
            template.querySelector(".pais").innerHTML = art.strCountry
            template.querySelector(".genero").innerHTML = `Género: ${art.strStyle} - ${art.strGenre}`
            template.querySelector(".descripcion").innerHTML = `${art.strBiographyES || art.strBiographyEN}` 
            template.querySelector(".link").href = `${art.strWebsite}`
            template.querySelector(".link").textContent = `sitio web:`
            template.querySelector("img").src = art.strArtistThumb ? art.strArtistThumb : art.strArtistWideThumb
            template.querySelector("img").style.maxWidth = "100%"
            let clone = document.importNode(template, true)
            fragment.appendChild(clone)
            artist.innerHTML = ""
            artist.appendChild(fragment)
            loader.forEach(el => el.classList.add("d-none"));
    }
    if (songJson.error) {
        song.innerHTML = ""
        document.querySelector(".errorS").innerHTML = `no se pudo encontrar la canción <b>${songText.value.toUpperCase()}</b>`
        loader.forEach(el => el.classList.add("d-none"));
    }else{
        document.querySelector(".errorS").innerHTML = ""
        song.innerHTML = ""
        song.innerHTML = `
         <p>Letra de ${songText.value.toUpperCase()}</p>
         <blockquote>${songJson.lyrics}</blockquote>
        `
        loader.forEach(el => el.classList.add("d-none"));
    }
    } catch (error) {
        song.innerHTML = ""
        artist.innerHTML = ""
        document.querySelector(".errorS").innerHTML = `ocurrió un error al solicitar los datos, inténtalo nuevamente`
        document.querySelector(".errorA").innerHTML =`ocurrió un error al solicitar los datos, inténtalo nuevamente`
        loader.forEach(el => el.classList.add("d-none"));
    } 
}
let regExpre = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð0-9\s]+$/
search.addEventListener("click",e=>{
    if (regExpre.test(artistText.value) && regExpre.test(songText.value)) {
        loader.forEach(el => el.classList.remove("d-none"));
        songText.classList.remove("error")
        artistText.classList.remove("error")
        load()
    }else{
        songText.classList.add("error")
        artistText.classList.add("error")
        alert("llenaste mal los datos")
     }
    })

document.addEventListener("keyup",e=>{
    if (e.target.matches("#cancion") || e.target.matches("#artista")) {
        if (e.key === "Enter") {
            if (regExpre.test(artistText.value) && regExpre.test(songText.value)) {
                loader.forEach(el => el.classList.remove("d-none"));
                songText.classList.remove("error")
                artistText.classList.remove("error")
                load()
            }else{
                songText.classList.add("error")
                artistText.classList.add("error")
                alert("llenaste mal los datos")
            }
        }
    }
})
