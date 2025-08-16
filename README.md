# Quotoday Chrome Extension

> Get inspiring quotes with one click - simple and distraction-free motivation boost.

Quotoday is a lightweight Chrome extension that delivers inspiring, motivational, and thought-provoking quotes directly in your browser. When you click the extension icon, a beautiful popup appears with a random quote, complete with stunning gradient backgrounds and easy sharing options.

## 🎯 Features

### Core Functionality
- **One-click access** to inspiring quotes
- **Random quote display** from ZenQuotes API
- **2-minute cooldown system** to respect API limits
- **Offline support** with local fallback quotes
- **State persistence** across popup sessions

### Visual Design
- **Beautiful gradient backgrounds** (30+ unique gradients)
- **Glass-morphism quote container** with backdrop blur
- **Pacifico font** for elegant branding
- **Compact 280x360px** popup window
- **Responsive design** with scroll support

### User Actions
- **Copy Quote** - Copy quote to clipboard
- **Social Sharing** - Share to X (Twitter), Facebook, LinkedIn, WhatsApp
- **Next Quote** - Get new quote (respects cooldown)
- **Automatic state saving** - Remembers last quote and background

## 🏗️ Architecture

### Tech Stack
- **Manifest V3** Chrome Extension
- **Vanilla JavaScript** (ES6+)
- **CSS3** with modern features (backdrop-filter, gradients)
- **HTML5** semantic structure
- **Chrome Storage API** for persistence
- **ZenQuotes API** for fresh content

### File Structure
```
quote-chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Styling and animations
├── popup.js              # Quote logic and functionality
├── quotes.json           # Local fallback quotes (50+ quotes)
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Documentation
```

## 🎨 Design System

### Color Palette
- **30 Gradient Backgrounds** - Carefully curated for visual appeal
- **Glass-morphism UI** - Semi-transparent overlays with backdrop blur
- **White Text** - High contrast with shadow for readability
- **Platform Brand Colors** - Twitter blue, Facebook blue, etc.

### Typography
- **Headers**: Pacifico (Google Fonts) - Elegant script font
- **Body**: System fonts - -apple-system, BlinkMacSystemFont, Segoe UI
- **Responsive sizing** - Optimized for 280px width

### Layout
- **Absolute positioning** for precise control
- **Flexbox** for responsive button layouts
- **z-index layers** for proper stacking
- **Scroll support** for longer quotes

## ⚙️ Functionality

### Quote Management
```javascript
class QuotodayApp {
  // State management
  - currentQuote: Object
  - currentBackground: String
  - lastApiCall: Number
  - quotes: Array (local fallback)
  
  // Core methods
  - fetchNewQuote(): Fetch from ZenQuotes API
  - displayRandomLocalQuote(): Show local quote
  - loadBackgroundGradient(): Apply random gradient
  - saveState(): Persist to Chrome storage
}
```

### API Integration
- **ZenQuotes API**: `https://zenquotes.io/api/random`
- **Rate limiting**: 2-minute cooldown between API calls
- **Error handling**: Graceful fallback to local quotes
- **Response parsing**: Extracts `q` (quote) and `a` (author)

### State Persistence
- **Chrome Storage Local**: Saves quote, background, and timestamp
- **Session continuity**: Same quote/background until cooldown expires
- **Cross-session memory**: Remembers state when popup reopens

### Sharing Integration
- **X (Twitter)**: Intent URL with hashtags (#Quotoday, #Inspiration)
- **Facebook**: Sharer with quote parameter
- **LinkedIn**: Professional sharing with summary
- **WhatsApp**: Direct message with quote text

## 🚀 Installation & Development

### For Users
1. Download the extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the folder
5. Click the Quotoday icon in your toolbar

### For Developers
```bash
# Clone or download the project
cd quote-chrome-extension

# No build process required - pure HTML/CSS/JS
# Simply load as unpacked extension in Chrome

# For icon generation (if needed)
python3 -c "from PIL import Image; ..."  # See development notes
```

### Dependencies
- **No build tools** required
- **No npm packages** - vanilla implementation
- **Chrome APIs**: storage, tabs (for sharing)
- **External APIs**: ZenQuotes (with fallback)

## 📝 Development Notes

### Chrome Extension Permissions
```json
{
  "permissions": ["storage", "tabs"],
  "host_permissions": ["https://zenquotes.io/*"]
}
```

### Key Implementation Details
1. **Manifest V3 Compliance** - Uses modern Chrome extension APIs
2. **No Content Security Policy issues** - All resources are local
3. **CORS Handling** - Proper host permissions for API calls
4. **Memory Management** - Efficient state storage and cleanup
5. **Error Resilience** - Multiple fallback strategies

### Performance Optimizations
- **Lazy loading** - Gradients and quotes load on demand
- **Minimal bundle size** - 104KB total (including icons)
- **Fast startup** - Instant background application
- **Cached state** - Reduces unnecessary API calls

## 🎯 Future Enhancements

### Planned Features
- **Daily notifications** with quotes
- **Quote categories** (motivation, humor, life)
- **Dark/Light theme toggle**
- **Favorite quotes collection**
- **Quote history tracking**
- **Custom quote collections**

### Technical Improvements
- **Service Worker** for background processing
- **Sync across devices** with Chrome Sync
- **Offline-first architecture**
- **Progressive Web App** features
- **Accessibility improvements**

## 📊 Project Stats

- **File Size**: 104KB total
- **Quote Database**: 50 local + unlimited from API
- **Gradient Collection**: 30 unique backgrounds
- **Load Time**: <100ms average
- **Browser Support**: Chrome 88+ (Manifest V3)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Chrome extension
5. Submit a pull request

### Development Guidelines
- Maintain Manifest V3 compliance
- Follow existing code style
- Test across different screen sizes
- Ensure graceful error handling
- Update documentation for new features

## 📄 License

MIT License - Feel free to use and modify as needed.

## 🏷️ Credits

- **Built by**: KJR Labs
- **Quotes API**: ZenQuotes.io
- **Icons**: Custom SVG designs
- **Fonts**: Google Fonts (Pacifico)
- **Inspiration**: Daily motivation for productivity

---

*Quotoday - Your daily dose of inspiration, one click away.* ✨