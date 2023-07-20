import API_KEY from "./key.js";
const link = `http://www.omdbapi.com/?apikey=${API_KEY}`
// gère le formulaire et récupère ses données
const form = document.forms['search-form'];

function submit(event) {
  event.preventDefault();
  const search = form.search.value;
  const dividedSearch = search.split(" ");
  const finalSearch = dividedSearch.map(word => word.replace(/\s+/g, '+'));
  console.log(finalSearch);
  getMovies(finalSearch);
}

form.onsubmit = submit;

// crée une requête en fonction des données récupérées dans la recherche
const getMovies = async (finalSearch) => {
  try {
    const response = await fetch(`${link}&s=${finalSearch}`);
    const movies = await response.json();
    const element = document.getElementById("movie");
    element.innerHTML = '';

    movies.Search.forEach((movie) => {
      showMovies(element, movie.Title, movie.Year, movie.Poster, movie.imdbID);
    });

  } catch (error) {
    console.error('Response error:', error.message);
  }
};

// gestion de l'intersection observer
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.5,
  }
);


// récupère les données supplémentaires sur le site
const getDetails = async (imdbID) => {
  try {
    const response = await fetch(`${link}&i=${imdbID}`);
    const movie = await response.json();
    showDetails(movie.Title, movie.Released,movie.Plot,  movie.Poster)
  } catch (error) {
    console.error('Response error:', error.message);
  }
};

let showMovies = (element, name, year, poster, imdbID) => {
  const movieDiv = document.createElement("div");
  movieDiv.innerHTML = `
    <div class="checked card mb-3" style="max-width: 540px;">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img src="${poster}" class="card-img" alt="poster">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">année : ${year}</p>
            <button class="btn btn-info btn-en-savoir-plus" data-imdbid="${imdbID}">En savoir plus</button>
          </div>
        </div>
      </div>
    </div>`;

  const movieElement = movieDiv.querySelector(".checked");
  element.appendChild(movieElement);

  observer.observe(movieElement);

  const enSavoirPlusButton = movieElement.querySelector(`[data-imdbid="${imdbID}"]`);

  enSavoirPlusButton.addEventListener('click', () => {
    getDetails(imdbID);
  });
};





// gestion de la popup
const popupContainer = document.getElementsByClassName("popup")[0];
const popupContent = document.getElementsByClassName("popup-content")[0];
const closeTag = document.getElementsByClassName("cancel-icon")[0];


const showDetails = (title, released, plot, poster) => {
  popupContent.innerHTML = "";
  popupContainer.classList.add("open-popup");
  popupContent.innerHTML += `
  <div class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src="${poster}" class="card-img" alt="poster">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${plot}</p>
        <p class="card-text"><small class="text-muted">date de sortie : ${released}</small></p>
      </div>
    </div>
  </div>
</div>

`;
}

const closePopup = () => {
  popupContainer.classList.remove("open-popup");
}

closeTag.addEventListener('click', closePopup);
