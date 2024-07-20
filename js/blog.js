import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
  var postsContainer = document.getElementById('posts');
  var prevButton = document.getElementById('prevPage');
  var nextButton = document.getElementById('nextPage');

  let currentPage = 1;
  const postsPerPage = 3;

  function renderPosts(page) {
    getPosts(postsContainer, page);
  }

  renderPosts(currentPage);

  prevButton.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      renderPosts(currentPage);
    }
  });

  nextButton.addEventListener('click', function() {
    currentPage++;
    renderPosts(currentPage);
  });

  function getPosts(container, page) {
    var postsRef = ref(database, 'posts');
    get(postsRef).then((snapshot) => {
      if (snapshot.exists()) {
        var posts = snapshot.val();
        var postIds = Object.keys(posts);
        var startIndex = (page - 1) * postsPerPage;
        var endIndex = startIndex + postsPerPage;
        var paginatedPosts = postIds.slice(startIndex, endIndex);

        container.innerHTML = '';
        paginatedPosts.forEach((postId) => {
          var post = posts[postId];
          var shortContent = post.content.slice(0, 100);
          if (post.content.length > 100) {
            shortContent += `... <a href="post.html?id=${postId}">Selengkapnya</a>`;
          }
          container.innerHTML += `
            <div class="post">
              <h2><a href="post.html?id=${postId}">${post.title}</a></h2>
              <p>${shortContent}</p>
              <p><em>By ${post.author}</em></p>
              <p><small>${formatDate(post.timestamp)}</small></p>
            </div>`;
        });

        prevButton.style.display = (page === 1) ? 'none' : 'inline-block';
        nextButton.style.display = (endIndex >= postIds.length) ? 'none' : 'inline-block';
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
});
