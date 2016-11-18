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

