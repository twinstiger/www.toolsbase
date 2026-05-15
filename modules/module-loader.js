// ==================== Module Loader & Navigation ====================

// ==================== Dropdown Menu with Delay ====================
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-btn');
    const content = dropdown.querySelector('.dropdown-content');
    let hideTimeout;
    
    // Show dropdown immediately on mouse enter
    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        content.style.display = 'block';
        content.style.animation = 'fadeIn 0.2s ease';
    });
    
    // Hide dropdown with delay on mouse leave
    dropdown.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
            content.style.display = 'none';
        }, 300); // 300ms delay before hiding
    });
});

// Tool switching function
function showTool(toolId) {
    // Special case: Show home page
    if (toolId === 'home') {
        const allSections = document.querySelectorAll('.tool-section');
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const homePage = document.getElementById('home-page');
        if (homePage) {
            homePage.classList.add('active');
        }
        return;
    }
    
    // Hide all tool sections
    const allSections = document.querySelectorAll('.tool-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Hide all individual tool cards
    const allCards = document.querySelectorAll('.individual-tool');
    allCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Check if it's an individual tool (like calc-basic, conv-length, etc.)
    if (toolId.startsWith('calc-') || toolId.startsWith('conv-') || toolId.startsWith('text-') || toolId.startsWith('gen-')) {
        // Show the parent section first
        let parentSection;
        if (toolId.startsWith('calc-')) {
            parentSection = document.getElementById('calculator-tool');
        } else if (toolId.startsWith('conv-')) {
            parentSection = document.getElementById('converter-tool');
        } else if (toolId.startsWith('text-')) {
            parentSection = document.getElementById('text-tool');
        } else if (toolId.startsWith('gen-')) {
            parentSection = document.getElementById('generator-tool');
        }
        
        if (parentSection) {
            parentSection.classList.add('active');
        }
        
        // Show specific tool card
        const targetCard = document.getElementById(`${toolId}-card`);
        if (targetCard) {
            targetCard.style.display = 'block';
            // Scroll to the card
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    } else {
        // Show full section for regular tools
        const targetSection = document.getElementById(`${toolId}-tool`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    const allBtns = document.querySelectorAll('.nav-btn');
    allBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the parent dropdown button
    const links = document.querySelectorAll('.dropdown-content a');
    links.forEach(link => {
        if (link.getAttribute('onclick').includes(`'${toolId}'`)) {
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const btn = parentDropdown.querySelector('.nav-btn');
                if (btn) btn.classList.add('active');
            }
        }
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    // Show home page by default
    showTool('home');
});
