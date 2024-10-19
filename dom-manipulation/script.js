// Array of quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Happiness" }
  ];

  // Function to show a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
  }

  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
      // Add the new quote to the array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      alert("New quote added!");

      // Clear input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert("Please enter both quote text and category.");
    }
  }

  // Event listener to show a new quote when the button is clicked
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  // Event listener to add a new quote when the button is clicked
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Load quotes from local storage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to add a new quote and save to local storage
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save to local storage
    alert("New quote added!");
    
    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Initialize the app and load quotes from local storage
window.onload = function() {
  loadQuotes();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
};
// Export quotes to JSON file
function exportToJsonFile() {
  const jsonString = JSON.stringify(quotes);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('exportJson').addEventListener('click', exportToJsonFile);
// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    
    // Add imported quotes to the existing array and save to local storage
    quotes.push(...importedQuotes);
    saveQuotes(); // Update local storage
    
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to extract unique categories and populate the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Add categories to the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);
  
  displayQuotes(filteredQuotes);
  
  // Save the selected category in local storage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to display filtered quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear current quotes
  
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
    quoteDisplay.appendChild(quoteElement);
  });
}
// Function to load the last selected category and apply the filter
function loadLastSelectedCategory() {
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
    filterQuotes(); // Apply the filter based on the saved category
  }
}

// Initialize the app on page load
window.onload = function() {
  loadQuotes();
  populateCategories();
  loadLastSelectedCategory(); // Load and apply last selected category filter
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
};
// Modify addQuote to update the category dropdown dynamically
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    // Add the new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save to local storage
    
    // Re-populate the categories if a new category was introduced
    populateCategories();
    alert("New quote added!");
    
    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Simulate fetching quotes from a server (using JSONPlaceholder or similar)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Replace with real API if needed
    const serverQuotes = await response.json();
    
    // Simulate transforming server data to fit your quote structure
    const transformedQuotes = serverQuotes.map(quote => ({
      text: quote.title,
      category: 'Server' // Assign a default or random category
    }));

    return transformedQuotes;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
  }
}

// Fetch quotes periodically (every 30 seconds)
setInterval(async () => {
  const serverQuotes = await fetchQuotesFromServer();
  handleServerDataSync(serverQuotes);
}, 30000); // 30 seconds
function handleServerDataSync(serverQuotes) {
  // Fetch local quotes from localStorage
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Find discrepancies and update local quotes with server data (server data takes precedence)
  serverQuotes.forEach(serverQuote => {
    if (!localQuotes.find(quote => quote.text === serverQuote.text)) {
      localQuotes.push(serverQuote); // Add new server quote to local data
    }
  });

  // Save the updated quotes back to localStorage
  localStorage.setItem('quotes', JSON.stringify(localQuotes));

  // Update the displayed quotes in the DOM
  displayQuotes(localQuotes);
}
// Function to notify user about conflicts or updates
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after a few seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}

// Update the sync function to notify the user
function handleServerDataSync(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  let conflictDetected = false;

  serverQuotes.forEach(serverQuote => {
    if (!localQuotes.find(quote => quote.text === serverQuote.text)) {
      localQuotes.push(serverQuote); // Add new quote
      conflictDetected = true;
    }
  });

  if (conflictDetected) {
    notifyUser('New quotes from the server have been added!');
  }

  localStorage.setItem('quotes', JSON.stringify(localQuotes));
  displayQuotes(localQuotes);
}
