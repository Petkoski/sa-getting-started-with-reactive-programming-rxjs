import { Observable, fromEvent } from "rxjs";
import { map, filter, delay } from 'rxjs/operators';

let circle = document.getElementById("circle");

//Creating an observable from a DOM event
//fromEvent() instructs RxJS to wire up an event handler on a DOM element (any)
let source = fromEvent(document, "mousemove")
    .pipe(
        map((e: MouseEvent) => { //Mapping only x & y values
            return {
                x: e.clientX,
                y: e.clientY
            } 
        }), 
        filter(val => val.x < 500), //Filter only mouse moves on the left part of the window (x < 500)
        delay(100) //Hold the piece of data for 100ms, before it is delivered to the observer
    );
//^Gives an observable that will deliver data async (a
//stream of data).

function onNext(value) {
    circle.style.left = `${value.x}px`;
    circle.style.top = `${value.y}px`;
    console.log(value);
}

source.subscribe(
    onNext,
    err => console.log(`error: ${err}`),
    () => console.log("Complete!")
);