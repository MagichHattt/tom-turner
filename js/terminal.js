/**
 * Tom Turner Portfolio - Easter Egg Terminal
 * Hidden interactive terminal with commands and games
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const terminalOverlay = document.getElementById('terminalOverlay');
    const easterTerminal = document.getElementById('easterTerminal');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    const terminalClose = document.getElementById('terminalClose');

    // ============================================
    // Terminal State
    // ============================================
    let commandHistory = [];
    let historyIndex = -1;
    let gameState = {
        active: false,
        type: null,
        targetNumber: null,
        attempts: 0,
        maxAttempts: 7
    };

    // ============================================
    // ASCII Art
    // ============================================
    const asciiArt = {
        banner: `
 ████████╗ ██████╗ ███╗   ███╗
 ╚══██╔══╝██╔═══██╗████╗ ████║
    ██║   ██║   ██║██╔████╔██║
    ██║   ██║   ██║██║╚██╔╝██║
    ██║   ╚██████╔╝██║ ╚═╝ ██║
    ╚═╝    ╚═════╝ ╚═╝     ╚═╝
   ████████╗██╗   ██╗██████╗ ███╗   ██╗███████╗██████╗
   ╚══██╔══╝██║   ██║██╔══██╗████╗  ██║██╔════╝██╔══██╗
      ██║   ██║   ██║██████╔╝██╔██╗ ██║█████╗  ██████╔╝
      ██║   ██║   ██║██╔══██╗██║╚██╗██║██╔══╝  ██╔══██╗
      ██║   ╚██████╔╝██║  ██║██║ ╚████║███████╗██║  ██║
      ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
`,
        skull: `
      ___
   .-'   '-.
  /  .-=-.  \\
  | (  C\\ \\  \\
 _\\  \\__/ /  /
/__'.___.'__.'
`,
        matrix: `
  ╔══════════════════════════════════╗
  ║  One does not simply...          ║
  ║  Walk into the Matrix.           ║
  ║                                  ║
  ║  You shall not pass...           ║
  ║  My precious... algorithms.      ║
  ║                                  ║
  ║  Wait, wrong matrix?             ║
  ╚══════════════════════════════════╝
`
    };

    // ============================================
    // Commands Registry
    // ============================================
    const commands = {
        help: {
            description: 'Show available commands',
            execute: () => {
                return `
Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span class="info">GENERAL</span>
  help          - Show this help menu
  about         - Learn about Tom Turner
  skills        - View technical skills
  experience    - View work experience
  contact       - How to get in touch
  clear         - Clear the terminal

<span class="info">FUN</span>
  banner        - Display ASCII banner
  matrix        - Enter the Matrix
  fortune       - Get a random fortune
  hack          - Simulate a "hack"
  game          - Play number guessing game
  joke          - Get a programming joke

<span class="info">SYSTEM</span>
  whoami        - Display current user
  date          - Show current date/time
  uptime        - System uptime
  neofetch      - System information

<span class="info">NAVIGATION</span>
  goto [section]- Navigate to section
                  (about, experience, skills, etc.)
  exit          - Close the terminal

Type a command and press Enter to execute.
`;
            }
        },

        about: {
            description: 'Learn about Tom Turner',
            execute: () => {
                return `
<span class="success">[ PROFILE: Tom Turner ]</span>

Role:       Cyber Officer, U.S. Air Force
Background: Enlisted → Commissioned Officer (2022)
            Integration Engineer @ BAE Systems

Philosophy: "Tinkerer at heart. Always curious."

Journey:
  ├─ Started in Cyber Systems Operations
  ├─ Managed Windows/Linux systems & VMware
  ├─ Served as COMSEC Responsible Officer
  ├─ Built Cross Domain Solutions at BAE
  └─ Now leading two cyber sections

Side quests: Building Linux crypto miners,
             deploying Splunk, web scraping,
             and always learning something new.
`;
            }
        },

        skills: {
            description: 'View technical skills',
            execute: () => {
                return `
<span class="success">[ TECHNICAL SKILLS ]</span>

Systems:
  ├─ Linux (RedHat, CentOS) ████████████░░ 90%
  ├─ Windows Server         ██████████░░░░ 85%
  ├─ VMware vCenter         ██████████░░░░ 85%
  └─ Server Administration  ████████████░░ 90%

Networking:
  ├─ Cross Domain Solutions ██████████░░░░ 85%
  ├─ CUCM                   █████████░░░░░ 80%
  ├─ VTC Systems            █████████░░░░░ 80%
  └─ Network Architecture   ████████░░░░░░ 75%

Security:
  ├─ COMSEC                 ████████████░░ 90%
  ├─ Air-Gapped Systems     ██████████░░░░ 85%
  ├─ Security Architecture  █████████░░░░░ 80%
  └─ Compliance/Hardening   ██████████░░░░ 85%

Tools & Dev:
  ├─ Splunk                 ████████░░░░░░ 75%
  ├─ Scripting (Bash/Python)█████████░░░░░ 80%
  ├─ Database Management    ███████░░░░░░░ 70%
  └─ Web Scraping           ████████░░░░░░ 75%
`;
            }
        },

        experience: {
            description: 'View work experience',
            execute: () => {
                return `
<span class="success">[ EXPERIENCE ]</span>

┌─────────────────────────────────────────────┐
│ <span class="info">CURRENT: Cyber Officer, U.S. Air Force</span>     │
│ 2022 - Present                              │
├─────────────────────────────────────────────┤
│ • Managing C2 Mission Systems shop          │
│ • Overseeing Comm Focal Point section       │
│ • Leading critical cyber operations         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ <span class="info">Integration Engineer, BAE Systems</span>         │
│ Air Force Research Laboratory               │
├─────────────────────────────────────────────┤
│ • Cross Domain Solutions on CentOS          │
│ • Air-gapped test system development        │
│ • Demo road kits for field operations       │
│ • CUCM management and VTC systems           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ <span class="info">Cyber Systems Operations, USAF (Enlisted)</span> │
│ Foundation Years                            │
├─────────────────────────────────────────────┤
│ • Windows patch/antivirus management        │
│ • VMware vCenter administration             │
│ • COMSEC Responsible Officer                │
│ • Server room operations                    │
└─────────────────────────────────────────────┘
`;
            }
        },

        contact: {
            description: 'How to get in touch',
            execute: () => {
                return `
<span class="success">[ CONTACT ]</span>

The best way to reach me is through the
contact form on this website.

Navigate to the contact section:
  > goto contact

Or scroll down to the bottom of the page.

I'm open to:
  • Professional networking
  • Mentorship opportunities
  • Discussing technology
  • Collaboration on projects

<span class="info">Security Note: Personal contact info is
not publicly displayed for privacy.</span>
`;
            }
        },

        clear: {
            description: 'Clear the terminal',
            execute: () => {
                terminalOutput.innerHTML = '';
                return null;
            }
        },

        banner: {
            description: 'Display ASCII banner',
            execute: () => {
                return `<span class="success">${asciiArt.banner}</span>`;
            }
        },

        matrix: {
            description: 'Enter the Matrix',
            execute: () => {
                return `<span class="success">${asciiArt.matrix}</span>

<span class="info">Remember: There is no spoon.</span>
`;
            }
        },

        fortune: {
            description: 'Get a random fortune',
            execute: () => {
                const fortunes = [
                    "The best time to plant a tree was 20 years ago. The second best time is now.",
                    "In the middle of difficulty lies opportunity. - Albert Einstein",
                    "The only way to do great work is to love what you do. - Steve Jobs",
                    "First, solve the problem. Then, write the code. - John Johnson",
                    "Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke",
                    "Talk is cheap. Show me the code. - Linus Torvalds",
                    "The best error message is the one that never shows up.",
                    "Weeks of coding can save you hours of planning.",
                    "It works on my machine. - Every developer ever",
                    "There are only 10 types of people: those who understand binary and those who don't.",
                    "A good programmer is someone who always looks both ways before crossing a one-way street.",
                    "Debugging is like being the detective in a crime movie where you are also the murderer."
                ];
                const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                return `
<span class="success">[ FORTUNE ]</span>

"${fortune}"
`;
            }
        },

        hack: {
            description: 'Simulate a "hack"',
            execute: () => {
                // Add some fake "hacking" lines with delay
                const hackLines = [
                    'Initializing connection...',
                    'Bypassing firewall... [OK]',
                    'Accessing mainframe...',
                    'Decrypting protocols...',
                    'Injecting payload... [OK]',
                    'Establishing backdoor...',
                    'Extracting data...',
                    '',
                    '<span class="error">JUST KIDDING!</span>',
                    '',
                    'This is just a harmless Easter egg.',
                    'No actual hacking occurred.',
                    'Please hack responsibly. :)'
                ];

                let output = '<span class="success">[ INITIATING HACK SEQUENCE ]</span>\n\n';
                hackLines.forEach(line => {
                    output += line + '\n';
                });

                return output;
            }
        },

        game: {
            description: 'Play number guessing game',
            execute: () => {
                gameState.active = true;
                gameState.type = 'guess';
                gameState.targetNumber = Math.floor(Math.random() * 100) + 1;
                gameState.attempts = 0;

                return `
<span class="success">[ NUMBER GUESSING GAME ]</span>

I'm thinking of a number between 1 and 100.
You have ${gameState.maxAttempts} attempts to guess it.

Type a number and press Enter to guess.
Type 'quit' to exit the game.

Good luck!
`;
            }
        },

        joke: {
            description: 'Get a programming joke',
            execute: () => {
                const jokes = [
                    "Why do programmers prefer dark mode?\nBecause light attracts bugs!",
                    "A SQL query walks into a bar, walks up to two tables and asks...\n'Can I join you?'",
                    "Why do Java developers wear glasses?\nBecause they can't C#!",
                    "What's a programmer's favorite hangout place?\nFoo Bar!",
                    "Why was the JavaScript developer sad?\nBecause he didn't Node how to Express himself.",
                    "How many programmers does it take to change a light bulb?\nNone. It's a hardware problem.",
                    "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.'\nHe comes back with 12 loaves of bread.",
                    "Why did the developer go broke?\nBecause he used up all his cache!",
                    "What's a bug's least favorite room?\nThe debug room!",
                    "Why do programmers hate nature?\nIt has too many bugs."
                ];
                const joke = jokes[Math.floor(Math.random() * jokes.length)];
                return `
<span class="success">[ JOKE ]</span>

${joke}
`;
            }
        },

        whoami: {
            description: 'Display current user',
            execute: () => {
                return 'guest@turner-portfolio';
            }
        },

        date: {
            description: 'Show current date/time',
            execute: () => {
                return new Date().toString();
            }
        },

        uptime: {
            description: 'System uptime',
            execute: () => {
                const start = new Date('2026-01-24');
                const now = new Date();
                const diff = now - start;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                return `System has been running for ${days} days since commissioning.`;
            }
        },

        neofetch: {
            description: 'System information',
            execute: () => {
                const now = new Date();
                return `
<span class="success">       .---.        </span>   guest@turner-portfolio
<span class="success">      /     \\       </span>   ─────────────────────
<span class="success">      \\.@-@./       </span>   <span class="info">OS:</span> Portfolio v1.0
<span class="success">      /\`\\_/\`\\       </span>   <span class="info">Host:</span> tom-turner.com
<span class="success">     //  _  \\\\      </span>   <span class="info">Kernel:</span> HTML5/CSS3/JS
<span class="success">    | \\     )|_     </span>   <span class="info">Shell:</span> Terminal v1.0
<span class="success">   /\`\\_\`>  <_/ \\    </span>   <span class="info">Theme:</span> Ops Dark
<span class="success">   \\__/'---'\\__/    </span>   <span class="info">Terminal:</span> Easter Egg
                       <span class="info">Date:</span> ${now.toLocaleDateString()}
                       <span class="info">Time:</span> ${now.toLocaleTimeString()}
`;
            }
        },

        goto: {
            description: 'Navigate to section',
            execute: (args) => {
                const section = args[0];
                if (!section) {
                    return `
<span class="error">Usage: goto [section]</span>

Available sections:
  • about
  • experience
  • skills
  • education
  • projects
  • contact
`;
                }

                const validSections = ['about', 'experience', 'skills', 'education', 'projects', 'contact', 'hero'];
                if (validSections.includes(section.toLowerCase())) {
                    const target = document.getElementById(section.toLowerCase());
                    if (target) {
                        closeTerminal();
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                        return `Navigating to ${section}...`;
                    }
                }
                return `<span class="error">Section "${section}" not found.</span>\nType 'goto' without arguments to see available sections.`;
            }
        },

        exit: {
            description: 'Close the terminal',
            execute: () => {
                closeTerminal();
                return 'Goodbye! Press Ctrl + ` to return.';
            }
        },

        quit: {
            description: 'Close the terminal',
            execute: () => commands.exit.execute()
        },

        sudo: {
            description: 'Superuser do',
            execute: () => {
                return `<span class="error">Nice try! But you don't have sudo privileges here.</span>\n\n${asciiArt.skull}`;
            }
        },

        rm: {
            description: 'Remove files',
            execute: (args) => {
                if (args.includes('-rf') && (args.includes('/') || args.includes('*'))) {
                    return `<span class="error">Nice try! This is a read-only filesystem.</span>\n\nNo files were harmed in the making of this Easter egg.`;
                }
                return '<span class="error">Permission denied: This is a virtual filesystem.</span>';
            }
        },

        ls: {
            description: 'List files',
            execute: () => {
                return `
<span class="info">drwxr-xr-x</span>  about/
<span class="info">drwxr-xr-x</span>  experience/
<span class="info">drwxr-xr-x</span>  skills/
<span class="info">drwxr-xr-x</span>  projects/
<span class="info">-rw-r--r--</span>  README.md
<span class="info">-rw-r--r--</span>  .secret
`;
            }
        },

        cat: {
            description: 'Read files',
            execute: (args) => {
                const file = args[0];
                if (file === '.secret') {
                    return `<span class="success">Congratulations! You found the secret file!</span>\n\nYou're clearly someone who likes to explore.\nThat's exactly the kind of curiosity that makes\na great cyber professional.\n\nKeep exploring. Keep learning. Keep building.`;
                }
                if (file === 'README.md') {
                    return `# Tom Turner Portfolio\n\nWelcome to my portfolio website.\nBuilt with HTML, CSS, and vanilla JavaScript.\n\nFeel free to explore!`;
                }
                return `<span class="error">cat: ${file || '?'}: No such file or directory</span>`;
            }
        },

        cd: {
            description: 'Change directory',
            execute: (args) => {
                const dir = args[0];
                if (['about', 'experience', 'skills', 'projects'].includes(dir)) {
                    return commands.goto.execute([dir]);
                }
                return `<span class="error">cd: ${dir || '?'}: Not a valid section</span>`;
            }
        },

        pwd: {
            description: 'Print working directory',
            execute: () => '/home/guest/portfolio'
        },

        echo: {
            description: 'Echo text',
            execute: (args) => args.join(' ') || ''
        },

        ping: {
            description: 'Ping host',
            execute: (args) => {
                const host = args[0] || 'localhost';
                return `PING ${host}: 64 bytes, time=<1ms TTL=64\nPING ${host}: 64 bytes, time=<1ms TTL=64\nPING ${host}: 64 bytes, time=<1ms TTL=64\n\n--- ${host} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`;
            }
        },

        coffee: {
            description: 'Make coffee',
            execute: () => {
                return `
<span class="success">Brewing coffee...</span>

    ( (
     ) )
  ........
  |      |]
  \\      /
   \`----'

<span class="info">Coffee ready! Stay caffeinated.</span>
`;
            }
        }
    };

    // ============================================
    // Process Command
    // ============================================
    function processCommand(input) {
        const trimmedInput = input.trim();

        if (!trimmedInput) return '';

        // Add to history
        commandHistory.push(trimmedInput);
        historyIndex = commandHistory.length;

        // Check if in game mode
        if (gameState.active) {
            return processGameInput(trimmedInput);
        }

        // Parse command and arguments
        const parts = trimmedInput.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Check if command exists
        if (commands[cmd]) {
            const result = commands[cmd].execute(args);
            return result;
        }

        // Unknown command
        return `<span class="error">Command not found: ${cmd}</span>\nType 'help' for available commands.`;
    }

    // ============================================
    // Process Game Input
    // ============================================
    function processGameInput(input) {
        if (input.toLowerCase() === 'quit') {
            gameState.active = false;
            return '<span class="info">Game ended. Thanks for playing!</span>';
        }

        const guess = parseInt(input);

        if (isNaN(guess)) {
            return '<span class="error">Please enter a valid number or "quit" to exit.</span>';
        }

        gameState.attempts++;

        if (guess === gameState.targetNumber) {
            gameState.active = false;
            return `
<span class="success">CORRECT!</span>

You guessed it in ${gameState.attempts} attempt${gameState.attempts === 1 ? '' : 's'}!
The number was ${gameState.targetNumber}.

Type 'game' to play again.
`;
        }

        const remaining = gameState.maxAttempts - gameState.attempts;

        if (remaining === 0) {
            gameState.active = false;
            return `
<span class="error">GAME OVER!</span>

The number was ${gameState.targetNumber}.
Better luck next time!

Type 'game' to play again.
`;
        }

        const hint = guess < gameState.targetNumber ? 'low' : 'high';
        return `<span class="info">${guess}</span> is too ${hint}. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`;
    }

    // ============================================
    // Terminal Output
    // ============================================
    function addOutput(content, isCommand = false) {
        if (content === null) return;

        const line = document.createElement('div');

        if (isCommand) {
            line.className = 'terminal-cmd';
            line.textContent = `guest@turner:~$ ${content}`;
        } else {
            line.className = 'terminal-response';
            line.innerHTML = content;
        }

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // ============================================
    // Terminal Controls
    // ============================================
    function openTerminal() {
        terminalOverlay.classList.add('active');
        terminalInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeTerminal() {
        terminalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset game state
        if (gameState.active) {
            gameState.active = false;
        }
    }

    // ============================================
    // Event Listeners
    // ============================================
    function initTerminal() {
        // Keyboard shortcut to open terminal (Ctrl + `)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
                e.preventDefault();
                if (terminalOverlay.classList.contains('active')) {
                    closeTerminal();
                } else {
                    openTerminal();
                }
            }
        });

        // Close button
        terminalClose.addEventListener('click', closeTerminal);

        // Close on overlay click
        terminalOverlay.addEventListener('click', (e) => {
            if (e.target === terminalOverlay) {
                closeTerminal();
            }
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && terminalOverlay.classList.contains('active')) {
                closeTerminal();
            }
        });

        // Terminal input handling
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = terminalInput.value;
                addOutput(input, true);

                const result = processCommand(input);
                if (result !== null) {
                    addOutput(result);
                }

                terminalInput.value = '';
            }

            // Command history navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }

            // Tab completion (basic)
            if (e.key === 'Tab') {
                e.preventDefault();
                const input = terminalInput.value.toLowerCase();
                const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));

                if (matches.length === 1) {
                    terminalInput.value = matches[0];
                } else if (matches.length > 1) {
                    addOutput(input, true);
                    addOutput(matches.join('  '));
                }
            }
        });

        // Keep focus on input when terminal is open
        easterTerminal.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTerminal);
    } else {
        initTerminal();
    }

})();
