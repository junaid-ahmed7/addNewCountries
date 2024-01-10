const currentPerms = require("./currentPerms");
const whereTakenCurrent = require("./whereTakenCurrent");
const whereTakenNew = require("./whereTakenNew");

const lowCities = () => {
    const newAdds = {};
    for (const entry of whereTakenNew){
        newAdds[entry.country] = true;
    };
    const hasMapCityRound = {};
    for (const entry of whereTakenCurrent){
        if (entry.name in newAdds){
            for (let i = 2; i < entry.game.length; i++){
                if (entry.game[i].hasMapAndCityRound){
                    hasMapCityRound[entry.name] = true
                };
            };
        }
    };
    const notEnoughCities = {}
    for (const entry of whereTakenCurrent){
        if (entry.name in hasMapCityRound){
            if (entry.cities.length < 6){
                notEnoughCities[entry.name] = entry.cities.length;
            }
        }
    }
    console.log(notEnoughCities)
    console.log(Object.keys(hasMapCityRound).length)
};

lowCities();
