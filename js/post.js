import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const postId = getQueryParam('id');
  const postContainer = document.getElementById('post');

  if (postId) {
    const postRef = ref(database, `posts/${postId}`);
    fetchPostData(postRef, postContainer);
  } else {
    postContainer.innerHTML = '<p>No post ID provided in URL!</p>';
  }

  initializeSlideshow();
  initializeNavToggle();
});

// Fetch post data and update UI
async function fetchPostData(postRef, container) {
  try {
    const snapshot = await get(postRef);
    if (snapshot.exists()) {
      const post = snapshot.val();
      container.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><em>${post.author}</em></p>
        <p><small>${formatDate(post.timestamp)}</small></p>`;
    } else {
      container.innerHTML = '<p>No post found!</p>';
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    container.innerHTML = '<p>Error fetching post!</p>';
  }
}

// Helper function to get query parameters
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Function to format timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// Initialize and handle navigation toggle
function initializeNavToggle() {
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');

  window.toggleNav = () => {
    const isVisible = navMenu.classList.toggle('show');
    menuIcon.style.display = isVisible ? 'none' : 'block';
  };
}

// Initialize and handle slideshow
function initializeSlideshow() {
  let slideIndex = 0;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  function showSlides() {
    Array.from(slides).forEach((slide, index) => {
      slide.style.display = "none";
      dots[index].classList.remove("active");
    });

    slideIndex = (slideIndex % slides.length + slides.length) % slides.length;
    slides[slideIndex].style.display = "block";
    dots[slideIndex].classList.add("active");

    setTimeout(showSlides, 8000); // Change slide every 8 seconds
  }

  showSlides(); // Start the slideshow

  document.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
  document.querySelector('.next').addEventListener('click', () => plusSlides(1));

  Array.from(dots).forEach((dot, index) => {
    dot.addEventListener('click', () => currentSlide(index + 1));
  });

  function plusSlides(n) {
    slideIndex += n;
    showSlides();
  }

  function currentSlide(n) {
    slideIndex = n - 1;
    showSlides();
  }
}

// Define the toggleNav function in the global scope
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
