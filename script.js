(function() {
    'use strict';

    // App data
    let appData = {
        intro: {
            name: 'Ruben',
            greeting: "Hello, I'm {name}",
            bio: "Welcome to my personal website. I'm a software developer passionate about building elegant solutions and continuously learning new technologies. Here you can find information about my learning journey, connect with me on social media, or get in touch."
        },
        socials: [],
        contact: {
            email: '',
            phone: ''
        },
        courses: [],
        workshops: []
    };

    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const closeMenu = document.getElementById('close-menu');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>';
        } else {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/>';
        }
    }

    // Load theme preference
    const userTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(userTheme || (systemPrefersDark ? 'dark' : 'light'));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    /**
     * Parse frontmatter from markdown content
     */
    function parseFrontmatter(content) {
        const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!match) {
            return { data: {}, content: content };
        }

        const frontmatterStr = match[1];
        const body = match[2] || '';

        const data = {};
        frontmatterStr.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();
                
                // Handle array values
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(v => v.trim());
                }
                
                data[key] = value;
            }
        });

        return { data, content: body.trim() };
    }

    /**
     * Fetch a file and return its text content
     */
    async function fetchFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                return null;
            }
            return await response.text();
        } catch (e) {
            return null;
        }
    }

    /**
     * Load intro/homepage content
     */
    async function loadIntro() {
        const content = await fetchFile('content/home/intro.md');
        if (content) {
            const { data } = parseFrontmatter(content);
            if (data.name) appData.intro.name = data.name;
            if (data.greeting) appData.intro.greeting = data.greeting;
            if (data.bio) appData.intro.bio = data.bio;
        }
        
        renderIntro();
    }

    /**
     * Load social links
     */
    async function loadSocials() {
        const content = await fetchFile('content/socials/index.md');
        if (content) {
            const { data, content: body } = parseFrontmatter(content);
            if (data.links) {
                appData.socials = Array.isArray(data.links) ? data.links : [data.links];
            }
            if (body) {
                // Parse links from markdown list
                const linkMatches = body.match(/\[([^\]]+)\]\(([^)]+)\)/g);
                if (linkMatches) {
                    appData.socials = linkMatches.map(match => {
                        const [_, label, url] = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
                        return { label, url };
                    });
                }
            }
        }
        renderSocials();
    }

    /**
     * Load contact info
     */
    async function loadContact() {
        const content = await fetchFile('content/contact/index.md');
        if (content) {
            const { data, content: body } = parseFrontmatter(content);
            if (data.email) appData.contact.email = data.email;
            if (data.phone) appData.contact.phone = data.phone;
            if (body) appData.contact.body = body;
        }
        renderContact();
    }

    /**
     * Load courses
     */
    async function loadCourses() {
        // For now, load from a single file
        // In production, you'd have multiple files or an index
        const content = await fetchFile('content/courses/index.md');
        if (content) {
            const lines = content.split('\n');
            let currentEntry = null;
            
            lines.forEach(line => {
                if (line.startsWith('## ')) {
                    if (currentEntry) appData.courses.push(currentEntry);
                    currentEntry = { title: line.replace('## ', '').trim() };
                } else if (line.startsWith('**Description:**')) {
                    if (currentEntry) currentEntry.description = line.replace('**Description:**', '').trim();
                } else if (line.startsWith('**Dates:**')) {
                    if (currentEntry) currentEntry.dates = line.replace('**Dates:**', '').trim();
                } else if (line.startsWith('**Certificate:**')) {
                    if (currentEntry) currentEntry.certificate = line.replace('**Certificate:**', '').trim();
                }
            });
            if (currentEntry) appData.courses.push(currentEntry);
        }
        
        // Alternative: Load individual course files
        const courseFiles = ['javascript-fundamentals.md']; // This would be generated
        for (const file of courseFiles) {
            const courseContent = await fetchFile(`content/courses/${file}`);
            if (courseContent) {
                const { data, content: body } = parseFrontmatter(courseContent);
                appData.courses.push({
                    title: data.title || 'Untitled Course',
                    description: body || data.description || '',
                    dates: data.dates || '',
                    certificate: data.certificate || ''
                });
            }
        }
        
        renderCourses();
    }

    /**
     * Load workshops
     */
    async function loadWorkshops() {
        const workshopFiles = []; // Would be generated from content directory
        for (const file of workshopFiles) {
            const workshopContent = await fetchFile(`content/workshops/${file}`);
            if (workshopContent) {
                const { data, content: body } = parseFrontmatter(workshopContent);
                appData.workshops.push({
                    title: data.title || 'Untitled Workshop',
                    description: body || data.description || '',
                    dates: data.dates || '',
                    certificate: data.certificate || ''
                });
            }
        }
        
        renderWorkshops();
    }

    /**
     * Render intro
     */
    function renderIntro() {
        const greetingEl = document.querySelector('.intro-greeting');
        const textEl = document.querySelector('.intro-text');
        
        if (greetingEl) {
            greetingEl.innerHTML = appData.intro.greeting.replace('{name}', `<span class="highlight">${escapeHtml(appData.intro.name)}</span>`);
        }
        if (textEl) {
            textEl.textContent = appData.intro.bio;
        }
    }

    /**
     * Render social links
     */
    function renderSocials() {
        const container = document.getElementById('social-links');
        if (!container) return;

        if (appData.socials.length === 0) {
            container.innerHTML = '<p class="empty-message">No social links added yet.</p>';
            return;
        }

        container.innerHTML = appData.socials.map(social => `
            <a href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" class="social-link">
                <span class="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                    </svg>
                </span>
                <span class="social-name">${escapeHtml(social.label)}</span>
            </a>
        `).join('');
    }

    /**
     * Render contact info
     */
    function renderContact() {
        const container = document.getElementById('contact-content');
        if (!container) return;

        let html = '<div class="contact-info">';
        
        if (appData.contact.email) {
            html += `
                <div class="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>${escapeHtml(appData.contact.email)}</span>
                </div>
            `;
        }
        
        if (appData.contact.phone) {
            html += `
                <div class="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>${escapeHtml(appData.contact.phone)}</span>
                </div>
            `;
        }
        
        html += '</div>';
        
        if (appData.contact.body) {
            html += `<p>${escapeHtml(appData.contact.body)}</p>`;
        }
        
        container.innerHTML = html;
    }

    /**
     * Render courses
     */
    function renderCourses() {
        const container = document.getElementById('courses-list');
        if (!container) return;

        if (appData.courses.length === 0) {
            container.innerHTML = '<p class="empty-message">No courses added yet. Add content via the <a href="/admin">admin panel</a>.</p>';
            return;
        }

        container.innerHTML = appData.courses.map(course => `
            <div class="entry-card">
                <h4 class="entry-title">${escapeHtml(course.title)}</h4>
                <p class="entry-description">${escapeHtml(course.description || '')}</p>
                ${course.dates ? `<p class="entry-dates">${escapeHtml(course.dates)}</p>` : ''}
                ${course.certificate ? `<a href="${escapeHtml(course.certificate)}" target="_blank" rel="noopener noreferrer" class="entry-certificate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    View Certificate
                </a>` : ''}
            </div>
        `).join('');
    }

    /**
     * Render workshops
     */
    function renderWorkshops() {
        const container = document.getElementById('workshops-list');
        if (!container) return;

        if (appData.workshops.length === 0) {
            container.innerHTML = '<p class="empty-message">No workshops added yet. Add content via the <a href="/admin">admin panel</a>.</p>';
            return;
        }

        container.innerHTML = appData.workshops.map(workshop => `
            <div class="entry-card">
                <h4 class="entry-title">${escapeHtml(workshop.title)}</h4>
                <p class="entry-description">${escapeHtml(workshop.description || '')}</p>
                ${workshop.dates ? `<p class="entry-dates">${escapeHtml(workshop.dates)}</p>` : ''}
                ${workshop.certificate ? `<a href="${escapeHtml(workshop.certificate)}" target="_blank" rel="noopener noreferrer" class="entry-certificate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    View Certificate
                </a>` : ''}
            </div>
        `).join('');
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Mobile menu toggle
     */
    function toggleMenu() {
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    function closeMenuHandler() {
        hamburger.classList.remove('active');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    /**
     * Active link highlighting
     */
    function handleNavClick(e) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Close mobile menu
        closeMenuHandler();
    }

    /**
     * Contact form handling
     */
    function handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;
        
        // For now, just log - in production, you'd send to a service
        console.log('Contact form submitted:', { name, email, message });
        
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    }

    /**
     * Initialize
     */
    function init() {
        // Event listeners
        hamburger?.addEventListener('click', toggleMenu);
        closeMenu?.addEventListener('click', closeMenuHandler);
        overlay?.addEventListener('click', closeMenuHandler);
        
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        document.getElementById('contact-form')?.addEventListener('submit', handleContactSubmit);

        // Load content
        loadIntro();
        loadSocials();
        loadContact();
        loadCourses();
        loadWorkshops();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
