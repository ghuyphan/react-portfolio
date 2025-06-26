import React, { useState, useEffect, useRef } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import siteLogo from './assets/logo.png';
import type { JSX } from 'react';
import './styles.css';

// --- TYPE DEFINITIONS ---
interface Project {
  name: string;
  description: string;
  img: string;
  span: 'col-span-1' | 'col-span-2';
}

interface CardData {
  id: string;
  title: string;
  content: string;
  icon: JSX.Element | null;
  logo: JSX.Element | null;
}

type Theme = 'dark' | 'light';

// --- SVG Icons ---
const CodeIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>);
const RocketIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.05-.64-.75-2.18-.85-3.05-.05z"></path><path d="M17.5 7.5c1.5-1.26 2-5 2-5s-3.74-.5-5 2c-.71.84-.7-2.3.05 3.05.64-.75-2.18-.85-3.05.05z"></path><path d="M9 10.5a2.5 2.5 0 0 0-3.5-3.5L2 10.5V12h1.5l3 3L8 19l1.5-1.5 3-3H14v-1.5l-3.5-3.5z"></path></svg>);
const ArrowRightIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>);
const FptLogo: React.FC = () => ( <img src="https://www.blackduck.com/resources/case-studies/fpt-software/_jcr_content/root/synopsyscontainer/column/colRight/image.coreimg.82.1200.png/1721182554773/fpt-software-logo.png" alt="FPT Software Logo" width="96" height="36" style={{ objectFit: 'contain' }}/> );
const HahahoLogo: React.FC = () => ( <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg"> <path d="M10 10 H 30 V 90 H 10 V 10 M 40 10 H 60 V 50 H 40 V 10 M 40 60 H 60 V 90 H 40 V 60 M 70 10 H 90 V 90 H 70 V 10" /> </svg> );
const LinkedInIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const GithubIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>);
const TwitterIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>);
const MailIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
// --- Data (UPDATED) ---
const projects: Project[] = [
    { name: 'Orange Pass', description: 'A secure QR code management system for seamless event check-ins.', img: 'https://placehold.co/800x600/020617/a5b4fc?text=Orange+Pass', span: 'col-span-2' },
    { name: 'Spending Tracker', description: 'A personal finance companion with smart categorization and data viz.', img: 'https://placehold.co/800x600/020617/a5b4fc?text=Tracker', span: 'col-span-1' },
    { name: 'Engleash', description: 'A language learning app using bite-sized videos to improve retention.', img: 'https://placehold.co/800x600/020617/a5b4fc?text=Engleash', span: 'col-span-1' },
    { name: 'Social Mapping', description: 'Discover and share locations with friends in real-time.', img: 'https://placehold.co/800x600/020617/a5b4fc?text=Social+Map', span: 'col-span-2' },
];

const cardsData: CardData[] = [
    { id: 'skills', title: 'My Tech Arsenal', content: 'From React Native to SAP ABAP, I love exploring different tech stacks. Currently focused on TypeScript and building scalable mobile experiences with Redux.', icon: <CodeIcon />, logo: null },
    { id: 'projects', title: 'Personal Projects', content: 'I build apps that solve real-world problems. Each project is an opportunity to refine my skills in user experience and product design.', icon: <RocketIcon />, logo: null },
    { id: 'hahaho', title: 'HAHAHO Digital (2022)', content: 'As a Business Analyst, I learned to translate complex business needs into actionable technical specifications, bridging the gap between stakeholders and developers.', icon: null, logo: <HahahoLogo/> },
    { id: 'fpt', title: 'FPT Software (2022-Present)', content: 'Currently developing enterprise-grade solutions, from SAP Fiori apps to Salesforce Lightning Web Components. Focused on creating intuitive and maintainable systems.', icon: null, logo: <FptLogo /> },
].reverse();

