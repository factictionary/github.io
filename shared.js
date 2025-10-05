// ===== LEADERBOARD MANAGER =====
class LeaderboardManager {
    constructor() {
        this.boards = {
            daily: [],
            weekly: [],
            allTime: []
        };
        this.loadLeaderboards();
        this.cleanupOldEntries();
    }
    
    loadLeaderboards() {
        try {
            const stored = localStorage.getItem('leaderboards');
            if (stored) {
                this.boards = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading leaderboards:', error);
            this.boards = { daily: [], weekly: [], allTime: [] };
        }
    }
    
    saveLeaderboards() {
        try {
            localStorage.setItem('leaderboards', JSON.stringify(this.boards));
        } catch (error) {
            console.error('Error saving leaderboards:', error);
        }
    }
    
    cleanupOldEntries() {
        const now = Date.now();
        const today = new Date().toDateString();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        
        // Clean daily board
        this.boards.daily = this.boards.daily.filter(entry => {
            const entryDate = new Date(entry.timestamp).toDateString();
            return entryDate === today;
        });
        
        // Clean weekly board
        this.boards.weekly = this.boards.weekly.filter(entry => 
            entry.timestamp > weekAgo
        );
        
        this.saveLeaderboards();
    }
    
    addScore(game, playerName, score, difficulty = null) {
        const entry = {
            game,
            playerName: playerName || 'Anonymous',
            score,
            difficulty,
            timestamp: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add to all boards
        this.boards.allTime.push(entry);
        this.boards.daily.push(entry);
        this.boards.weekly.push(entry);
        
        // Sort all boards by score (descending)
        this.boards.allTime.sort((a, b) => b.score - a.score);
        this.boards.daily.sort((a, b) => b.score - a.score);
        this.boards.weekly.sort((a, b) => b.score - a.score);
        
        // Limit board sizes
        this.boards.allTime = this.boards.allTime.slice(0, 100);
        this.boards.daily = this.boards.daily.slice(0, 50);
        this.boards.weekly = this.boards.weekly.slice(0, 50);
        
        this.saveLeaderboards();
        
        return this.getRank(entry, 'daily');
    }
    
    getRank(entry, board = 'daily') {
        const index = this.boards[board].findIndex(e => 
            e.playerName === entry.playerName && 
            e.game === entry.game && 
            e.score === entry.score &&
            e.timestamp === entry.timestamp
        );
        return index + 1;
    }
    
    getTopPlayers(board = 'daily', limit = 5, game = null) {
        let entries = this.boards[board] || [];
        
        if (game) {
            entries = entries.filter(e => e.game === game);
        }
        
        return entries.slice(0, limit);
    }
    
    getAllGames() {
        const games = new Set();
        this.boards.allTime.forEach(entry => games.add(entry.game));
        return Array.from(games).sort();
    }
}

// Initialize global leaderboard
const leaderboard = new LeaderboardManager();

// ===== VOCABULARY LOADER =====
class VocabularyLoader {
    constructor() {
        this.vocabulary = null;
        this.loaded = false;
        this.loadVocabulary();
    }
    
    async loadVocabulary() {
        try {
            // Try to load from file
//            const response = await window.fs.readFile('vocabulary.json', { encoding: 'utf8' });
			fetch('vocabulary.json')
			  .then(response => response.json())
			  .then(data => {
					this.vocabulary = data;
					this.loaded = true;
					console.log('Loaded:', data);
				  }
			  );           
        } catch (error) {
            console.warn('Vocabulary file not found, using sample data');
            alert("Loading sample words")
			this.vocabulary = this.getSampleVocabulary();
            this.loaded = true;
        }
    }
    
    getSampleVocabulary() {
        return {
            "easy": [
                { "word": "happy", "definition": "feeling or showing pleasure or contentment" },
                { "word": "big", "definition": "of considerable size or extent" },
                { "word": "quick", "definition": "moving fast or doing something in a short time" },
                { "word": "bright", "definition": "giving out or reflecting much light" },
                { "word": "calm", "definition": "not showing or feeling nervousness or anger" },
                { "word": "strong", "definition": "having the power to move heavy weights or perform physically demanding tasks" },
                { "word": "gentle", "definition": "having or showing a mild, kind, or tender temperament" },
                { "word": "brave", "definition": "ready to face and endure danger or pain" },
                { "word": "clever", "definition": "quick to understand, learn, and devise or apply ideas" },
                { "word": "friendly", "definition": "kind and pleasant" }
            ],
            "medium": [
                { "word": "eloquent", "definition": "fluent or persuasive in speaking or writing" },
                { "word": "diligent", "definition": "having or showing care and conscientiousness in one's work or duties" },
                { "word": "resilient", "definition": "able to withstand or recover quickly from difficult conditions" },
                { "word": "meticulous", "definition": "showing great attention to detail; very careful and precise" },
                { "word": "pragmatic", "definition": "dealing with things sensibly and realistically in a practical way" },
                { "word": "ambiguous", "definition": "open to more than one interpretation; not having one obvious meaning" },
                { "word": "benevolent", "definition": "well-meaning and kindly" },
                { "word": "candid", "definition": "truthful and straightforward; frank" },
                { "word": "tenacious", "definition": "tending to keep a firm hold of something; persistent" },
                { "word": "versatile", "definition": "able to adapt or be adapted to many different functions or activities" }
            ],
            "hard": [
                { "word": "ephemeral", "definition": "lasting for a very short time" },
                { "word": "ubiquitous", "definition": "present, appearing, or found everywhere" },
                { "word": "insidious", "definition": "proceeding in a gradual, subtle way, but with harmful effects" },
                { "word": "esoteric", "definition": "intended for or likely to be understood by only a small number of people with specialized knowledge" },
                { "word": "perfunctory", "definition": "carried out with a minimum of effort or reflection" },
                { "word": "magnanimous", "definition": "generous or forgiving, especially toward a rival or less powerful person" },
                { "word": "obfuscate", "definition": "render obscure, unclear, or unintelligible" },
                { "word": "paradigm", "definition": "a typical example or pattern of something; a model" },
                { "word": "surreptitious", "definition": "kept secret, especially because it would not be approved of" },
                { "word": "vicarious", "definition": "experienced in the imagination through the feelings or actions of another person" }
            ]
        };
    }
    
    async waitForLoad() {
        while (!this.loaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    getWords(difficulty = 'medium', count = 10) {
        if (!this.vocabulary || !this.vocabulary[difficulty]) {
            return [];
        }
        const words = [...this.vocabulary[difficulty]];
        return words.sort(() => Math.random() - 0.5).slice(0, count);
    }
    
    getAllWords() {
        if (!this.vocabulary) return [];
        return Object.values(this.vocabulary).flat();
    }
    
    getRandomWord(difficulty = null) {
        if (!this.vocabulary) return null;
        
        if (difficulty && this.vocabulary[difficulty]) {
            const words = this.vocabulary[difficulty];
            return words[Math.floor(Math.random() * words.length)];
        }
        
        const allWords = this.getAllWords();
        return allWords[Math.floor(Math.random() * allWords.length)];
    }
    
    getDifficulties() {
        if (!this.vocabulary) return [];
        return Object.keys(this.vocabulary);
    }
}

// Initialize global vocabulary loader
const vocabLoader = new VocabularyLoader();

// ===== SOCIAL SHARING =====
function share(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = document.title || 'Brain Games Hub';
    const text = encodeURIComponent(`Check out ${title}! 🎮`);
    
    const urls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank', 'width=600,height=400');
    }
}

// ===== SCORE SUBMISSION =====
function submitScore(game, score, difficulty = null) {
    const playerName = prompt('🎉 Great job! Enter your name for the leaderboard:', 'Player');
    
    if (playerName === null) {
        return false; // User cancelled
    }
    
    const finalName = playerName.trim() || 'Anonymous';
    const rank = leaderboard.addScore(game, finalName, score, difficulty);
    
    alert(`Score submitted!\n\nYour Score: ${score}\nYour Rank: #${rank}\n\nCheck the leaderboard to see all rankings!`);
    return true;
}

// ===== DISPLAY TOP PLAYERS =====
function displayTopPlayers() {
    const container = document.getElementById('topPlayers');
    if (!container) return;
    
    const top = leaderboard.getTopPlayers('daily', 5);
    
    if (top.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No scores yet today. Be the first to play!</p>';
        return;
    }
    
    container.innerHTML = top.map((entry, i) => `
        <div class="leaderboard-entry">
            <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <span class="player-name">${escapeHtml(entry.playerName)}</span>
            <span class="game-name">${escapeHtml(entry.game)}</span>
            <span class="score">${entry.score}</span>
        </div>
    `).join('');
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRandomElements(array, count) {
    return shuffleArray(array).slice(0, count);
}

// ===== TEXT-TO-SPEECH =====
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn('Text-to-speech not supported');
    }
}

// ===== PAGE LOAD EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Display top players if container exists
    if (document.getElementById('topPlayers')) {
        displayTopPlayers();
    }
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});