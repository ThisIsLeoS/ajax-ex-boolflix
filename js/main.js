// @ts-check

/*
 * Input TODO
 */

$("main input").keyup(function(key) {
    var searchedMovie = $(this).val();

    // if "Enter" has been pressed
    if (key.key === "Enter") printMoviesInfo(searchedMovie);
});

/*
 * Button TODO
 */

$("main button").click(function() {
    var searchedMovie = $("main input").val();
    printMoviesInfo(searchedMovie);
});

/**
 * TODO
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

            // the previously displayed movies information are removed
            $("main .movies-info").empty();

            // a <ul> is appended to the movies info element
            var moviesInfoUl = $("<ul>");
            $("main .movies-info").append(moviesInfoUl);

            /* for each movie in the data.results array a movie info element is created and
            appended.
            Note: if the data.results array is empty (that is, there are no movies corresponding to
            the entered string), this loop won't loop */
            for (var i = 0; i < data.results.length; ++i) {

                // the movie info element is created from the movie info template
                var templateCompiled = Handlebars.compile($("body > #movie-info-template").html());
                var templateHTML = templateCompiled({
                    "title": data.results[i].title,
                    "originalTitle": data.results[i].original_title,
                    "originalLang": data.results[i].original_language,
                    "voteAverage": data.results[i].vote_average
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
