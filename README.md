# 🇮🇳 Bharat National Intelligence Platform

An AI-powered Government Decision Intelligence Platform for Agriculture and Petroleum sectors, featuring advanced voice interaction with OpenAI integration.

## 🎯 **Overview**

This platform provides data-driven insights and optimization for:
- **🌾 Agriculture (Bharat Krishi Setu)**: Crop procurement, surplus/deficit analysis, transportation optimization
- **🛢️ Petroleum Analytics**: Production forecasting, refinery analytics, import/export tracking, trade balance

## ✨ **Key Features**

### **🎤 Advanced Voice Agent**
- **OpenAI Integration**: Uses `gpt-4o-transcribe` for high-accuracy speech-to-text
- **11 Indian Languages**: English, Hindi, Telugu, Tamil, Kannada, Marathi, Malayalam, Urdu, Gujarati, Punjabi, Bengali
- **Real-time Transcription**: MediaRecorder API with OpenAI audio transcription
- **Voice Responses**: Text-to-speech in all supported languages
- **Stop Button**: Interrupt speech playback anytime with red stop button
- **Domain-Specific Prompts**: Enhanced accuracy for agriculture and petroleum terminology

### **🌾 Agriculture Module**
- Inter-state crop procurement optimization
- Real-time availability tracking
- Demand and supply forecasting
- Multi-objective optimization (cost, distance, time, carbon emissions)
- Surplus and deficit prediction
- Transport mode comparison (road/rail)

### **🛢️ Petroleum Module**
- Crude oil production forecasting
- Refinery capacity utilization tracking
- Import/export analytics
- Trade balance analysis
- Strategic intelligence briefings

### **📊 Data Visualization**
- Interactive charts and graphs
- Real-time dashboard metrics
- Historical trend analysis
- Comparative analytics

## 🚀 **Quick Start**

### **Prerequisites**
```bash
Node.js >= 14.x
npm >= 6.x
```

### **Installation**

1. Clone the repository:
```bash
git clone https://github.com/Chennakiran2004/OpenAi-hackathon.git
cd OpenAi-hackathon
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Required: OpenAI API Key
REACT_APP_OPENAI_API_KEY=sk-your-api-key-here

# Optional: Custom configurations
REACT_APP_OPENAI_BASE_URL=https://api.openai.com/v1
REACT_APP_OPENAI_MODEL=gpt-4o-mini
REACT_APP_TRANSCRIPTION_MODEL=gpt-4o-transcribe
```

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎙️ **Voice Agent Usage**

### **Getting Started with Voice**

1. **Click the microphone FAB** (bottom-right corner)
2. **Select your language** from the dropdown
3. **Click the mic button** or type your question
4. **Speak clearly** for 5-15 seconds
5. **Stop recording** and wait for transcription
6. **Listen to the response** in your selected language
7. **Click the red stop button** to interrupt if needed

### **Supported Voice Commands**

#### **Agriculture Queries:**
```
"Show me rice availability"
"I need 100 tonnes of wheat in Maharashtra"
"What's the surplus of onions in Karnataka?"
"Optimize transport for tomatoes to Delhi"
```

#### **Petroleum Queries:**
```
"Show crude oil production forecast"
"What's the refinery utilization?"
"Import export data for petroleum"
"Trade balance analysis"
```

### **Language Support**

| Language | Code | Example Greeting |
|----------|------|------------------|
| English | en-IN | "Hello" |
| Hindi | hi-IN | "नमस्ते" |
| Bengali | bn-IN | "নমস্কার" |
| Telugu | te-IN | "నమస్కారం" |
| Tamil | ta-IN | "வணக்கம்" |
| Marathi | mr-IN | "नमस्कार" |
| Gujarati | gu-IN | "નમસ્તે" |
| Urdu | ur-IN | "السلام علیکم" |
| Kannada | kn-IN | "ನಮಸ್ಕಾರ" |
| Malayalam | ml-IN | "നമസ്കാരം" |
| Punjabi | pa-IN | "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" |

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Recharts** - Data visualization
- **React Icons** - Icon library

### **AI & Voice**
- **OpenAI GPT-4o-mini** - Chat completions
- **OpenAI gpt-4o-transcribe** - Audio transcription
- **MediaRecorder API** - Audio capture
- **Web Speech API** - Text-to-speech

### **Styling**
- **CSS Custom Properties** - Theming
- **Responsive Design** - Mobile-friendly
- **Glassmorphism** - Modern UI effects

## 📁 **Project Structure**

