document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Minimum display time of 1.5 seconds for better UX
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 1500);
        });
    }
    
    // 1. Custom Cursor (#11)
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        // Only enable on non-touch devices
        if (window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
            
            // Add hover effect on interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .project-card, .value-card');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
            });
        } else {
            cursor.style.display = 'none';
        }
    }
    
    // 2. Particle Background (#12) - Keeping existing dot pattern
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.fillStyle = `rgba(217, 48, 37, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(217, 48, 37, ${0.1 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }
    
    // 3. Language Switcher (#19) - Full Implementation
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langCurrent = document.querySelector('.lang-current');
    
    // Translation Dictionary
    const translations = {
        en: {
            // Navigation
            about: 'About',
            work: 'Work',
            values: 'Values',
            github: 'GitHub',
            // Hero
            heroTitle: 'Curiosity. Code. Craft.',
            heroDesc: 'Luminus Labs is a human-scale workshop where ideas are sketched, tested, and refined. A team of creators building honest tools at the intersection of design and engineering.',
            viewProjects: 'View Projects',
            meetTeam: 'Meet the Team',
            // Team Section
            teamTitle: 'The Team',
            founder: 'Founder / Developer',
            developer: 'Developer',
            tester: 'Tester / Outreach',
            graphicDesign: 'Graphic Design / Web Testing',
            joinCommunity: 'Join the Community',
            moreToCome: 'More to Come',
            teamDesc: "We're always looking for creative minds to join our workshop. If you're interested in building honest tools at the intersection of design and engineering, reach out and say hello.",
            getInTouch: 'Get in Touch',
            viewGithub: 'View GitHub',
            // Focus Section
            focusTitle: 'Current Focus',
            activeDevelopment: 'Active Development',
            fluxOSDesc: 'Flux-OS is a 32-bit, hobbyist operating system written from scratch in C and x86 Assembly. It aims to be a "Nothing OS" inspired desktop environment—minimalist, typography-driven, and philosophically bare metal.',
            fluxOSVision: 'Vision:',
            fluxOSVisionText: 'To create a desktop experience that feels like a digital instrument cluster. No bloat. No clutter. Just raw interaction between user and machine.',
            fluxOSCurrent: 'Currently in Pre-Alpha, the system boots successfully via GRUB into a protected-mode kernel. It features a custom software rasterizer (GFX) and a philosophy that exposes the Multiboot memory maps and interrupt descriptor tables to the user.',
            fluxOSQuote: '"The void is not empty. It is full of potential."',
            visitSite: 'Visit Site',
            viewRepo: 'View Repo',
            // Projects Section
            projectsTitle: 'From the Bench',
            fluxOS: 'Flux-OS',
            fluxOSSys: 'Systems Programming / Assembly',
            fluxOSProjectDesc: 'A "Nothing OS" inspired desktop environment. Minimalist, typography-driven, and philosophically bare metal.',
            viewLiveSite: 'View Live Site',
            nextBeat: 'NextBeat',
            nextBeatSocial: 'Social / Real-time',
            nextBeatDesc: 'A social music platform built for moments, not algorithms. A democratic queue system where every guest contributes exactly one song.',
            viewProject: 'View Project',
            petPaths: 'Pet Paths',
            petPathsComm: 'Community / Safety',
            petPathsDesc: 'A mapping tool that treats local experience as expertise. It turns fragmented knowledge about local routes into shared, useful safety data.',
            visitLiveSite: 'Visit Live Site',
            // Values Section
            approachTitle: 'The Approach',
            clarityTitle: 'Clarity & Restraint',
            clarityText: 'Interfaces that feel calm, intentional, and honest. Avoiding visual noise in favor of thoughtful simplicity, letting typography breathe.',
            fundamentalsTitle: 'Fundamentals First',
            fundamentalsText: 'Respecting clean structure and maintainable code. Well-considered simplicity often outperforms unnecessary complexity.',
            humanScaleTitle: 'Human Scale',
            humanScaleText: 'A workshop, not a factory. Every project is cared for deeply, with long hours spent refining small decisions rather than cutting corners.',
            // Footer
            interestedProcess: 'Interested in the process?',
            followGithub: 'Follow on GitHub',
            copyright: 'Built by the team with care.'
        },
        es: {
            about: 'Acerca de',
            work: 'Trabajo',
            values: 'Valores',
            github: 'GitHub',
            heroTitle: 'Curiosidad. Código. Artesanía.',
            heroDesc: 'Luminus Labs es un taller a escala humana donde las ideas se esbozan, prueban y refinan. Un equipo de creadores construyendo herramientas honestas en la intersección del diseño y la ingeniería.',
            viewProjects: 'Ver Proyectos',
            meetTeam: 'Conocer al Equipo',
            teamTitle: 'El Equipo',
            founder: 'Fundador / Desarrollador',
            developer: 'Desarrollador',
            tester: 'Probador / Comunicación',
            graphicDesign: 'Diseño Gráfico / Pruebas Web',
            joinCommunity: 'Únete a la Comunidad',
            moreToCome: 'Más por Venir',
            teamDesc: 'Siempre buscamos mentes creativas para nuestro taller. Si te interesa construir herramientas honestas en la intersección del diseño y la ingeniería, contáctanos.',
            getInTouch: 'Contáctanos',
            viewGithub: 'Ver GitHub',
            focusTitle: 'Enfoque Actual',
            activeDevelopment: 'Desarrollo Activo',
            fluxOSDesc: 'Flux-OS es un sistema operativo hobby de 32 bits escrito desde cero en C y Ensamblador x86. Busca ser un entorno de escritorio inspirado en "Nothing OS"—minimalista, impulsado por la tipografía y filosóficamente metal desnudo.',
            fluxOSVision: 'Visión:',
            fluxOSVisionText: 'Crear una experiencia de escritorio que se sienta como unCluster digital. Sin bloat. Sin desorden. Solo interacción cruda entre usuario y máquina.',
            fluxOSCurrent: 'Actualmente en Pre-Alfa, el sistema arranca exitosamente vía GRUB en un kernel en modo protegido. Cuenta con un rasterizador software personalizado (GFX) y una filosofía que expone los mapas de memoria Multiboot y las tablas de descriptores de interrupción al usuario.',
            fluxOSQuote: '"El vacío no está vacío. Está lleno de potencial."',
            visitSite: 'Visitar Sitio',
            viewRepo: 'Ver Repositorio',
            projectsTitle: 'Del Banco',
            fluxOS: 'Flux-OS',
            fluxOSSys: 'Programación de Sistemas / Ensamblador',
            fluxOSProjectDesc: 'Un entorno de escritorio inspirado en "Nothing OS". Minimalista, impulsado por la tipografía y filosóficamente metal desnudo.',
            viewLiveSite: 'Ver Sitio en Vivo',
            nextBeat: 'NextBeat',
            nextBeatSocial: 'Social / Tiempo Real',
            nextBeatDesc: 'Una plataforma social de música construida para momentos, no algoritmos. Un sistema de cola democrático donde cada huésped contribuye exactamente una canción.',
            viewProject: 'Ver Proyecto',
            petPaths: 'Pet Paths',
            petPathsComm: 'Comunidad / Seguridad',
            petPathsDesc: 'Una herramienta de mapeo que trata la experiencia local como expertise. Transforma el conocimiento fragmentado sobre rutas locales en datos de seguridad compartidos y útiles.',
            visitLiveSite: 'Visitar Sitio en Vivo',
            approachTitle: 'El Enfoque',
            clarityTitle: 'Claridad y Contención',
            clarityText: 'Interfaces que se sienten calmadas, intencionales y honestas. Evitando el ruido visual en favor de la simplicidad reflexiva, dejando respirar a la tipografía.',
            fundamentalsTitle: 'Fundamentos Primero',
            fundamentalsText: 'Respetando la estructura limpia y el código mantenible. La simplicidad bien considerada a menudo supera a la complejidad innecesaria.',
            humanScaleTitle: 'Escala Humana',
            humanScaleText: 'Un taller, no una fábrica. Cada proyecto se cuida profundamente, con largas horas refinando pequeñas decisiones en lugar de tomar atajos.',
            interestedProcess: '¿Interesado en el proceso?',
            followGithub: 'Seguir en GitHub',
            copyright: 'Construido por el equipo con cuidado.'
        },
        fr: {
            about: 'À propos',
            work: 'Projets',
            values: 'Valeurs',
            github: 'GitHub',
            heroTitle: 'Curiosité. Code. Savoir-faire.',
            heroDesc: "Luminus Labs est un atelier à échelle humaine où les idées sont esquissées, testées et affinées. Une équipe de créateurs construisant des outils honnêtes à l'intersection du design et de l'ingénierie.",
            viewProjects: 'Voir les Projets',
            meetTeam: 'Rencontrer l\'Équipe',
            teamTitle: "L'Équipe",
            founder: 'Fondateur / Développeur',
            developer: 'Développeur',
            tester: 'Testeur / Communication',
            graphicDesign: 'Design Graphique / Tests Web',
            joinCommunity: 'Rejoindre la Communauté',
            moreToCome: 'Plus à Venir',
            teamDesc: "Nous recherchons toujours des esprits créatifs pour notre atelier. Si vous êtes intéressé par la construction d'outils honnêtes à l'intersection du design et de l'ingénierie, contactez-nous.",
            getInTouch: 'Contactez-nous',
            viewGithub: 'Voir GitHub',
            focusTitle: 'Focus Actuel',
            activeDevelopment: 'Développement Actif',
            fluxOSDesc: "Flux-OS est un système d'exploitation hobby 32 bits écrit from scratch en C et Assembly x86. Il vise à être un environnement de bureau inspiré du 'Nothing OS'—minimaliste, piloté par la typographie et philosophiquement bare metal.",
            fluxOSVision: 'Vision :',
            fluxOSVisionText: "Créer une expérience de bureau qui ressemble à un cluster numérique. Pas de bloat. Pas de désordre. Juste une interaction brute entre utilisateur et machine.",
            fluxOSCurrent: "En Pre-Alpha actuellement, le système boot avec succès via GRUB dans un kernel en mode protégé. Il dispose d'un rasterizer logiciel personnalisé (GFX) et d'une philosophie qui expose les cartes mémoire Multiboot et les tables de descripteurs d'interruption à l'utilisateur.",
            fluxOSQuote: '"Le vide n\'est pas vide. Il est plein de potentiel."',
            visitSite: 'Voir le Site',
            viewRepo: 'Voir le Repo',
            projectsTitle: 'Du Banc',
            fluxOS: 'Flux-OS',
            fluxOSSys: 'Programmation Système / Assembly',
            fluxOSProjectDesc: "Un environnement de bureau inspiré du 'Nothing OS'. Minimaliste, piloté par la typographie et philosophiquement bare metal.",
            viewLiveSite: 'Voir le Site',
            nextBeat: 'NextBeat',
            nextBeatSocial: 'Social / Temps Réel',
            nextBeatDesc: "Une plateforme musicale sociale construite pour les moments, pas les algorithmes. Un système de file d'attente démocratique où chaque invité contribue exactement une chanson.",
            viewProject: 'Voir le Projet',
            petPaths: 'Pet Paths',
            petPathsComm: 'Communauté / Sécurité',
            petPathsDesc: "Un outil de cartographie qui traite l'expérience locale comme expertise. Il transforme les connaissances fragmentées sur les routes locales en données de sécurité partagées et utiles.",
            visitLiveSite: 'Voir le Site',
            approachTitle: 'L\'Approche',
            clarityTitle: 'Clarté et Restrainte',
            clarityText: "Des interfaces qui se sentent calmes, intentionnelles et honnêtes. Éviter le bruit visuel au profit d'une simplicité réfléchie, laisser respirer la typographie.",
            fundamentalsTitle: 'Fondamentaux en Premier',
            fundamentalsText: "Respecter la structure propre et le code maintenable. La simplicité bien pensée surpasse souvent la complexité inutile.",
            humanScaleTitle: 'Échelle Humaine',
            humanScaleText: "Un atelier, pas une usine. Chaque projet est soin avec dévouement, avec de longues heures passées à affiner les petites décisions plutôt que de prendre des raccourcis.",
            interestedProcess: 'Intéressé par le processus ?',
            followGithub: 'Suivre sur GitHub',
            copyright: 'Construit par l\'équipe avec soin.'
        },
        de: {
            about: 'Über uns',
            work: 'Arbeit',
            values: 'Werte',
            github: 'GitHub',
            heroTitle: 'Neugier. Code. Handwerk.',
            heroDesc: 'Luminus Labs ist eine Werkstatt in menschlichem Maßstab, wo Ideen skizziert, getestet und verfeinert werden. Ein Team von Schöpfern, das ehrliche Tools an der Schnittstelle von Design und Ingenieurwesen baut.',
            viewProjects: 'Projekte Ansehen',
            meetTeam: 'Team Kennenlernen',
            teamTitle: 'Das Team',
            founder: 'Gründer / Entwickler',
            developer: 'Entwickler',
            tester: 'Tester / Öffentlichkeitsarbeit',
            graphicDesign: 'Grafikdesign / Web-Tests',
            joinCommunity: 'Der Community Beitreten',
            moreToCome: 'Mehr Kommt',
            teamDesc: 'Wir suchen immer nach kreativen Köpfen für unsere Werkstatt. Wenn Sie daran interessiert sind, ehrliche Tools an der Schnittstelle von Design und Ingenieurwesen zu bauen, kontaktieren Sie uns.',
            getInTouch: 'Kontaktieren',
            viewGithub: 'GitHub Ansehen',
            focusTitle: 'Aktueller Fokus',
            activeDevelopment: 'Aktive Entwicklung',
            fluxOSDesc: 'Flux-OS ist ein 32-Bit-Hobby-Betriebssystem von Grund auf in C und x86-Assembly geschrieben. Es strebt eine "Nothing OS"-inspirierte Desktop-Umgebung an—minimalistisch, typografiegetrieben und philosophisch Bare-Metal.',
            fluxOSVision: 'Vision:',
            fluxOSVisionText: 'Ein Desktop-Erlebnis zu schaffen, das sich wie ein digitales Instrumenten-Cluster anfühlt. Kein Bloat. Kein Durcheinander. Rohe Interaktion zwischen Benutzer und Maschine.',
            fluxOSCurrent: 'Derzeit in Pre-Alpha, das System bootet erfolgreich über GRUB in einen Protected-Mode-Kernel. Es verfügt über einen benutzerdefinierten Software-Rasterizer (GFX) und eine Philosophie, die die Multiboot-Speicherkarten und Interrupt-Deskriptortabellen dem Benutzer expose.',
            fluxOSQuote: '"Die Leere ist nicht leer. Sie ist voller Potenzial."',
            visitSite: 'Site Besuchen',
            viewRepo: 'Repo Ansehen',
            projectsTitle: 'Vom Werkbank',
            fluxOS: 'Flux-OS',
            fluxOSSys: 'Systemprogrammierung / Assembly',
            fluxOSProjectDesc: 'Eine "Nothing OS"-inspirierte Desktop-Umgebung. Minimalistisch, typografiegetrieben und philosophisch Bare-Metal.',
            viewLiveSite: 'Live-Site Ansehen',
            nextBeat: 'NextBeat',
            nextBeatSocial: 'Sozial / Echtzeit',
            nextBeatDesc: 'Eine soziale Musikplattform für Momente, nicht Algorithmen. Ein demokratisches Warteschlangensystem, bei dem jeder Gast genau ein Lied beisteuert.',
            viewProject: 'Projekt Ansehen',
            petPaths: 'Pet Paths',
            petPathsComm: 'Gemeinschaft / Sicherheit',
            petPathsDesc: 'Ein Mapping-Tool, das lokale Erfahrung als Expertise behandelt. Es wandelt fragmentiertes Wissen über lokale Routen in geteilte, nützliche Sicherheitsdaten um.',
            visitLiveSite: 'Live-Site Besuchen',
            approachTitle: 'Der Ansatz',
            clarityTitle: 'Klarheit & Zurückhaltung',
            clarityText: 'Schnittstellen, die sich ruhig, absichtlich und ehrlich anfühlen. Visuelles Rauschen zugunsten von durchdachter Einfachheit vermeiden, der Typografie Raum zum Atmen geben.',
            fundamentalsTitle: 'Grundlagen Zuerst',
            fundamentalsText: 'Saubere Struktur und wartbaren Code respektieren. Gut durchdachte Einfachheit übertrumpft oft unnötige Komplexität.',
            humanScaleTitle: 'Menschliche Skala',
            humanScaleText: 'Eine Werkstatt, keine Fabrik. Jedes Projekt wird tiefgehend gepflegt, mit langen Stunden, in denen kleine Entscheidungen verfeinert werden, anstatt Abkürzungen zu nehmen.',
            interestedProcess: 'Am Prozess interessiert?',
            followGithub: 'GitHub Folgen',
            copyright: 'Vom Team mit Sorgfalt gebaut.'
        },
        ja: {
            about: '概要',
            work: '実績',
            values: '価値観',
            github: 'GitHub',
            heroTitle: '好奇心。コード。匠。',
            heroDesc: 'Luminus Labsはアイデアが描かれ、テストされ、磨かれる人間規模のワークショップです。デザインとエンジニアリングの境界目で正直なツールを構築するクリエイターたちのチームです。',
            viewProjects: 'プロジェクトを見る',
            meetTeam: 'チームに会う',
            teamTitle: 'チーム',
            founder: '創業者/開発者',
            developer: '開発者',
            tester: 'テスター/アウトリーチ',
            graphicDesign: 'グラフィックデザイン/Webテスト',
            joinCommunity: 'コミュニティに参加',
            moreToCome: 'さらなるharapkan',
            teamDesc: '私たちは常にワークショップに加わるクリエイティブマインドを探しています。デザインとエンジニアリングの境界目で正直なツール構築に興味があるなら、ぜひご連絡ください。',
            getInTouch: 'お問い合わせ',
            viewGithub: 'GitHubを見る',
            focusTitle: '現在の焦点',
            activeDevelopment: 'アクティブ開発',
            fluxOSDesc: 'Flux-OSはCとx86アセンブリでゼロから書かれた32ビット趣味のオペレーティングシステムです。「Nothing OS」にインスパイアされたデスクトップ環境を目指し、ミニマリストでタイポグラフィ主導、哲学的にベアメタルの目標を掲げています。',
            fluxOSVision: 'ビジョン：',
            fluxOSVisionText: 'デジタルインストルメントクラスターのように感じるデスクトップ体験を作成すること。ブロートなし。散らかりなし。ユーザーとマシンの間の生のインタラクションのみ。',
            fluxOSCurrent: '現在プレアルファで、システムはGRUB経由でプロテクトモードカーネルに正常にブートします。カスタムソフトウェアラスタライザー（GFX）と、MultibootメモリマップとInterrupt Descriptor Tableをユーザーに公開する哲学を備えています。',
            fluxOSQuote: '"真空は空ではない。潜在力で満ちている。"',
            visitSite: 'サイト訪問',
            viewRepo: 'リポジトリを見る',
            projectsTitle: 'ベンチより',
            fluxOS: 'Flux-OS',
            fluxOSSys: 'システムプログラミング/アセンブリ',
            fluxOSProjectDesc: '「Nothing OS」にインスパイアされたデスクトップ環境。ミニマリストでタイポグラフィ主導、哲学的にベアメンタル。',
            viewLiveSite: 'ライブサイトを見る',
            nextBeat: 'NextBeat',
            nextBeatSocial: 'ソーシャル/リアルタイム',
            nextBeatDesc: 'アルゴリズムではなく瞬間のために構築されたソーシャル音楽プラットフォーム。 各ゲストが正確に1曲提供する民主的なキューシステム。',
            viewProject: 'プロジェクトを見る',
            petPaths: 'Pet Paths',
            petPathsComm: 'コミュニティ/安全',
            petPathsDesc: '地域の経験を専門知識として扱うマッピングツール。 地元のルートに関する断片的な知識を共有有用的安全データに変換します。',
            visitLiveSite: 'ライブサイトを見る',
            approachTitle: 'アプローチ',
            clarityTitle: '明確さと抑制',
            clarityText: '静かで、意図的で、正直なインターフェース。 視覚的なノイズを思慮深いシンプルさを避けることで、タイポグラフィに呼吸の機会を与えます。',
            fundamentalsTitle: '基本を優先',
            fundamentalsText: 'クリーンな構造と保守可能なコードを尊重する。 適切に考えられたシンプルさは、しばしば不必要な複雑さを上回る。',
            humanScaleTitle: '人間のスケール',
            humanScaleText: '工場ではなくワークショップ。 各プロジェクトは深い世話をされ、ショートカットを講じるのではなく、小さな決定を磨ぐために長い時間を費やす。',
            interestedProcess: 'プロセスに興味がありますか？',
            followGithub: 'GitHubでフォロー',
            copyright: 'チームが気を配って構築。'
        },
        zh: {
            about: '关于',
            work: '作品',
            values: '价值观',
            github: 'GitHub',
            heroTitle: '好奇。代码。匠心。',
            heroDesc: 'Luminus Labs是一个人性化的工作室，创意在这里被勾勒、测试和精炼。一个在设计与工程交汇处打造真诚工具的创作者团队。',
            viewProjects: '查看项目',
            meetTeam: '认识团队',
            teamTitle: '团队',
            founder: '创始人/开发者',
            developer: '开发者',
            tester: '测试/外联',
            graphicDesign: '平面设计/Web测试',
            joinCommunity: '加入社区',
            moreToCome: '更多即将到来',
            teamDesc: '我们一直在寻找有创意的头脑加入我们的工作室。如果您对在设计与工程交汇处打造真诚工具感兴趣，请联系我们。',
            getInTouch: '联系我们',
            viewGithub: '查看GitHub',
            focusTitle: '当前重点',
            activeDevelopment: '积极开发',
            fluxOSDesc: 'Flux-OS是一款从零用C和x86汇编编写的32位业余操作系统。它旨在成为一个"Nothing OS"启发的桌面环境——极简、字体驱动、哲学上属于裸机。',
            fluxOSVision: '愿景：',
            fluxOSVisionText: '创造一种感觉像数字仪表盘的桌面体验。无膨胀。无杂乱。只有用户与机器之间的原始交互。',
            fluxOSCurrent: '目前处于预Alpha阶段，系统通过GRUB成功引导进入保护模式内核。它具有自定义软件光栅化器(GFX)和一种将Multiboot内存映射和中断描述符表暴露给用户的哲学。',
            fluxOSQuote: '"虚空不是空的。它充满了潜力。"',
            visitSite: '访问网站',
            viewRepo: '查看仓库',
            projectsTitle: '工作台成果',
            fluxOS: 'Flux-OS',
            fluxOSSys: '系统编程/汇编',
            fluxOSProjectDesc: '一款"Nothing OS"启发的桌面环境。极简、字体驱动、哲学上属于裸机。',
            viewLiveSite: '查看现场演示',
            nextBeat: 'NextBeat',
            nextBeatSocial: '社交/实时',
            nextBeatDesc: '一个为时刻而非算法打造的音乐社交平台。民主队列系统，每位访客贡献一首歌。',
            viewProject: '查看项目',
            petPaths: 'Pet Paths',
            petPathsComm: '社区/安全',
            petPathsDesc: '将本地经验视为专业知识的地图工具。它将关于本地路线的碎片化知识转化为共享、有用的安全数据。',
            visitLiveSite: '访问现场演示',
            approachTitle: '方法论',
            clarityTitle: '清晰与克制',
            clarityText: '感觉平静、刻意、诚实的界面。避免视觉噪音，转向深思熟虑的简约，让字体呼吸。',
            fundamentalsTitle: '基础优先',
            fundamentalsText: '尊重清晰结构和可维护的代码。深思熟虑的简约往往优于不必要的复杂。',
            humanScaleTitle: '人性化规模',
            humanScaleText: '工作室，而非工厂。每个项目都受到深入关怀，花费大量时间精炼小决策，而非走捷径。',
            interestedProcess: '对过程感兴趣？',
            followGithub: '在GitHub上关注',
            copyright: '由团队精心打造。'
        },
        cy: {
            about: 'Amdani',
            work: 'Gwaith',
            values: 'Gwerthoedd',
            github: 'GitHub',
            heroTitle: 'Curiosrwydd. Cod. Crefft.',
            heroDesc: "Luminus Labs yn gweithdy gradd dynol lle caiff syniadau eu hesbonio, eu profi a'u perffeithio. Tîm o greaduriaethau sy'n adeiladu offer difrifol ar groestoriad dylunio a pheirianneg.",
            viewProjects: 'Gweld Prosiectau',
            meetTeam: 'Cwrdd â\'r Tîm',
            teamTitle: 'Y Tîm',
            founder: 'Sylfaenydd / Datblygwr',
            developer: 'Datblygwr',
            tester: 'Prawfwr / Ymgyrth',
            graphicDesign: 'Dylunio Graffeg / Profi Gwe',
            joinCommunity: 'Ymunwch â\'r Gymuned',
            moreToCome: 'Mwy i Ddod',
            teamDesc: "Rydym bob amser yn edrych am feddyliau creadigol i ymuno â'n gweithdy. Os ydych chi'n interest mewn adeiladu offer difrifol ar groestoriad dylunio a pheirianneg, cysylltwch â ni.",
            getInTouch: 'Cysylltwch',
            viewGithub: 'Gweld GitHub',
            focusTitle: 'Ffocus Presennol',
            activeDevelopment: 'Datblygiad Gweithredol',
            fluxOSDesc: "Flux-OS yw system weithredu hobby 32-bit wedi'i ysgrifennu o'r dechrau mewn C ac Assembly x86. Mae'n anelu at fod yn amgylchedd bwrdd gwaelod wedi'i ysbrydoli gan 'Nothing OS'—minimalistig, gyrrir gan deipograffeg ac yn athronyddol metal noeth.",
            fluxOSVision: 'Gweledigaeth:',
            fluxOSVisionText: "Creu profiad bwrdd gwaelod sy'n teimlo fel clyster offer digidol. Dim bloat. Dim anhrefn. Dim ond rhyngweithio rhwng defnyddiwr a machin.",
            fluxOSCurrent: "Ar hyn o bryd yn Pre-Alpha, mae'r system yn ymysgu'n llwyddiannus trwy GRUB i gernel modd amddiffyn. Mae'n cynnwys rastereg meddalwedd bersonol (GFX) ac athroniaeth sy'n amlygu mapiau cof Multiboot a thablau ddisgribyddion ymyrrydd i'r defnyddiwr.",
            fluxOSQuote: '"Nid yw\'r gwacter yn wag. Mae\'n llawn potensial."',
            visitSite: 'Ymweld â\'r Safle',
            viewRepo: 'Gweld Ystorfa',
            projectsTitle: "O'r Bwrdd",
            fluxOS: 'Flux-OS',
            fluxOSSys: 'Rhaglennu Systemau / Assembly',
            fluxOSProjectDesc: 'Amgylchedd bwrdd gwaelod wedi\'i ysbrydoli gan "Nothing OS". Minimalistig, gyrrir gan deipograffeg ac yn athronyddol metal noeth.',
            viewLiveSite: 'Gweld Safle Byw',
            nextBeat: 'NextBeat',
            nextBeatSocial: 'Cymdeithasol / Amser Real',
            nextBeatDesc: 'Lleoliad cerddoriaeth cymdeithasol wedi\'i adeiladu ar gyfer momentau, nid algorithmau. System ciw democratig lle mae pob gwesteiwr yn cyfrannu un cân yn union.',
            viewProject: 'Gweld Prosiect',
            petPaths: 'Pet Paths',
            petPathsComm: 'Cymuned / Diogelwch',
            petPathsDesc: "Offer mapio sy'n trin profiad lleol fel arbenigodd. Mae'n trosi gwybodaeth dameidig am lwybrau lleol yn ddata diogeldeb cydrannol a defnyddiol.",
            visitLiveSite: 'Ymweld â\'r Safle Byw',
            approachTitle: 'Y Dull',
            clarityTitle: 'Clirdeb a Ymataliad',
            clarityText: 'Rhyngwynebau sy\'n teimlo\'n dawel, bwriadol, a difrifol. Osgoi sŵn gweledol er mantais symlrwydd meddwl, gan adael i deipograffeg anadlu.',
            fundamentalsTitle: 'Sylfeiriwaith yn Gyntaf',
            fundamentalsText: "Parchu strwythur glân a chod cynnal. Mae symlrwydd meddwl yn aml yn gorchfygu cymhlethdod diangen.",
            humanScaleTitle: 'Gradd Dynol',
            humanScaleText: "Gweithdy, nid ffatri. Caiff pob prosiect ei ofalu'n ddwfn, gyda oriau hir yn treulio perffeithio penderfyniadau bach yn hytrach nag torri corneli.",
            interestedProcess: 'Ydyn ni\'n dal i ffwrdd?',
            followGithub: 'Dilyn ar GitHub',
            copyright: 'Adeiladwyd gan y tîm gyda gofal.'
        }
    };
    
    // Language display names and flags
    const langNames = {
        'en': 'EN', 'es': 'ES', 'fr': 'FR', 'de': 'DE',
        'ja': 'JA', 'zh': 'ZH', 'cy': 'CY'
    };
    
    // Language flag SVG sources
    const langFlags = {
        'en': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23012169'/%3E%3Cpath d='M0 0l60 40M60 0L0 40' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0 0l60 40M60 0L0 40' stroke='%23C8102E' stroke-width='2'/%3E%3Crect width='60' height='20' fill='%23fff'/%3E%3Crect x='25' y='0' width='10' height='40' fill='%23fff'/%3E%3Crect width='60' height='20' fill='%23C8102E'/%3E%3Crect x='25' y='0' width='10' height='40' fill='%23C8102E'/%3E%3C/svg%3E",
        'es': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23AA151B'/%3E%3Crect y='10' width='60' height='20' fill='%23F1BF00'/%3E%3Crect width='60' height='40' fill='none' stroke='%23AA151B' stroke-width='1'/%3E%3C/svg%3E",
        'fr': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%230020A0'/%3E%3Crect width='20' height='40' fill='%23fff'/%3E%3Crect x='40' width='20' height='40' fill='%23ED2939'/%3E%3C/svg%3E",
        'de': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23000'/%3E%3Crect width='60' height='13.33' fill='%23DD0000'/%3E%3Crect width='60' y='26.66' height='13.33' fill='%23FFCE00'/%3E%3C/svg%3E",
        'ja': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23fff'/%3E%3Ccircle cx='30' cy='20' r='10' fill='%23BC002D'/%3E%3C/svg%3E",
        'zh': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23DE2910'/%3E%3Cpath d='M15 5l2.5 7.5h8l-6.5 4.5 2.5 7.5-6.5-4.5-6.5 4.5 2.5-7.5-6.5-4.5h8z' fill='%23FFDE00'/%3E%3C/svg%3E",
        'cy': "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23fff'/%3E%3Crect width='60' height='8' fill='%23D13737'/%3E%3Crect y='16' width='60' height='8' fill='%23fff'/%3E%3Crect y='32' width='60' height='8' fill='%232C6B2F'/%3E%3Crect width='60' height='2' fill='%23000'/%3E%3Crect y='6' width='60' height='2' fill='%23000'/%3E%3Crect y='14' width='60' height='2' fill='%23000'/%3E%3Crect y='24' width='60' height='2' fill='%23000'/%3E%3Crect y='30' width='60' height='2' fill='%23000'/%3E%3Crect y='38' width='60' height='2' fill='%23000'/%3E%3C/svg%3E"
    };
    
    // Check URL for language or use saved preference
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && translations[urlLang]) {
            return urlLang;
        }
        const savedLang = localStorage.getItem('language');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        return 'en';
    }
    
    // Update language without page reload
    function setLanguage(lang) {
        if (!translations[lang]) return;
        
        // Save to localStorage
        localStorage.setItem('language', lang);
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
        
        // Update button flag image
        const langBtnFlag = document.querySelector('.lang-current-flag');
        if (langBtnFlag && langFlags[lang]) {
            langBtnFlag.src = langFlags[lang];
        }
        
        // Apply translations to page
        applyTranslations(lang);
        
        // Update hreflang links
        document.querySelectorAll('link[hreflang]').forEach(link => {
            const langCode = link.getAttribute('hreflang');
            const baseUrl = window.location.href.split('?')[0];
            link.setAttribute('href', `${baseUrl}?lang=${langCode}`);
        });
    }
    
    // Apply translations to the page
    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;
        
        // Navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks[0]) navLinks[0].textContent = t.about;
        if (navLinks[1]) navLinks[1].textContent = t.work;
        if (navLinks[2]) navLinks[2].textContent = t.values;
        if (navLinks[3]) navLinks[3].textContent = t.github;
        
        // Hero Section
        const heroTitle = document.querySelector('.hero-text h1');
        if (heroTitle) heroTitle.textContent = t.heroTitle;
        const heroDesc = document.querySelector('.hero-text p');
        if (heroDesc) heroDesc.textContent = t.heroDesc;
        const heroActions = document.querySelectorAll('.hero-actions .btn');
        if (heroActions[0]) heroActions[0].textContent = t.viewProjects;
        if (heroActions[1]) heroActions[1].textContent = t.meetTeam;
        
        // Team Section
        const teamTitle = document.querySelector('#about .section-title');
        if (teamTitle) teamTitle.textContent = t.teamTitle;
        
        const teamCards = document.querySelectorAll('#about .project-card');
        const teamRoles = document.querySelectorAll('#about .card-tags');
        const teamDescs = document.querySelectorAll('#about .card-desc');
        const teamLinks = document.querySelectorAll('#about .card-link');
        
        if (teamRoles[0]) teamRoles[0].textContent = t.founder;
        if (teamDescs[0]) teamDescs[0].textContent = "The original creator and founder of Luminus Labs. Systems programmer and designer building honest tools at the intersection of code and craft.";
        if (teamLinks[0]) teamLinks[0].textContent = t.viewGithub + ' →';
        
        if (teamRoles[1]) teamRoles[1].textContent = t.developer;
        if (teamDescs[1]) teamDescs[1].textContent = "Creative developer focused on bringing innovative ideas to life through code.";
        
        if (teamRoles[2]) teamRoles[2].textContent = t.tester;
        if (teamDescs[2]) teamDescs[2].textContent = "Full-stack developer passionate about building robust and elegant solutions.";
        
        if (teamRoles[3]) teamRoles[3].textContent = t.graphicDesign;
        if (teamDescs[3]) teamDescs[3].textContent = "Graphic designer and web-only tester bringing visual design and quality assurance to the team.";
        
        if (teamRoles[4]) teamRoles[4].textContent = t.joinCommunity;
        if (teamDescs[4]) teamDescs[4].textContent = t.teamDesc;
        if (teamLinks[1]) teamLinks[1].textContent = t.getInTouch + ' →';
        
        // Focus Section
        const focusTitle = document.querySelector('#focus .section-title');
        if (focusTitle) focusTitle.textContent = t.focusTitle;
        
        const cpTag = document.querySelector('.cp-tag');
        if (cpTag) cpTag.textContent = t.activeDevelopment;
        
        const cpDesc = document.querySelector('.cp-desc');
        if (cpDesc) {
            const paragraphs = cpDesc.querySelectorAll('p');
            if (paragraphs[0]) paragraphs[0].textContent = t.fluxOSDesc;
            if (paragraphs[1]) {
                paragraphs[1].innerHTML = `<strong>${t.fluxOSVision}</strong> ${t.fluxOSVisionText}`;
            }
            if (paragraphs[2]) paragraphs[2].textContent = t.fluxOSCurrent;
            if (paragraphs[3]) paragraphs[3].textContent = t.fluxOSQuote;
        }
        
        const cpFooter = document.querySelectorAll('.cp-footer .btn');
        if (cpFooter[0]) cpFooter[0].textContent = t.visitSite;
        if (cpFooter[1]) cpFooter[1].textContent = t.viewRepo;
        
        // Projects Section
        const projectsTitle = document.querySelector('#work .section-title');
        if (projectsTitle) projectsTitle.textContent = t.projectsTitle;
        
        const projectCards = document.querySelectorAll('#work .project-card');
        const projectTags = document.querySelectorAll('#work .card-tags');
        const projectTitles = document.querySelectorAll('#work .card-title');
        const projectDescs = document.querySelectorAll('#work .card-desc');
        const projectLinks = document.querySelectorAll('#work .card-link');
        
        // Flux-OS
        if (projectTags[0]) projectTags[0].textContent = t.fluxOSSys;
        if (projectTitles[0]) projectTitles[0].textContent = t.fluxOS;
        if (projectDescs[0]) projectDescs[0].textContent = t.fluxOSProjectDesc;
        if (projectLinks[0]) projectLinks[0].textContent = t.viewLiveSite + ' →';
        
        // NextBeat
        if (projectTags[1]) projectTags[1].textContent = t.nextBeatSocial;
        if (projectTitles[1]) projectTitles[1].textContent = t.nextBeat;
        if (projectDescs[1]) projectDescs[1].textContent = t.nextBeatDesc;
        if (projectLinks[1]) projectLinks[1].textContent = t.viewProject + ' →';
        
        // Pet Paths
        if (projectTags[2]) projectTags[2].textContent = t.petPathsComm;
        if (projectTitles[2]) projectTitles[2].textContent = t.petPaths;
        if (projectDescs[2]) projectDescs[2].textContent = t.petPathsDesc;
        if (projectLinks[2]) projectLinks[2].textContent = t.visitLiveSite + ' →';
        
        // Values Section
        const valuesTitle = document.querySelector('#values .section-title');
        if (valuesTitle) valuesTitle.textContent = t.approachTitle;
        
        const valueCards = document.querySelectorAll('#values .value-card');
        const valueTitles = document.querySelectorAll('#values .value-title');
        const valueTexts = document.querySelectorAll('#values .value-text');
        
        if (valueTitles[0]) valueTitles[0].textContent = t.clarityTitle;
        if (valueTexts[0]) valueTexts[0].textContent = t.clarityText;
        
        if (valueTitles[1]) valueTitles[1].textContent = t.fundamentalsTitle;
        if (valueTexts[1]) valueTexts[1].textContent = t.fundamentalsText;
        
        if (valueTitles[2]) valueTitles[2].textContent = t.humanScaleTitle;
        if (valueTexts[2]) valueTexts[2].textContent = t.humanScaleText;
        
        // Footer
        const footerCta = document.querySelector('.footer-cta h3');
        if (footerCta) footerCta.textContent = t.interestedProcess;
        
        const githubLink = document.querySelector('.github-link');
        if (githubLink) {
            const svg = githubLink.querySelector('svg');
            githubLink.textContent = '';
            if (svg) githubLink.appendChild(svg);
            githubLink.appendChild(document.createTextNode(' ' + t.followGithub));
        }
        
        const copyright = document.querySelector('.copyright');
        if (copyright) {
            copyright.innerHTML = `&copy; <span id="year"></span> Luminus Labs. ${t.copyright}`;
            document.getElementById('year').textContent = new Date().getFullYear();
        }
    }
    
    // Initialize language
    const currentLang = getCurrentLanguage();
    const langBtnFlag = document.querySelector('.lang-current-flag');
    if (langBtnFlag && langFlags[currentLang]) {
        langBtnFlag.src = langFlags[currentLang];
    }
    
    // Apply translations on page load
    applyTranslations(currentLang);
    
    // Set up language switcher click handlers
    const langDropdownLinks = document.querySelectorAll('.lang-dropdown a');
    langDropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = link.getAttribute('data-lang');
            if (lang) {
                setLanguage(lang);
            }
        });
    });
    
    // 4. Set Dynamic Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Switcher Logic
    const toggleButton = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved user preference, if any, on load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    // Toggle Event Listener
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 3. Scroll Animation Observer (With Replay Logic)
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Check if the element has the reset class
            const shouldReset = entry.target.classList.contains('animation-reset');

            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // If it's out of view and marked for reset, remove the class to replay later
                if (shouldReset) {
                    entry.target.classList.remove('is-visible');
                }
            }
        });
    }, observerOptions);

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-section, .slide-in-left, .slide-in-right, .scale-in');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});