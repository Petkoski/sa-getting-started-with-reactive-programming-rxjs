import { Observable, fromEvent, from, defer, merge, of, throwError, onErrorResumeNext } from "rxjs";
import { map, filter, delay, flatMap, retry, retryWhen, scan, takeWhile, catchError } from 'rxjs/operators';

import { load, loadWithFetch, loadWithFetchErrorHandled } from '../../loader';

let button = document.getElementById("button");
let output = document.getElementById("output");

let click = fromEvent(button, "click");

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

loadWithFetchErrorHandled("moviess.json")
    .subscribe(
        renderMovies,
        err => console.log(`error: ${err}`), //Now we don't have an unhandled exception
        () => console.log("Complete!"));

click.pipe(flatMap(e => loadWithFetchErrorHandled("moviess.json")))
    .subscribe(
        renderMovies,
        err => console.log(`error: ${err}`),
        () => console.log("Complete!"));