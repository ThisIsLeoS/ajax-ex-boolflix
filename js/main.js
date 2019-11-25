// @ts-check

/*
 * Input TODO
 */

$("main input").keyup(function(key) {
    var searchedMovie = $(this).val();

    // if the newline character has been entered
    if (key.keyCode === 13) printMoviesInfo(searchedMovie);
});

/*
 * Button TODO
 */

$("main button").click(function() {
    var searchedMovie = $("main .movies-info input");
    printMoviesInfo(searchedMovie);
});

/* funzione per richiesta HTTP al server:
in input prende la stringa inserita dall'utente
fa una chiamata ad AJAX
- nel metodo success stampi i risultati */
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
            var moviesInfoUl = $("<ul>");
            $("main .movies-info").append(moviesInfoUl);

            /* if no movies corresponding to the entered string are found, data.results will
            contain an empty array and this loop won't loop */
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
            $("main .movies-info").append(moviesInfoUl);
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
