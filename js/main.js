// @ts-check

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

            // a <ul> is appended to the movies info element
            var moviesInfoUl = $("<ul>");
            $("main .movies-info").append(moviesInfoUl);

            var templateCompiled = Handlebars.compile($("body > #movie-info-template").html());

            /* for each movie in the data.results array a movie info element is created and
            appended.
            Note: if the data.results array is empty (that is, there are no movies corresponding to
            the entered string), this loop won't loop */
            for (var i = 0; i < data.results.length; ++i) {

                // the movie info element is created from the movie info template
                var templateHTML = templateCompiled({
                    "title": data.results[i].title,
                    "originalTitle": data.results[i].original_title,
                    "originalLang": data.results[i].original_language,
                    // TODO: controllare che la funz restituisca un numero
                    "voteAverage": toIntBetween1And5(data.results[i].vote_average)
                });

                moviesInfoUl.append(templateHTML);
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

/* funzione per cambiare un numero decimale da 1 a 10 in un numero intero da 1 a 5 
Note: Math.ceil(null) returns integer 0 and does not give a NaN error. TODO */
function toIntBetween1And5(num) {
    return Math.ceil(num / 2);
}
