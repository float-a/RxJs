import {Observable,Observer} from 'rxjs';
// import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";



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
let source6 = Observable.fromEvent(button, "click");
 

function load(url: string) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
        let movies = JSON.parse(xhr.responseText);
        movies.forEach(m => {
            let div = document.createElement("div");
            div.innerHTML = m.title;
            output.appendChild(div);
        })
    })

    xhr.open("GET",url);
    xhr.send();
}

source6.subscribe(e => load("movies.json"),
                    e =>   console.log(`error: ${e}`),
                    () =>  console.log("completed")
)