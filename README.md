# Travel Itinerary Chatbot

A travel itinerary chatbot built with React and Express that leverages OpenAI to help users plan trips with accommodation, activity, and transportation recommendations.

## Features

- Chat-based interface for travel planning
- AI-generated personalized travel itineraries
- Multi-city planning capabilities
- Weather information integration
- Budget tracking for trip expenses
- PostgreSQL database for persistent storage

## Project Structure

The project follows a full-stack architecture:

- **Frontend**: React with TypeScript, TailwindCSS, and Shadcn UI components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for chat responses and itinerary generation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone this repository:
```bash
git clone https://github.com/SMX541/travel-itinerary-chatbot.git
cd travel-itinerary-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgres://username:password@localhost:5432/travel_chatbot
OPENAI_API_KEY=your_openai_api_key_here
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5000`
2. Start a new chat and describe your travel plans
3. Ask questions about destinations, budget, activities, etc.
4. Request an itinerary when you're ready

## Project Architecture

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/contexts/`: React contexts for state management
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions and API clients
  - `src/pages/`: Page components for routing

- `server/`: Backend Express server
  - `lib/`: Server utilities and services
  - `routes.ts`: API route definitions
  - `storage.ts`: Database access layer
  - `db.ts`: Database connection

- `shared/`: Shared code between frontend and backend
  - `schema.ts`: Database schema and shared types
<img width="1440" alt="Screenshot 2025-04-04 at 12 42 18" src="https://github.com/user-attachments/assets/1a2fc82d-bbde-4084-a185-cc90744a6270" />
<img width="1440" alt="Screenshot 2025-04-04 at 12 43 31" src="https://github.com/user-attachments/assets/e61f8863-bce5-445d-b399-058a5d7c417e" />
<img width="1440" alt="Screenshot 2025-04-04 at 12 44 27" src="https://github.com/user-attachments/assets/cf7936c7-a112-48cc-9b18-a73d079db4f8" />


## Acknowledgments

- The project uses [OpenAI API](https://platform.openai.com/) for AI-powered conversations
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [React](https://reactjs.org/), [Express](https://expressjs.com/), and [Drizzle ORM](https://orm.drizzle.team/)
