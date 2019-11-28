// compilation of Handlebars' templates
var infoTemplateCompiled = Handlebars.compile($("body > #info").html());
var flagTemplateCompiled = Handlebars.compile($("body > #lang-flag").html());
var starTemplateCompiled = Handlebars.compile($("body > #star-vote").html());

/*
 * Field to search movies and shows
 */
$("main .movie-or-show-input").keyup(function(key) {

    // if "Enter" has been pressed
    if (key.key === "Enter") {
        var query = $(this).val();
        printMoviesAndShows(query);
    }
});

/*
 * Search button to the right of the field to search movies and shows
 */
$("main button").click(function() {
    var query = $("main .movie-or-show-input").val();
    printMoviesAndShows(query);
});

/**
 * Empties the field used to search movies and shows and removes the previously displayed movies
 * and shows.
 * Prints all the info of the movies and the shows that have the query in the title
 * @param {String} query - The searched movie or show
 */
function printMoviesAndShows(query) {
    reset();
    printInfo(query, "movie");
    printInfo(query, "tv");
}

/**
 * If the parameter movieOrTv contains "movie", prints the info of the movies that have the query
 * in the title. If the parameter moviesOrTv contains "tv" does the same thing but for the shows.
 * @param {String} query - The searched movie or show
 * @param {String} movieOrTv - A string containing "movie" or "tv"
 */
function printInfo(query, movieOrTv) {

    /* if the query isn't empty (needed check because the server returns an object containing an
    error message if an empty query is passed) (note: if the query is empty this function does
    nothing) */
    if (query.length > 0) {
        $.ajax({
            "url": "https://api.themoviedb.org/3/search/" + movieOrTv,
            "method": "GET",
            "data": getData(query, movieOrTv),
            "success": function(data) {
                var elToAppendTo = (movieOrTv === "movie") ?
                    $("main .movies")
                    : $("main .shows");

                /* for each movie (or show) in the data.results array a movie-or-show-info element
                is created and appended.
                Note: if the data.results array is empty (that is, there are no movies or shows
                corresponding to the passed query), this loop won't loop */
                for (var i = 0; i < data.results.length; ++i) {

                    // the movie or show info element is created
                    var templateHTML = infoTemplateCompiled({

                        /*
                        * value names that differs between the movies and the shows returned by the
                        * server
                        */
                        "title": movieOrTv === "movie" ?
                            data.results[i].title
                            : data.results[i].name,
                        "original_title": movieOrTv === "movie" ?
                            data.results[i].original_title
                            : data.results[i].original_name,

                        /*
                        * value names common to both the movies and the shows returned by the server
                        */
                        "original_language": getFlag(data.results[i].original_language),

                        // needed check because data-results[i].poster_path could be null
                        "poster_path": data.results[i].poster_path ?
                            "https://image.tmdb.org/t/p/w342" + data.results[i].poster_path
                            : "img/no-poster-available.jpg",

                        /* vote_average is a decimal number between 1 and 10 thus
                        Math.ceil(data.results[i].vote_average / 2) is an integer number between 1
                        and 5 */
                        "vote_average": getStars(Math.ceil(data.results[i].vote_average / 2))
                    });

                    // the movie-or-show-info element is appended
                    elToAppendTo.append(templateHTML);
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
}

/**
 * If the flag icon corresponding to the language passed as input exists, returns a string
 * containing the lang flag template with the URL of the flag icon. If the flag icon doesn't exist,
 * returns the same string passed as input
 * @param {String} lang - The language whose corresponding flag icon, if it exists, will be used to
 *     create the returned template
 * @returns {String} If the flag icon corresponding to the language passed as input exists, a string
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
}

/**
 * Returns the value of the data property (one of the properties of the object passed to the ajax
 * method)
 * @param {String} query - The searched movie or show
 * @param {String} movieOrTv - A string containing "movie" or "tv"
 * @returns {Object} The value of the data property (one of the properties of the object passed to
 *     the ajax method)
 */
function getData(query, movieOrTv) {

    // properties common to both query strings
    var dataObj = {
        "api_key": "2712588bad2a9f3c1777737cb66448d5",
        "query": query
    };

    // properties specific to the query string for a movie
    if (movieOrTv === "movie") {
        dataObj.include_adult = false;
    }

    return dataObj;
}

/**
 * Returns a string containing five star templates. The first numOfStars of these will have a color
 * the remaining ones won't
 * @param {Number} numOfStars - The number of colored star templates that will be in the returned
 *     string
 * @returns {String} A string containing five star templates. The first numOfStars of these will
 *     have a color, the remaining ones won't
 */
function getStars(numOfStars) {

    var i;

    // star template with an uncolored star
    var emptyStarHTML = starTemplateCompiled({
        "fill": "fill=\"transparent\""
    });

    // star template with a colored star
    var filledStarHTML = starTemplateCompiled({
        "fill": "fill=\"#F8D64E\""
    });

    var starTemplatesHTML = "";

    // first numOfStars star templates have a color
    for (i = 0; i < numOfStars; ++i) {
        starTemplatesHTML += filledStarHTML;
    }

    // remaining stars templates don't have a color
    for (i = 0; i < 5 - numOfStars; ++i) {
        starTemplatesHTML += emptyStarHTML;
    }

    return starTemplatesHTML;
}

/**
 * Empties the field used to search movies and shows and removes the previously displayed movies
 * and shows
 */
function reset() {

    // the input field is emptied
    $("main .movie-or-show-input").val("");

    // the previously displayed movies and shows information are removed
    $("main .movies").empty();
    $("main .shows").empty();
}
