//! ===========================================DECLARE GLOBALS=======================================
// set JSON server API
const API = 'https://sltnbv-json-server.herokuapp.com/hackathon-dom-js';

let userId = null;
let userName;
let userlName;
let userHandle;
let userPic;
let currentUser;
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
   'first-screen__login-user'
)[0];
let inpPassLogin = document.getElementsByClassName(
   'first-screen__login-pass'
)[0];
let btnLogin = document.getElementsByClassName('first-screen__login-btn')[0];
//grab create elements
let inpUserCreate = document.getElementsByClassName(
   'first-screen__create-user'
)[0];
let inpPassCreate = document.getElementsByClassName(
   'first-screen__create-pass'
)[0];
let inpEmailCreate = document.getElementsByClassName(
   'first-screen__create-email'
)[0];
let btnCreate = document.getElementsByClassName('first-screen__create-btn')[0];
let loginModal = document.getElementsByClassName('first-screen')[0];
let welcomeMsg = document.getElementsByClassName('welcome__msg')[0];
let inpName = document.getElementsByClassName('first-screen__create-name')[0];
let inpLastName = document.getElementsByClassName(
   'first-screen__create-lname'
)[0];
let container = document.getElementsByClassName('app')[0];

let editModal = document.getElementsByClassName('edit-modal')[0];
let modalUpdateBtn = document.getElementsByClassName(
   'posts__edit-btn-update'
)[0];
let modalUpdateTitle = document.getElementsByClassName('edit-modal__title')[0];
let modalUpdateBody = document.getElementsByClassName('edit-modal__body')[0];
let modalUpdateImg = document.getElementsByClassName('edit-modal__img')[0];

// grab 'ADD POST' inputs

let postTitle = document.getElementsByClassName('add-post__title')[0];
let postBody = document.getElementsByClassName('add-post__body')[0];
let postImg = document.getElementsByClassName('add-post__img')[0];
let postBtnAdd = document.getElementsByClassName('add-post__btn')[0];
let postsContent = document.getElementsByClassName('my-posts__container')[0];

let createMsg = document.getElementsByClassName('first-screen__motto')[0];

let sidebar = document.getElementsByClassName('app__sidebar')[0];
let sidebarExplore = document.getElementsByClassName('sidebar__explore')[0];

let home = document.getElementsByClassName('sidebar__home')[0];
let joined = document.getElementsByClassName('profile__date-joined-txt')[0];

//show profile

const profileIcon = document.getElementsByClassName('sidebar__profile')[0];
const profileForm = document.getElementsByClassName('content__profile')[0];

const postForm = document.getElementsByClassName('content__my-posts')[0];
// const exploreIcon = document.getElementsByClassName("explore-icon")[0];

// get profile elements
let profileTopName = document.getElementsByClassName('profile__name')[0];
let tweetCount = document.getElementsByClassName('profile-quantity')[0];
let profileBottomHandle = document.getElementsByClassName('profile__handle')[0];
let profileBottomName = document.getElementsByClassName('profile__name')[0];

let mobileSearch = document.getElementsByClassName('app__mobile-search')[0];
let appContent = document.getElementsByClassName('app__content')[0];

let trending = document.getElementsByClassName('app__trending')[0];

mobileSearch.addEventListener('click', () => {
   appContent.style.display = 'none';
   trending.style.display = 'block';
});

let hamburger = document.getElementsByClassName('app__hamburger')[0];
hamburger.addEventListener('click', () => {
   sidebar.style.display = 'block';
});

async function countPosts() {
   let countPosts = await getData('posts', userId);
   let postCount = countPosts.length;
   return postCount;
}

home.addEventListener('click', () => {
   profileForm.classList.add('hide');
   postForm.classList.remove('hide');
   timelineContainer.classList.add('hide');
   renderPosts();
   let isMobile = window.matchMedia('(max-width: 500px)');
   if (isMobile.matches) {
      sidebar.style.display = 'none';
      trending.style.display = 'none';
      appContent.style.display = 'block';
   }
});

