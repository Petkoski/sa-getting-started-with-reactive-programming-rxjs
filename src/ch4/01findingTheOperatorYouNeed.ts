/**
 * RxJS presents several challenges:
 * 1) To think like RxJS wants you to think (to think about 
 * streams of data that arrive asynchronously). Thinking this
 * way is different than the way we think about using
 * callbacks, or events, or promises.
 * 
 * 2) Knowing the RxJS API (there are so many operators to
 * choose from and so many special case operators you might
 * never use):
 * http://reactivex.io/documentation/operators.html
 * a) Operators By Category
 * b) A Decision Tree of Observable Operators (if you have
 * some observable data and a general idea of what you
 * want to do with it, but not sure what operator to use)
 * 
 * Example: http://reactivex.io/documentation/operators/flatmap.html
 * (sample code included)
 * 
 * It's good to have a small experimental project set aside 
 * for testing particular operators (in isolation) away from 
 * the real application.
 */