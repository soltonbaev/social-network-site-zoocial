//! ============================DECLARE GLOBALS============================
// set JSON server API
const API = 'https://soltonbaev.com/json-server/api/zoocial';

let userId = null;
let userName;
let userlName;
let userHandle;
let userPic;
let currentUser;
let loginState = getLogIn();

//! ===========================GRAB ELEMENTS==============================
// grab login sections
let loginModal = document.getElementsByClassName('first-screen')[0];
const registerForm = document.getElementsByClassName('first-screen__create')[0];
const loginForm = document.getElementsByClassName('first-screen__login')[0];
let createMsg = document.getElementsByClassName('first-screen__motto')[0];

// grab login titles
const registerTitle = document.getElementsByClassName(
   'first-screen__register-title'
)[0];
const loginTitle = document.getElementsByClassName(
   'first-screen__login-title'
)[0];

let inpUserLogin = document.getElementsByClassName(
   'first-screen__login-user'
)[0];
let inpPassLogin = document.getElementsByClassName(
   'first-screen__login-pass'
)[0];
let btnLogin = document.getElementsByClassName('first-screen__login-btn')[0];

//grab create account elements

let inpName = document.getElementsByClassName('first-screen__create-name')[0];
let inpLastName = document.getElementsByClassName(
   'first-screen__create-lname'
)[0];
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

// grab APP container

let container = document.getElementsByClassName('app')[0];

// grab post edit modal elements
let editModal = document.getElementsByClassName('edit-modal')[0];
let modalUpdateBtn = document.getElementsByClassName(
   'posts__edit-btn-update'
)[0];
let modalUpdateTitle = document.getElementsByClassName('edit-modal__title')[0];
let modalUpdateBody = document.getElementsByClassName('edit-modal__body')[0];
let modalUpdateImg = document.getElementsByClassName('edit-modal__img')[0];

// grab 'ADD POST' inputs
let welcomeMsg = document.getElementsByClassName('welcome__msg')[0];
let postTitle = document.getElementsByClassName('add-post__title')[0];
let postBody = document.getElementsByClassName('add-post__body')[0];
let postImg = document.getElementsByClassName('add-post__img')[0];
let postBtnAdd = document.getElementsByClassName('add-post__btn')[0];

// grab MY-POSTS section
const postForm = document.getElementsByClassName('content__my-posts')[0];
let postsContent = document.getElementsByClassName('my-posts__container')[0];
let posts = document.getElementsByClassName('content__my-posts')[0];

//grab timeline section
let timeline = document.getElementsByClassName('timeline-wrapper')[0];
let timelineContainer = document.getElementsByClassName('content__timeline')[0];

// grab SIDEBAR section
let sidebar = document.getElementsByClassName('app__sidebar')[0];
let home = document.getElementsByClassName('sidebar__home')[0];
let sidebarExplore = document.getElementsByClassName('sidebar__explore')[0];
const profileIcon = document.getElementsByClassName('sidebar__profile')[0];

//grab profile section

const profileForm = document.getElementsByClassName('content__profile')[0];

// get profile elements
let profileTopName = document.getElementsByClassName('profile__name')[0];
let tweetCount = document.getElementsByClassName('profile-quantity')[0];
let profileBottomHandle = document.getElementsByClassName('profile__handle')[0];
let profileBottomName = document.getElementsByClassName('profile__name')[0];
let joined = document.getElementsByClassName('profile__date-joined-txt')[0];
let profileAvatar = document.getElementsByClassName('profile__avatar')[0];
let logOut = document.getElementsByClassName('profile__logout')[0];

// grab CONTENT section
let appContent = document.getElementsByClassName('app__content')[0];

// grab TRENDING section
let trending = document.getElementsByClassName('app__trending')[0];

// grab SEARCH elems
let mobileSearch = document.getElementsByClassName('app__mobile-search')[0];
let searchUsernameNode = document.getElementsByClassName(
   'search__results-by-username'
)[0];
let searchInpNode = document.getElementsByClassName('search__input')[0];

mobileSearch.addEventListener('click', () => {
   appContent.style.display = 'none';
   trending.style.display = 'block';
});
let hamburger = document.getElementsByClassName('app__hamburger')[0];

//!=================LAUNCH EVENT-LISTENERS========================

// reveal register form upon cliking the register title
registerTitle.addEventListener('click', e => {
   registerForm.classList.remove('hide');
   registerTitle.style.color = '#1d9bf0';
   loginTitle.style.color = 'white';
   loginForm.classList.add('hide');
});

//reveal login form upon clicking the login title
loginTitle.addEventListener('click', e => {
   loginForm.classList.remove('hide');
   loginTitle.style.color = '#1d9bf0';
   registerTitle.style.color = 'white';
   registerForm.classList.add('hide');
});

