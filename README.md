# NewsScope - AI-Powered Fake News Detector

NewsScope is an intelligent news verification platform that leverages artificial intelligence to help users identify fake news and misinformation. Built with React, TypeScript, and Flask, NewsScope provides a modern, user-friendly interface for analyzing news articles in real-time.

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (Build Tool)
- Shadcn UI Components
- Tailwind CSS
- React Router DOM
- Radix UI Primitives
- Lucide React (Icons)

### Backend
- Python 3.9+
- Flask
- Google Generative AI (Gemini 2.5 Flash)
- SendGrid (Email Service)
- Flask-CORS
- Python-dotenv

## 🌟 Features in Detail

### AI-Powered News Analysis
- Advanced machine learning algorithms analyze linguistic patterns
- Real-time fact-checking using Google Gemini AI
- Confidence scores with detailed explanations
- Red flags and warning signs identification

### Multi-Source Verification
- Cross-references information across 10+ trusted news outlets
- Checks against AP, Reuters, BBC News, CNN, The Guardian, and more
- Fact-checking organizations: Snopes, FactCheck.org, PolitiFact

### Instant Results
- Get comprehensive analysis in under 3 seconds
- Detailed reports with key claims extraction
- Verification suggestions and evidence sources

### Privacy First
- No data storage - all analysis is performed in real-time
- Content is discarded after processing
- Secure SSL encryption

### Interactive Features
- Real vs Fake news showcase with live examples
- Trust score with detailed breakdown
- Responsive design for all devices
- Multiple color themes (Sepia, Purple, Green)

## 📁 Project Structure

```
NewsScope/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── FeatureCard.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Home page
│   │   ├── DetectPage.tsx # News analysis page
│   │   └── NotFound.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   └── assets/           # Images and static files
├── public/               # Public assets
├── NewsScope.py          # Flask backend
├── requirements.txt      # Python dependencies
├── package.json          # Node.js dependencies
└── README.md
```

Made with ❤️ by Manas Rohilla
