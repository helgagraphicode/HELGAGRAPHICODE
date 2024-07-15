import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from './firebase-config.js';

// Referensi ke posts di database Firebase
var postsRef = ref(database, 'posts');

// Memuat daftar postingan dari Firebase dan menampilkannya di #posts
onValue(postsRef, function(snapshot) {
    var posts = snapshot.val();
    var postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
  
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
    html += `<p><a href="blog.html">View All Posts</a></p>`;
  
    // Tetapkan string HTML ke dalam postsContainer
    postsContainer.innerHTML = html;
  });
  

// Inisialisasi slideIndex
let slideIndex = 0;

// Mendapatkan daftar semua slide
const slides = document.getElementsByClassName("slide");

// Memanggil fungsi showSlides untuk menampilkan slide pertama saat halaman dimuat
showSlides();

// Fungsi untuk menampilkan slide yang sesuai dengan slideIndex
function showSlides() {
  // Sembunyikan semua slide terlebih dahulu
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  // Tampilkan slide yang sesuai dengan slideIndex
  slides[slideIndex].style.display = "block";  
}

// Fungsi untuk menggeser slide ke slide berikutnya atau sebelumnya
function plusSlides(n) {
    // Sembunyikan slide yang sedang ditampilkan
    slides[slideIndex].style.display = "none";
  
    // Hitung index baru slide
    slideIndex += n;
  
    // Periksa batas atas dan bawah dari slideIndex
    if (slideIndex >= slides.length) {
      slideIndex = 0; // Kembali ke slide pertama jika melewati batas atas
    } else if (slideIndex < 0) {
      slideIndex = slides.length - 1; // Tampilkan slide terakhir jika melewati batas bawah
    }
  
    // Tampilkan slide yang sesuai dengan slideIndex yang baru
    slides[slideIndex].style.display = "block";
  }


// Event listener untuk tombol prev dan next
document.querySelector('.prev').addEventListener('click', function() {
  plusSlides(-1);
});

document.querySelector('.next').addEventListener('click', function() {
  plusSlides(1);
});

// Otomatis berganti slide setiap 3 detik
setInterval(function() {
  plusSlides(1);
}, 10000); // Ganti slide setiap 3 detik
