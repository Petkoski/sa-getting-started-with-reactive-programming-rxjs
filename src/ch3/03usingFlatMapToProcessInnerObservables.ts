import { Observable, fromEvent } from "rxjs";
import { map, filter, delay, flatMap, mergeMap } from 'rxjs/operators';

let button = document.getElementById("button");
let output = document.getElementById("output");

//Creating an observable from a DOM event
let click = fromEvent(button, "click");

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        //Event handler that will execute when a response/error is received
        xhr.addEventListener("load", () => {
            let data = JSON.parse(xhr.responseText);
            observer.next(data);
            observer.complete();
        });

        xhr.open("GET", url);
        xhr.send();
    });  
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        // div.innerText = m.title;
        div.innerText = m.name;
        output.appendChild(div);
    });
}

/**
 * What should happen is that loading movies.json will produce an observable that we can
 * subscribe to, and then process the result that arrives from the server.
 */

//If you are writing a subscribe() inside of a subscribe(), there's typically a better way to do things

//Example:
// click.pipe(map(e => load("movies.json"))).subscribe(o => console.log(o)); //Returns an observable (makes sense because we are subscribing to the click observable)

// click.pipe(flatMap(e => load("movies.json"))).subscribe(o => console.log(o));
//Returns: (3) [{…}, {…}, {…}]
//^flatMap is a little more sophisticated than the map() operator. It sees that load()
//is producing an observable and flatMap() will subscribe to that observable. And then
//it will deliver throughout the rest of the pipeline into the next handler, whatever
//this inner observable produces.

//click.pipe(flatMap(e => load("movies.json"))) //When click event is received, load movies.json. FlatMap will subscribe to that inner observable and deliver data below
click.pipe(flatMap(e => load("https://jsonplaceholder.typicode.com/users")))
    .subscribe(
        renderMovies, //Render the received movies
        err => console.log(`error: ${err}`),
        () => console.log("Complete!"));

//complete() being raised (line 18) is on the inner observable, but this outer observable (the 
//click event) is not complete, that can continue into the future (user can continue clicking,
//and will pull down more movies)

//Why use RxJS for all these? One advantage is:
//Having such code:
//load("movies.json")
//Does nothing! Think of this method as being lazy. We are not going to send any
//request until someone subscribes to this observable (which is returned in load()).
//The code doesn't execute until someone subscribes to it (to its observable being returned).