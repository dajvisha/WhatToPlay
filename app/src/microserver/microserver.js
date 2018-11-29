import { CarbonLDP } from "carbonldp";
import { Event } from "carbonldp/Messaging/Event";
import igdb from 'igdb-api-node';

const client = igdb('8802b93cc6ad014d7391694b26bbf369');
const carbonldp = new CarbonLDP("https://db.itesm-01.carbonldp.com/");

function queryGenres() {
    let query = carbonldp.documents.$executeSELECTQuery(
        "genres/",
        `
            BASE <https://db.itesm-01.carbonldp.com/>
            PREFIX c:<https://carbonldp.com/ns/v1/platform#>
            PREFIX local:<https://db.itesm-01.carbonldp.com/vocabularies/main/#>
            PREFIX ldp:<http://www.w3.org/ns/ldp#>
            
            SELECT ?genreName
            WHERE {
                ?genre
                local:genreName ?genreName .
            }`);

    return query;
}

function queryPlatforms() {
    let query = carbonldp.documents.$executeSELECTQuery(
        "platforms/",
        `
            BASE <https://db.itesm-01.carbonldp.com/>
            PREFIX c:<https://carbonldp.com/ns/v1/platform#>
            PREFIX local:<https://db.itesm-01.carbonldp.com/vocabularies/main/#>
            PREFIX ldp:<http://www.w3.org/ns/ldp#>
            
            SELECT ?platformName
            WHERE {
                ?platform
                local:platformName ?platformName .
            }`);

    return query;
}

function buildPlatformsQS(platformsList) {
    let platformsQS = "(";

    for (let i = 0; i < platformsList.length - 1; i++) {
        let queryVariable =  `?platformName = "${platformsList[i]}" ||`;
        platformsQS += queryVariable;
    }

    platformsQS += `?platformName = "${platformsList[platformsList.length - 1]}"`;
    platformsQS += ')';

    return platformsQS;
}

function buildGenresQS(genresList) {
    let genresQS = "(";

    for (let i = 0; i < genresList.length - 1; i++) {
        let queryVariable =  `?genreName = "${genresList[i]}" || `;
        genresQS += queryVariable;
    }

    genresQS += `?genreName = "${genresList[genresList.length - 1]}"`;
    genresQS += ')';

    return genresQS;
}

function buildRatingQS(edad) {
    let ratingQS = "(";
    let ratingsAllowed = [];
    
    if(edad >= 18){
        ratingsAllowed = ["e", "e10", "t", "m"];
    } else if(edad >= 15){
        ratingsAllowed=["e", "e10", "t"];
    } else if(edad >= 10){
        ratingsAllowed = ["e", "e10"];
    } else{
        ratingsAllowed = ["e"];
    }

    for (let i = 0; i < ratingsAllowed.length - 1; i++) {
        let queryVariable =  `?ratingName = "${ratingsAllowed[i]}" || `;
        ratingQS += queryVariable;
    }

    ratingQS += `?ratingName = "${ratingsAllowed[ratingsAllowed.length - 1]}"`;
    ratingQS += ')';

    return ratingQS;
}

function queryRecomendations(options) {
    let platformsQS = buildPlatformsQS(options.userVGPlatforms);
    let genresQS = buildGenresQS(options.userVGGenres);
    let ratingQS = buildRatingQS(parseInt(options.userAge));

    let query = carbonldp.documents.$executeSELECTQuery(
        "/",
        `
            BASE <https://db.itesm-01.carbonldp.com/>
            PREFIX c:<https://carbonldp.com/ns/v1/platform#>
            PREFIX local:<https://db.itesm-01.carbonldp.com/vocabularies/main/#>
            PREFIX ldp:<http://www.w3.org/ns/ldp#>
        
            SELECT DISTINCT ?gameTitle 
            WHERE{
                ?game local:title ?gameTitle .
                ?game local:ratings ?ratings .
                ?ratings local:ratingName ?ratingName .
                ?game local:platforms ?platform .
                ?platform local:platformName ?platformName .
                ?game local:genres ?genres .
                ?genres local:genreName ?genreName .
                FILTER(${ratingQS} && ${platformsQS} && ${genresQS})
        }`);

    return query;
}

function getGenres() {
    return queryGenres();
}

function getPlatforms() {
    return queryPlatforms();
}

function fetchRecomendations(options) {
    return queryRecomendations(options);
}

function fetchVGInformation(searchTerm) {
    return client.games({
        search: searchTerm,
        limit: 1,
    },[
        'summary',
        'cover',
        'videos',
        'screenshots',
    ]);
}

function fetchRecomendationsInformation(data) {
    let recomendations = data.bindings;
    let promiseArray = [];

    for (let i = 0; i < recomendations.length; i++) {
        promiseArray.push(fetchVGInformation(recomendations[i].gameTitle));
    }

    return promiseArray;
}

function fetchInicio() {
    let fetchPromises = [getGenres(), getPlatforms()];
    return Promise.all(fetchPromises);
}

function processDataInicio(data) {
    let response = {};
    let genresList = [];
    let platformsList = [];

    let genresData = data[0].bindings;

    for (let i = 0; i < genresData.length; i++) {
        let currentGenre = genresData[i];
        genresList.push(currentGenre.genreName);
    }

    let platformsData = data[1].bindings;

    for (let i = 0; i < platformsData.length; i++) {
        let currentPlatform = platformsData[i];
        platformsList.push(currentPlatform.platformName);
    }

    response['genresList'] = genresList;
    response['platformsList'] = platformsList;

    return response;
}

export function waitNewGames() {
    carbonldp.documents.$on(Event.CHILD_CREATED, "/*", function(message) {
        
    }, function(error) {
        console.log(error);
    });
}

export function fetchData(page, options = {}) {
    if (page === "Inicio") {
        return new Promise(
            function (resolve, reject) {
                fetchInicio().then((data) => {
                    let inicioResponse = processDataInicio(data);
                    resolve(inicioResponse);
                });
            });
    } else if (page === 'Recomendations') {
        return new Promise(
            function (resolve, reject) {
                fetchRecomendations(options).then((data) => {
                    Promise.all(fetchRecomendationsInformation(data)).then((response) => {
                        let recomendationsResponse= {};
                        let recomendationsList = [];
                        let recomendations = data.bindings;
                
                        for (let i=0; i < response.length; i++) {
                            let recomendation = {};
                
                            let name = recomendations[i].gameTitle;
                            let description = response[i].body[0].summary;
                            let image = "http://bit.ly/2OVKovH";
                            let video = "";

                            if (response[i].body[0].cover) {
                                image = response[i].body[0].cover.url.substring(2);
                                image = image.replace('images.igdb.com', 'https://pull.spacechop.com')
                            }

                            if (response[i].body[0].videos) {
                                let currVideo = response[i].body[0].videos[0].video_id
                                video = currVideo;
                            }
                
                            recomendation['name'] = name;
                            recomendation['description'] = description;
                            recomendation['image'] = image;
                            recomendation['video'] = video;
                
                            recomendationsList.push(recomendation);
                        }
                
                        recomendationsResponse['recomendations'] = recomendationsList;
                
                        console.log(recomendationsResponse);
                        resolve(recomendationsResponse);
                    });
                });
            }
        );
    }

    return {};
}
