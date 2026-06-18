// get search functions from api
import { searchGames, searchGamesByGenre } from "./api.js";
// let curent page be 1 for starter.
let currentPage = 1;
// We'll need this because when the user presses Next, we need to know what they searched for.
let currentSearch = "";
// same with genre
let currentGenre = "all";
// for recomandations 
let recommendationPage = 1;
const recommendationsPerPage = 6;
let allRecommendations = [];
// get info from buttons
const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");
const pageNumber = document.getElementById("page-number");

// gets information from the form on home page.
const form = document.getElementById("search-form");


// addEventListener listens to action happaning in from, in this situation a submit button.
// preventDefault Stops a <form> from reloading the page when clicking a submit button, allowing asynchronous JavaScript
// then we search by name and filter searched game by ganre.
// renderGame (add the game to page)
if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const searchInput = document.getElementById("search-input");
        const genreFilter = document.getElementById("genre-filter");

        // if there is an error, we should be able to see it on page
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "";

        // while searching for games website will show "Loading games..."
        const loadingMessage = document.getElementById("loading-message");
        loadingMessage.textContent = "Loading games...";
        

        try{
            currentSearch = searchInput.value;
            currentPage = 1;
            currentGenre = genreFilter.value;
            
            const games = await searchGames(
                searchInput.value,
                currentPage
            );

            // aply all needed filters (garas and +4 rating)
            const filteredGames = applyFilters(games);
        
            // if there are no games found show this message and clear the past search
            if (filteredGames.length === 0) {
                document.getElementById("games-container").innerHTML = "";
                errorMessage.textContent = "No games found!";
                loadingMessage.textContent = "";
                return;
            }

            renderGames(filteredGames);
            loadingMessage.textContent = "";
            errorMessage.textContent = "";
        }catch (error) {
            loadingMessage.textContent = "";
            errorMessage.textContent = "Failed to load games :( ... Please try again!";
        }
    });
}

// if next/prev button is pressed
if (nextButton) {
    nextButton.addEventListener("click", async () => {
        if (!currentSearch) return;
        currentPage++;
        const games = await searchGames(currentSearch, currentPage);
        const filteredGames = applyFilters(games);
        renderGames(filteredGames);
        pageNumber.textContent =`Page ${currentPage}`;
    });
}
if (previousButton) {
    previousButton.addEventListener("click", async () => {
        if (!currentSearch) return;
        if (currentPage === 1) return;
        currentPage--;
        const games = await searchGames(currentSearch, currentPage);
        const filteredGames = applyFilters(games);
        renderGames(filteredGames);
        pageNumber.textContent =`Page ${currentPage}`;
    });
}




// creates a gamecard
function createGameCard(game) {
    const card = document.createElement("div");
    card.classList.add("game-card");

    // getting an image
    const image = document.createElement("img");
    image.src = game.background_image;
    // in case image wasnt found it will show games name
    image.alt = game.name;
    // tital
    const title = document.createElement("h3");
    title.textContent = game.name;
    // rating 
    const rating = document.createElement("p");
    rating.textContent = `Rating: ${game.rating}`;
    // ganras
    // combine all genre names into one string
    const genres = document.createElement("p");
    genres.textContent = "Genres: " + game.genres.map((genre) => genre.name).join(", ")

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(rating);
    card.appendChild(genres);
    return card;
}

// filters games by genre
function filterByGenre(games, genre) {
    if (genre === "all") {
        return games;
    }
    return games.filter((game) =>
        game.genres.some(
            (gameGenre) =>
                gameGenre.name.toLowerCase() === genre.toLowerCase()
        )
    );
}

// aplys all ganra and 4+ filter
function applyFilters(games) {
    let filteredGames = filterByGenre(games, currentGenre);
    const highRatedOnly = document.getElementById("high-rated-only").checked;
    if (highRatedOnly) {
        filteredGames = filteredGames.filter(
            game => game.rating >= 4
        );
    }
    return filteredGames;
}

// functon to desplay the games cards
function renderGames(games) {
    const container = document.getElementById("games-container");
    // clearing the container
    container.innerHTML = "";

    games.forEach((game) => {
        // Favorits button
        const card = createGameCard(game);
        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = "Add to favorites";
        favoriteButton.addEventListener("click", () => {
            saveFavorite(game);
        });
        
        // add everything to the created card.
        card.appendChild(favoriteButton);
        container.appendChild(card);
    });
}

// favotits Page

// saves favorite games
function saveFavorite(game) {
    // get existing favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // check if game already exists in favorites
    //  (some = Checks whether at least one item matches the condition.)
    const alreadySaved = favorites.some(
        (favorite) => favorite.id === game.id
    );
    if (alreadySaved) {
        alert(`${game.name} is already in favorites!`);
        return;
    }
    // add in the game
    favorites.push(game);
    // adds favorites to local storage with jsons help
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
    alert(`${game.name} added to favorites!`);
}
// check if we are on the favorites page
const savedContainer = document.getElementById("favorite-games-container");
if (savedContainer) {
    displayFavorites();
}

