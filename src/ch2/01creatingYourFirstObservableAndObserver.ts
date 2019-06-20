import { Observable, from, Observer } from "rxjs";

//Numerous different APIs to create a new observable object (a new data source).

//Create:

//Easier method - from()
let numbers = [1, 5, 10]; //This doesn't represent an async data source
let source = from(numbers); //Hiding the array behind an observable and have the observable produce a stream of data.

//1) Formal way of creating an observer (using the Observer interface) as a class:
//Classes allow to track state, add additional APIs, use interfaces, etc.
class MyObserver implements Observer<number> {
    //It needs 3 methods:
    next(value) { //Method that the observable will invoke on the observer when there is a value to produce (that might be right now, or 10 secs from now)
        console.log(value);
    }

    error(err) { //If the observable encounters an error, the observable object will invoke the error() method on the observer
        console.log(`error: ${err}`);
    }

    complete() { //If the observable knows that it has exhausted the data source, it will invoke this method on the observer
        console.log("Complete!"); //Not every observable data source can complete
    }
}

//source.subscribe(new MyObserver()) //Passing an observer (observer listens/subscribes to an observable)
//source.subscribe(new MyObserver()) //Multiple subscribers to a single observable


//2) Creating an observer by passing functions (or passing just one):
//Just as before, but with less formality
source.subscribe(
    value => console.log(value),
    err => console.log(`error: ${err}`),
    () => console.log("Complete!")
);