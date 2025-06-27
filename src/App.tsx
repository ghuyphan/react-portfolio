import React, { useState, useEffect, useRef } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

// Asset Imports
import siteLogo from './assets/logo.png';
import fptLogoAsset from './assets/fpt-logo.png';
import expoLogoAsset from './assets/expo-logo.svg';
import sapUI5LogoAsset from './assets/sapUi5-logo.svg';

import type { JSX } from 'react';
import './styles.css';

// --- TYPE DEFINITIONS ---
interface Project {
  name: string;
  description: string;
  icon: JSX.Element;
  span: 'col-span-1' | 'col-span-2';
  link: string;
}

interface CardData {
  id: string;
  title: string;
  content: string;
  icon: JSX.Element | null;
  logo: JSX.Element | null;
}

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  isScrolled: boolean;
}

type Theme = 'dark' | 'light';

// --- A REUSABLE HOOK FOR ANIMATING SECTIONS ON SCROLL ---
const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};


// --- REFINED SVG ICONS ---
const CodeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const RocketIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.05-.64-.75-2.18-.85-3.05-.05z"></path>
        <path d="M12 2s5 2 5 9c0 3-2 6-2 6s-3-2-6-2-6 2-6 2-2-3-2-6c0-7 5-9 5-9z"></path>
        <path d="M12 12h.01"></path>
    </svg>
);

const ArrowRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

// --- NEW PROJECT ICON PLACEHOLDER ---
const ProjectIconPlaceholder: React.FC = () => (
    <div className="project-icon-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    </div>
);


const LinkedInIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const GithubIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const TwitterIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

const MailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

// --- LOGO COMPONENTS ---
const LogoImage: React.FC<{ src: string, alt: string, className?: string }> = ({ src, alt, className = '' }) => (
    <img src={src} alt={alt} loading="lazy" className={`tech-logo-img ${className}`} />
);

const FptLogo: React.FC = () => (
    <div className="company-logo-wrapper">
        <img src={fptLogoAsset} alt="FPT Software Logo" className="company-logo" />
    </div>
);

const HahahoLogo: React.FC = () => (
    <div className="company-logo-wrapper">
        <div className="hahaho-logo-placeholder">
            <span>HAHAHO</span>
        </div>
    </div>
);

const HtmlLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" alt="HTML5 Logo" />;
const CssLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" alt="CSS3 Logo" />;
const ReactLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png" alt="React Logo" />;
const ReactNativeLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png" alt="React Native Logo" />;
const ExpoLogo: React.FC = () => <LogoImage src={expoLogoAsset} alt="Expo Logo" className="expo-logo-img" />;
const TypeScriptLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TypeScript Logo" />;
const JavaScriptLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript Logo" />;
const NodeLogo: React.FC = () => <LogoImage src="https://cdn.iconscout.com/icon/free/png-256/free-node-js-1174925.png" alt="Node.js Logo" />;
const ReduxLogo: React.FC = () => <LogoImage src="https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.png" alt="Redux Logo" />;
const SqlLogo: React.FC = () => <LogoImage src="https://images.icon-icons.com/2699/PNG/512/sqlite_logo_icon_169724.png" alt="SQL Logo" />;
const GitLogo: React.FC = () => <LogoImage src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" alt="Git Logo" />;
const SapUi5Logo: React.FC = () => <LogoImage src={sapUI5LogoAsset} alt="SAPUI5 Logo" className="sapui5-logo-img" />;
const SapAbapLogo: React.FC = () => <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" alt="SAP ABAP Logo" />;

// --- DATA ---
const projects: Project[] = [
  {
    name: 'Orange Pass',
    description: 'A secure QR code management system for seamless event check-ins.',
    icon: <ProjectIconPlaceholder />,
    span: 'col-span-2',
    link: 'https://github.com/ghuyphan/Orange-Pass',
  },
  {
    name: 'Orange 2',
    description: 'A personal finance companion with smart categorization and data viz.',
    icon: <ProjectIconPlaceholder />,
    span: 'col-span-1',
    link: 'https://github.com/ghuyphan/Orange-2',
  },
  {
    name: 'Apollo',
    description: 'A language learning app using bite-sized videos to improve retention.',
    icon: <ProjectIconPlaceholder />,
    span: 'col-span-1',
    link: 'https://github.com/ghuyphan/Apollo',
  },
  {
    name: 'Petty',
    description: 'Discover and share locations with friends in real-time.',
    icon: <ProjectIconPlaceholder />,
    span: 'col-span-2',
    link: 'https://github.com/ghuyphan/Petty',
  },
];

