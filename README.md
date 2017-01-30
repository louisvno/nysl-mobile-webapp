# nysl-mobile-webapp
Single page mobile website that behaves like a native app when added to homescreen

Uses Mustache to render the views in accordance with the app state. 
AJAX requests are used to retrieve the data and the view templates themselves.
By using AJAX the page content can change without reloading the page making it a single page app. 

The app also uses History.state object to manipulate the browser history to create the different page URLs.
Firebase was used as a backend and a URL rewrite redirects all requests to index.html (as it is the only static html resource).
