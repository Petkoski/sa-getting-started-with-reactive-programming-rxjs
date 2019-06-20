import { Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';

//Huge number of operators RxJS provides (categories: to transform data, change timing, etc.)
//All of them are composable (can be combined together to establish a processing pipeline)
//https://rxjs-dev.firebaseapp.com/api/operators/

//Chaining map() & filter() operators
//https://rxjs-dev.firebaseapp.com/api/operators/map
//https://rxjs-dev.firebaseapp.com/api/operators/filter
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
//^Able to compose individual pieces of logic into the processing pipeline 
//that will process each item as delivered through the observable stream.
//Allows to maintain separation of concerns, gives flexibility with the 
//observables.

//Observer didn't have to change
source.subscribe(
    value => console.log(value),
    err => console.log(`error: ${err}`),
    () => console.log("Complete!")
); 