const BASE_URL = "http://localhost:3000"

function init(){
    // ** Get all movies from the database movies_db **
    renderAllMovies();
}
document.addEventListener('DOMContentLoaded', init)

function renderComment(record){
    const commentsLi = document.getElementById("comments-list")
    const commentLi = document.createElement("li")
    commentLi.innerHTML = `
        <p>${record.comment} <button type="button" class="btn btn-danger btn-sm" ><i class="fas fa-trash-alt"></i></button> </p>
    `
    console.log(record.comment)
    commentsLi.append(commentLi)
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
    console.log(movie)

    const movieCard = document.createElement("div")
    movieCard.className = "col"
    movieCard.innerHTML = `
                            <div class="card">
                                <img 
                                    type="button" data-bs-toggle="modal" 
                                    data-bs-target="#movie-modal" 
                                    src="${movie.image}" 
                                    class="card-img-top" alt="${movie.fullTitle}">
                            </div>
                            `
    document.getElementById("movies-list").appendChild(movieCard)
    
    // ** Show movie modal when movie image was clicked **//
    movieCard.addEventListener("click", showMovie)
    function showMovie() {

        //** Show trailer **
        document.getElementById("movie-trailer-link").src=movie.trailerLinkEmbed
        //** Show movie information **
        document.getElementById("movie-directors").textContent = `Directors: ${movie.directors}`
        document.getElementById("movie-stars").textContent = `Stars: ${movie.stars}`
        document.getElementById("movie-year").textContent = `Year: ${movie.year}`
        document.getElementById("movie-runtime").textContent = `Runtime: ${movie.runtimeStr}`
        document.getElementById("movie-imdb-rating").textContent = `ImDB Rating: ${movie.imDbRating}`
        document.getElementById("movie-content-rating").textContent = `Content Rating: ${movie.contentRating}`

        // ** Get Comments and display ** 
        getComments(movie).then(renderComments)
    }
}