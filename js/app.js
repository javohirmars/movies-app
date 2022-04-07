let elWrapper = document.querySelector("#wrapper");
let elForm = document.querySelector("#form");
let elSearchInput = document.querySelector("#search_input");
let elCategorySelect= document.querySelector("#category-select");
let elRating = document.querySelector("#rating");
let elSort = document.querySelector("#rating_sort");
let elBtn = document.querySelector("#btn");
let elTitle = document.querySelector("#search-result");
let elMovieCardTemplate = document.querySelector("#movie_card").content;


// Get movies list
let slicedMovies = movies.slice(0, 100)

var normolizedMoviesList = slicedMovies.map(movieItem => {
  return {
    title: movieItem.Title.toString(),
    categories: movieItem.Categories,
    rating: movieItem.imdb_rating,
    year: movieItem.movie_year,
    imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
    youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`
  }
})

// create categories
function generateCategories(movieArray) {
  let categoryList = []

  movieArray.forEach(function(item) {
    let splittedItem = item.categories.split("|");

    splittedItem.forEach(function(item) {
      if (!categoryList.includes(item)) {
        categoryList.push(item)
      }
    })
    categoryList.sort();
  })

  let categoryFragment = document.createDocumentFragment()

  categoryList.forEach(function (item) {
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

    elFragment.appendChild(templateDiv)

  });

  wrapper.appendChild(elFragment)

  elTitle.textContent = movieArray.length;
}
renderMovies(normolizedMoviesList, elWrapper);

// elForm.addEventListener("submit", function(params) {
//   params.preventDefault()

//   let ratingInput = elRating.value.trim()
//   let filteredArray = normolizedMoviesList.filter(item => item.rating >= ratingInput)

//   renderMovies(filteredArray, elWrapper);
// })

// elForm.addEventListener("submit", function(params) {
//   params.preventDefault()

//   var selectOption = elCategorySelect.value
//   let categorizedMovies = []

//   if (selectOption === "All") {
//     categorizedMovies = normolizedMoviesList
//   } else {
//     categorizedMovies= normolizedMoviesList.filter(function (item) {
//       return item.categories.split("|").includes(selectOption)
//     })
//   }

//   renderMovies(categorizedMovies, elWrapper);
// })

// elForm.addEventListener("submit", function(params) {
//   params.preventDefault()

//   var searchInput = elSearchInput.value.trim().toLowerCase()

//   let searchedMovies = normolizedMoviesList.filter(function(item) {
//     return item.title.toLowerCase().includes(searchInput)
//   })

//   renderMovies(searchedMovies, elWrapper);
// })

var findMovies = function (movie_title, minRating, genre) {

  return normolizedMoviesList.filter(function (movie) {
    var doesMatchCategory = genre ===`All` || movie.categories.includes(genre);

    return movie.title.match(movie_title) && movie.rating >= minRating && doesMatchCategory;
  })
}

elForm.addEventListener("input", function(params) {
  params.preventDefault()

  let searchInput = elSearchInput.value.trim()
  let pattern = new RegExp(searchInput, "gi")

  let ratingInput = elRating.value.trim()
  let selectOption = elCategorySelect.value
  let sortingType = elSort.value

  let resultArray = findMovies(pattern, ratingInput, selectOption)

  if (sortingType === "high") {
    resultArray.sort((b,  a) => a.rating - b.rating)
  }
  if (sortingType === "low") {
    resultArray.sort((a,  b) => a.rating - b.rating)
  }
  renderMovies(resultArray, elWrapper);
})