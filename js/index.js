// Import Firebase Database functions
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from './firebase-config.js';

// Referensi ke posts di database Firebase
var postsRef = ref(database, 'posts');

// Memuat daftar postingan dari Firebase dan menampilkannya di #posts
onValue(postsRef, function(snapshot) {
    var posts = snapshot.val();
    var postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
  
    if (posts) {
        // Menampilkan hanya satu posting pertama
        var firstPostId = Object.keys(posts)[0]; // Ambil ID postingan pertama
        var firstPost = posts[firstPostId]; // Ambil postingan pertama
  
        // Bangun string HTML untuk postingan pertama
        var html = `
          <div class="post">
            <h2><a href="post.html?id=${firstPostId}">${firstPost.title}</a></h2>
            <p>${firstPost.content}</p>
            <p><em>${firstPost.author}</em></p>
            <hr>
          </div>`;
  
        // Tambahkan tautan "View All Posts" ke string HTML
        html += `<p class="view-all-posts"><a href="blog.html">View All Posts</a></p>
`;
  
        // Tetapkan string HTML ke dalam postsContainer
        postsContainer.innerHTML = html;
    } else {
        postsContainer.innerHTML = '<p>No posts available.</p>';
    }
});

// Definisikan fungsi toggleNav dalam global scope
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
  
  // Change slide every 2 seconds
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

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = 'Show';
  question.appendChild(toggleBtn);

  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    
    // Jika jawaban saat ini sudah ditampilkan
    if (answer.classList.contains('show')) {
      // Sembunyikan jawaban
      answer.classList.remove('show');
      toggleBtn.textContent = 'Show'; // Ubah teks tombol
    } else {
      // Sembunyikan semua jawaban terlebih dahulu
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.classList.remove('show');
        ans.previousElementSibling.querySelector('.toggle-btn').textContent = 'Show'; // Reset teks tombol
      });
      
      // Tampilkan jawaban untuk pertanyaan yang diklik
      answer.classList.add('show');
      toggleBtn.textContent = 'Hide'; // Ubah teks tombol
    }
  });
});
