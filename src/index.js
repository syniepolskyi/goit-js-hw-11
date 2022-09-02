import photoCard from "./templates/photo-card.hbs"
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import "notiflix/dist/notiflix-3.2.5.min.css"

import fetchSearch from "./js/pixabayApi"

const searchFormRef = document.querySelector(`#search-form`)
const galleryRef = document.querySelector(`.gallery`)
const loadMoreBtn = document.querySelector('.btn-load-more')
const toBtnTop = document.querySelector('.btn-to-top')
const loading = document.querySelector('.loading')
const inputRef = document.querySelector(`[name="searchQuery"]`)

let simpleLightBox = null
let page = 1
let perPage = 40
let q = ''
let totalPages = 0

window.addEventListener('scroll', onScroll)
toBtnTop.addEventListener('click', onToTopBtn)
searchFormRef.addEventListener("submit", onSubmit)

function onToTopBtn() {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

function onSubmit(ev){
    ev.preventDefault()
    if(inputRef.getAttribute("disabled")){
        return
    }
    q = inputRef.value.trim()
    loadMoreBtn.classList.add('is-hidden')
    loading.classList.remove('show')
    galleryRef.innerHTML = ''
    if(!q){
        return
    }
    inputRef.setAttribute("disabled","disabled")
    page = 1
    totalPages = 0
    load()
}

function onScroll() {
    const scrolled = window.pageYOffset
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    if (scrolled > clientHeight) {
        toBtnTop.classList.add('btn-to-top--visible')
    }
    if (scrolled < clientHeight) {
        toBtnTop.classList.remove('btn-to-top--visible')
    }
    let isDisabled = inputRef.getAttribute("disabled")
    if(isDisabled){
        return
    }
    if (clientHeight + scrollTop >= scrollHeight - 5 && page > 0) {
        showLoading()
    }
}

function showLoading() {
    if(loading.classList.contains('show')){
        return 
    }
    loading.classList.add('show')
    inputRef.setAttribute("disabled","disabled")
	setTimeout (onLoadMoreBtn, 2000)
}

function onLoadMoreBtn() {
    page += 1
    if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden')
        inputRef.removeAttribute("disabled")
        loading.classList.remove('show')
        Notify.warning('We are sorry, but you have reached the end of search results.')
        page=0
        return
    }
    load()
}

function load(){
    fetchSearch(q, page, perPage)
    .then(responseData => {
        if(page === 1){
            galleryRef.innerHTML = ''
        }
        if (responseData.data && (!responseData.data.total || !responseData.data.hits.length)){
            Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            return 
        }
        totalPages = Math.ceil(responseData.data.total / perPage)
        if(page === 1){
            Notify.success(`Hooray! We found ${responseData.data.total} images.`)
        }
        renderGallery(responseData.data.hits)
        loadMoreBtn.classList.toggle('is-hidden', !(responseData.data.total > perPage))
        if(!simpleLightBox){
            simpleLightBox = new SimpleLightbox('.gallery a')
        } else {
            simpleLightBox.refresh()
        }
    })
    .catch(error => {
        Notify.failure("Something bad happened. Check the browser console")
        console.warn(error)
    })
    .finally(() => {
        setTimeout(() => {
            inputRef.removeAttribute("disabled")
            loading.classList.remove('show')
        }, 500)
    })
}

function renderGallery(images) {
    const markup = images.map(image => {
        //const { id, largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image
        const markup = photoCard(image)
        return markup
    }).join('')

    galleryRef.insertAdjacentHTML('beforeend', markup)
}
