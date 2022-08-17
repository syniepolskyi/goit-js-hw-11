import photoCard from "./templates/photo-card.hbs"
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"

import fetchSearch from "./js/pixabayApi";

const searchInput = document.querySelector(`[name="searchQuery"]`)
const searchBtn = document.querySelector(`button`)

fetchSearch("hello",1)
.then(responseData => {
    if (responseData.data && !responseData.data.total){

    }
})
.catch(error => {

})

//const lightbox = new SimpleLightbox('.gallery .photo-card', { /* options */ });