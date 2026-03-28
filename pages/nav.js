(function () {
    const PROJECTS = [
        { title: 'Bring Your Own Cup',          href: 'byo.html' },
        { title: 'SFUSnap — VictimSupport',     href: 'afterhours-support.html' },
        { title: 'VACFSS Recruitment Campaign', href: '2022_marketing.html' },
        { title: 'VACFSS UX Research',          href: 'vacfss_ux.html' },
        { title: 'Palanner',                    href: 'Palanner.html' },
        { title: 'BluRead',                     href: 'bluread.html' },
        { title: 'Meddlesome Company',          href: '2024_middlesome.html' },
        { title: 'Winter Solstice Card 2022',   href: '2022_Wintersolstice.html' },
    ];

    const currentFile = window.location.pathname.split('/').pop();
    const currentIndex = PROJECTS.findIndex(p => p.href === currentFile);
    const nextProject = currentIndex >= 0
        ? PROJECTS[(currentIndex + 1) % PROJECTS.length]
        : null;

    // ── Back Button — injected into the nav alongside existing links ──
    function injectBackButton() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;
        const btn = document.createElement('a');
        btn.className = 'back-btn';
        btn.textContent = '← Back';
        btn.href = '#';
        btn.setAttribute('aria-label', 'Go back');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (history.length > 1) history.back();
            else window.location.href = '../index.html';
        });
        navLinks.prepend(btn);
    }

    // ── Next Project — injected before the footer ──
    function injectNextProject() {
        if (!nextProject) return;
        const footer = document.querySelector('footer');
        if (!footer) return;

        const section = document.createElement('section');
        section.className = 'next-project-section';
        section.innerHTML = `
            <p class="next-project-label">Next Project</p>
            <a href="${nextProject.href}" class="next-project-link">
                <span class="next-project-title">${nextProject.title}</span>
                <div class="next-project-arrow" aria-hidden="true"></div>
            </a>
        `;
        footer.before(section);
    }

    // ── Styles ──
    const style = document.createElement('style');
    style.textContent = `
        /* Back button — sits inline in the nav */
        .back-btn {
            font-size: 0.82rem !important;
            font-weight: 700 !important;
            color: #64748b !important;
            padding: 6px 14px !important;
            border: 1.5px solid #e2e8f0;
            border-radius: 99px;
            text-decoration: none !important;
            transition: all 0.2s ease;
            background: transparent;
            white-space: nowrap;
        }
        .back-btn:hover {
            border-color: #da6e30;
            color: #da6e30 !important;
            background: #fff7ed;
        }

        /* Next project section */
        .next-project-section {
            text-align: center;
            padding: 96px 24px 80px;
            border-top: 1px solid #e2e8f0;
        }
        .next-project-label {
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #94a3b8;
            margin: 0 0 20px;
        }
        .next-project-link {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            text-decoration: none;
        }
        .next-project-title {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.03em;
            transition: color 0.2s ease;
        }
        .next-project-link:hover .next-project-title {
            color: #da6e30;
        }
        .next-project-arrow {
            width: 52px;
            height: 32px;
            background-image: url("data:image/svg+xml,%3Csvg width='52' height='32' viewBox='0 0 52 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6 L26 26 L48 6' stroke='%23f97316' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.45;
            animation: nav-bounce 3.5s ease-in-out infinite;
        }
        .next-project-link:hover .next-project-arrow { opacity: 0.9; }

        @keyframes nav-bounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(9px); }
        }

        @media (max-width: 600px) {
            .next-project-title { font-size: 1.5rem; }
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', () => {
        injectBackButton();
        injectNextProject();
    });
})();
