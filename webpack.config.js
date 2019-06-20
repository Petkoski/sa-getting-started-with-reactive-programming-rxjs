module.exports = {
    //Chapter 02:
    // entry: "./src/ch2/01creatingYourFirstObservableAndObserver", //Parts 02-01 to 06
    // entry: "./src/ch2/02usingObservableCreate", //Part 02-07
    // entry: "./src/ch2/03goingAsyncWithSetTimeout", //Part 02-08
    // entry: "./src/ch2/04usingRxJSOperators", //Part 02-09
    // entry: "./src/ch2/05importingJustWhatWeNeed", //Part 02-10

    //Chapter 03:
    // entry: "./src/ch3/01processingMouseEvents.ts", //Part 03-02
    // entry: "./src/ch3/02sendingRequestsWithXmlHttpRequest.ts", //Part 03-03
    // entry: "./src/ch3/03usingFlatMapToProcessInnerObservables.ts", //Part 03-04
    // entry: "./src/ch3/04implementingRetryLogicWithRetryAndRetryWhen.ts", //Part 03-05
    // entry: "./src/ch3/05usingFetchAndPromises.ts", //Parts 03-06 to 08

    //Chapter 04:
    // entry: "./src/ch4/01findingTheOperatorYouNeed.ts", //Part 04-02
    // entry: "./src/ch4/02dealingWithErrorsAndExceptions.ts", //Part 04-03
    // entry: "./src/ch4/03revistingTheRetryWhenStrategy.ts", //Part 04-04
    entry: "./src/ch4/04unsubscribingForCleanup.ts", //Part 04-05

    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ["*", ".ts", ".js"]
    },
    output: {
        filename: "app.js"
    }
}