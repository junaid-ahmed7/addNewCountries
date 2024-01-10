const fs = require("fs");
const path = require("path");
const newPerms = require("./newPerms");
const whereTakenCurrent = require("./whereTakenCurrent");

function isAfterJanuary12th(dateString) {
  // Convert the input string to a Date object
  const dateParts = dateString.split('/');
  const year = parseInt(dateParts[2], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based in JavaScript Date object
  const day = parseInt(dateParts[0], 10);
  
  const inputDate = new Date(year, month, day);
  
  // Create a Date object for January 12th, 2024
  const january12th2024 = new Date(2024, 0, 12); // Month is zero-based
  
  // Compare the dates
  return inputDate > january12th2024;
}

missingMap = async () => {
  const countryToCountryCode = {};
  const hasMapRound = {};
  for (const country of whereTakenCurrent) {
    countryToCountryCode[country.code] = country.name;
    if (country.game[country.game.length - 1].hasMapAndCityRound || country.game[country.game.length - 1].hasMapAndCityRound){
      hasMapRound[country.name] = true;
    }
  }
  const missingMaps = {};
  fs.readdirSync("./countries/").forEach((file) => {
    if (file === ".DS_Store" || file === ".ds") {
      return;
    }
    const subFolderPath = path.join("./countries/", file);
    missingMaps[countryToCountryCode[file.toUpperCase()]] = true;
    fs.readdirSync(subFolderPath).forEach((i) => {
      if (i.startsWith("map")) {
        delete missingMaps[countryToCountryCode[file.toUpperCase()]]
      }
    });
  });

  const hasGameAndMissingMap = {};

  for (const perm of newPerms){
    if (isAfterJanuary12th(perm.date) && hasMapRound[perm.country] && perm.country in missingMaps){
        hasGameAndMissingMap[perm.country] = true;
    }
  }

  console.log(hasGameAndMissingMap)
};

missingMap();
