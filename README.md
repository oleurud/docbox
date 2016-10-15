Frontend of the project [postmanDocs](https://github.com/oleurud/postmanDocs)

**Is 99.9% based in [Mapbox](https://github.com/mapbox/docbox)**. I only added a React class to get the content from a HTTP call


### Requirements

* Node v4 or higher
* NPM
* Git

To run the site locally:

1. Clone this repository
	2. `git clone https://github.com/mapbox/docbox.git`
2. `npm install`
3. `npm start`
4. Open http://localhost:9966/

## Tests

Tests cover both the source code of Docbox as well as the content in the `content/` directory.

To run tests:

1. Clone this repository
	2. `git clone https://github.com/mapbox/docbox.git`
2. `npm install`
3. `npm test`


## Deployment

The `npm run build` command builds a `bundle.js` file that contains all the JavaScript code and content needed to show the site, and creates an `index.html` file that already contains the site content. Note that this _replaces_ the existing `index.html` file, so it's best to run this only when deploying the site and to undo changes to `index.html` if you want to keep working on content.

1. Clone this repository
	2. `git clone https://github.com/mapbox/docbox.git`
2. `npm install`
3. `npm run build`

---
