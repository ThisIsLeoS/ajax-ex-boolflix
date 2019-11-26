/* eslint-disable no-else-return */
// @ts-check

// compilation of Handlebars' templates
var movieInfoTemplateCompiled = Handlebars.compile($("body > #movie-info").html());
var movieLangTemplateCompiled = Handlebars.compile($("body > #movie-lang-flag").html());

/*
 * Input TODO
 */

$("main .searched-movie-input").keyup(function(key) {
    var searchedMovie = $(this).val();

    /* if "Enter" has been pressed and the entered string isn't an empty string (printMoviesInfo
    throws an error if an empty string is passed) */
    if (key.key === "Enter" && searchedMovie.length > 0) {
        printMoviesInfo(searchedMovie);
    }
});

/*
 * Button TODO
 */

$("main button").click(function() {
    var searchedMovie = $("main .searched-movie-input").val();

    /* if the entered string isn't an empty string (printMoviesInfo throws an error if an empty
    string is passed) */
    if (searchedMovie.length > 0) printMoviesInfo(searchedMovie);
});

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
            "include_adult": false
        },
        "success": function(data) {

            // the input field is emptied
            $("main .searched-movie-input").val("");

            // the previously displayed movies information are removed
            $("main .movies-info").empty();

            var moviesInfoEl = $("main .movies-info");

            /* for each movie in the data.results array a movie info element is created and
            appended.
            Note: if the data.results array is empty (that is, there are no movies corresponding to
            the entered string), this loop won't loop */
            for (var i = 0; i < data.results.length; ++i) {

                // the movie info element is created
                var templateHTML = movieInfoTemplateCompiled({
                    "title": data.results[i].title,
                    "originalTitle": data.results[i].original_title,
                    "originalLang": toFlag(data.results[i].original_language),

                    /* an integer number between 1 and 5 is passed to the toStars method
                    (vote_average is a decimal number between 1 and 10) */
                    "averageVote": toStars(Math.ceil(data.results[i].vote_average / 2))
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


// var file = new File();

/**
 * If the flag icon corresponding to the language passed as input exists, returns a string
 * containing the lang flag template with the URL of the flag icon. If the flag icon doesn't exist,
 * returns the same string passed as input
 * @param {String} lang - the language whose corresponding flag icon, if it exists, will be used to
 *     create the returned template
 * @returns if the flag icon corresponding to the language passed as input exists, returns a string
 *     containing the lang flag template with the URL of the flag icon. If the flag icon doesn't
 *     exist, returns the same string passed as input
 */
function toFlag(lang) {
    if (lang === "cn" || lang === "en" || lang === "fr" || lang === "it" || lang === "jp") {
        var templateHTML = movieLangTemplateCompiled({
            "lang": lang
        });
        return templateHTML;
    }
    else {
        return lang;
    }
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
 * Returns a string containing the star template repeated a number of times euqal to the number
 * passed as input
 * @param {Number} numOfStars - the number of times the star template will be in the returned string
 * @returns a string containing the star template repeated a number of times euqal to the number
 * passed as input
 */

// TODO mettere stars vuote (average vote 0 = 5 stars vuote)
function toStars(numOfStars) {
    var starTemplateHTML = document.getElementById("movie-star-vote").innerHTML;
    var starTemplatesHTML = "";
    for (var i = 0; i < numOfStars; ++i) {
        starTemplatesHTML += starTemplateHTML;
    }
    return starTemplatesHTML;
}
