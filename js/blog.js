import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
  var postsContainer = document.getElementById('posts');
  getPosts(postsContainer);
});

function getPosts(container) {
  var postsRef = ref(database, 'posts');
  get(postsRef).then((snapshot) => {
    if (snapshot.exists()) {
      var posts = snapshot.val();
      Object.keys(posts).forEach((postId) => {
        var post = posts[postId];
        // Ambil hanya beberapa baris pertama dari isi post
        var shortContent = post.content.slice(0, 100); // Ambil 100 karakter pertama
        if (post.content.length > 100) {
          shortContent += `... <a href="post.html?id=${postId}">Selengkapnya</a>`; // Tambahkan tautan untuk melihat lebih lanjut
        }
        container.innerHTML += `
          <div class="post">
            <h2><a href="post.html?id=${postId}">${post.title}</a></h2>
            <p>${shortContent}</p>
            <p><em>By ${post.author}</em></p>
            <p><small>${formatDate(post.timestamp)}</small></p>
          </div>`;
      });
    } else {
      console.log("No posts available");
      container.innerHTML = '<p>No posts found!</p>';
    }
  }).catch((error) => {
    console.error("Error getting posts: ", error);
  });
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
