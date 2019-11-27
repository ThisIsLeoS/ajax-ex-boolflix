// @ts-check

/* eslint-disable no-alert */
/* eslint-disable no-else-return */

// compilation of Handlebars' templates
// @ts-ignore
var movieInfoTemplateCompiled = Handlebars.compile($("body > #movie-info").html());
// @ts-ignore
var showInfoTemplateCompiled = Handlebars.compile($("body > #show-info").html());
// @ts-ignore
var flagTemplateCompiled = Handlebars.compile($("body > #lang-flag").html());
var starTemplateCompiled = Handlebars.compile($("body > #star-vote").html());

/*
 * Input TODO
 */

$("main .movie-or-show-input").keyup(function(key) {

    // if "Enter" has been pressed
    if (key.key === "Enter") {
        var searchedStr = $(this).val();
        printMoviesAndShows(searchedStr);
    }
});

/*
 * Button TODO
 */

$("main button").click(function() {
    var searchedStr = $("main .searched-movie-or-show").val();
    printMoviesAndShows(searchedStr);
});

/**
 * TODO
 * @param {*} searchedStr
 */
function printMoviesAndShows(searchedStr) {

    /* if the searched string isn't empty (note: printMoviesInfo and printShowInfo throw an error
    if an empty string is passed) */
    if (searchedStr.length > 0) {

        // the input field is emptied
        $("main .movie-or-show-input").val("");

        // the previously displayed movies and shows information are removed
        $("main .movies-info").empty();
        $("main .shows-info").empty();

        printMoviesInfo(searchedStr);
        printShowsInfo(searchedStr);
    }
    // else, nothing is printed
}

/**
 * TODO (throws error if empty string is passed TODO)
 * @param {String} searchedMovie
 */
function printMoviesInfo(searchedMovie) {
    $.ajax({
        "url": "https://api.themoviedb.org/3/search/movie",
        "method": "GET",
        "data": {
            "api_key": "2712588bad2a9f3c1777737cb66448d5",
            "query": searchedMovie,
            "include_adult": false,
        },
        "success": function(data) {
            var moviesInfoEl = $("main .movies-info");

            /* for each movie in the data.results array a movie info element is created and
            appended.
            Note: if the data.results array is empty (that is, there are no movies corresponding to
            the passed string), this loop won't loop */
            for (var i = 0; i < data.results.length; ++i) {

                // the movie info element is created
                var templateHTML = movieInfoTemplateCompiled({
                    "title": data.results[i].title,
                    "original_title": data.results[i].original_title,
                    "original_language": getFlag(data.results[i].original_language),
                    "poster_path": data.results[i].poster_path,

                    /* vote_average is a decimal number between 1 and 10 thus
                    Math.ceil(data.results[i].vote_average / 2) is an integer number between 1 and
                    5 */
                    "vote_average": getStars(Math.ceil(data.results[i].vote_average / 2))
                });

                moviesInfoEl.append(templateHTML);
            }
        },
        "error": function (iqXHR, textStatus, errorThrown) {
            alert(
                "iqXHR.status: " + iqXHR.status + "\n" +
                "textStatus: " + textStatus + "\n" +
                "errorThrown: " + errorThrown
            );
        }
    });
}

/**
 * TODO (throws error if empty string is passed TODO)
 * @param {String} searchedMovie
 */
function printShowsInfo(searchedShow) {
    $.ajax({
        "url": "https://api.themoviedb.org/3/search/tv",
        "method": "GET",
        "data": {
            "api_key": "2712588bad2a9f3c1777737cb66448d5",
            "query": searchedShow,
        },
        "success": function (data) {

            var showsInfoEl = $("main .shows-info");

            /* for each show in the data.results array a show info element is created and
            appended.
            Note: if the data.results array is empty (that is, there are no shows corresponding to
            the passed string), this loop won't loop */
            for (var i = 0; i < data.results.length; ++i) {

                // the show info element is created
                var templateHTML = showInfoTemplateCompiled({
                    "name": data.results[i].name,
                    "original_name": data.results[i].original_name,
                    "original_language": getFlag(data.results[i].original_language),
                    "poster_path": data.results[i].poster_path,

                    /* an integer number between 1 and 5 is passed to the getStars method
                    (vote_average is a decimal number between 1 and 10) */
                    "vote_average": getStars(Math.ceil(data.results[i].vote_average / 2))
                });

                showsInfoEl.append(templateHTML);
            }
        },
        "error": function (iqXHR, textStatus, errorThrown) {
            alert(
                "iqXHR.status: " + iqXHR.status + "\n" +
                "textStatus: " + textStatus + "\n" +
                "errorThrown: " + errorThrown
            );
        }
    });
}

// var file = new File();

/**
 * If the flag icon corresponding to the language passed as input exists, returns a string
 * containing the lang flag template with the URL of the flag icon. If the flag icon doesn't exist,
 * returns the same string passed as input
 * @param {String} lang - the language whose corresponding flag icon, if it exists, will be used to
 *     create the returned template
 * @returns {String} if the flag icon corresponding to the language passed as input exists, a string
 *     containing the lang flag template with the URL of the flag icon. If the flag icon doesn't
 *     exist, the same string passed as input
 */
function getFlag(lang) {
    if (lang === "cn" || lang === "en" || lang === "fr" || lang === "it" || lang === "ja") {
        var templateHTML = flagTemplateCompiled({
            "lang": lang
        });
        return templateHTML;
    }
    return lang;
    /* var flagIconFile = file("..\img\\" + lang + "-flag-icon.svg");

    if (!flagIconFile.exists) {
    alert(myfile + " could not be found!");
    }
    else console.log("found!"); */
    /* prendi la lingua
    verifica che il file della bandiera della lingua ci sia o fai un if per verificare se c'è l'immagine per la lingua
    fai una copia del template
    aggiungi la lingua ad entrambi i placeholder lang del template
    restituisci il template
    */
}

/**
 * Returns a string containing five star templates. The first numOfStars of these will have a color
 * the remaining ones won't
 * @param {Number} numOfStars - The number of coloured star templates that will be in the returned
 *     string
 * @returns {String} A string containing five star templates. The first numOfStars of these will
 *     have a color, the remaining ones won't
 */
function getStars(numOfStars) {

    // star template with an uncolored star
    var emptyStarHTML = starTemplateCompiled({
        "fill": "fill=\"transparent\""
    });

    // star template with a colored star
    var filledStarHTML = starTemplateCompiled({
        "fill": "fill=\"#F8D64E\""
    });

    var starTemplatesHTML = "";

    // first numOfStars stars have a color
    for (var i = 0; i < numOfStars; ++i) {
        starTemplatesHTML += filledStarHTML;
    }

    // remaining stars don't have a color
    for (var i = 0; i < 5 - numOfStars; ++i) {
        starTemplatesHTML += emptyStarHTML;
    }

    return starTemplatesHTML;
}