// clear button, if its clicked remove everything from favorites
const clearButton = document.getElementById("clear-favorites-btn");
if (clearButton) {
    clearButton.addEventListener("click", () => {
        localStorage.removeItem("favorites");
        displayFavorites();
    });
}

// desplays all the favorit cards and adds remove button to them
function displayFavorites() {
    const container = document.getElementById("favorite-games-container");
    const favorites =JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorite games yet!</p>";
        return;
    }
    container.innerHTML = "";

    favorites.forEach((game) => {
        const card = createGameCard(game);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            removeFavorite(game.id);
        });

        card.appendChild(removeButton);
        container.appendChild(card);
    });
}

// gets favorites from local storage and fiters them so they dont contain removed card.
// after that desplaying function is called again.
function removeFavorite(gameId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(
        (game) => game.id !== gameId
    );

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
    displayFavorites();
}


// recomandations Page:

const recommendationsContainer = document.getElementById("recommendations-container");

if (recommendationsContainer) {
    displayRecommendations();
}

function displayRecommendations() {
    const container = document.getElementById("recommendations-container");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // if there are no favorites go look for them
    if (favorites.length === 0) {
        container.textContent = "Look threw some games first! Choose favorites! :D";
        return;
    }

    // for each game, for each genre count them.
    const genreCount = {};
    favorites.forEach((game) => {
        game.genres.forEach((genre) => {
            if (genreCount[genre.name]) {
                genreCount[genre.name]++;
            } else {
                genreCount[genre.name] = 1;
            }
        });
    });

    // converts object into array, then we sort it from highest to lowest
    // then get top 3 
    const sortedGenres = Object.entries(genreCount);
    sortedGenres.sort((a, b) => b[1] - a[1]);
    const topGenres = sortedGenres.slice(0, 3);
    container.innerHTML = "";

    topGenres.forEach((genre) => {
        const p = document.createElement("p");
        p.textContent = `${genre[0]} (${genre[1]} favorites)`;;
        container.appendChild(p);
    });

    loadRecommendedGames(topGenres[0][0]);
}

// searches games using your favorite genre
// removes games already in favorites
// keeps only 10 games
async function loadRecommendedGames(topGenre) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const games = await searchGamesByGenre(topGenre.toLowerCase());
    const recommendedGames = games
    .filter(game => game.rating >= 4)
    .filter(game =>
        !favorites.some(
            favorite => favorite.id === game.id
        )
    );
    // Highest rating first
    recommendedGames.sort((a, b) => b.added - a.added);
    // i used this at the top of file*
    allRecommendations = recommendedGames;
    renderRecommendations();
}

// makes recomandation cards but also adds button "favorites" in them
function renderRecommendations() {
    const container = document.getElementById("recommended-games-container");
    container.innerHTML = "";
    // calculating what 6 games will be shown on that page!
    const start = (recommendationPage - 1) * recommendationsPerPage;
    const end = start + recommendationsPerPage;
    const gamesToShow = allRecommendations.slice(start, end);
    
    if (gamesToShow.length === 0) {
        container.innerHTML = "<p>No more recommendations for you :D</p>";
        return;
    }
    gamesToShow.forEach((game) => {
        const card = createGameCard(game);
        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = "Add to Favorites";

        favoriteButton.addEventListener("click", () => {
            saveFavorite(game);
            // remove recommendations that are now favorites
            allRecommendations = allRecommendations.filter(
                recommendation => recommendation.id !== game.id
            );
            renderRecommendations();
            displayRecommendations();
        });
        card.appendChild(favoriteButton);
        container.appendChild(card);
    });
}


// recomendation buttons

const recommendationNext = document.getElementById("recommendation-next");
if (recommendationNext) {
    recommendationNext.addEventListener("click", () => {
        const maxPage = Math.ceil(allRecommendations.length /recommendationsPerPage);
        if (recommendationPage < maxPage) {
            recommendationPage++;
            renderRecommendations();
            window.scrollTo(0, 0);
            document.getElementById("recommendation-page").textContent =`Page ${recommendationPage}`;
        }
    });
}

const recommendationPrev = document.getElementById("recommendation-prev");
if (recommendationPrev) {
    recommendationPrev.addEventListener("click", () => {
        if (recommendationPage > 1) {
            recommendationPage--;
            renderRecommendations();
            window.scrollTo(0, 0);
            document.getElementById("recommendation-page").textContent =`Page ${recommendationPage}`;
        }
    });
}