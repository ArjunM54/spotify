# Spotify Songs' Genre Segmentation

An interactive website that explores Spotify songs by genre, subgenre, playlist, popularity and audio features. Built with HTML5, CSS3 and vanilla JavaScript. Chart.js (charts) and Papa Parse (CSV) load from a CDN.

## Features
Live dataset statistics, song explorer (search, filters, sorting, pagination), song detail dialog with radar chart, genre and subgenre analysis, subgenre bubble map and genre radar, playlist explorer, analytics histograms and scatter plots, correlation heatmap, discover music, top 10 songs and artists.

## Dataset
`data/spotify_dataset.csv`: 23 columns (track, album, playlist, genre, subgenre, audio features). One row per track-playlist entry, so some tracks repeat.

## How to run
The CSV is loaded with a request, so use a local server (opening index.html directly will not load it):
1. Open the folder in VS Code and install the Live Server extension.
2. Right-click `index.html` and choose Open with Live Server.
Or run `python -m http.server` in this folder and visit http://localhost:8000. If loading fails, the page offers a file picker for the CSV.

## How the CSV is processed
CSV, then Papa Parse (typed rows), then aggregation in `js/data.js` and the page scripts, then cards, tables and Chart.js charts. Scatter plots use an even sample of rows; everything else uses all rows. Tables render one page at a time.

## Structure
`index.html`, `css/style.css`, `js/` (data, charts, genres, songs, analytics, app), `data/`.

## Screenshots
Add screenshots here.

## Future enhancements
Separate pages per section, k-means clustering, shareable filter URLs.