const cardsData: CardData[] = [
  { id: 'skills', title: 'My Tech Arsenal', content: 'From React Native to SAP ABAP, I love exploring different tech stacks. Currently focused on TypeScript and building scalable mobile experiences with Redux.', icon: <CodeIcon />, logo: null },
  { id: 'projects', title: 'Personal Projects', content: 'I build apps that solve real-world problems. Each project is an opportunity to refine my skills in user experience and product design.', icon: <RocketIcon />, logo: null },
  { id: 'hahaho', title: 'HAHAHO Digital (2022)', content: 'As a Business Analyst, I learned to translate complex business needs into actionable technical specifications, bridging the gap between stakeholders and developers.', icon: null, logo: <HahahoLogo /> },
  { id: 'fpt', title: 'FPT Software (2022-Present)', content: 'Currently developing enterprise-grade solutions, from SAP Fiori apps to Salesforce Lightning Web Components. Focused on creating intuitive and maintainable systems.', icon: null, logo: <FptLogo /> },
].reverse();

interface Tech {
  name: string;
  component: JSX.Element;
}

const technologies: Tech[] = [
  { name: 'HTML5', component: <HtmlLogo /> },
  { name: 'CSS3', component: <CssLogo /> },
  { name: 'JavaScript', component: <JavaScriptLogo /> },
  { name: 'TypeScript', component: <TypeScriptLogo /> },
  { name: 'React', component: <ReactLogo /> },
  { name: 'React Native', component: <ReactNativeLogo /> },
  { name: 'Expo', component: <ExpoLogo /> },
  { name: 'Redux', component: <ReduxLogo /> },
  { name: 'Node.js', component: <NodeLogo /> },
  { name: 'Git', component: <GitLogo /> },
  { name: 'SQLite', component: <SqlLogo /> },
  { name: 'SAPUI5', component: <SapUi5Logo /> },
  { name: 'SAP ABAP', component: <SapAbapLogo /> },
];

const to = (i: number) => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 });
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r: number, s: number) => `perspective(1500px) rotateX(30deg) rotateY(${r / 20}deg) rotateZ(${r}deg) scale(${s})`;


// --- PAGE COMPONENTS ---
const SimpleLogo: React.FC = () => (
  <img src={siteLogo} alt="Site Logo" width="50" height="50" style={{ borderRadius: '6px' }} />
);

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, isScrolled }) => {
//   const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const headerClassName = `app-header ${isScrolled ? 'scrolled' : ''}`;
  
  return (
    <header className={headerClassName}>
      <div className="header-inner">
        <a href="#" className="header-logo-link" aria-label="Home"><SimpleLogo /></a>
        <nav className="header-nav">
          <a href="#work" className="header-link">WORK</a>
          <a href="#projects" className="header-link">PROJECTS</a>
          {/* <button onClick={scrollToContact} className="header-link">CONTACT</button> */}
          <button onClick={onToggleTheme} className="animated-theme-toggle" data-theme={theme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <div className="icons-wrapper">
              <div className="icon">☀️</div>
              <div className="icon">🌙</div>
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
};

const ContactInfo: React.FC = () => (
  <div className="contact-info-container" id="contact">
    <a href="https://github.com/ghuyphan" target="_blank" rel="noopener noreferrer" className="contact-icon-link" aria-label="Github"><GithubIcon /></a>
    <a href="https://linkedin.com/in/giahuyphan" target="_blank" rel="noopener noreferrer" className="contact-icon-link" aria-label="LinkedIn"><LinkedInIcon /></a>
    <a href="https://x.com/your_handle" target="_blank" rel="noopener noreferrer" className="contact-icon-link" aria-label="Twitter"><TwitterIcon /></a>
    <a href="mailto:giahuyphan0110@gmail.com" className="contact-icon-link" aria-label="Email"><MailIcon /></a>
  </div>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-copyright">© {currentYear} Gia Huy Phan. All Rights Reserved.</div>
        <div className="footer-built-with">Built with <span className="tech-tag">React</span>, <span className="tech-tag">TypeScript</span>, and <span className="tech-tag">React Spring</span>.</div>
      </div>
    </footer>
  );
};

function Deck() {
  const [gone] = useState(() => new Set());
  const [props, api] = useSprings(cardsData.length, i => ({ ...to(i), from: from(i) }));

  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!active && trigger) gone.add(index);
    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0;
      const rot = mx / 100 + (isGone ? dir * 10 * vx : 0);
      const scale = active ? 1.1 : 1;
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 } };
    });
    if (!active && gone.size === cardsData.length) {
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
      }, 600);
    }
  });

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className="deck" key={i} style={{ x, y }}>
          <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans) }} className="deck-card-container">
            <div className="card-content">
              <div className="card-icon">{cardsData[i].logo || cardsData[i].icon}</div>
              <h2 className="card-title">{cardsData[i].title}</h2>
              <p className="card-paragraph">{cardsData[i].content}</p>
            </div>
          </animated.div>
        </animated.div>
      ))}
    </>
  );
}

