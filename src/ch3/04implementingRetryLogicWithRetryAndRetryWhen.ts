import { Observable, fromEvent } from "rxjs";
import { map, filter, delay, flatMap, retry, retryWhen, scan, takeWhile } from 'rxjs/operators';

let button = document.getElementById("button");
let output = document.getElementById("output");

let click = fromEvent(button, "click");

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
    })//.pipe(retry(3)); //Automatic retry logic built into the observable (this will send 3 retry requests [4 in total])
    .pipe(retryWhen(retryStrategy({attempts: 3, del: 1500}))); //Sophisticated. Instead of passing a number, we pass a function that takes an observable (observable of the errors that are being produced upstream) and returns an observable (used to figure out the retry strategy).
}

function retryStrategy({attempts = 4, del = 1000}) { //Setting default values (if not provided when function is called)
    //Approach #1:
    //Currently - this is an infinite loop. Every time observer.error()
    //is invoked (line 20), that error is delivered to this observable. 
    //Since we are just returning that observable, the retryStrategy() 
    //will continue to retry.
    // return function(errors) {
    //     return errors.pipe(delay(1000)); //Delaying the delivery of that error
    //     /**
    //      * We still have an infinite loop, but now at least we are waiting 1000ms 
    //      * between each request.
    //      */
    // }

    //Approach #2:
    return function(errors) {
        return errors.pipe(
            scan((acc, value) => {
                console.log(acc, value);
                return acc + 1; //Returning a new value for the accumulator
            }, 0), 
            //Scan is like an aggregation function, we can use it to count items
            //coming through a sequence, compute the sum of some property of objects
            //being delivered. 
            //We pass a function to scan() that takes 2 params:
            //a) acc
            //b) value being produced by the observable (in our case - error that we deliver with observer.error() [line 20])
            //Second param to scan() is a starting value for our accumulator (0 in this example)

            takeWhile(acc => acc < attempts),
            //Operator that will stop the observable when we reach some max number of retry attempts.
            //Receives the value produced in the pipeline (in our example - acc value)
            //Returning true - takeWhile() allows the observable to keep on going
            //Returning false - takeWhile() will complete the observable (calls complete() on the observer)
            
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

//Simulating an error by requesting a file that doesn't exist.
//What we want? App to RETRY the operation 3 times with 1500ms of delay between each request.
click.pipe(flatMap(e => load("moviess.json")))
    .subscribe(
        renderMovies, //Render the received movies
        err => console.log(`error: ${err}`),
        () => console.log("Complete!"));

/**
 * Why adding an extra library just to do something that we've 
 * been able to do with a minimal amount of code for years?
 * RxJS might not be the type of library you rely on to solve 
 * one problem in the app. It is more of a lifestyle choice for
 * an app, an app that wants to be reactive everywhere.
 * RxJS gives the ability to handle events and react to data using 
 * some higher level of complexity (ex. combine together streams of
 * data using operators like flatMap and apply functional 
 * programming techniques to solve problems).
 */