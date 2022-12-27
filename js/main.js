//! ===========================================DECLARE GLOBALS=======================================
// set JSON server API
const API = "https://sltnbv-json-server.herokuapp.com/hackathon-dom-js";

let userId = null;
let userName;
let userHandle;
let userPic;
console.log("global userpic", userPic);
//! ===========================================GRAB ELEMENTS=======================================
// grab login elements
let inpUserLogin = document.getElementsByClassName(
  "first-screen__login-user"
)[0];
let inpPassLogin = document.getElementsByClassName(
  "first-screen__login-pass"
)[0];
let btnLogin = document.getElementsByClassName("first-screen__login-btn")[0];
//grab create elements
let inpUserCreate = document.getElementsByClassName(
  "first-screen__create-user"
)[0];
let inpPassCreate = document.getElementsByClassName(
  "first-screen__create-pass"
)[0];
let inpEmailCreate = document.getElementsByClassName(
  "first-screen__create-email"
)[0];
let btnCreate = document.getElementsByClassName("first-screen__create-btn")[0];
let loginModal = document.getElementsByClassName("first-screen")[0];
let welcomeMsg = document.getElementsByClassName("welcome__msg")[0];
let inpName = document.getElementsByClassName("first-screen__create-name")[0];
let inpLastName = document.getElementsByClassName(
  "first-screen__create-lname"
)[0];
let container = document.getElementsByClassName("container")[0];

let editModal = document.getElementsByClassName("posts__modal-edit")[0];
let modalUpdateBtn = document.getElementsByClassName(
  "posts__edit-btn-update"
)[0];
let modalUpdateTitle = document.getElementsByClassName("posts__edit-title")[0];
let modalUpdateBody = document.getElementsByClassName("posts__edit-body")[0];
let modalUpdateImg = document.getElementsByClassName("posts__edit-img")[0];

// grab 'ADD POST' inputs

let postTitle = document.getElementsByClassName("posts__title")[0];
let postBody = document.getElementsByClassName("posts__body")[0];
let postImg = document.getElementsByClassName("posts__img")[0];
let postBtnAdd = document.getElementsByClassName("posts__btn-add")[0];
let postsContent = document.getElementsByClassName("posts__content")[0];

let createMsg = document.getElementsByClassName("first-sreen__create-msg")[0];
// listeners
btnLogin.addEventListener("click", async function () {
  await loginUser();
});
btnCreate.addEventListener("click", async function () {
  await createNewUser();
});

postBtnAdd.addEventListener("click", async function () {
  await createNewPost();
  await renderPosts();
  postTitle.value = "";
  postBody.value = "";
});

// event delegation for delete and edit of posts
postsContent.addEventListener("click", async function (e) {
  if (e.target.classList.contains("posts__post-delete")) {
    console.log(parseInt(e.target.id));

    await deleteData("post", parseInt(e.target.id));
  } else if (e.target.classList.contains("posts__post-edit")) {
    console.log(true);
    // console.log(e.target.id);
    let currPostTitle = document.getElementById("title-" + e.target.id);
    // console.log(currPostTitle);
    let currPostBody = document.getElementById("body-" + e.target.id);
    let currPostImg = document.getElementById("img-" + e.target.id);
    editModal.classList.remove("hide");
    modalUpdateTitle.value = currPostTitle.textContent;
    modalUpdateBody.value = currPostBody.innerText;
    modalUpdateImg.value = currPostImg.innerText;

    // editModal.classList.remove("hide");
    // modalUpdateTitle.value =
    modalUpdateBtn.addEventListener("click", async function () {
      let editedPostObj = {};
      editedPostObj.title = modalUpdateTitle.value;
      editedPostObj.body = modalUpdateBody.value;
      editedPostObj.imgUrl = modalUpdateImg.value;

      console.log(editedPostObj.title);
      await setData("editedPost", editedPostObj, parseInt(e.target.id));
      editModal.classList.add("hide");
    });
  }
});

// create new user
async function createNewUser() {
  users = await getData("users");
  users.forEach((user) => {
    if (inpUserCreate.value === user.username) {
      inpUserCreate.value = "username is taken";
      inpUserCreate.style.borderColor = "red";
      return;
    }
  });

  const newUser = {
    name: inpName.value,
    lastName: inpLastName.value,
    email: inpEmailCreate.value,
    username: inpUserCreate.value,
    password: inpPassCreate.value,
    userPic: "./images/userPic.png",
    posts: [],
    loggedin: false,
  };
  console.log("newest ", newUser);
  await setData("user", newUser);
  createMsg.innerText =
    "You account has been successfuly created. Use your credentials to login";
  createMsg.style.color = "green";
}

async function createNewPost() {
  console.log(postImg);
  const newPostObj = {
    title: postTitle.value,
    body: postBody.value,
    imgUrl: `${
      postImg.value === "" ? "https://picsum.photos/300/300" : postImg.value
    }`,
    postId: Date.now(),
    likes: 0,
    comments: [],
    sharedby: [],
  };
  await setData("post", newPostObj);
}
// delete data
async function deleteData(type, id) {
  if (type === "user" && id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
  } else if (type === "post") {
    let posts = await getData("posts");

    // console.log(type);
    console.log(id);
    posts.forEach((post, index) => {
      if (post.postId === id) {
        posts.splice(index, 1);
      }
    });
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ posts: posts }),
    };
    await fetch(`${API}/${userId}`, options);
    renderPosts();
  }
}

