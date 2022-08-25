import axios from "axios"

const API_KEY = "29345630-91d6f898a516c2b5f1d45b459"


export default async function fetchSearch(_query="random",_page=1, _perPage = 40){
    const query = encodeURI(_query)
    const page = encodeURI(_page)
    const perPage = encodeURI(_perPage)
    return await axios(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
}