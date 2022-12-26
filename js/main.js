// set JSON server API
const API = "https://sltnbv-json-server.herokuapp.com/hackathon-dom-js";

// get data from JSON server
async function getData() {
  const response = await fetch(API);
  const result = await response.json();

  return result;
}

// write data to JSON server
async function setData(dataObj) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObj),
  };
  await fetch(API, options);
}

// function to test writing and getting data from JSON server
async function test() {
  const testObj = {
    test: "test",
  };
  await setData(testObj);
  let result = await getData();
  console.log(result);
}
test();