// login existing user
async function loginUser() {
  let users = await getData("users");
  let isUserAuthenticated = false;
  for (let i = 0; i < users.length; i++) {
    if (
      inpUserLogin.value === users[i].username &&
      inpPassLogin.value === users[i].password
    ) {
      userId = users[i].id;
      userName = users[i].name;
      userHandle = users[i].username;
      userPic = users[i].userPic;
      isUserAuthenticated == true;
      console.log("Login successful");
      loginModal.classList.add("hide");
      container.classList.remove("hide");
      welcomeMsg.innerHTML = `<h1>Welcome to the social media, ${users[i].name}</h1>`;
      console.log(users[i]);
      renderPosts();
      break;
    }
  }
  if (!isUserAuthenticated) {
    inpUserLogin.value = "try again";
    inpPassLogin.style.borderColor = "red";
    inpUserLogin.style.borderColor = "red";
    inpPassLogin.value = "";
  }
}

// render posts

async function renderPosts() {
  let posts = await getData("posts");
  postsContent.innerHTML = "";
  posts.forEach((post) => {
    console.log(post.userPic);
    postsContent.innerHTML += `<div class="posts__post-wrapper">
    <img class="userpic" src="${userPic}"><span class="posts__post-name">${userName}</span> <span class="posts__post-username">@${userHandle}</span>
                                 <h3 id="title-${post.postId}">${post.title}</h3> 
                                 <p id="body-${post.postId}">${post.body}</p>  
                                 <img id="img-${post.postId}" src="${post.url}">
                                 <span class="posts__post-likes">${post.likes}</span>
                                 <div class="posts__post-comments"></div>
                                </div>
                                <div class = "post-icons"><div><img class="posts__post-liked" src ="./images/liked.svg"></img><img class="posts__post-likes" src ="./images/like.svg">
                                </img>
                                <img class="posts__post-comments" src ="./images/comments.svg">
                                </img>
                                </div><div><img src="./images/delete.svg" id ="${post.postId}" class="posts__post-delete">
                                </img>
                                <img src = "./images/edit.svg" id ="${post.postId}" class="posts__post-edit">
                                </img></div></div>`;
    // let postDelete = document.getElementsByClassName("posts__post-delete")[0];
    // let postEdit = document.getElementById("edit-" + post.postId);
    // console.log(postEdit);
    // postEdit.addEventListener("click", async function () {
    //   console.log(true);
    // });
  });

  console.log(posts);
}

// get data from JSON server
async function getData(type) {
  if (type === "users") {
    const response = await fetch(API);
    const result = await response.json();
    return result;
  } else if (type === "posts") {
    const response = await fetch(`${API}/${userId}`);
    const result = await response.json();
    return result.posts;
  }
}

// write data to JSON server
async function setData(type, data, id) {
  if (type === "user") {
    console.log("newuser", data);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    await fetch(API, options);
  } else if (type === "post") {
    let posts = await getData("posts");
    posts.push(data);
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ posts: posts }),
    };
    await fetch(`${API}/${userId}`, options);
  } else if (type === "editedPost" && id) {
    let posts = await getData("posts");
    console.log(data);
    posts.forEach((post) => {
      if (post.postId === id) {
        post.title = data.title;
        post.body = data.body;
        post.imgUrl = data.imgUrl;
        return;
      }
    });
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ posts: posts }),
    };
    await fetch(`${API}/${userId}`, options);
    renderPosts();
  }
}

// function to test writing and getting data from JSON server
async function test() {
  let result = await getData();
  console.log(result);
}
// test();

// remove all data from JSON server
async function nukeAll() {
  let users = await getData();
  users.forEach((user) => {
    deleteData(user.id);
  });
}

// nukeAll();

// show registration
const regis = document.getElementsByClassName("regis")[0];
const login = document.getElementsByClassName("login")[1];
const regisForm = document.getElementsByClassName("first-screen__create")[0];
const loginForm = document.getElementsByClassName(
  "first-screen__login-wrapper"
)[0];

regis.addEventListener("click", (e) => {
  regisForm.classList.add("display-flex");
  loginForm.classList.add("display-none");
});

login.addEventListener("click", (e) => {
  loginForm.classList.add("display-block");
  loginForm.classList.remove("display-none");
  regisForm.classList.remove("display-flex");
});

//show profile

const profileIcon = document.getElementsByClassName("profile-icon")[0];
const profileForm = document.getElementsByClassName("profile")[0];

const postForm = document.getElementsByClassName("posts")[0];
const exploreIcon = document.getElementsByClassName("explore-icon")[0];

profileIcon.addEventListener("click", () => {
  profileForm.classList.remove("hide");
  postForm.classList.add("hide");
});

exploreIcon.addEventListener("click", () => {
  profileForm.classList.add("hide");
  postForm.classList.remove("hide");
});
