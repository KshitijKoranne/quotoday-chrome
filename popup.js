class QuotodayApp {
    constructor() {
        this.quotes = [];
        this.currentQuote = null;
        this.currentBackground = null;
        this.lastApiCall = 0;
        this.apiCooldown = 2 * 60 * 1000; // 2 minutes in milliseconds
        this.init();
    }

    async init() {
        await this.loadLocalQuotes();
        this.setupEventListeners();
        // Set initial background immediately
        this.loadBackgroundGradient();
        await this.loadStoredState();
        await this.initializeQuote();
    }

    async loadStoredState() {
        try {
            const result = await chrome.storage.local.get(['lastApiCall', 'currentQuote', 'currentBackground']);
            if (result.lastApiCall) {
                this.lastApiCall = result.lastApiCall;
            }
            if (result.currentQuote) {
                this.currentQuote = result.currentQuote;
            }
            if (result.currentBackground) {
                this.currentBackground = result.currentBackground;
            }
        } catch (error) {
            // Silently handle storage errors in production
        }
    }

    async saveState() {
        try {
            await chrome.storage.local.set({
                lastApiCall: this.lastApiCall,
                currentQuote: this.currentQuote,
                currentBackground: this.currentBackground
            });
        } catch (error) {
            // Silently handle storage errors in production
        }
    }

    async initializeQuote() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastApiCall;
        
        // If we have a current quote and it's still within cooldown, just display it
        if (this.currentQuote && timeSinceLastCall < this.apiCooldown) {
            // Restore the same background
            if (this.currentBackground) {
                document.body.style.setProperty('background', this.currentBackground, 'important');
            }
            this.displayQuote();
            this.startCooldownTimer();
        } else {
            // Time to fetch a new quote
            await this.fetchNewQuote();
        }
    }

    async loadLocalQuotes() {
        try {
            const response = await fetch(chrome.runtime.getURL('quotes.json'));
            const data = await response.json();
            this.quotes = data.quotes;
        } catch (error) {
            // Fallback to hardcoded quote if local quotes fail
            this.quotes = [
                {
                    text: "The only way to do great work is to love what you do.",
                    author: "Steve Jobs"
                }
            ];
        }
    }

    async fetchNewQuote() {
        try {
            const quote = await this.makeApiCall();
            
            this.currentQuote = {
                text: quote.content,
                author: quote.author
            };
            
            this.lastApiCall = Date.now();
            this.loadBackgroundGradient();
            this.displayQuote();
            this.startCooldownTimer();
            await this.saveState();
        } catch (error) {
            // Gracefully fallback to local quotes on API failure
            await this.displayRandomLocalQuote();
        }
    }

    loadBackgroundGradient() {
        const body = document.body;
        
        // Expanded gradient palette - 30 beautiful gradients
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // Original purple-blue
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',  // Pink-coral
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',  // Blue-cyan
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',  // Green-mint
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',  // Pink-yellow
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',  // Mint-pink
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',  // Soft pink
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',  // Warm peach
            'linear-gradient(135deg, #ff8a80 0%, #ffab91 100%)',  // Coral
            'linear-gradient(135deg, #81c784 0%, #aed581 100%)',  // Nature green
            'linear-gradient(135deg, #90caf9 0%, #a5d6a7 100%)',  // Sky blue-green
            'linear-gradient(135deg, #ce93d8 0%, #f8bbd9 100%)',  // Purple-pink
            'linear-gradient(135deg, #ffb74d 0%, #ff8a65 100%)',  // Orange-coral
            'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',  // Blue tones
            'linear-gradient(135deg, #aed581 0%, #689f38 100%)',  // Green shades
            'linear-gradient(135deg, #e1bee7 0%, #ba68c8 100%)',  // Lavender-purple
            'linear-gradient(135deg, #80deea 0%, #26c6da 100%)',  // Cyan-teal
            'linear-gradient(135deg, #ffcc02 0%, #ff6f00 100%)',  // Golden-orange
            'linear-gradient(135deg, #f8bbd9 0%, #e91e63 100%)',  // Light pink-magenta
            'linear-gradient(135deg, #c5e1a5 0%, #7cb342 100%)',  // Light green-forest
            'linear-gradient(135deg, #ffab91 0%, #d84315 100%)',  // Peach-red
            'linear-gradient(135deg, #b39ddb 0%, #673ab7 100%)',  // Light purple-deep
            'linear-gradient(135deg, #81d4fa 0%, #0277bd 100%)',  // Light blue-ocean
            'linear-gradient(135deg, #dcedc8 0%, #558b2f 100%)',  // Pale green-olive
            'linear-gradient(135deg, #f48fb1 0%, #c2185b 100%)',  // Rose-crimson
            'linear-gradient(135deg, #ffe082 0%, #f57f17 100%)',  // Light yellow-amber
            'linear-gradient(135deg, #bcaaa4 0%, #5d4037 100%)',  // Beige-brown
            'linear-gradient(135deg, #90a4ae 0%, #263238 100%)',  // Gray-charcoal
            'linear-gradient(135deg, #ff8a65 0%, #bf360c 100%)',  // Orange-red
            'linear-gradient(135deg, #9fa8da 0%, #3f51b5 100%)'   // Indigo shades
        ];
        
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        body.style.setProperty('background', randomGradient, 'important');
        this.currentBackground = randomGradient;
    }

    async makeApiCall() {
        // Using ZenQuotes API which is more reliable for extensions
        const response = await fetch('https://zenquotes.io/api/random', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'omit'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate API response
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid API response format');
        }
        
        const quote = data[0];
        
        // Validate quote data
        if (!quote.q || !quote.a) {
            throw new Error('Invalid quote data structure');
        }
        
        return {
            content: quote.q, // quote text
            author: quote.a   // author name
        };
    }

    startCooldownTimer() {
        const nextBtn = document.getElementById('nextQuoteBtn');
        const originalText = nextBtn.textContent;
        
        nextBtn.disabled = true;
        
        const updateTimer = () => {
            const now = Date.now();
            const remainingTime = this.apiCooldown - (now - this.lastApiCall);
            
            if (remainingTime <= 0) {
                nextBtn.textContent = originalText;
                nextBtn.disabled = false;
                return;
            }
            
            const seconds = Math.ceil(remainingTime / 1000);
            nextBtn.textContent = `Wait ${seconds}s`;
            
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    async displayRandomLocalQuote() {
        if (this.quotes.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        this.currentQuote = this.quotes[randomIndex];
        this.loadBackgroundGradient();
        this.displayQuote();
        await this.saveState();
    }

    setupEventListeners() {
        const nextBtn = document.getElementById('nextQuoteBtn');
        const copyBtn = document.getElementById('copyQuoteBtn');
        
        // Sharing buttons
        const shareTwitterBtn = document.getElementById('shareTwitterBtn');
        const shareFacebookBtn = document.getElementById('shareFacebookBtn');
        const shareLinkedInBtn = document.getElementById('shareLinkedInBtn');
        const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');

        nextBtn.addEventListener('click', () => this.handleNextQuote());
        copyBtn.addEventListener('click', () => this.copyQuote());
        
        // Sharing event listeners
        shareTwitterBtn.addEventListener('click', () => this.shareToTwitter());
        shareFacebookBtn.addEventListener('click', () => this.shareToFacebook());
        shareLinkedInBtn.addEventListener('click', () => this.shareToLinkedIn());
        shareWhatsAppBtn.addEventListener('click', () => this.shareToWhatsApp());
    }

    handleNextQuote() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastApiCall;
        
        if (timeSinceLastCall >= this.apiCooldown) {
            this.fetchNewQuote();
        } else {
            // Don't do anything - button should be disabled
        }
    }

    displayQuote() {
        if (!this.currentQuote) return;

        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');

        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            // Sanitize and limit quote length for display
            const sanitizedText = this.sanitizeText(this.currentQuote.text, 300);
            const sanitizedAuthor = this.sanitizeText(this.currentQuote.author, 50);
            
            quoteText.textContent = sanitizedText;
            quoteAuthor.textContent = sanitizedAuthor;
            
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 150);
    }

    async copyQuote() {
        if (!this.currentQuote) return;

        const textToCopy = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showCopyFeedback();
        } catch (error) {
            // Fallback to alternative copy method
            this.fallbackCopy(textToCopy);
        }
    }

    showCopyFeedback() {
        const copyBtn = document.getElementById('copyQuoteBtn');
        const originalText = copyBtn.textContent;
        
        copyBtn.classList.add('copied');
        copyBtn.textContent = 'Copied!';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.textContent = originalText;
        }, 2000);
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback();
        } catch (error) {
            // Copy operation failed silently
        }
        
        document.body.removeChild(textArea);
    }

    // Utility methods
    sanitizeText(text, maxLength = 1000) {
        if (!text || typeof text !== 'string') return '';
        
        // Remove any potentially harmful characters and trim
        const sanitized = text
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
            
        // Limit length
        return sanitized.length > maxLength 
            ? sanitized.substring(0, maxLength - 3) + '...'
            : sanitized;
    }

    // Sharing methods
    getShareText() {
        if (!this.currentQuote) return '';
        return `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
    }

    shareToTwitter() {
        const text = this.getShareText();
        const hashtags = 'Quotoday,Inspiration,Quotes';
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${hashtags}`;
        chrome.tabs.create({ url });
    }

    shareToFacebook() {
        const text = this.getShareText();
        const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
        chrome.tabs.create({ url });
    }

    shareToLinkedIn() {
        const text = this.getShareText();
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://chrome.google.com/webstore/detail/quotoday')}&summary=${encodeURIComponent(text)}`;
        chrome.tabs.create({ url });
    }

    shareToWhatsApp() {
        const text = this.getShareText();
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        chrome.tabs.create({ url });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuotodayApp();
});