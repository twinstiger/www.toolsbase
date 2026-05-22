/**
 * Blog Module - 博客文章管理
 * 功能：动态渲染文章、搜索、分类筛选
 */

const BlogArticles = [
    {
        id: 1,
        title: "Why Local Running Online Tools Are Becoming The First Choice For Modern Users",
        excerpt: "In recent years, with users' continuous improvement of network data security awareness, a kind of online tool that can run locally in the browser is rapidly replacing the traditional server-side tool website...",
        tag: "security",
        date: "May 2026",
        image: "https://picsum.photos/seed/sec1/600/400"
    },
    {
        id: 2,
        title: "Complete Guide to Using Developer Practical Online Tools to Improve Daily Work Efficiency",
        excerpt: "For front-end developers, back-end programmers, test engineers and Internet technical practitioners, various auxiliary small tools are indispensable important aids in daily work...",
        tag: "productivity",
        date: "May 2026",
        image: "https://picsum.photos/seed/dev1/600/400"
    },
    {
        id: 3,
        title: "Daily Office Text Processing Practical Skills | Use Online Tools to Simplify Copy Sorting Work",
        excerpt: "In daily office work, a large number of text content sorting, word quantity statistics, content arrangement and other work occupy most of the daily working time of many office staff...",
        tag: "productivity",
        date: "May 2026",
        image: "https://picsum.photos/seed/office1/600/400"
    },
    {
        id: 4,
        title: "Top 10 Essential Browser-Based Tools Every Developer Should Know",
        excerpt: "Discover the top 10 must-have browser-based tools that can boost your productivity and streamline your development workflow...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/code1/600/400"
    },
    {
        id: 5,
        title: "Understanding Data Privacy in the Age of Online Tools",
        excerpt: "Learn essential data privacy practices when using online tools and how to protect your sensitive information...",
        tag: "privacy",
        date: "May 2026",
        image: "https://picsum.photos/seed/priv1/600/400"
    },
    {
        id: 6,
        title: "Boosting Front-End Development Efficiency with Modern Browser Tools",
        excerpt: "Learn how modern browser-based tools can dramatically improve your front-end development workflow and productivity...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/react1/600/400"
    },
    {
        id: 7,
        title: "The Hidden Risks of Server-Side Tools | Why Browser-Based is Safer",
        excerpt: "Understand the security implications of server-side processing and why running tools locally in your browser offers better privacy protection...",
        tag: "security",
        date: "May 2026",
        image: "https://picsum.photos/seed/lock1/600/400"
    },
    {
        id: 8,
        title: "The Evolution of Front-End Tooling | From CLI to Visual",
        excerpt: "Trace the evolution of front-end development tools from command-line interfaces to modern visual browser-based solutions...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/cli1/600/400"
    },
    {
        id: 9,
        title: "Mastering JSON: Best Practices for API Development",
        excerpt: "Learn how to properly format, validate, and optimize JSON for API responses. Avoid common pitfalls in JSON handling...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/json1/600/400"
    },
    {
        id: 10,
        title: "Password Security 101 | Creating Unbreakable Passwords",
        excerpt: "Discover the mathematics behind password strength and learn how to generate truly secure passwords that resist brute-force attacks...",
        tag: "security",
        date: "May 2026",
        image: "https://picsum.photos/seed/pass1/600/400"
    },
    {
        id: 11,
        title: "The Complete Guide to Regular Expressions",
        excerpt: "Master regex with practical examples. From simple pattern matching to complex text extraction...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/regex1/600/400"
    },
    {
        id: 12,
        title: "API Testing Made Easy | Tools and Techniques",
        excerpt: "Streamline your API development workflow with proper testing tools and automation strategies...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/api1/600/400"
    },
    {
        id: 13,
        title: "Color Theory for Developers | Building Better UIs",
        excerpt: "Understand color fundamentals and learn to create stunning user interfaces with proper color selection...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/color1/600/400"
    },
    {
        id: 14,
        title: "Timestamp Handling Across Time Zones",
        excerpt: "Navigate the complexities of timestamps, UTC, and time zone conversions in modern web applications...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/time1/600/400"
    },
    {
        id: 15,
        title: "Base64 Encoding Explained | When and How to Use It",
        excerpt: "Demystify Base64 encoding with practical examples for data URI, authentication, and content transmission...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/enc1/600/400"
    },
    {
        id: 16,
        title: "QR Codes in 2026 | Beyond the Basics",
        excerpt: "Explore advanced QR code generation techniques, customization options, and modern use cases...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/qr1/600/400"
    },
    {
        id: 17,
        title: "Image Optimization for Web Performance",
        excerpt: "Learn compression techniques, format selection, and delivery strategies for lightning-fast websites...",
        tag: "development",
        date: "May 2026",
        image: "https://picsum.photos/seed/img1/600/400"
    },
    {
        id: 18,
        title: "Hash Functions Explained | MD5, SHA, and Beyond",
        excerpt: "Understand cryptographic hash functions, their use cases, and when to use each algorithm...",
        tag: "security",
        date: "May 2026",
        image: "https://picsum.photos/seed/hash1/600/400"
    }
];

let currentFilter = 'all';

// Render all articles
function renderArticles() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    grid.innerHTML = BlogArticles.map(article => `
        <a href="article${article.id}.html" class="blog-card" data-tag="${article.tag}" data-title="${article.title.toLowerCase()}">
            <div class="blog-card-image" style="background-image: url('${article.image}'); background-size: cover; background-position: center;">
            </div>
            <div class="blog-card-content">
                <h2>${article.title}</h2>
                <p class="excerpt">${article.excerpt}</p>
                <span class="read-more">Read More →</span>
                <div class="meta">
                    <span class="tag">${getTagIcon(article.tag)} ${article.tag.charAt(0).toUpperCase() + article.tag.slice(1)}</span>
                    <span>${article.date}</span>
                </div>
            </div>
        </a>
    `).join('');
}

function getTagIcon(tag) {
    const icons = { productivity: '⚡', development: '💻', security: '🔒', privacy: '🔐' };
    return icons[tag] || '📝';
}

// Filter by tag
function setFilter(tag, btn) {
    currentFilter = tag;

    // Update button states
    document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => {
        const cardTag = card.dataset.tag;
        const matches = tag === 'all' || cardTag === tag;
        const searchText = document.getElementById('blog-search')?.value?.toLowerCase() || '';
        const titleMatch = searchText === '' || card.dataset.title.includes(searchText);

        card.style.display = (matches && titleMatch) ? 'block' : 'none';
    });
}

// Search articles
function filterArticles() {
    const searchText = document.getElementById('blog-search')?.value?.toLowerCase() || '';

    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => {
        const title = card.dataset.title;
        const cardTag = card.dataset.tag;
        const matches = currentFilter === 'all' || cardTag === currentFilter;
        const searchMatch = searchText === '' || title.includes(searchText);

        card.style.display = (matches && searchMatch) ? 'block' : 'none';
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
});

// Export to global
window.BlogModule = { setFilter, filterArticles, articles: BlogArticles };
window.setFilter = setFilter;
window.filterArticles = filterArticles;

console.log('Blog module loaded');