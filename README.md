# PMP Drill Coach

A modern, interactive practice application for PMP (Project Management Professional) exam preparation with gamification features.

## Features

- ✅ **1,324 Preloaded PMP Questions** - Start practicing immediately
- 🎯 **20-Question Practice Sessions** - Randomly selected from the question bank
- ⏱️ **25-Minute Timer** - Simulates real exam conditions
- ❤️ **Lives System** - 3 lives per session, lose one for wrong answers
- 🔥 **Streak Tracking** - Build streaks for bonus XP
- 📊 **Progress Tracking** - View your performance over time
- 🎨 **Beautiful Glassmorphism UI** - Modern, sleek design
- 📤 **Custom Question Upload** - Upload your own questions in Excel or CSV format

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

4. Click "Start Practice" to begin with preloaded questions!

## Question Format

The app supports two formats:

### Format 1: Preloaded Questions (Current)
- Questions are preloaded from `src/data/questions.json`
- 1,324 valid PMP questions ready to use

### Format 2: Custom Upload
Upload Excel (.xlsx) or CSV files with these columns:
- `#` - Question number (optional)
- `Question` - The question text
- `Options` - All answer options (A-D) separated by line breaks
- `Answer` - Correct answer letter (A, B, C, or D)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **XLSX** for Excel file parsing
- **Recharts** for data visualization

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── data/            # Preloaded questions JSON
├── pages/           # Main application pages
├── styles/          # CSS and styling
└── utils/           # Helper functions
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
