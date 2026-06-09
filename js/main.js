// get search function from api
import { searchGames } from "./api.js";

// gets information from the form on home page.
const form = document.getElementById("search-form");

// addEventListener listens to action happaning in from, in this situation a submit button.
// preventDefault Stops a <form> from reloading the page when clicking a submit button, allowing asynchronous JavaScript
// then we search and print games in console for now.
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("search-input");
    const games = await searchGames(searchInput.value);
    console.log(games);
});