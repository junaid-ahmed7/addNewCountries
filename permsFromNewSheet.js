const express = require("express");
const currentPerms = require("./currentPerms");
const whereTakenNew = require("./whereTakenNew");
const whereTakenCurrent = require("./whereTakenCurrent");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3007;

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

function randomSort() {
  return Math.random() - 0.5; // Returns a random value between -0.5 and 0.5
}

// Function to add 1 day to the given date string
function addOneDay(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  const currentDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
  currentDate.setDate(currentDate.getDate() + 1);

  const newDay = currentDate.getDate();
  const newMonth = currentDate.getMonth() + 1; // Month is 0-based, so add 1

  const formattedDate = `${newDay}/${newMonth}/${currentDate.getFullYear()}`;

  return formattedDate;
}

function randomSort() {
  return Math.random() - 0.5; // Returns a random value between -0.5 and 0.5
}

app.get("/newPermsFromSheet", async function (req, res, next) {
  const currentGames = {};

  for (perm of currentPerms) {
    if (!(perm.country in currentGames)) {
      currentGames[perm.country] = 0;
    }
    currentGames[perm.country]++;
  }
  //   console.log(currentGames);
  const howManyImages = {};
  fs.readdirSync("./countries/").forEach((file) => {
    if (file === ".DS_Store" || file === ".ds") {
      return;
    }
    if (!(file in howManyImages)) {
      howManyImages[file] = 0;
    }
    const subFolderPath = path.join("./countries/", file);
    fs.readdirSync(subFolderPath).forEach((i) => {
      if (i.startsWith("main") && i[i.length - 1] === "g") {
        howManyImages[file]++;
      }
    });
  });

  const lengthOfGamesArray = {};
  for (const countries of whereTakenCurrent) {
    if (!(countries.name in lengthOfGamesArray)) {
      lengthOfGamesArray[countries.name] = countries.game.length;
    }
  }
  const newPerms = [];
  const newEntriesData = {};
  for (const newEntry of whereTakenNew) {
    if (!(newEntry.country in newEntriesData)) {
      newEntriesData[newEntry.country] = {
        hasBeenPlayed: currentGames[newEntry.country] || 0,
        howManyImages: howManyImages[newEntry.code.toLowerCase()],
        howManyGameDatas: lengthOfGamesArray[newEntry.country],
      };
      //   console.log(newEntriesData[newEntry.country].hasBeenPlayed >= 2);
    }
    // console.log(newEntry.country);
    // console.log(`has been played ${currentGames[newEntry.country] || 0} times`);
    // console.log(
    //   `it has ${howManyImages[newEntry.code.toLowerCase()]} images to use`
    // );
    // console.log(
    //   `length of games array = ${lengthOfGamesArray[newEntry.country]}`
    // );
    //   console.log(newEntry.country, howManyImages[newEntry.code.toLowerCase()], currentGames[newEntry.country], lengthOfGamesArray[newEntry.country])
  }
  const hasBeenSeen = {};
  for (const newEntry of whereTakenNew) {
    const newPerm = {};
    newPerm.country = newEntry.country;
    newPerm.photoCode = newEntry.country in hasBeenSeen ? 4 : 3;
    hasBeenSeen[newEntry.country] = true;
    newPerms.push(newPerm);
  }

  const randomlySortedPerms = newPerms.sort(randomSort);

  // the date upto which games have been created, MANUALLY update this with the latest game date when you are running this function
  let date = "12/1/2024";

  // to set game numbers for new games
  let currentGameNumber = currentPerms.length;

  for (const newRandomPerm of randomlySortedPerms){
    date = addOneDay(date);
    newRandomPerm.number = currentGameNumber++;
    newRandomPerm.date = date;
  }
  console.log(randomlySortedPerms);
  console.log(randomlySortedPerms.length);
  console.log(currentGameNumber);
  res.send([ ...currentPerms, ...randomlySortedPerms]);
});
