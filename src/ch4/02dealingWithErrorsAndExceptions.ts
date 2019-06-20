import { Observable, fromEvent, from, defer, merge, of, throwError, onErrorResumeNext } from "rxjs";
import { map, filter, delay, flatMap, retry, retryWhen, scan, takeWhile, catchError } from 'rxjs/operators';

import { load, loadWithFetch } from '../../loader';

/**
 * Error handling is another challenge in RxJS because
 * most of our code is async - the usual try-catch statement
 * does not work. By the time most of the interesting code
 * executes, we will already be out of the try-catch block.
 * That's why an observer has an onError method() to let us
 * know about errors.
 */

/**
 * Important to understand: In RxJS, if something creates an
 * error and invokes the error handler, but there is NO error
 * handler (in the observer), or any other operator that will
 * stop that error, then the error becomes an unhandled 
 * exception (similar to throw new Error("Stop!")).
 */

/**
 * If an error handler exists (in the observer):
 * We don't have an unhandled exception now, but the
 * observable sequence STOPS when an error is hit.
 */

let source = Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.error("Stop!");
    // throw new Error("Stop!");
    observer.next(3);
    observer.complete();
});

let source2 = merge(
    of(1),
    from([2, 3, 4]),
    throwError(new Error("Stop!")),
    /**
     * If we want to introduce an error into the sequence 
     * of items being produced by merging all these 
     * observables. We use the throwError() operator.
     * This produces a handled error that calls our
     * error handler (in the observer).
     * DIFFERENT from throw new Error("Stop!") //With this line
     * we are producing an unhandled exception (observer's
     * error handler WON'T be triggered).
     */
    of(5)
).pipe(catchError(e => {
    console.log(`caught: ${e}`);
    return of(10);
}));

/**
 * What if we want to continue even though this error occurs.
 * There are several techniques:
 * 1) Use onErrorResumeNext() operator instead of merge(). Take 
 * all observables and keep producing items from them even if
 * there is an error, just continue on.
 * 
 * 2) Use catchError() operator (lines 53-56). With it, we can
 * return a new Observable that can take over where the previous
 * Observable was stopped (line 55) because of an error.
 */

// source.subscribe(
//     value => console.log(`value: ${value}`),
//     error => console.log(`error: ${error}`),
//     () => console.log("Complete!")
// );
/**
 * Output:
 * value: 1
 * value: 2
 * error: Stop!
 */

source2.subscribe(
    value => console.log(`value: ${value}`),
    error => console.log(`error: ${error}`),
    () => console.log("Complete!")
);
/**
 * Output:
 * value: 1
 * value: 2
 * value: 3
 * value: 4
 * caught: Error: Stop!
 * value: 10
 * Complete!
 */