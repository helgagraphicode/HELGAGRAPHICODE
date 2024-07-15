import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
  var postId = getQueryParam('id');
  if (postId) {
    var postRef = ref(database, 'posts/' + postId);
    get(postRef).then((snapshot) => {
      if (snapshot.exists()) {
        var post = snapshot.val();
        var postContainer = document.getElementById('post');
        postContainer.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p><em>${post.author}</em></p>
          <p><small>${post.timestamp}</small></p>`;
      } else {
        console.log("No data available");
        var postContainer = document.getElementById('post');
        postContainer.innerHTML = '<p>No post found!</p>';
      }
    }).catch((error) => {
      console.error(error);
    });
  } else {
    var postContainer = document.getElementById('post');
    postContainer.innerHTML = '<p>No post ID provided in URL!</p>';
  }
});

function getQueryParam(param) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
