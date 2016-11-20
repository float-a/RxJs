import {Observable,Observer} from 'rxjs';
// import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";

import {load, loadWithFetch} from './loader';

let numbers = [1, 5, 10];

class MyObserver implements Observer<number> {
    next(value) {
        console.log(`value: ${value}`);
    }

    error(e){
        console.log(`error: ${e}`);
    }

    complete(){
        console.log("completed");
    }
}

// Ex.1
let source1 = Observable.from(numbers);

source1.subscribe(new MyObserver());

// <=>
source1.subscribe( value => console.log(`value: ${value}`),
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
);

//Ex. 2
let source2 = Observable.create(function(observer) {
    for (let n of numbers) {
        
        if(n==5) {
            observer.error("Something went wrong!");
        }
        observer.next(n);
    }

    observer.complete()
})

source2.subscribe(value => console.log(`value: ${value}`),
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
)


//EX. 3
let source3 = Observable.create(observer => {
        let index = 0;

        let produceValue = () => {
            observer.next(numbers[index++])   

            if(index < numbers.length) {
               setTimeout(produceValue, 200); 
            } 
            else {
                observer.complete();
            }
        }

        produceValue();
})

source3.subscribe(value => console.log(`value: ${value}`),
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
)

//EX. 4
let source4 = Observable.create(observer => {
        let index = 0;

        let produceValue = () => {
            observer.next(numbers[index++])   

            if(index < numbers.length) {
               setTimeout(produceValue, 2500); 
            } 
            else {
                observer.complete();
            }
        }

        produceValue();
}).map(n => n * 2) 
  .filter(n => n>4);  

source4.subscribe(value => console.log(`value: ${value}`),
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
)


//Ex. 5
let circle = document.getElementById("circle");

let source5 = Observable.fromEvent(document, "mousemove")
                        .map((e : MouseEvent) => {
                            return {
                                x: e.clientX,
                                y: e.clientY
                            }
                        })
                        .filter(value => value.x < 500)
                        .delay(300);
                        

function onNext(value) {
    circle.style.left = value.x;
    circle.style.top = value.y;
}

source5.subscribe(onNext,
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
)

//Ex. 6
let output = document.getElementById("output");
let button = document.getElementById("button")
let click = Observable.fromEvent(button, "click");
 

// function load(url: string) {
  
//     return Observable.create(observer => {
//         let xhr = new XMLHttpRequest();

//         xhr.addEventListener("load", () => {
//             if (xhr.status === 200) {
//                 let data = JSON.parse(xhr.responseText);
//                 observer.next(data);
//                 observer.complete();
//             } else {
//                 observer.error(xhr.statusText);
//             }


//         })

//         xhr.open("GET", url);
//         xhr.send();
//     }).retryWhen(retryStrategy({attempts: 3, delay: 1500}));
// }

// function retryStrategy({attempts = 4, delay = 1000}){
//     return function(errors) {
//         return errors
//                 .scan((acc, value) => {
//                     console.log(acc, value);
//                     return acc+1;
//                 }, 0)
//                 .takeWhile(acc => acc < attempts)
//                 .delay(delay);
//     }
// }

// function loadWithFetch(url: string){
//     return Observable.defer(() => {
//         return Observable.fromPromise(fetch(url).then(r => r.json()));

//     })
// }

function renderMovies(movies){
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerHTML = m.title;
        output.appendChild(div);
    })
}

//load("movies.json").subscribe(renderMovies);

click.flatMap(e => loadWithFetch("moviess.json"))
    .subscribe(renderMovies,
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
)


//Ex. 7;

// let source7 = Observable.create(observer => {
//     observer.next(0);
//     observer.next(2);
//     observer.error("Stop!");
//     observer.next(3);
//     observer.complete();
// })
// let source7 = Observable.merge(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("Stop!")),
//     Observable.of(5)
// )
// let source7 = Observable.onErrorResumeNext(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("Stop!")),
//     Observable.of(5)
// )
let source7 = Observable.merge(
    Observable.of(1),
    Observable.from([2, 3, 4]),
    Observable.throw(new Error("Stop!")),
    Observable.of(5)
).catch(e => {
    console.log(`caught: ${e}`);
    return Observable.of(10);
})

source7.subscribe(
    value => console.log(`value: ${value}`),
    error => console.log(`error: ${error}`),
    () => console.log("complete")
)