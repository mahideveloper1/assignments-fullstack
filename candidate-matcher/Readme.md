# Candidate Matcher

Advanced Candidate Matching System that uses AI to match candidates with job requirements.

## Project Overview

Candidate Matcher is a web application that helps recruiters and hiring managers find the best candidates for their job openings. The system uses advanced matching algorithms and AI to analyze candidate profiles and job requirements to provide accurate matching scores.

## Features

- AI-powered candidate matching
- Knowledge graph for skills relationships
- Interactive user interface for reviewing matches
- RESTful API for integration with other systems

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **AI Integration**: OpenAI API

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd candidate-matcher
```

### 2. Install dependencies

The project uses a monorepo structure with separate packages for client and server. To install all dependencies:

```bash
npm run install:all
```

This command will install dependencies for the root project, client, and server.

### 3. Environment Configuration

Create a `.env` file in the server directory by copying the example file:

```bash
cp server/.env.example server/.env
```

Then edit the `.env` file to add your OpenAI API key:

```
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

### 4. Build the project

```bash
npm run build
```

This will build both the client and server components.

### 5. Start the application

```bash
npm start
```

This command will start both the client and server concurrently:
- Client: http://localhost:3000
- Server: http://localhost:5000

## Development

### Running in development mode

To run the application in development mode with hot reloading:

```bash
# For the client
npm run start:client

# For the server
cd server
npm run dev
```

### Testing

To run tests for both client and server:

```bash
npm test
```

Or run tests for each package separately:

```bash
npm run test:client
npm run test:server
```

## Project Structure

```
candidate-matcher/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── data/           # Sample data
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express application
│   ├── src/                # Source code
│   │   ├── data/           # Data models and sample data
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Entry point
│   ├── data/               # Persistent data storage
│   └── .env                # Environment variables
└── package.json            # Root package.json for scripts
```

## License

ISC
