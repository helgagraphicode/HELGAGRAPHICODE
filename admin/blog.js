import { getDatabase, ref, get, push, set, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { database } from '../js/firebase-config.js';

// Initialize SunEditor
const editor = SUNEDITOR.create('suneditor-container', {
    buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['removeFormat'],
        ['fontColor', 'hiliteColor'],
        ['indent', 'outdent'],
        ['align', 'horizontalRule', 'list', 'table'],
        ['link', 'image'],
        ['fullScreen', 'showBlocks', 'codeView'],
    ]
});

document.addEventListener('DOMContentLoaded', function() {
    const postSelector = document.getElementById('post-selector');
    const formContainer = document.getElementById('form-container');
    const submitButton = document.getElementById('submit-button');

    // Load post options on page load
    loadPostOptions();

    postSelector.addEventListener('change', function() {
        const postId = this.value;
        if (postId) {
            loadPost(postId);
            submitButton.textContent = 'Save Changes'; // Set text for editing existing post
        } else {
            // Reset form for creating a new post
            document.getElementById('title').value = '';
            editor.setContents('');
            document.getElementById('author').value = '';
            submitButton.textContent = 'Post'; // Set text for creating new post
        }
    });

    document.getElementById('post-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = editor.getContents();
        const author = document.getElementById('author').value;
        const timestamp = new Date().toISOString();
        const postId = postSelector.value;

        if (title.trim() === '' || content.trim() === '' || author.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        if (postId) {
            // Update existing post
            update(ref(database, 'posts/' + postId), {
                title: title,
                content: content,
                author: author,
                timestamp: timestamp
            }).then(() => {
                console.log("Post updated successfully");
                window.location.href = 'blog.html'; // Redirect after update
            }).catch((error) => {
                console.error("Error updating post: ", error);
            });
        } else {
            // Add new post
            const postsRef = ref(database, 'posts');
            const newPostRef = push(postsRef);
            const newPostId = newPostRef.key;

            set(ref(database, 'posts/' + newPostId), {
                title: title,
                content: content,
                author: author,
                timestamp: timestamp
            }).then(() => {
                console.log("Post added successfully");
                document.getElementById('title').value = '';
                editor.setContents('');
                document.getElementById('author').value = '';
                loadPostOptions(); // Reload post options
            }).catch((error) => {
                console.error("Error adding post: ", error);
            });
        }
    });

    function loadPostOptions() {
        const postsRef = ref(database, 'posts');
        get(postsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const posts = snapshot.val();
                postSelector.innerHTML = '<option value="">Create New Post</option>'; // Reset options
                Object.keys(posts).forEach((postId) => {
                    const post = posts[postId];
                    const option = document.createElement('option');
                    option.value = postId;
                    option.textContent = post.title;
                    postSelector.appendChild(option);
                });
            } else {
                console.log("No posts available");
            }
        }).catch((error) => {
            console.error("Error getting posts: ", error);
        });
    }

    function loadPost(postId) {
        const postRef = ref(database, 'posts/' + postId);
        get(postRef).then((snapshot) => {
            if (snapshot.exists()) {
                const post = snapshot.val();
                document.getElementById('title').value = post.title;
                editor.setContents(post.content);
                document.getElementById('author').value = post.author;
            } else {
                console.log("Post not found");
                alert('Post not found');
            }
        }).catch((error) => {
            console.error("Error getting post: ", error);
        });
    }
});
