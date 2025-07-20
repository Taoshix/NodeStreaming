# Streaming Site Made Using Node.js

## Overview
This project is a local streaming site built with Node.js. It allows you to stream video content stored in a structured folder format.

## Features
- Stream video content locally.
- Automatically detect and display shows and episodes.
- Supports cover images in various formats.

## Prerequisites
1. Install [Node.js](https://nodejs.org/) (version 16 or higher recommended).
2. Install [npm](https://www.npmjs.com/) (comes bundled with Node.js).

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Taoshix/NodeStreaming.git
   ```
2. Navigate to the project directory:
   ```bash
   cd NodeStreaming
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Server
1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Content Folder Structure
The `content` folder is where all the shows and episodes are stored. Each show should be placed in its own subfolder within the `content` directory. The structure should follow this format:

```
content/{show name}/{episode number}.mp4
content/{show name}/cover.{webp|jpg|jpeg|png|gif}
```

### Example:
```
content/Example Season 1/1.mp4
content/Example Season 1/2.mp4
content/Example Season 1/cover.webp
```

## Instructions to Set Up Content
1. Create a folder named `content` in the root directory of the project.
2. Inside the `content` folder, create subfolders for each show. The name of the subfolder will be the name of the show.
3. Add episode files in `.mp4` format to the respective show folder. Name the files numerically (e.g., `1.mp4`, `2.mp4`, etc.).
4. Add a cover image for the show in the same folder. The cover image can be in any of the following formats: `.webp`, `.jpg`, `.jpeg`, `.png`, or `.gif`.

## Notes
- Ensure the `content` folder is properly set up before starting the server.
- The server will automatically detect and serve the content based on the folder structure.
