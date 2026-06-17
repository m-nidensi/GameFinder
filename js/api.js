// gets the information from the api. i used RAWG Video Games Database API
const API_KEY = "0118bd39bc0a447da42f7b9de821c02f";

// function that searches games when name of the game is given.
// responce is fetched from the website with key and name of the game.
// RAWG sends data in JSON format so response.json() converts it into a JavaScript object.
// and in the end it return results.
export async function searchGames(gameName) {
    const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&search=${gameName}`
    );
    const data = await response.json();
    return data.results;
}

export async function searchGamesByGenre(genre) {
    const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}`
    );
    const data = await response.json();
    return data.results;
}