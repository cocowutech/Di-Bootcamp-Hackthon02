// Importing the marked library for Markdown conversion if needed
import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

// Define the articleSearch function that will be called on button click
async function articleSearch(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the value from the input box
    const userInput = document.getElementById('searchInput').value;

    // Encode the user input to ensure special characters are properly handled
    const encodedInput = encodeURIComponent(userInput);

    // Create the URL with the query parameter
    const urlWithQueryParam = `http://localhost:3000/search?keyword=${encodedInput}`;

    try {
        // Make an asynchronous fetch request using the URL with the query parameter
        const response = await fetch(urlWithQueryParam);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        // Assuming the response is JSON with properties 'title' and 'content'
        const { title, content } = await response.json();

        // Update the DOM with the title and content
        document.getElementById('articleTitle').textContent = title;
        document.getElementById('articleContent').innerHTML = marked(content);
    } catch (error) {
        console.error('Error:', error);
        // Update the DOM to show the error
        document.getElementById('articleTitle').textContent = 'Error fetching article';
        document.getElementById('articleContent').textContent = '';
    }
}

// Attach the articleSearch function to the form's submit event
document.getElementById('searchForm').addEventListener('submit', articleSearch);