profileIcon.addEventListener('click', () => {
   profileForm.classList.remove('hide');
   postForm.classList.add('hide');
   timelineContainer.classList.add('hide');
   let isMobile = window.matchMedia('(max-width: 500px)');
   if (isMobile.matches) {
      sidebar.style.display = 'none';
      trending.style.display = 'none';
      appContent.style.display = 'block';
   }
});

let timeline = document.getElementsByClassName('timeline-wrapper')[0];
console.log(timeline);

let timelineContainer = document.getElementsByClassName('content__timeline')[0];
let logOut = document.getElementsByClassName('profile__logout')[0];

logOut.addEventListener('click', () => {
   setLogIn(false);
   location.reload();
});

let posts = document.getElementsByClassName('content__my-posts')[0];

sidebarExplore.addEventListener('click', () => {
   profileForm.classList.add('hide');
   posts.classList.add('hide');
   timelineContainer.classList.remove('hide');
   getTimelinePosts();
   let isMobile = window.matchMedia('(max-width: 500px)');
   if (isMobile.matches) {
      sidebar.style.display = 'none';
      trending.style.display = 'none';
      appContent.style.display = 'block';
   }
});

// listeners
btnLogin.addEventListener('click', async function () {
   await loginUser();
});
btnCreate.addEventListener('click', async function () {
   await createNewUser();
});

postBtnAdd.addEventListener('click', async function () {
   await createNewPost('post');
   await renderPosts();
});

//event delegation for timeline

container.addEventListener('click', async function (e) {
   if (e.target.classList.contains('posts__post-likes-heart')) {
      let heartCount = document.getElementById(`heart-count-${e.target.id}`);
      e.stopPropagation();
      console.log(heartCount.innerText);
      let newHeartCount = parseInt(heartCount.innerText) + 1;
      let likeStatus = true;
      await setLike(likeStatus, parseInt(e.target.id), parseInt(e.target.name));
   } else if (e.target.classList.contains('posts__post-comments')) {
      let postNode = e.target.closest('.posts__post-wrapper');
      console.log(postNode);
      let commentSectionNode =
         postNode.getElementsByClassName('comment-section')[0];
      commentSectionNode.classList.remove('hide');
      let commentWrapper = document.createElement('div');
      let comment = document.createElement('textarea');
      comment.classList.add('post__comment-input');
      comment.setAttribute('placeholder', 'add comment here');
      let addCommentBtn = document.createElement('button');
      addCommentBtn.classList.add('post__comment-btn-add');
      commentSectionNode.append(commentWrapper);
      commentWrapper.append(comment);
      commentWrapper.append(addCommentBtn);
      addCommentBtn.innerText = '+';
      addCommentBtn.addEventListener('click', () => {
         let commentObj = {
            author: userName,
            authorId: userId,
            commentBody: comment.value,
            timeCreated: getDate(),
         };
         postComments(commentObj, e.target.name, postNode.id);
         commentWrapper.remove();
      });
   } else if (e.target.classList.contains('toggle-comments')) {
      let commentSection = document.getElementsByName(`${e.target.id}`)[0];

      commentSection.classList.toggle('hide');
   }
});

// event delegation for delete and edit of posts
postsContent.addEventListener('click', async function (e) {
   if (e.target.classList.contains('posts__post-delete')) {
      console.log(parseInt(e.target.id));

      await deleteData('post', parseInt(e.target.id));
   } else if (e.target.classList.contains('posts__post-edit')) {
      console.log(true);
      // console.log(e.target.id);
      let currPostTitle = document.getElementById('title-' + e.target.id);
      // console.log(currPostTitle);
      let currPostBody = document.getElementById('body-' + e.target.id);
      let currPostImg = document.getElementById('img-' + e.target.id);
      editModal.classList.remove('hide');
      modalUpdateTitle.value = currPostTitle.textContent;
      modalUpdateBody.value = currPostBody.innerText;
      modalUpdateImg.value = currPostImg.innerText;

      // editModal.classList.remove("hide");
      // modalUpdateTitle.value =
      modalUpdateBtn.addEventListener('click', async function () {
         let editedPostObj = {};
         editedPostObj.title = modalUpdateTitle.value;
         editedPostObj.body = modalUpdateBody.value;
         editedPostObj.imgUrl = modalUpdateImg.value;

         console.log(editedPostObj.title);
         await setData('editedPost', editedPostObj, parseInt(e.target.id));
         editModal.classList.add('hide');
      });
   }
});

