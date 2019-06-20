import { Observable, from, defer } from "rxjs";
import { delay, retryWhen, scan, takeWhile } from 'rxjs/operators';

export function load(url: string) {
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
    })
    .pipe(retryWhen(retryStrategy({attempts: 3, del: 1500})));
}

export function loadWithUnsubscribeLogic(url: string) { //Unsubscribe logic included (for ch4\04unsubscribingForCleanup.ts)
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        let onLoad = () => {
            if(xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            }
            else {
                observer.error(xhr.statusText);
            }
        }

        xhr.addEventListener("load", onLoad);

        xhr.open("GET", url);
        xhr.send();

        //Code that executes when someone invokes the unsubscribe() method. 
        //It's an ability to clean up the source, an ability to cancel the
        //execution of this async operation. Not everything async will give
        //you the ability to cancel the operation - that's hard to do with fetch().
        //If you want this ability (cancelling) implement such function.
        return () => {
            console.log("Cleanup!");
            xhr.removeEventListener("load", onLoad);
            xhr.abort();
        };
    })
    .pipe(retryWhen(retryStrategy({attempts: 3, del: 1500})));
}

export function loadWithFetch(url: string) {
    return defer(() => {
        return from(fetch(url).then(r => r.json()));
    });
}

export function loadWithFetchErrorHandled(url: string) { //Errror handling included
    return defer(() => {
        return from(fetch(url).then(r => {
            if(r.status == 200) {
                return r.json();
            } else {
                // throw new Error(); //Can escape our RxJS pipeline and truly become an uncaught exception that halts everything.
                return Promise.reject(r);
            }
        }));
    }).pipe(retryWhen(retryStrategyWithErrorPropagation({attempts: 3, del: 1500}))); //Retrying the entire network operation (if errors)
}

//Leave it as an implementation detail of this module (that's hidded). That's why it is not exported.
function retryStrategy({attempts = 4, del = 1000}) {
    return function(errors) {
        return errors.pipe(
            scan((acc, value) => {
                console.log(acc, value);
                return acc + 1;
            }, 0), 
            takeWhile(acc => acc < attempts),           
            delay(del)
        );
    }
}

function retryStrategyWithErrorPropagation({attempts = 4, del = 1000}) {
    return function(errors) {
        return errors.pipe(
            scan((acc, value) => {
                acc += 1;
                if(acc < attempts) {
                    return acc;
                }
                else {
                    throw new Error(String(value)); //retryWhen() operator maps this exception into a call to the error handler of the observer (that's the operator implementation)
                }
            }, 0), 
            delay(del)
        );
    }
}