```
OpenAi-hackathon/
├── public/
│   └── animations/       # Lottie animations
├── src/
│   ├── api/              # API clients
│   │   ├── openaiClient.ts        # Chat completions
│   │   ├── audioTranscription.ts  # Voice transcription
│   │   └── clientapi/             # Backend integration
│   ├── components/
│   │   ├── VoiceAgent/           # Voice interaction UI
│   │   ├── Dashboard/            # Main dashboard
│   │   ├── AgricultureSector/    # Agriculture module
│   │   ├── PetroleumSector/      # Petroleum module
│   │   └── OptimizeForm/         # Optimization interface
│   ├── config/
│   │   └── voiceAgentSystemPrompt.ts  # AI instructions
│   └── styles/           # Global styles
├── .env                  # Environment variables
└── README.md            # This file
```

## ⚙️ **Configuration**

### **Environment Variables**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_OPENAI_API_KEY` | OpenAI API key | - | ✅ Yes |
| `REACT_APP_OPENAI_MODEL` | Chat model | `gpt-4o-mini` | ❌ No |
| `REACT_APP_TRANSCRIPTION_MODEL` | Audio model | `gpt-4o-transcribe` | ❌ No |
| `REACT_APP_OPENAI_BASE_URL` | API endpoint | `https://api.openai.com/v1` | ❌ No |

### **Voice Agent Settings**

The voice agent behavior is configured in `src/config/voiceAgentSystemPrompt.ts`:
- Response style and tone
- Language handling
- Domain boundaries
- Conversation policies

## 📊 **API Integration**

### **OpenAI APIs Used**

1. **Chat Completions** (`/v1/chat/completions`)
   - Model: `gpt-4o-mini`
   - Purpose: Generate AI responses
   - Endpoint: Chat-based interactions

2. **Audio Transcriptions** (`/v1/audio/transcriptions`)
   - Model: `gpt-4o-transcribe`
   - Purpose: Convert speech to text
   - Format: WebM, WAV, MP3

### **Backend API**

The platform integrates with a backend API for:
- Crop data retrieval
- Surplus/deficit calculations
- Transport optimization
- Petroleum analytics
- Historical data access

## 🎨 **Available Scripts**

### **Development**
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

## 🧪 **Testing**

### **Voice Agent Testing**
1. Test microphone permissions
2. Try all 11 supported languages
3. Test stop button during speech
4. Verify transcription accuracy
5. Check speech synthesis quality

### **Feature Testing**
- Agriculture optimization queries
- Petroleum forecasting
- Data visualization rendering
- Mobile responsiveness
- Cross-browser compatibility

## 🔒 **Security & Privacy**

- ✅ API keys stored in environment variables
- ✅ No sensitive data in frontend code
- ✅ Audio data transmitted via HTTPS
- ✅ No persistent storage of voice recordings
- ✅ Microphone access requires user permission

## 🌐 **Browser Compatibility**

| Browser | Speech Recognition | Speech Synthesis | Audio Recording |
|---------|-------------------|------------------|-----------------|
| Chrome 90+ | ✅ Full | ✅ Full | ✅ Full |
| Edge 90+ | ✅ Full | ✅ Full | ✅ Full |
| Firefox 88+ | ⚠️ Limited | ✅ Full | ✅ Full |
| Safari 14+ | ❌ No | ⚠️ Limited | ✅ Full |

**Note:** The platform uses OpenAI transcription as primary, with browser SpeechRecognition as fallback.

## 📱 **Mobile Support**

- ✅ Responsive design for all screen sizes
- ✅ Touch-optimized controls
- ✅ Mobile browser support
- ⚠️ Voice features may vary by mobile browser

## 🐛 **Troubleshooting**

### **Voice Agent Issues**

**"Missing OpenAI API key"**
- Solution: Set `REACT_APP_OPENAI_API_KEY` in `.env` file

**"Microphone access denied"**
- Solution: Enable microphone permissions in browser settings
- Use HTTPS (required for microphone access)

**"Audio file too large"**
- Solution: Keep recordings under 20 seconds
- Maximum size: 25 MB

**"Transcription failed"**
- Check API key validity
- Verify internet connection
- Check OpenAI service status

**Speech doesn't play in selected language**
- Verify browser supports the language
- Check system language settings
- Try a different browser

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License.

## 👥 **Team**

Developed for the OpenAI Hackathon by Chennakiran2004

## 📞 **Support**

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review OpenAI documentation

## 🎉 **Acknowledgments**

- OpenAI for GPT-4o and transcription models
- Create React App team
- React community
- Government of India data sources

---

**🚀 Built with AI for Government Intelligence** | **🇮🇳 Made in India**
