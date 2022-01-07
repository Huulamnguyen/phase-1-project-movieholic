const BASE_URL = "http://localhost:3000"

function init(){
    // ** Get all movies from the database movies_db **
    renderMostPopularMovies()
    renderAllMovies();
    renderMoviesAPI();
    ;
}

document.addEventListener('DOMContentLoaded', init)

// ** Comment **
document.getElementById("new-comment").addEventListener("submit", e => {
    e.preventDefault();
    console.log(e.target.dataset.movieId)
    console.log(e.target.commentInput.value)
    const commentData ={
        movieId: e.target.dataset.movieId,
        comment: e.target.commentInput.value
    }
    createComment(commentData)
    .then(savedRecord => {
        renderComment(savedRecord)
    })
})

function deleteComment(commentId) {
    return fetch(`${BASE_URL}/comments/${commentId}`,{
        method: "DELETE"
    })
    .then(res => res.json())
}

function createComment(commentData){
    return fetch(`${BASE_URL}/comments`,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(commentData)
    })
    .then(res => res.json())
}

function renderComment(record){
    const commentsLi = document.getElementById("comments-list")
    const commentLi = document.createElement("li")
    commentLi.className = "list-unstyled"
    commentLi.innerHTML = `
        <p>${record.comment} <button type="button" class="btn btn-danger btn-sm" ><i class="fas fa-trash-alt"></i></button> </p>
    `
    // console.log(record.comment)
    commentsLi.append(commentLi)

    const deleteBtn = commentLi.querySelector("button")
    deleteBtn.addEventListener("click", e => {
        deleteComment(record.id)
        .then(() => commentLi.remove())
    })
}

function renderComments(comments) {
    const commentsLi = document.getElementById("comments-list")
    commentsLi.innerHTML = "";
    comments.forEach(renderComment)
}

// ** Get all comments from database
function getComments(movie){
    return fetch(`http://localhost:3000/comments?movieId=${movie.id}`)
    .then(res => res.json())
}

// ** Get all movies from database
function renderAllMovies(){
    fetch(`${BASE_URL}/movies`)
    .then(response => response.json())
    .then(movies => movies.forEach(renderMovieImage))
}

// ** Render each movie image and update to the DOM **
function renderMovieImage(movie){
    // console.log(movie)

    const movieCard = document.createElement("div")
    movieCard.className = "col"
    movieCard.innerHTML = `
                            <div class="card">
                                <img 
                                    type="button" data-bs-toggle="modal" 
                                    data-bs-target="#movie-modal"
                                    height="250" 
                                    src="${movie.image}" 
                                    class="card-img-top" alt="${movie.fullTitle}">
                            </div>
                            `
    document.getElementById("movies-list").append(movieCard)
    
    // ** Show movie modal when movie image was clicked **//
    movieCard.addEventListener("click", showMovie)
    function showMovie() {

        const movieBanner = document.getElementById("movie-banner")
        if(movie.trailerLinkEmbed){
            movieBanner.innerHTML = `<iframe frameborder="0" allowfullscreen width="560" height="315" id="movie-api-trailer-link" src="${movie.trailerLinkEmbed}"></iframe>`
        } else {
            movieBanner.innerHTML = `<img src="${movie.image}" class="card-img-top" alt="${movie.title}">`
        }

        //** Show movie information **
        document.getElementById("movie-fullTitle").textContent = movie.fullTitle
        document.getElementById("movie-directors").textContent = `Directors: ${movie.directors}`
        document.getElementById("movie-stars").textContent = `Stars: ${movie.stars}`
        document.getElementById("movie-year").textContent = `Year: ${movie.year}`
        document.getElementById("movie-runtime").textContent = `Runtime: ${movie.runtimeStr}`
        document.getElementById("movie-imdb-rating").textContent = `ImDB Rating: ${movie.imDbRating}`
        document.getElementById("movie-content-rating").textContent = `Content Rating: ${movie.contentRating}`
        document.getElementById("new-comment").dataset.movieId = movie.id

        // ** Get Comments and display ** 
        getComments(movie).then(renderComments)

        // ** Delete movie **
        document.getElementById("delete-movie-btn").addEventListener("click", () => {
            deleteMovie(movie.id)
        })
    }
}

