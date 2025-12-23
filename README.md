# 📰 NewsScope - AI-Powered Fake News Detector

## 🌟 Overview

NewsScope is a cutting-edge web application that leverages advanced AI technology to analyze news articles and detect misinformation. Built with React, TypeScript, and Google's Gemini AI, NewsScope helps users make informed decisions about the content they consume online.

### ✨ Key Features

- **🤖 AI-Powered Analysis**: Utilizes Google Gemini 2.5 Flash for accurate news verification
- **🎯 Real-time Detection**: Instant analysis of news articles and headlines
- **📊 Detailed Reports**: Comprehensive credibility scores and fact-checking insights
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- **🌓 Theme Switching**: Multiple theme options (Sepia, Purple, Green)
- **📱 Mobile Responsive**: Optimized for all device sizes
- **💬 Feedback System**: Integrated SendGrid email for user feedback

---

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **TypeScript 5.6.2** - Type-safe JavaScript
- **Vite 5.4.2** - Lightning-fast build tool
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Router DOM 6.28.0** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Flask 3.0.0** - Python web framework
- **Google Generative AI** - Gemini 2.5 Flash model
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **SendGrid 6.11.0** - Email service
- **Gunicorn 21.2.0** - WSGI HTTP Server

---


## 📁 Project Structure

```
NewsScope/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Index.tsx
│   │   ├── DetectPage.tsx
│   │   └── NotFound.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   ├── lib/             # Utilities
│   │   └── utils.ts
│   └── hooks/           # Custom hooks
├── public/              # Static assets
├── NewsScope.py         # Flask backend
├── requirements.txt     # Python dependencies
├── render.yaml          # Render deployment config
├── vercel.json          # Vercel deployment config
└── package.json         # Node dependencies
```

---


<div align="center">

**Made with ❤️ by Manas Rohilla**

⭐ Star this repo if you find it useful!

</div>