const trans = (r: number, s: number): string => `perspective(1500px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

// --- UPDATED Logo Component ---
const SimpleLogo: React.FC = () => (
    <img 
        src={siteLogo}  // Use the imported variable here
        alt="Site Logo" 
        width="32" 
        height="32"
        style={{ borderRadius: '6px' }}
    />
);

// --- Page Components ---
interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
    isScrolled: boolean;
}
const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, isScrolled }) => {
    const scrollToFooter = () => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    const headerClassName = `app-header ${isScrolled ? 'scrolled' : ''}`;
    return (
        <header className={headerClassName}>
            <div className="header-inner"><a href="#" className="header-logo-link" aria-label="Home"><SimpleLogo /></a><nav className="header-nav"><a href="#about" className="header-link">ABOUT</a><button onClick={scrollToFooter} className="header-link">CONTACT</button><button onClick={onToggleTheme} className="animated-theme-toggle" data-theme={theme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><div className="icons-wrapper"><div className="icon">☀️</div><div className="icon">🌙</div></div></button></nav></div>
        </header>
    );
}

// --- UPDATED Footer Component ---
const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer id="footer" className="app-footer">
            <div className="footer-inner">
                <div className="footer-copyright">
                    © {currentYear} Gia Huy Phan. All Rights Reserved.
                </div>
                <div className="footer-right-group">
                    <a href="#about" className="footer-link">ABOUT</a>
                    <div className="footer-socials">
                        <a href="https://github.com/ghuyphan" target="_blank" rel="noopener noreferrer" className="footer-icon-link" aria-label="Github"><GithubIcon /></a>
                        <a href="https://linkedin.com/in/giahuyphan" target="_blank" rel="noopener noreferrer" className="footer-icon-link" aria-label="LinkedIn"><LinkedInIcon /></a>
                        <a href="https://x.com/your_handle" target="_blank" rel="noopener noreferrer" className="footer-icon-link" aria-label="Twitter"><TwitterIcon /></a>
                        <a href="https://www.instagram.com/your_handle" target="_blank" rel="noopener noreferrer" className="footer-icon-link" aria-label="Instagram"><MailIcon /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- Deck Component (No Changes) ---
function Deck() {
    const deckRef = useRef<HTMLDivElement>(null);
    const [gone] = useState<Set<number>>(() => new Set());
const [props, api] = useSprings(cardsData.length, i => ({
    x: i * 10, y: 0, scale: 1, rot: 0, opacity: 1,
}));

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const deckTop = deckRef.current?.offsetTop ?? 0;
            const deckHeight = deckRef.current?.offsetHeight ?? 0;
            const windowHeight = window.innerHeight;

            if (scrollY + windowHeight > deckTop && scrollY < deckTop + deckHeight) {
                const scrollProgress = (scrollY + windowHeight - deckTop) / (deckHeight + windowHeight);
                api.start(i => {
                    if (gone.has(i)) return;
                    const y = -scrollProgress * (cardsData.length - 1 - i) * 30;
                    const scale = 1 - scrollProgress * 0.05 * (cardsData.length - 1 - i);
                    return { y, scale };
                });
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [api, gone]);
    
    const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
        const trigger = vx > 0.2;
        const dir = xDir < 0 ? -1 : 1;
        if (index === undefined) return;
        if (!active && trigger) gone.add(index);
        api.start(i => {
            if (index !== i) return;
            const isGone = gone.has(index);
            const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0;
            const rot = mx / 100 + (isGone ? dir * 10 * vx : 0);
            const scale = active ? 1.1 : 1;
            return { x, rot, scale, config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 } };
        });

        if (!active && gone.size === cardsData.length) {
            setTimeout(() => {
                gone.clear();
                api.start(() => ({ x: 0, rot: 0, scale: 1 }));
            }, 600);
        }
    });

    return (
        <div className="deck-container" ref={deckRef}>
            {props.map(({ x, y, rot, scale, opacity }, i) => (
                <animated.div className="card-flipper" key={i} style={{ x, y, zIndex: cardsData.length - i, opacity: opacity }}>
                    <animated.div {...bind(i)} className="card-content" style={{ transform: interpolate([rot, scale], trans) }}>
                        <div className="card-icon">{cardsData[i].logo || cardsData[i].icon}</div>
                        <h2 className="card-title">{cardsData[i].title}</h2>
                        <p className="card-paragraph">{cardsData[i].content}</p>
                    </animated.div>
                </animated.div>
            ))}
        </div>
    );
}

// --- Other Components (No Changes) ---
function ProjectsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }); },
            { root: null, rootMargin: '0px', threshold: 0.1 }
        );
        const elements = Array.from(sectionRef.current.children);
        elements.forEach((el) => observer.observe(el));
        return () => elements.forEach((el) => { if (el) observer.unobserve(el) });
    }, []);

    return (
        <section id="projects" className="projects-section-container">
            <div className="projects-title-wrapper"><h2 className="section-title">Things I've Built</h2></div>
            <div className="bento-grid" ref={sectionRef}>
                {projects.map((project, index) => (
                    <a href="#" key={index} className={`bento-card ${project.span}`} style={{ transitionDelay: `${index * 100}ms` }}>
                        <img src={project.img} alt={project.name} className="bento-card-bg" />
                        <div className="bento-card-content">
                            <p className="bento-card-title">{project.name}</p>
                            <div className="bento-card-arrow"><ArrowRightIcon /></div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

function AboutSection() {
    return (
        <section id="about" className="about-section">
            <h2 className="section-title">My Story</h2>
            <p>My coding journey started back in 2022 when I landed my first role as a Business Analyst at HAHAHO Digital. There's something magical about being the bridge between "what the business wants" and "what the code can do" - and I was hooked. Since then, I've spent over 3 years diving deep into different worlds: from building enterprise SAP Fiori applications to crafting Lightning Web Components at Salesforce.</p>
            <p>What drives me? It's that moment when complex business requirements suddenly click into elegant, maintainable code. Whether I'm optimizing ABAP performance, designing RESTful APIs, or building mobile apps with React Native, I'm always thinking about the human on the other side of the screen. Code isn't just logic - it's communication, and I love making that conversation as smooth as possible.</p>
        </section>
    );
}

// --- Main App Component ---
export default function App() {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = window.localStorage.getItem('theme') as Theme;
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => { if (!window.localStorage.getItem('theme')) { setTheme(e.matches ? 'dark' : 'light'); } };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); };
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        window.localStorage.setItem('theme', newTheme);
    };

    useEffect(() => { document.body.className = `theme-${theme}`; }, [theme]);

    return (
        <div className="app-container">
            <Header theme={theme} onToggleTheme={toggleTheme} isScrolled={isScrolled} />
            <main className="main-content">
                <div className="intro-container">
                    <h1 className="intro-title">Hey, I'm Gia Huy</h1>
                    <div className="intro-emoji">👋</div>
                    <p className="intro-subtitle">Welcome to my digital space! I'm a developer who's been on quite the journey - from translating business dreams into tech reality at startups, to building enterprise SAP solutions, and now crafting Salesforce magic. When I'm not at work, you'll find me tinkering with React Native apps that (hopefully) make life a little easier.</p>
                </div>
                <Deck />
                <AboutSection />
                <ProjectsSection />
            </main>
            <Footer />
        </div>
    );
}