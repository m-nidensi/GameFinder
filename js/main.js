// get search function from api
import { searchGames } from "./api.js";

// gets information from the form on home page.
const form = document.getElementById("search-form");

// addEventListener listens to action happaning in from, in this situation a submit button.
// preventDefault Stops a <form> from reloading the page when clicking a submit button, allowing asynchronous JavaScript
// then we search by name and filter searched game by ganre.
// renderGame (add the game to page)
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchInput = document.getElementById("search-input");
    const genreFilter = document.getElementById("genre-filter");

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

    renderGames(filteredGames);
});

// functon to desplay the games cards
function renderGames(games) {
    const container = document.getElementById("games-container");
    // clearing the container
    container.innerHTML = "";

    games.forEach((game) => {
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

        // Favorits button
        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = "Add to favorites"
        

        // add everything to the created card.
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(rating);
        card.appendChild(genres);
        card.appendChild(favoriteButton);
        container.appendChild(card);

    });
}
