import { Observable, fromEvent } from "rxjs";
import { map, filter, delay } from 'rxjs/operators';

let button = document.getElementById("button");
let output = document.getElementById("output");

//Creating an observable from a DOM event
let click = fromEvent(button, "click");

function load(url: string) {
    let xhr = new XMLHttpRequest();

    //Event handler that will execute when a response/error is received
    xhr.addEventListener("load", () => {
        let movies = JSON.parse(xhr.responseText);
        movies.forEach(m => {
            let div = document.createElement("div");
            div.innerText = m.title;
            output.appendChild(div);
        });
    });

    xhr.open("GET", url);
    xhr.send();
}

click.subscribe(
    e => load("movies.json"),
    err => console.log(`error: ${err}`),
    () => console.log("Complete!")
);