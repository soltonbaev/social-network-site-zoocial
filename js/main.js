//! ===========================================DECLARE GLOBALS=======================================
// set JSON server API
const API = "https://sltnbv-json-server.herokuapp.com/hackathon-dom-js";

let userId = null;
let userName;
let userlName;
let userHandle;
let userPic;
let userObject;
let loginState = getLogIn();
console.log(loginState);
function getDate() {
  let date = new Date();
  let buildDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`;
  return buildDate;
}

// console.log(getDate());

// the hour in UTC+0 time zone (London time without daylight savings)

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

let sidebarExplore = document.getElementsByClassName("explore")[0];

let home = document.getElementsByClassName("home")[0];
let joined = document.getElementsByClassName("profile__joined")[0];

//show profile

const profileIcon = document.getElementsByClassName("profile-icon")[0];
const profileForm = document.getElementsByClassName("profile")[0];

const postForm = document.getElementsByClassName("posts")[0];
// const exploreIcon = document.getElementsByClassName("explore-icon")[0];

// get profile elements
let profileTopName = document.getElementsByClassName("profile-handle")[0];
let tweetCount = document.getElementsByClassName("profile-quantity")[0];
let profileBottomHandle = document.getElementsByClassName("profile__handle")[0];
let profileBottomName = document.getElementsByClassName("profile__name")[0];

async function countPosts() {
  let countPosts = await getData("posts", userId);
  let postCount = countPosts.length;
  return postCount;
}

home.addEventListener("click", () => {
  profileForm.classList.add("hide");
  postForm.classList.remove("hide");
  timelineContainer.classList.add("hide");
  renderPosts();
});

profileIcon.addEventListener("click", () => {
  profileForm.classList.remove("hide");
  postForm.classList.add("hide");
  timelineContainer.classList.add("hide");
});

let timeline = document.getElementsByClassName("timeline-wrapper")[0];
console.log(timeline);

let timelineContainer = document.getElementsByClassName("timeline")[0];
let logOut = document.getElementsByClassName("profile__logout")[0];

logOut.addEventListener("click", () => {
  setLogIn(false);
  location.reload();
});

let posts = document.getElementsByClassName("posts")[0];

sidebarExplore.addEventListener("click", () => {
  profileForm.classList.add("hide");
  posts.classList.add("hide");
  timelineContainer.classList.remove("hide");
  getTimelinePosts();
});

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
});

//event deletagion for timeline

timeline.addEventListener("click", async function (e) {
  if (e.target.classList.contains("posts__post-likes-heart")) {
    let heartCount = document.getElementById(`heart-count-${e.target.id}`);
    console.log(heartCount.innerText);
    let newHeartCount = parseInt(heartCount.innerText) + 1;
    await setGlobalLikes(
      newHeartCount,
      parseInt(e.target.id),
      parseInt(e.target.name)
    );
  }
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
    userPic: "https://xsgames.co/randomusers/avatar.php?g=pixel",
    posts: [],
    dateJoined: getDate(),
  };

  console.log("newest ", newUser);
  await setData("user", newUser);
  createMsg.innerText =
    "You account has been successfuly created. Use your credentials to login";
  createMsg.style.color = "green";
}

async function createNewPost() {
  console.log(postImg);
  let postImage = postImg.value;
  if (postImg.value === "") {
    postImage = "https://picsum.photos/300/300";
  }
  const newPostObj = {
    title: postTitle.value,
    body: postBody.value,
    imgUrl: postImage,
    postId: Date.now(),
    postDate: getDate(),
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
    await renderPosts();
  }
}

function setLogIn(state, id) {
  if (state === true) {
    localStorage.setItem("login", JSON.stringify({ state: true, userId: id }));
  } else {
    localStorage.setItem("login", "false");
  }
}

function getLogIn() {
  let state = JSON.parse(localStorage.getItem("login"));
  return state;
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
      isUserAuthenticated = true;
      setUserGlobals(users[i]);
      await setProfileData(users[i]);
      setLogIn(true, users[i].id);
      await renderPosts();
      break;
    }
  }
  if (isUserAuthenticated) {
    loginModal.classList.add("hide");
    container.classList.remove("hide");
  } else {
    inpUserLogin.value = "try again";
    inpPassLogin.style.borderColor = "red";
    inpUserLogin.style.borderColor = "red";
    inpPassLogin.value = "";
    setLogIn(false);
  }
}

async function checkLogin() {
  if (loginState && loginState.state === true) {
    loginModal.classList.add("hide");
    container.classList.remove("hide");
    let users = await getData("users");
    for (let i = 0; i < users.length; i++) {
      if (loginState.userId === users[i].id) {
        setUserGlobals(users[i]);
        await setProfileData(users[i]);
        await renderPosts();
        break;
      }
    }
  }
}

function setUserGlobals(userObj) {
  welcomeMsg.innerHTML = `<h1>Welcome to the social media, ${userObj.name}</h1>`;
  userObject = userObj;
  userId = userObj.id;
  userName = userObj.name;
  userlName = userObj.lastName;
  userHandle = userObj.username;
  userPic = userObj.userPic;
}

async function setProfileData(userObj) {
  tweetCount.innerText = `Tweets: ${await countPosts()}`;
  profileTopName.innerText = userName;
  profileBottomHandle.innerText = userHandle;
  profileBottomName.innerText = `${userName} ${userlName}`;
  console.log(userObj.dateJoined);
  joined.innerText = "Date joined " + userObj.dateJoined;
}

checkLogin();

// render posts

async function setGlobalLikes(data, id, uId) {
  let posts = await getData("userPosts", uId);
  console.log(posts);
  posts.forEach((post) => {
    if (post.postId === id) {
      post.likes = data;
    }
    return;
  });

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ posts: posts }),
  };
  await fetch(`${API}/${uId}`, options);
  getTimelinePosts();
}

async function getTimelinePosts() {
  console.log("rendering timeline");
  let users = await getData("users");
  timeline.innerHTML = "";
  users.forEach((user) => {
    postRenderer(timeline, user, user.posts);
  });
  let postIcons = document.getElementsByClassName("post-icons")[0];
  // event handler for post wrapper
  console.log(postIcons);
  postIcons.addEventListener("click", (e) => {
    console.log("click");
    if (e.target.classList.contains("posts__post-comments")) {
      console.log(true);
      let commentWrapper = document.createElement("div");
      let comment = document.createElement("input");
      let addCommentBtn = document.createElement("button");
      postIcons.append(commentWrapper);
      commentWrapper.append(comment);
      commentWrapper.append(addCommentBtn);
      addCommentBtn.innerText = "Add comment";
      let commentObj = {
        author: userName,
        authorId: userId,
        commentBody: comment.value,
        timeCreated: getDate(),
      };
      addCommentBtn.addEventListener("click", () => {
        postComments(commentObj, e.target.name, e.target.id);
      });
    }
  });
}

async function renderPosts() {
  let posts = await getData("posts");
  postsContent.innerHTML = "";
  postRenderer(postsContent, userObject, posts, "currUserPosts");
}

function postRenderer(element, user, posts, type) {
  posts.forEach((post) => {
    element.innerHTML += `<div class="posts__post-wrapper">
    <img class="userpic" src="${user.userPic}">
    <span class="posts__post-name">${
      user.name
    }</span> <span class="posts__post-username">@${
      user.username
    }</span><span class="posts__post-date">&nbsp${post.postDate}</span>
                                 <h3 id="title-${post.postId}">${
      post.title
    }</h3> 
                                 <p id="body-${post.postId}">${post.body}</p>  
                                 <img id="img-${post.postId}" src="${
      post.imgUrl
    }">
                                 
                                 <div class="posts__post-comments">
                                 </div>
                                </div>
                                <div class = "post-icons">
                                <div><img name="${user.id}" id="${
      post.postId
    }" class="posts__post-likes-heart" src="${
      post.likes == 0 ? "./images/like.svg" : "./images/liked.svg"
    }">
                                </img><span id="heart-count-${
                                  post.postId
                                }" class="posts__post-likes">${
      post.likes
    }</span>
                                <img name="${user.id}" id="${
      post.postId
    }"  class="posts__post-comments" src ="./images/comments.svg">
                                </img>
                                </div><div class="edit-delete-btns ${
                                  type && type === "currUserPosts" ? "" : "hide"
                                }"><img src="./images/delete.svg" id ="${
      post.postId
    }" class="posts__post-delete">
                                </img>
                                <img src = "./images/edit.svg" id ="${
                                  post.postId
                                }" class="posts__post-edit">
                                </img>
                               </div></div>`;
  });
}

async function postComments(data, uId, postId) {
  let posts = await getData("userPosts", userId);

  posts.forEach((post) => {
    if (postId === post.id) {
      post.comments.push(data);
    }
  });
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ posts: posts }),
  };
  await fetch(`${API}/${uId}`, options);
  getTimelinePosts();
  console.log(posts);
}

// get data from JSON server
async function getData(type, id) {
  if (type === "users") {
    const response = await fetch(API);
    const result = await response.json();
    return result;
  } else if (type === "posts") {
    const response = await fetch(`${API}/${userId}`);
    const result = await response.json();
    return result.posts;
  } else if (type === "userPosts" && id) {
    const response = await fetch(`${API}/${id}`);
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
    await renderPosts();
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
  let users = await getData("users");
  users.forEach((user) => {
    deleteData("user", user.id);
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

// console.log(exploreIcon);
// exploreIcon.addEventListener("click", () => {
//   console.log(profileForm);
//   console.log(1);
//   profileForm.classList.add("hide");
//   postForm.classList.remove("hide");
// });
