// Import Firebase modules and configuration
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
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

// Add event listener to submit button of post form
document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Retrieve form values
    var title = document.getElementById('title').value;
    var content = editor.getContents(); // Get content from SunEditor
    var author = document.getElementById('author').value;
    var timestamp = new Date().toISOString();

    // Validate input fields
    if (title.trim() === '' || content.trim() === '' || author.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Reference to 'posts' in Firebase database
    var postsRef = ref(database, 'posts');
    // Generate a new post reference with push()
    var newPostRef = push(postsRef);
    var postId = newPostRef.key;

    // Save data to Firebase
    set(ref(database, 'posts/' + postId), {
        title: title,
        content: content,
        author: author,
        timestamp: timestamp
    }).then(() => {
        console.log("Post added successfully");
        // Clear form fields after successful submission
        document.getElementById('title').value = '';
        editor.setContents(''); // Reset SunEditor content
        document.getElementById('author').value = '';
    }).catch((error) => {
        console.error("Error adding post: ", error);
    });
});
