import { Observable, fromEvent, from, defer, merge, of, throwError, onErrorResumeNext } from "rxjs";
import { map, filter, delay, flatMap, retry, retryWhen, scan, takeWhile, catchError } from 'rxjs/operators';

import { load, loadWithUnsubscribeLogic, loadWithFetch, loadWithFetchErrorHandled } from '../../loader';

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

/**
 * When we call subscribe() on an Observable, we receive back a subscription.
 */

//Let's say, loading this data takes long time and the user wants to cancel 
//the request (with button click for example).

//We need to grab the subscription returned from the Observable
let subscription = loadWithUnsubscribeLogic("movies.json")
    .subscribe(
        renderMovies,
        err => console.log(`error: ${err}`),
        () => console.log("Complete!"));
subscription.unsubscribe(); //unsubscribe() depends on the Observable. Currently we are creating an Observable
//that doens't have any unsubscribe logic. We must implement that logic (loader.ts lines 50-54). Status of this
//request will be (cancelled) in Network tab of Chrome dev tools.

/**
 * If we request a wrong url:
 * retry logic will jump in and you'll notice the cleanup operation is invoked each time.
 * How do they retry this operation? By unsubscribing from the one that errored, and subscribing
 * again to create a new observable. Cleanup logic ('Cleanup!' in console) is executed on each xml http request.
 */

click.pipe(flatMap(e => loadWithUnsubscribeLogic("movies.json")))
    .subscribe(
        renderMovies,
        err => console.log(`error: ${err}`),
        () => console.log("Complete!"));