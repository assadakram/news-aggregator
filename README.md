# News Aggregator

A modern news aggregator built with React, TypeScript, and Vite that pulls articles from multiple sources including NewsAPI, The Guardian, and The New York Times.

## Features

- Search articles across multiple news sources
- Filter articles by source
- Responsive design for mobile and desktop
- Real-time search updates
- Clean and modern UI

## Prerequisites

Before running the application, you'll need to obtain API keys from:
- [NewsAPI](https://newsapi.org/)
- [The Guardian](https://open-platform.theguardian.com/)
- [The New York Times](https://developer.nytimes.com/)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_NEWS_API_KEY=your_newsapi_key
VITE_GUARDIAN_API_KEY=your_guardian_key
VITE_NYT_API_KEY=your_nyt_key
```

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Running with Docker

1. Build the Docker image:
```bash
docker build -t news-aggregator .
```

2. Run the container:
```bash
docker run -p 4173:4173 -e VITE_NEWS_API_KEY=your_key -e VITE_GUARDIAN_API_KEY=your_key -e VITE_NYT_API_KEY=your_key news-aggregator
```

The application will be available at http://localhost:4173

## Architecture

The application follows SOLID principles and is organized into the following structure:

- `/src/components`: React components
- `/src/services`: API integration and services
- `/src/store`: State management using Zustand
- `/src/types`: TypeScript interfaces and types

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- Date-fns
- Lucide React