// reveal sidebar upon cliking hamburger icon
hamburger.addEventListener('click', () => {
   sidebar.style.display = 'block';
});

// show HOME MY-POSTS section on clicking the HOME item
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

// show PROFILE section on clicking PROFILE icon

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

// logout current user upon clicking LOGOUT
logOut.addEventListener('click', () => {
   setLogIn(false);
   location.reload();
});

// show EXPLORE section upon clicking EXPLORE item
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

// login user when clicking LOGIN button
btnLogin.addEventListener('click', async function () {
   await loginUser();
});

// create new user when clicking LOGIN button
btnCreate.addEventListener('click', async function () {
   await createNewUser();
});

// create new post when clicking TWEET button
postBtnAdd.addEventListener('click', async function () {
   await createNewPost('post');
   await renderPosts();
});

//event delegation for the whole APP

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
      await deleteData('post', parseInt(e.target.id));
   } else if (e.target.classList.contains('posts__post-edit')) {
      let currPostTitle = document.getElementById('title-' + e.target.id);
      let currPostBody = document.getElementById('body-' + e.target.id);
      let currPostImg = document.getElementById('img-' + e.target.id);
      editModal.classList.remove('hide');
      modalUpdateTitle.value = currPostTitle.textContent;
      modalUpdateBody.value = currPostBody.innerText;
      modalUpdateImg.value = currPostImg.innerText;
      modalUpdateBtn.addEventListener('click', async function () {
         let editedPostObj = {};
         editedPostObj.title = modalUpdateTitle.value;
         editedPostObj.body = modalUpdateBody.value;
         editedPostObj.imgUrl = modalUpdateImg.value;
         await setData('editedPost', editedPostObj, parseInt(e.target.id));
         editModal.classList.add('hide');
      });
   }
});

// get current date

function getDate() {
   let date = new Date();
   let buildDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`;
   return buildDate;
}

//count posts

async function countPosts() {
   let countPosts = await getData('posts', userId);
   let postCount = countPosts.length;
   return postCount;
}

// create new user
async function createNewUser() {
   let users = await getData('users');
   if (
      inpName.value === '' ||
      inpUserCreate.value === '' ||
      inpPassCreate.value === ''
   ) {
      createMsg.innerText = 'Please, fill out the required fields';
      createMsg.style.color = 'red';
      return;
   }
   for (let user in users) {
      console.log(user.username);
      if (inpUserCreate.value === users[user].username) {
         createMsg.innerText = 'username is taken';
         createMsg.style.color = 'red';
         inpUserCreate.value = '';
         return;
      }
   }

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
      followed: [],
      dateJoined: getDate(),
   };
   clearCreateInputs();
   await setData('user', newUser);
   createMsg.innerText =
      'You account has been successfuly created. Use your credentials to login';
   createMsg.style.color = 'green';
}

function clearCreateInputs() {
   inpName.value = '';
   inpLastName.value = '';
   inpEmailCreate.value = '';
   inpUserCreate.value = '';
   inpPassCreate.value = '';
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
   profileAvatar.innerHTML = `<img src="${userObj.userPic}">`;
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

async function getTimelinePosts() {
   let users = await getData('users');
   postsContent.innerHTML = '';
   timeline.innerHTML = '';
   users.forEach(user => {
      postRenderer(timeline, user, user.posts);
   });

   currentUser.renderPosts = false;
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
      element.innerHTML += `<div id="${post.postId}" name = "${
         user.id
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
      // showLikeTooltip(post.postId);
      console.log(post.likes);
   });
}

function renderUserProfile() {}

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

searchInpNode.addEventListener('input', async function () {
   await renderSearchByUsername();
});

async function renderSearchByUsername() {
   let searchResult = await getData('searchUsers');
   searchUsernameNode.innerHTML = '';
   if (searchInpNode.value !== '') {
      searchResult.forEach(user => {
         searchUsernameNode.innerHTML += `<li>${user.username}</li>`;
      });
   } else {
      searchUsernameNode.innerHTML = '';
   }
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
   } else if (type === 'searchUsers') {
      const response = await fetch(
         `${API}?username_like=${searchInpNode.value}`
      );
      const result = await response.json();
      return result;
   }
}

// write data to JSON server
async function setData(type, data, id) {
   if (type === 'user') {
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

// nukeAll();

// show registration

async function renderLikes(post) {
   let tooltipNode = document
      .getElementById(post.postId)
      .getElementsByClassName('posts__post-likes-tooltip')[0];
   for (likeObj in post.likes) {
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

// ! ======================= DEV SECTION ==============================
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
