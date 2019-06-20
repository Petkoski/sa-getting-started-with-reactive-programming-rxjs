//If you want to be careful about the amount of code
//sent to the client browser, import just the pieces
//you need (and just the operators app needs to use)

// import { Observable } from "rxjs";
import { Observable } from "rxjs/Observable";
import { map, filter } from 'rxjs/operators';

let numbers = [1, 5, 10];
let source = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length) {
            setTimeout(produceValue, 2000);
        }
        else {
            observer.complete();
        }
    }

    produceValue(); 
}).pipe(map(val => Number(val) * 2), filter(x => x > 2));

source.subscribe(
    value => console.log(value),
    err => console.log(`error: ${err}`), 
    () => console.log("Complete!")
);