const PEXELS_API_KEY = "ZrI0vMDL5OGjqQXQ4dKV0xrHh2xP9ObvY0ELdAliWdc9NxhREbJEfYNf";
const PEXELS_API_URL = "https://api.pexels.com/v1";
const FIXED_URL_PATHS = {
  loadImages: "/search?query=hamsters",
  loadSecondaryImages: "/search?query=tigers",
};

const main = () => {
  addEventHandlers();
};

window.addEventListener("load", main);

const loadImages = async () => {
  try {
    // get remote images
    const { photos: images } = await getRemoteImagesForLoadImages();
    // display images in UI
    // console.log(images)
    displayImages(images);
  } catch (err) {
    console.log(err);
    throw new Error("error during load or display images: ", err);
  }
};

const loadSecondaryImages = async () => {
  try {
    // get remote images
    const { photos: images } = await getRemoteImagesForLoadSecondaryImages();
    // display images in UI
    // console.log(images)
    displayImages(images);
  } catch (err) {
    console.log(err);
    throw new Error("error during load or display images: ", err);
  }
};

//

// display images in UI
const displayImages = (images) => {
  const albumCardsAsList = getUIAlbumCardsAsList();
  // in album cards, iterate for as long as there are cards
  let i = 0;
  while (i < albumCardsAsList.length) {
    // the ui element
    const albumCard = albumCardsAsList[i];
    // the remote image
    const image = images[i];
    // display image
    displayImage(image, albumCard);
    i += 1;
  }
};

const displayImage = (newImage, albumCard) => {
  // replace the current image url with the image url
  // of the given image
  albumCard.querySelector("img").src = newImage.src.original;
  albumCard.querySelector("small.text-muted").innerText = newImage.id;
  // console.log(newImage)
};

// REMOTE

const getRemoteImagesForLoadImages = async () => {
  return getRequest(getPexelsUrlForLoadImages());
};

const getRemoteImagesForLoadSecondaryImages = async () => {
  return getRequest(getPexelsUrlForLoadSecondaryImages());
};

const searchRemoteImages = async (userSearch) => {
  return getRequest(getPexelsCustomSearch(userSearch));
};

const getRequest = async (absolute_url) => {
  const response = await fetch(absolute_url, {
    headers: {
        "Authorization": PEXELS_API_KEY
    }
  });
  if (!response.ok) {
    throw new Error("error during fetching. status: ", response.status);
  }
  const data = await response.json();
  return data;
};

// EVENT HANDLERS

const handleClickLoadImages = (event) => {
  loadImages();
};

const handleClickLoadSecondaryImages = (event) => {
  loadSecondaryImages();
};

const addEventHandlers = () => {
  // load images button
  getUIButtonLoadImages().addEventListener("click", handleClickLoadImages);
  // load secondary images button
  getUIButtonLoadSecondaryImages().addEventListener("click", handleClickLoadSecondaryImages);
  // hide button in album cards
  onHideButtonClickHideCard();
  // input search images
  onTypeInputSearchImagesDisplayImages();
};

const onTypeInputSearchImagesDisplayImages = () => {
  // typing delayer library
  new TypingDelayer({
    // the input CSS selector
    inputSelector: "#inputSearchImages",
    // reference to the callback
    onTypingStopped: async (userSearch, moreInfo) => {
      const { photos: images } = await searchRemoteImages(userSearch);
      displayImages(images)
    },
  });
};

const onHideButtonClickHideCard = () => {
  // hide button in album cards
  const hideButtons = getUIHideCardButton();
  hideButtons.forEach((hideButton) => {
    hideButton.addEventListener("click", (event) => {
      const parentCol = hideButton.closest(".col-md-4");
      // hide the "card" but more specifically the column
      // where the card is contained in
      parentCol.classList.add("d-none");
    });
  });
};

const getUIButtonLoadImages = () => {
  return document.getElementById("btnLoadImages");
};

const getUIButtonLoadSecondaryImages = () => {
  return document.getElementById("btnLoadSecondaryImages");
};

const getUIAlbumContainer = () => {
  return document.querySelector(".album");
};

// where the cards are
const getUIAlbumCards = () => {
  return getUIAlbumContainer().querySelector(".row");
};

const getUIAlbumCardsAsList = () => {
  return getUIAlbumContainer().querySelectorAll(".card");
};

const getUIHideCardButton = () => {
  return getUIAlbumContainer().querySelectorAll("[data-app-role='hide-card']");
};

const getUIInputSearchImages = () => {
  return document.getElementById("inputSearchImages");
};

const getPexelsUrl = (url_path = "") => {
  return `${PEXELS_API_URL}${url_path}`;
};

// REMOTE HELPERS

const getPexelsCustomSearch = (userSearch) => {
  return getPexelsUrl(`/search?query=${userSearch}`);
};

const getPexelsUrlForLoadImages = () => {
  return getPexelsUrl(FIXED_URL_PATHS["loadImages"]);
};

const getPexelsUrlForLoadSecondaryImages = () => {
  return getPexelsUrl(FIXED_URL_PATHS["loadSecondaryImages"]);
};