// ==================================================================
// ===== START: Updated Projects Section & New BentoCard Component =====
// ==================================================================

const BentoCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cardRef.current?.style.setProperty('--x', `${x}px`);
            cardRef.current?.style.setProperty('--y', `${y}px`);
        }
    };

    return (
        <a
            ref={cardRef}
            href={project.link}
            key={project.name}
            target="_blank"
            rel="noopener noreferrer"
            className={`bento-card ${project.span}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onMouseMove={onMouseMove}
        >
            <div className="bento-glow"></div>
            <div className="bento-card-content">
                {project.icon}
                <div className="bento-text-wrapper">
                    <p className="bento-card-title">{project.name}</p>
                    <p className="bento-card-description">{project.description}</p>
                </div>
                <div className="bento-card-arrow">
                    <ArrowRightIcon />
                </div>
            </div>
        </a>
    );
};

function ProjectsSection() {
    const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

    return (
        <section id="projects" ref={sectionRef} className={`content-section animated-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="projects-title-wrapper">
                <h2 className="section-title">Things I've Built</h2>
            </div>
            <div className="bento-grid">
                {projects.map((project, index) => (
                    <BentoCard project={project} index={index} key={project.name} />
                ))}
            </div>
        </section>
    );
}

// ================================================================
// ===== END: Updated Projects Section & New BentoCard Component =====
// ================================================================


const TechShowcase: React.FC = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 }); // Added for scroll effect

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller || scroller.getAttribute("data-animated")) return;

        scroller.setAttribute("data-animated", "true");

        const scrollerInner = scroller.querySelector('.tech-scroller-inner');
        if (scrollerInner) {
            const scrollerContent = Array.from(scrollerInner.children);
            scrollerContent.forEach(item => {
                const duplicatedItem = item.cloneNode(true) as HTMLElement;
                duplicatedItem.setAttribute("aria-hidden", "true");
                scrollerInner.appendChild(duplicatedItem);
            });
        }
    }, []);

    return (
        <section 
            className={`content-section animated-section ${isVisible ? 'is-visible' : ''}`} // Apply classes
            aria-label="Technologies I use" 
            ref={sectionRef} // Attach ref
        >
            <div className="tech-showcase-container">
                <h2 className="section-title">My Tech Stack</h2>
                <div className="tech-scroller" ref={scrollerRef}>
                    <div className="tech-scroller-inner">
                        {technologies.map((tech) => (
                            <div className="tech-item" key={tech.name}>
                                <div className="tech-logo">{tech.component}</div>
                                <span className="tech-name">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const HeroSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 }); // Added for scroll effect

  return (
    <section 
      className={`hero-section animated-section ${isVisible ? 'is-visible' : ''}`} // Apply classes
      ref={sectionRef} // Attach ref
    >
      <p className="hero-greeting">Hello, world! I'm</p>
      <h1 className="hero-main-heading">
        <span className="gradient-text">Gia Huy.</span><br />I build for web & mobile.
      </h1>
      <p className="hero-description">I'm a software developer focused on building robust, scalable applications and turning complex business problems into elegant, user-friendly solutions.</p>
      <ContactInfo />
    </section>
  );
};

const DeckSection: React.FC = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="work" ref={sectionRef} className={`content-section animated-section ${isVisible ? 'is-visible' : ''}`}>
      <h2 className="section-title">What I Do</h2>
      <div className="deck-container"><Deck /></div>
    </section>
  );
};

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
    const handleChange = (e: MediaQueryListEvent) => {
      if (!window.localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div className="app-container">
      <Header theme={theme} onToggleTheme={toggleTheme} isScrolled={isScrolled} />
      <main className="main-content">
        <HeroSection />
        <DeckSection />
        <TechShowcase />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}