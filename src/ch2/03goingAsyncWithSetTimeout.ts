import { Observable, from } from "rxjs";

let numbers = [1, 5, 10];
let source = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length) {
            setTimeout(produceValue, 2000); //Going async with setTimeout()
        }
        else {
            observer.complete();
        }
    }

    produceValue();
    //Now the observable is producing a stream of data over time
});

source.subscribe(
    value => console.log(value),
    err => console.log(`error: ${err}`),
    () => console.log("Complete!")
);
//Didn't need to change anyting in the observer. The observer is simply an
//object that waits for data to be produced from the observable and provides
//the logic to react to arriving data. Doens't matter if the data is arriving
//synchronously (like before with from()) or async (like the ^ example).
//The observer is ISOLATED from all these details. That's one of the nice
//abstractions that RxJS provides.