function deleteMovie(movieId) {
    console.log(movieId)
    return fetch(`${BASE_URL}/movies/${movieId}`, {
        method: "DELETE"
    })
}

// ** Movies from API **
const API_KEY = config.MY_API_KEY
const BASE_URL_API = "https://imdb-api.com/en/API"

function renderMostPopularMovies(){
    return fetch(`${BASE_URL_API}/MostPopularMovies/${API_KEY}`)
    .then(res => res.json())
    .then(itemsObject => itemsObject.items.slice(0, 10).forEach(renderMostPopularMovie))
}

function renderMostPopularMovie(movie) {
    const topMovieAPICard = document.createElement("div")
    topMovieAPICard.className = "col"
    topMovieAPICard.innerHTML = `
                            <div class="card">
                                <img 
                                    type="button" data-bs-toggle="modal" 
                                    data-bs-target="#top-movie-api-modal"
                                    height="250" 
                                    src="${movie.image}" 
                                    class="card-img-top" alt="${movie.title}">
                            </div>
                            `
    document.getElementById("top-movies-list-api").append(topMovieAPICard)

    topMovieAPICard.addEventListener("click", renderTopMovieAPI)
    function renderTopMovieAPI() {
        console.log(movie.id)
        const topMovieAPIInfo = fetch(`${BASE_URL_API}/Title/${API_KEY}/${movie.id}`)
        .then(res => res.json())
        .then(topMovieAPIObject => showTopMovieAPIInfo(topMovieAPIObject))
    }
}

function showTopMovieAPIInfo(topMovieAPIObject){
    const topMovieAPIBanner = document.getElementById("top-movie-api-banner")
    if (topMovieAPIObject.trailer) {
        topMovieAPIBanner.innerHTML = `<iframe frameborder="0" allowfullscreen width="560" height="315" id="movie-api-trailer-link" src="${topMovieAPIObject.trailer}"></iframe>`
    } else {
        topMovieAPIBanner.innerHTML = `<img src="${topMovieAPIObject.image}" class="card-img-top" alt="${topMovieAPIObject.title}">`
    }

    //** Show movie information **
    document.getElementById("top-movie-api-fullTitle").textContent = topMovieAPIObject.fullTitle
    document.getElementById("top-movie-api-directors").textContent = `Directors: ${topMovieAPIObject.directors}`
    document.getElementById("top-movie-api-stars").textContent = `Stars: ${topMovieAPIObject.stars}`
    document.getElementById("top-movie-api-year").textContent = `Year: ${topMovieAPIObject.year}`
    document.getElementById("top-movie-api-runtime").textContent = `Runtime: ${topMovieAPIObject.runtimeStr}`
    document.getElementById("top-movie-api-imdb-rating").textContent = `ImDB Rating: ${topMovieAPIObject.imDbRating}`
    document.getElementById("top-movie-api-content-rating").textContent = `Content Rating: ${topMovieAPIObject.contentRating}`

    document.getElementById("add-top-movie-btn").addEventListener("click", ()=> {
        const topMovieData = {
            idAPI:topMovieAPIObject.id,
            fullTitle:topMovieAPIObject.fullTitle,
            year:topMovieAPIObject.year,
            runtimeStr:topMovieAPIObject.runtimeStr,
            image:topMovieAPIObject.image,
            directors:topMovieAPIObject.directors,
            stars:topMovieAPIObject.stars,
            trailerLinkEmbed:topMovieAPIObject.trailer,
            imDbRating:topMovieAPIObject.imDbRating,
            contentRating:topMovieAPIObject.contentRating
        }
        createMovie(topMovieData)
        .then((savedMovie) => {renderMovieImage(savedMovie)});
    })
}

