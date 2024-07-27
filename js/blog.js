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
          var shortContent = post.content.slice(0, 200); // Display 200 characters
          var isTruncated = post.content.length > 200;

          container.innerHTML += `
            <div class="post">
              <h2><a href="post.html?id=${postId}">${post.title}</a></h2>
              <p class="post-content">
                ${shortContent}${isTruncated ? `... <a href="post.html?id=${postId}" class="read-more">Selengkapnya</a>` : ''}
              </p>
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

// Define the function to toggle navigation in the global scope
window.toggleNav = function() {
  var navMenu = document.getElementById('nav-menu');
  var menuIcon = document.getElementById('menu-icon');
  if (navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
    menuIcon.style.display = 'block';
  } else {
    navMenu.classList.add('show');
    menuIcon.style.display = 'none';
  }
}

// JavaScript code for slides and auto slide functionality
let slideIndex = 0;
const slides = document.getElementsByClassName("mySlides"); // Use the correct class name
const dots = document.getElementsByClassName("dot");
showSlides();

// Show slides with fade effect
function showSlides() {
  // Hide all slides and reset dot colors
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  // Increment slide index and wrap around if necessary
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  
  // Show the current slide
  slides[slideIndex - 1].style.display = "block";  
  dots[slideIndex - 1].className += " active";
  
  // Change slide every 8 seconds
  setTimeout(showSlides, 8000);
}

// Add event listeners for prev and next buttons
document.querySelector('.prev').addEventListener('click', function() {
  plusSlides(-1);
});

document.querySelector('.next').addEventListener('click', function() {
  plusSlides(1);
});

// Function to change slides manually
function plusSlides(n) {
  slideIndex += n;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  } else if (slideIndex < 1) {
    slideIndex = slides.length;
  }
  showSlides();
}

// Add event listeners to dots
for (let i = 0; i < dots.length; i++) {
  dots[i].addEventListener('click', function() {
    currentSlide(i + 1);
  });
}

// Function to show a specific slide
function currentSlide(n) {
  slideIndex = n;
  showSlides();
}
