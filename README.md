# Operating Systems Quiz Application

A comprehensive educational application for studying Operating Systems concepts with AI-powered quiz evaluation.

## Features

- **Q&A Study Guide**: 150+ questions covering Process Scheduling, Process Synchronization, Deadlocks, and Main Memory
- **AI-Powered Quiz**: Intelligent answer evaluation using Groq's LLM
- **Randomized Questions**: Different quiz experience each time
- **Progress Tracking**: Detailed performance analytics by chapter and difficulty
- **Fallback System**: Keyword matching when AI evaluation is unavailable

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq API Key for AI-powered quiz evaluation
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

**To get a Groq API key:**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Create a new API key
4. Copy the key to your `.env.local` file

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Q&A Study Guide
- Browse questions by chapter, category, and difficulty
- Click to expand answers for detailed explanations
- Use filters to focus on specific topics

### Quiz Mode
- Select chapter(s) and number of questions
- Answer questions in your own words
- Get AI-powered evaluation of your understanding
- Review detailed results and performance breakdown

## Security Notes

- **Never commit API keys to version control**
- The `.env.local` file is automatically ignored by git
- If no API key is provided, the quiz falls back to keyword matching
- Regenerate your API key if it's ever exposed

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui
- **AI Integration**: Groq SDK
- **UI Components**: Radix UI primitives

## Project Structure

```
├── app/                    # Next.js App Router
├── components/            # Reusable UI components
├── process-scheduling-qa.tsx  # Main Q&A component with all questions
├── quiz-page.tsx         # Quiz functionality
└── .env.local            # Environment variables (create this)
```

## Content Coverage

- **Chapter 5**: Process Scheduling (42 questions)
- **Chapter 6**: Process Synchronization (40+ questions)
- **Chapter 7**: Deadlocks (40+ questions)
- **Chapter 8**: Main Memory (40+ questions)

Each chapter includes questions at Basic, Intermediate, and Advanced difficulty levels.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. 