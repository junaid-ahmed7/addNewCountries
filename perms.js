const express = require("express");
const currentPerms = require("./currentPerms");
const whereTakenCurrent = require("./whereTakenCurrent");
const app = express();
const PORT = 3007;

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

// Function to add 1 day to the given date string
function addOneDay(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  const currentDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
  currentDate.setDate(currentDate.getDate() + 1);
  const newDate = currentDate.toLocaleDateString("en-GB"); // Adjust the locale as needed
  return newDate;
}

function randomSort() {
  return Math.random() - 0.5; // Returns a random value between -0.5 and 0.5
}

app.get("/newPerms", async function (req, res, next) {
  // store number of games played for each country
  const gamesForEachCountry = {};
  // ignoring the first yemen game, loop through all current games and populate hashmap with number of games that have been played for that country and the photocodes that have been used
  for (let i = 1; i < currentPerms.length; i++) {
    const { country, date, photoCode, number } = currentPerms[i];
    if (country in gamesForEachCountry) {
      gamesForEachCountry[country].timesPlayed++;
      gamesForEachCountry[country].photoCodes.push(photoCode);
    } else {
      gamesForEachCountry[country] = {
        timesPlayed: 1,
        photoCodes: [photoCode],
      };
    }
  }

  // new games
  const newPossiblePerms = [];

  // to set game numbers for new games
  let currentGameNumber = currentPerms.length;

  // the date upto which games have been created, MANUALLY update this with the latest game date when you are running this function
  let date = "12/1/2024";

  // loop through all current countries we have data on
  for (const country of whereTakenCurrent) {
    // if there has never been a game before for a country, adding it to the hashmap
    if (!(country.name in gamesForEachCountry)) {
      gamesForEachCountry[country.name] = {
        timesPlayed: 0,
        photoCodes: [],
      };
    }

    // creating the new games, the while condition checks if we have more possible games we can create for every country.
    while (
      gamesForEachCountry[country.name].timesPlayed < country.game.length
    ) {
      // add one day to the date and reassing the date var
      date = addOneDay(date);

      // creating new game (perm)
      const newGame = {};
      newGame.country = country.name;

      // photo codes are out of order sometimes, as in the first time a country has been played does not mean we used photoCode 1, so we need to check with the used photo codes
      for (let i = 1; i <= country.game.length; i++) {
        // starting from 1, if that photo has not been used, use it
        if (!gamesForEachCountry[country.name].photoCodes.includes(i)) {
          newGame.photoCode = i;
          gamesForEachCountry[country.name].photoCodes.push(i);
          break;
        }
      }

    //   newGame.number = currentGameNumber++;
      newGame.date = date;

      // new game has been made, so for the purposes of this algorithm, this country has been played one more time, update counter
      gamesForEachCountry[country.name].timesPlayed++;

      // push the new game into new games array
      newPossiblePerms.push(newGame);
    }
  }

  // Use the custom sorting function to randomly sort the array
  const randomlySortedPerms = newPossiblePerms.sort(randomSort);

  // add game numbers to each new game, use the currentGameNumber as the start and increment
  for (let i = 0; i < randomlySortedPerms.length; i++){
    randomlySortedPerms[i].number = currentGameNumber++;
  };

  // send out a final array of all previous games spread with the new games after. this is the new perms.ts
  res.send([...currentPerms, ...randomlySortedPerms]);
});
