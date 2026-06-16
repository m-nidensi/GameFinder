// get search function from api
import { searchGames } from "./api.js";

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
        // this line is added so loading message will be visible for longer
        await new Promise(resolve => setTimeout(resolve, 300));

        try{

            const games = await searchGames(searchInput.value);
            // stores selected genre from dropdown
            const selectedGenre = genreFilter.value;
            let filteredGames = games;

            if (selectedGenre !== "all") {
                filteredGames = games.filter((game) =>
                    game.genres.some(
                        (genre) =>
                            genre.name.toLowerCase() === selectedGenre.toLowerCase()
                    )
                );
            }
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
// desplays all the favorit cards and adds remove button to them
function displayFavorites() {
    const container = document.getElementById("favorite-games-container");
    const favorites =JSON.parse(localStorage.getItem("favorites")) || [];
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