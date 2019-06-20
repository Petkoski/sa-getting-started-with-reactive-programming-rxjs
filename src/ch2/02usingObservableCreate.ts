import { Observable, from } from "rxjs";

let numbers = [1, 5, 10];
let source = Observable.create(observer => { //Passing an observer object
    for (const n of numbers) {
        // if(n === 5)
        //     observer.error("Something went wrong!"); //Observable keen to stop after this

        observer.next(n);
    }
    observer.complete();
});

source.subscribe(
    value => console.log(value),
    err => console.log(`error: ${err}`),
    () => console.log("Complete!")
);

/**
 * Each time the observable receives a new piece of data, the observable
 * can invoke the next() method, and the passed value will be delivered
 * to the observer which can then react or do something in response.
 */