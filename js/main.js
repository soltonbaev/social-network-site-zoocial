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

// grab login elements
let inpUserLogin = document.getElementsByClassName("social__login-user")[0];
let inpPassLogin = document.getElementsByClassName("social__login-pass")[0];
let btnLogin = document.getElementsByClassName("social__login-btn")[0];
//grab create elements
let inpUserCreate = document.getElementsByClassName("social__create-user")[0];
let inpPassCreate = document.getElementsByClassName("social__create-user")[0];
let inpEmailCreate = document.getElementsByClassName("social__create-email")[0];
let btnCreate = document.getElementsByClassName("social__create-pass")[0];

btnLogin.addEventListener("click", () => {});
btnCreate.addEventListener("click", () => {});

// create new user
function createNewUser() {
  const newUser = {
    username: inpUserCreate.value,
    email: inpEmailCreate,
    password: inpPassCreate,
    posts: [],
  };
}