// create new user
async function createNewUser() {
   users = await getData('users');
   users.forEach(user => {
      if (inpUserCreate.value === user.username) {
         inpUserCreate.value = 'username is taken';
         inpUserCreate.style.borderColor = 'red';
         return;
      }
   });
   createMsg.innerText = 'Creating your account...';
   createMsg.style.color = 'orange';
   const newUser = {
      name: inpName.value,
      lastName: inpLastName.value,
      email: inpEmailCreate.value,
      username: inpUserCreate.value,
      password: inpPassCreate.value,
      userPic: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
      posts: [],
      dateJoined: getDate(),
   };

   await setData('user', newUser);
   createMsg.innerText =
      'You account has been successfuly created. Use your credentials to login';
   createMsg.style.color = 'green';
}

async function createNewPost(type, sharedPostId) {
   let postImage = postImg.value;
   if (postImg.value === '') {
      try {
         postImage = 'https://api.lorem.space/image?w=150&h=180';
      } catch (error) {
         console.log(error);
      }
   }
   const newPostObj = {
      title: postTitle.value,
      body: postBody.value,
      imgUrl: postImage,
      postId: Date.now(),
      postDate: getDate(),
      likes: [],
      comments: [],
      sharedby: [],
      type: type,
      sharedPostId: '',
   };
   if (sharedPostId) {
      newPostObj.sharedPostId = sharedPostId;
   }
   await setData('post', newPostObj);
}
// delete data
async function deleteData(type, id) {
   if (type === 'user' && id) {
      await fetch(`${API}/${id}`, {method: 'DELETE'});
   } else if (type === 'post') {
      let posts = await getData('posts');

      // console.log(type);
      console.log(id);
      posts.forEach((post, index) => {
         if (post.postId === id) {
            posts.splice(index, 1);
         }
      });
      const options = {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({posts: posts}),
      };
      await fetch(`${API}/${userId}`, options);
      await renderPosts();
   }
}

function setLogIn(state, id) {
   if (state === true) {
      localStorage.setItem('login', JSON.stringify({state: true, userId: id}));
   } else {
      localStorage.setItem('login', 'false');
   }
}

function getLogIn() {
   let state = JSON.parse(localStorage.getItem('login'));
   return state;
}

// login existing user
async function loginUser() {
   let users = await getData('users');
   let isUserAuthenticated = false;
   for (let i = 0; i < users.length; i++) {
      if (
         inpUserLogin.value === users[i].username &&
         inpPassLogin.value === users[i].password
      ) {
         console.log(createMsg);
         createMsg.innerText = 'User found. Logging in...';
         createMsg.style.color = 'green';
         isUserAuthenticated = true;
         setUserGlobals(users[i]);
         await setProfileData(users[i]);
         setLogIn(true, users[i].id);
         await renderPosts();
         break;
      }
   }
   if (isUserAuthenticated) {
      loginModal.classList.add('hide');
      container.classList.remove('hide');
   } else {
      inpUserLogin.value = 'try again';
      inpPassLogin.style.borderColor = 'red';
      inpUserLogin.style.borderColor = 'red';
      inpPassLogin.value = '';
      setLogIn(false);
   }
}

