// select elements from DOM
let elWrapper = document.querySelector("#wrapper");
let elBookmarkedList = document.querySelector(".bookmarked-list");
let elMoveModal = document.querySelector(".movie-modal");
let elForm = document.querySelector("#form");
let elSearchInput = document.querySelector("#search_input");
let elCategorySelect= document.querySelector("#category-select");
let elRating = document.querySelector("#rating");
let elSort = document.querySelector("#rating_sort");
let elBtn = document.querySelector("#btn");
let elAlert = document.querySelector(".movie-alert");
let elMovieCardTemplate = document.querySelector("#movie_card").content;
let elBookmarkedTemplate = document.querySelector("#bookmarked").content;


// Get movies list
let slicedMovies = movies.slice(0, 10)


// normolize movies
var normolizedMoviesList = slicedMovies.map((movieItem, index) => {
  return {
    id: ++index,
    title: movieItem.Title.toString(),
    categories: movieItem.Categories,
    rating: movieItem.imdb_rating,
    year: movieItem.movie_year,
    summary: movieItem.summary,
    imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
    youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`
  }
})


// create categories
function generateCategories(movieArray) {
  let categoryList = []

  movieArray.forEach(function(item) {
    let splittedItem = item.categories.split("|");

    splittedItem.forEach(item => categoryList.includes(item) ? null : categoryList.push(item))
  })

  categoryList.sort();

  let categoryFragment = document.createDocumentFragment()

  categoryList.forEach(item => {
    let categoryOption = document.createElement("option");
    categoryOption.value = item
    categoryOption.textContent = item
    categoryFragment.appendChild(categoryOption)
  })

  elCategorySelect.appendChild(categoryFragment)
}
generateCategories(normolizedMoviesList)


// create render function
function renderMovies(movieArray, wrapper) {
  wrapper.innerHTML = null;
  let elFragment = document.createDocumentFragment()

  movieArray.forEach(movie => {
    let templateDiv = elMovieCardTemplate.cloneNode(true)
    templateDiv.querySelector(".card-img-top").src = movie.imageLink
    templateDiv.querySelector(".card-title").textContent = movie.title
    templateDiv.querySelector(".card-categories").textContent = movie.categories.split("|").join(", ")
    templateDiv.querySelector(".card-year").textContent = movie.year
    templateDiv.querySelector(".card-rate").textContent = movie.rating
    templateDiv.querySelector(".card-link").href = movie.youtubeLink
    templateDiv.querySelector(".modal-open-btn").dataset.movieInfoId = movie.id
    templateDiv.querySelector(".bookmark-btn").dataset.movieId = movie.id

    elFragment.appendChild(templateDiv)
  });

  wrapper.appendChild(elFragment)

  let lengthOfMovies = movieArray.length

  if (lengthOfMovies == 0) {
    elAlert.textContent = "Not found!"
    elAlert.classList.add("alert-danger")
  }else {
    elAlert.textContent = `Search result: ${lengthOfMovies}`
    elAlert.classList.remove("alert-danger")
  }
}
renderMovies(normolizedMoviesList, elWrapper);


// find searched Movies function
var findMovies = function (movie_title, minRating, genre) {
  let resutArray = normolizedMoviesList.filter(movie => {
    var doesMatchCategory = genre ===`All` || movie.categories.includes(genre);

    return movie.title.match(movie_title) && movie.rating >= minRating && doesMatchCategory;
  })

  return resutArray
}


elForm.addEventListener("input", function(params) {
  params.preventDefault()

  let searchInput = elSearchInput.value.trim()
  let ratingInput = elRating.value.trim()
  let selectOption = elCategorySelect.value
  let sortingType = elSort.value

  let pattern = new RegExp(searchInput, "gi")
  let resultArray = findMovies(pattern, ratingInput, selectOption)

  if (sortingType === "high") {
    resultArray.sort((b,  a) => a.rating - b.rating)
  }
  if (sortingType === "low") {
    resultArray.sort((a,  b) => a.rating - b.rating)
  }
  renderMovies(resultArray, elWrapper);
})


// storage local
let storage = window.localStorage;
let bookmarkedMovies = JSON.parse(storage.getItem("movieArray")) || []

elWrapper.addEventListener("click", function (evt) {
  let movieID = evt.target.dataset.movieId;

  if (movieID) {
    let foundMovie = normolizedMoviesList.find(item => item.id == movieID)
    let doesInclude = bookmarkedMovies.findIndex(item => item.id === foundMovie.id)

    if (doesInclude === -1) {
      bookmarkedMovies.push(foundMovie)
      storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))

      renderBokmarkedMovies(bookmarkedMovies, elBookmarkedList)
    }
  }
})


// render Bokmarked Movies
function renderBokmarkedMovies(array, wrapper) {
  wrapper.innerHTML = null
  let elFragment = document.createDocumentFragment()

  array.forEach(function (item) {
    let templateBookmark = elBookmarkedTemplate.cloneNode(true)

    templateBookmark.querySelector(".movie-title").textContent = item.title
    templateBookmark.querySelector(".btn-remove").dataset.markedId = item.id

    elFragment.appendChild(templateBookmark)
  })
  wrapper.appendChild(elFragment)
}
renderBokmarkedMovies(bookmarkedMovies, elBookmarkedList)


elBookmarkedList.addEventListener("click",function (evt) {
  let removedMovieId = evt.target.dataset.markedId;

  if (removedMovieId) {
    let indexOfMovie = bookmarkedMovies.findIndex(item => item.id == removedMovieId)

    bookmarkedMovies.splice(indexOfMovie, 1)
    storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))
    storage.removeItem('user')

    renderBokmarkedMovies(bookmarkedMovies, elBookmarkedList)
  }
})

// create movie modal info
elWrapper.addEventListener("click", function (evt) {
  let moreInfoBtn = evt.target.dataset.movieInfoId

  if (moreInfoBtn) {
    let findMovie =normolizedMoviesList.find(item => item.id == moreInfoBtn)

    elMoveModal.querySelector(".movie-modal-heading").textContent = findMovie.title
    elMoveModal.querySelector(".movie-modal-text").textContent = findMovie.summary
  }
})