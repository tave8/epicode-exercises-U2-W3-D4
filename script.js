const PEXELS_API_KEY = "ZrI0vMDL5OGjqQXQ4dKV0xrHh2xP9ObvY0ELdAliWdc9NxhREbJEfYNf"
const PEXELS_API_URL = "https://api.pexels.com/v1"
const FIXED_URL_PATHS = {
    loadImages: "/search?query=hamsters",
    loadSecondaryImages: "/search?query=tigers"
}


const main = () => {
    addEventHandlers()
}

window.addEventListener("load", main)

const loadImages = async () => {
    try {
        // get remote images
        const {photos: images} = await getRemoteImagesForLoadImages()    
        // display images in UI 
        // console.log(images)
        displayImages(images)
    }
    catch (err) {
        throw new Error("error during load or display images. status: ", err)
    }
}

const loadSecondaryImages = async () => {
    try {
        // get remote images
        const {photos: images} = await getRemoteImagesForLoadSecondaryImages()    
        // display images in UI 
        // console.log(images)
        displayImages(images)
    }
    catch (err) {
        throw new Error("error during load or display images. status: ", err)
    }
}


// 

// display images in UI
const displayImages = (images) => {
    const albumCardsAsList = getUIAlbumCardsAsList()
    // in album cards, iterate for as long as there are cards
    let i = 0
    while (i < albumCardsAsList.length) {
        // the ui element
        const albumCard = albumCardsAsList[i]
        // the remote image
        const image = images[i]
        displayImage(image, albumCard)
        i += 1
    }
}

const displayImage = (newImage, albumCard) => {
    // replace the current image url with the image url
    // of the given image
    albumCard.querySelector("img").src = newImage.src.original
    // console.log(newImage)
}


// REMOTE


const getRemoteImagesForLoadImages = async () => {
    return getRequest(getPexelsUrlForLoadImages())
}

const getRemoteImagesForLoadSecondaryImages = async () => {
    return getRequest(getPexelsUrlForLoadSecondaryImages())
}

const getRequest = async (absolute_url) => {
    const response = await fetch(absolute_url)
    if (!response.ok) {
        throw new Error("error during fetching. status: ", response.status)
    }
    const data = await response.json()
    return data
}


// EVENT HANDLERS

const handleClickLoadImages = (event) => {
    loadImages()
}

const handleClickLoadSecondaryImages = (event) => {
    loadSecondaryImages()
}

const addEventHandlers = () => {
    // load images button
    getUIButtonLoadImages().addEventListener("click", handleClickLoadImages)
    // load secondary images button
    getUIButtonLoadSecondaryImages().addEventListener("click", handleClickLoadSecondaryImages)
}


const getUIButtonLoadImages = () => {
    return document.getElementById("btnLoadImages")   
}

const getUIButtonLoadSecondaryImages = () => {
    return document.getElementById("btnLoadSecondaryImages")   
}

const getUIAlbumContainer = () => {
    return document.querySelector(".album")   
}

// where the cards are
const getUIAlbumCards = () => {
    return getUIAlbumContainer().querySelector(".row")
}

const getUIAlbumCardsAsList = () => {
    return getUIAlbumContainer().querySelectorAll(".card")
}

const getPexelsUrl = (url_path="") => {
    return `${PEXELS_API_URL}${url_path}`
}

const getPexelsUrlForLoadImages = () => {
    return getPexelsUrl(FIXED_URL_PATHS["loadImages"])
}

const getPexelsUrlForLoadSecondaryImages = () => {
    return getPexelsUrl(FIXED_URL_PATHS["loadSecondaryImages"])
}