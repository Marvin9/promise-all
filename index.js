const axios = require("axios").default;
const EventEmitter = require("events");

export const customPromiseAll = (promisesArray) => {
  const promiseEventEmitter = new EventEmitter();
  return new Promise((resolve, reject) => {
    const total = promisesArray.length;
    let fulfiled = 0;
    let fulfiledResponses = new Array(total);

    promisesArray.forEach((promise, idx) => {
      if (promise.then) {
        promise
          .then((response) => {
            fulfiled++;
            fulfiledResponses[idx] = response;
            promiseEventEmitter.emit("fulfil");
          })
          .catch((e) => reject(e));
      } else {
        fulfiled++;
        fulfiledResponses[idx] = promise;
      }
    });

    promiseEventEmitter.on("fulfil", () => {
      if (fulfiled === total) resolve(fulfiledResponses);
    });
  });
};

const dummyAsyncEvent = () => {
  console.log("called");
  return axios.get("https://jsonplaceholder.typicode.com/todos");
};

const main = () => {
  // const promiseArray = [dummyAsyncEvent(), dummyAsyncEvent()];
  const p1 = Promise.resolve(3);
  const p2 = 1337;
  const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("foo");
    }, 100);
  });
  customPromiseAll([p1, p2, p3])
    .then((data) => console.log(data))
    .catch((e) => console.error(e));
};

main();
