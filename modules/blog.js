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
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
    },
    {
        id: 2,
        title: "Complete Guide to Using Developer Practical Online Tools to Improve Daily Work Efficiency",
        excerpt: "For front-end developers, back-end programmers, test engineers and Internet technical practitioners, various auxiliary small tools are indispensable important aids in daily work...",
        tag: "productivity",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>'
    },
    {
        id: 3,
        title: "Daily Office Text Processing Practical Skills | Use Online Tools to Simplify Copy Sorting Work",
        excerpt: "In daily office work, a large number of text content sorting, word quantity statistics, content arrangement and other work occupy most of the daily working time of many office staff...",
        tag: "productivity",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
    },
    {
        id: 4,
        title: "Top 10 Essential Browser-Based Tools Every Developer Should Know",
        excerpt: "Discover the top 10 must-have browser-based tools that can boost your productivity and streamline your development workflow...",
        tag: "development",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    },
    {
        id: 5,
        title: "Understanding Data Privacy in the Age of Online Tools",
        excerpt: "Learn essential data privacy practices when using online tools and how to protect your sensitive information...",
        tag: "privacy",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>'
    },
    {
        id: 6,
        title: "Boosting Front-End Development Efficiency with Modern Browser Tools",
        excerpt: "Learn how modern browser-based tools can dramatically improve your front-end development workflow and productivity...",
        tag: "development",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    },
    {
        id: 7,
        title: "The Hidden Risks of Server-Side Tools | Why Browser-Based is Safer",
        excerpt: "Understand the security implications of server-side processing and why running tools locally in your browser offers better privacy protection...",
        tag: "security",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
    },
    {
        id: 8,
        title: "The Evolution of Front-End Tooling | From CLI to Visual",
        excerpt: "Trace the evolution of front-end development tools from command-line interfaces to modern visual browser-based solutions...",
        tag: "development",
        date: "May 2026",
        gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>'
    }
];

let currentFilter = 'all';

// Render all articles
function renderArticles() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    grid.innerHTML = BlogArticles.map(article => `
        <a href="article${article.id}.html" class="blog-card" data-tag="${article.tag}" data-title="${article.title.toLowerCase()}">
            <div class="blog-card-image" style="background: ${article.gradient};">
                ${article.icon}
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
document.addEventListener('DOMContentLoaded', renderArticles);

// Export to global
window.BlogModule = { setFilter, filterArticles, articles: BlogArticles };
window.setFilter = setFilter;
window.filterArticles = filterArticles;

console.log('Blog module loaded');