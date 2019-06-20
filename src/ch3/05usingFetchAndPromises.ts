import { Observable, fromEvent, from, defer } from "rxjs";
import { map, filter, delay, flatMap, retry, retryWhen, scan, takeWhile } from 'rxjs/operators';

let button = document.getElementById("button");
let output = document.getElementById("output");

let click = fromEvent(button, "click");

/**
 * Using Observables with promises
 * Promises have some limitations compared to Observables:
 * a) Promises deliver only a single value, and then they are finished,
 * whereas Observables can deliver an infinite stream of data.
 * b) Promises lack of operators (map, flatMap, retryWhen)
 */

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if(xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            }
            else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open("GET", url);
        xhr.send();
    })
    .pipe(retryWhen(retryStrategy({attempts: 3, del: 1500})));
}

//Second implementation (working with promises, creating an Observable from a promise)
//https://github.com/whatwg/fetch
//Fetch standard https://fetch.spec.whatwg.org/
function loadWithFetch(url: string) {
    //return from(fetch(url).then(r => r.json()));

    //Making loadWithFetch() lazy (to make network request ONLY WHEN SOMEONE SUBSCRIBES):
    return defer(() => {
        return from(fetch(url).then(r => r.json()));
    });
}

function retryStrategy({attempts = 4, del = 1000}) {
    return function(errors) {
        return errors.pipe(
            scan((acc, value) => {
                console.log(acc, value);
                return acc + 1; //Returning a new value for the accumulator
            }, 0), 
            takeWhile(acc => acc < attempts),           
            delay(del)
        );
    }
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

loadWithFetch("movies.json");
    //.subscribe(renderMovies);
//Calling the function without subscribing to it - a request will be send (when line is executed)!
//So loadWithFetch() is NOT AS LAZY as load() implementation
//[check .\ch3\03usingFlatMapToProcessInnerObservables.ts].
//To make it lazy - use defer() [lines 44-47].

click.pipe(flatMap(e => loadWithFetch("movies.json")))
    .subscribe(
        renderMovies, //Render the received movies
        err => console.log(`error: ${err}`),
        () => console.log("Complete!"));