async function checkLogin() {
   if (loginState && loginState.state === true) {
      loginModal.classList.add('hide');
      container.classList.remove('hide');
      let users = await getData('users');
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
   welcomeMsg.innerHTML = `<h1>Welcome to the Zoocial Network, <span style="color: #1d9bf0">${userObj.name}</span></h1>`;
   currentUser = {...userObj};
   userId = userObj.id;
   userName = userObj.name;
   userlName = userObj.lastName;
   userHandle = userObj.username;
   userPic = userObj.userPic;
}

async function setProfileData(userObj) {
   tweetCount.innerText = `Tweets: ${await countPosts()}`;
   profileTopName.innerText = userName;
   profileBottomHandle.innerText = '@' + userHandle;
   profileBottomName.innerText = `${userName} ${userlName}`;
   console.log(userObj.dateJoined);
   joined.innerText = 'Date joined ' + userObj.dateJoined;
}

checkLogin();

async function getUserName(id) {
   let users = await getData('users');
   let result = users.find(user => {
      if (id === user.id) {
         return user;
      }
   });
   return result.name;
}

// render posts

async function setLike(status, id, uId) {
   let posts = await getData('userPosts', uId);
   console.log(posts);
   const likeObj = {
      userLikeId: userId,
      likeStatus: status,
   };
   posts.forEach(post => {
      if (post.postId === id) {
         let likeExists;
         post.likes.forEach((likeObj, index) => {
            if (likeObj.userLikeId == userId) {
               likeExists = true;
               post.likes.splice(index, 1);
            }
         });
         if (!likeExists) {
            post.likes.push(likeObj);
         }
      }
      return;
   });

   const options = {
      method: 'PATCH',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({posts: posts}),
   };
   await fetch(`${API}/${uId}`, options);
   if (currentUser.renderPosts === true) {
      await renderPosts();
   } else {
      await getTimelinePosts();
   }
}

async function getLike() {}

async function getTimelinePosts() {
   console.log('rendering timeline');
   let users = await getData('users');
   postsContent.innerHTML = '';
   timeline.innerHTML = '';
   users.forEach(user => {
      postRenderer(timeline, user, user.posts);
   });

   currentUser.renderPosts = false;
   console.log(currentUser.renderPosts);
   // event handler for post wrapper
   // console.log(postIcons);
}

async function renderPosts() {
   let posts = await getData('posts');
   timeline.innerHTML = '';
   postsContent.innerHTML = '';
   currentUser.renderPosts = true;
   postRenderer(postsContent, currentUser, posts, 'currUserPosts');
}

function postRenderer(element, user, posts, type) {
   posts.forEach(post => {
      console.log(post.likes);
      element.innerHTML += `<div id="${
         post.postId
      }" class="posts__post-wrapper">
      <div class="post__header> 
         <img class="userpic" src="${user.userPic}">
         <span class="posts__post-name">${user.name}</span>
         <span class="posts__post-username">@${user.username}</span>
         <span class="posts__post-date">&nbsp${post.postDate}</span>
      </div>
      <div class="post__body">
         <h3 id="title-${post.postId}">${post.title}</h3> 
         <p id="body-${post.postId}">${post.body}</p>  
         <img id="img-${post.postId}" src="${post.imgUrl}">
      </div>
      <div class="post__footer">
      <div class="posts__post-comments">
      </div>
 <div id ="pi-${post.postId}" class = "post-icons">
 <div>
<img name="${user.id}" id="${
         post.postId
      }" class="posts__post-likes-heart" src="${
         post.likes.length == 0 ? './images/like.svg' : './images/liked.svg'
      }">
</img>

<span id="heart-count-${post.postId}" class="posts__post-likes">${
         post.likes.length
      }</span>
<img name="${user.id}" id="${
         post.postId
      }"  class="posts__post-comments" src ="./images/comments.svg">
 </img>
<span id="cs-${post.postId}" class="toggle-comments ">&nbspComments&nbsp${
         post.comments.length
      }</span>
                                </div>
                                <div class="edit-delete-btns ${
                                   type && type === 'currUserPosts'
                                      ? ''
                                      : 'hide'
                                }">
<img src="./images/delete.svg" id ="${post.postId}" class="posts__post-delete">
</img>
<img src = "./images/edit.svg" id ="${post.postId}" class="posts__post-edit">
</img>
</div>
</div>
</div>
<ul class="posts__post-likes-tooltip hide">Liked by: </ul>
<ul name="cs-${post.postId}" class="comment-section hide"><ul/>
</div>`;
      renderComments(post);
      renderLikes(post);
      showLikeTooltip(post.postId);
      console.log(post.likes);
   });
}

function showLikeTooltip(postId) {}

function renderComments(post) {
   let postSection = document.getElementsByName(`cs-${post.postId}`)[0];
   post.comments.forEach(comment => {
      postSection.innerHTML += `<li><span>${comment.author}</span><span>${comment.timeCreated}</span><p>${comment.commentBody}</p></li>`;
   });
}

async function postComments(data, uId, postId) {
   let posts = await getData('userPosts', uId);
   console.log('postComments', postId);
   console.log('postComments', posts);
   posts.forEach(post => {
      if (postId == post.postId) {
         post.comments.push(data);
         console.log(post.postId);
      }
   });
   const options = {
      method: 'PATCH',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({posts: posts}),
   };
   await fetch(`${API}/${uId}`, options);
   if (currentUser.renderPosts === true) {
      await renderPosts();
   } else {
      await getTimelinePosts();
   }
   // console.log(posts);
}

// get data from JSON server
async function getData(type, id) {
   if (type === 'users') {
      const response = await fetch(API);
      const result = await response.json();
      return result;
   } else if (type === 'posts') {
      const response = await fetch(`${API}/${userId}`);
      const result = await response.json();
      return result.posts;
   } else if (type === 'userPosts' && id) {
      const response = await fetch(`${API}/${id}`);
      const result = await response.json();
      return result.posts;
   }
}

// write data to JSON server
async function setData(type, data, id) {
   if (type === 'user') {
      console.log('newuser', data);
      const options = {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      };
      await fetch(API, options);
      return;
   } else if (type === 'post') {
      let posts = await getData('posts');
      posts.push(data);
      const options = {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({posts: posts}),
      };
      await fetch(`${API}/${userId}`, options);
   } else if (type === 'editedPost' && id) {
      let posts = await getData('posts');
      console.log(data);
      posts.forEach(post => {
         if (post.postId === id) {
            post.title = data.title;
            post.body = data.body;
            post.imgUrl = data.imgUrl;
            return;
         }
      });
      const options = {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({posts: posts}),
      };
      await fetch(`${API}/${userId}`, options);
   }
   if (currentUser.renderPosts === true) {
      await renderPosts();
   } else {
      await getTimelinePosts();
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
   let users = await getData('users');
   users.forEach(user => {
      deleteData('user', user.id);
   });
}

// nukeAll();

// show registration
const registerTitle = document.getElementsByClassName(
   'first-screen__register-title'
)[0];
const loginTitle = document.getElementsByClassName(
   'first-screen__login-title'
)[0];
const registerForm = document.getElementsByClassName('first-screen__create')[0];
const loginForm = document.getElementsByClassName('first-screen__login')[0];

registerTitle.addEventListener('click', e => {
   registerForm.classList.remove('hide');
   registerTitle.style.color = '#1d9bf0';
   loginTitle.style.color = 'white';
   loginForm.classList.add('hide');
});

loginTitle.addEventListener('click', e => {
   loginForm.classList.remove('hide');
   loginTitle.style.color = '#1d9bf0';
   registerTitle.style.color = 'white';
   registerForm.classList.add('hide');
});

// console.log(exploreIcon);
// exploreIcon.addEventListener("click", () => {
//   console.log(profileForm);
//   console.log(1);
//   profileForm.classList.add("hide");
//   postForm.classList.remove("hide");
// });

async function renderLikes(post) {
   let tooltipNode = document
      .getElementById(post.postId)
      .getElementsByClassName('posts__post-likes-tooltip')[0];
   // console.log(`tooltip`, tooltipNode);
   for (likeObj in post.likes) {
      // console.log('likeObj', post.likes[likeObj]);
      // console.log(await getUserName(likeObj.userLikeId));
      tooltipNode.innerHTML += `<li>${await getUserName(
         post.likes[likeObj].userLikeId
      )}</li>`;
   }
   let heart = document
      .getElementById(post.postId)
      .getElementsByClassName('posts__post-likes-heart')[0];
   heart.addEventListener('mouseover', () => {
      if (post.likes.length > 0) {
         tooltipNode.classList.remove('hide');
      }
   });
   heart.addEventListener('mouseout', () => {
      tooltipNode.classList.add('hide');
   });
}
