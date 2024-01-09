const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const newPerms = require("./newPerms");
const whereTakenCurrent = require("./whereTakenCurrent");

missingImages = async () => {
  const countryToCountryCode = {};
  for (const country of whereTakenCurrent) {
    countryToCountryCode[country.name] = country.code;
  }
  //   console.log(countryToCountryCode);
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

  const howManyGames = {};
  for (const perm of newPerms) {
    if (!(perm.country in howManyGames)) {
      howManyGames[perm.country] = 0;
    }
    howManyGames[perm.country]++;
  }
  const missing = [];
  const missingSome = [];
  for (const games in howManyGames) {
    const code = countryToCountryCode[games];
    if (!(code.toLowerCase() in howManyImages)) {
      missing.push([games, code]);
    } else if (howManyGames[games] > howManyImages[code.toLowerCase()]) {
      missingSome.push([
        games,
        code,
        Number(howManyGames[games]) - Number(howManyImages[code.toLowerCase()]),
      ]);
    }
  }
  //   console.log(Object.keys(howManyGames).length);
  //   console.log(Object.keys(howManyImages).length);
  console.log(missing);
  console.log(missingSome);
};

missingImages();