function renderMoviesAPI(){
    document.getElementById("new-movie").addEventListener("submit", (e) => {
        e.preventDefault()
        const expression = e.target.movieInput.value
        const matchingMovies = fetch(`${BASE_URL_API}/SearchMovie/${API_KEY}/${expression}`)
            .then(res => res.json())
            .then(matchingObject => matchingObject.results.forEach(renderMovieAPIImage))

        e.target.reset()
    })
}

function renderMovieAPIImage(movieAPI){
    const movieAPICard = document.createElement("div")
    movieAPICard.innerHTML = ""
    movieAPICard.className = "col"
    movieAPICard.innerHTML = `
                            <div class="card">
                                <img 
                                    type="button" data-bs-toggle="modal" 
                                    data-bs-target="#movie-api-modal"
                                    height="250"
                                    src="${movieAPI.image}" 
                                    class="card-img-top" alt="${movieAPI.title}">
                            </div>
                            `
    document.getElementById("movies-list-api").append(movieAPICard)
    movieAPICard.addEventListener("click", renderMovieAPI)
    function renderMovieAPI() {
        console.log(movieAPI.id)
        const movieAPIInfo = fetch(`${BASE_URL_API}/Title/${API_KEY}/${movieAPI.id}`)
        .then(res => res.json())
        .then(movieAPIObject => showMovieAPIInfo(movieAPIObject))
    }
}

function createMovie(movieData) {
    console.log("clicked")
    return fetch(`${BASE_URL}/movies`,{
        method: "POST",
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(movieData)
    })
    .then(response => response.json())
}

function showMovieAPIInfo(movieAPIObject) {
    //** Show trailer or movie image (banner) **
    // console.log(movieAPIObject)
    
    const movieAPIBanner = document.getElementById("movie-api-banner")

    if (movieAPIObject.trailer) {
        movieAPIBanner.innerHTML = `<iframe frameborder="0" allowfullscreen width="560" height="315" id="movie-api-trailer-link" src="${movieAPIObject.trailer}"></iframe>`
    } else {
        movieAPIBanner.innerHTML = `<img src="${movieAPIObject.image}" class="card-img-top" alt="${movieAPIObject.title}">`
    }
    // console.log(movieAPIBanner)

    //** Show movie information **
    document.getElementById("movie-api-fullTitle").textContent = movieAPIObject.fullTitle
    document.getElementById("movie-api-directors").textContent = `Directors: ${movieAPIObject.directors}`
    document.getElementById("movie-api-stars").textContent = `Stars: ${movieAPIObject.stars}`
    document.getElementById("movie-api-year").textContent = `Year: ${movieAPIObject.year}`
    document.getElementById("movie-api-runtime").textContent = `Runtime: ${movieAPIObject.runtimeStr}`
    document.getElementById("movie-api-imdb-rating").textContent = `ImDB Rating: ${movieAPIObject.imDbRating}`
    document.getElementById("movie-api-content-rating").textContent = `Content Rating: ${movieAPIObject.contentRating}`

    document.getElementById("add-movie-btn").addEventListener("click", ()=> {
        console.log(movieAPIObject)
        const movieData = {
            idAPI:movieAPIObject.id,
            fullTitle:movieAPIObject.fullTitle,
            year:movieAPIObject.year,
            runtimeStr:movieAPIObject.runtimeStr,
            image:movieAPIObject.image,
            directors:movieAPIObject.directors,
            stars:movieAPIObject.stars,
            trailerLinkEmbed:movieAPIObject.trailer,
            imDbRating:movieAPIObject.imDbRating,
            contentRating:movieAPIObject.contentRating
        }
        createMovie(movieData)
        .then((savedMovie) => {renderMovieImage(savedMovie)});
    })
}