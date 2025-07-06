'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutCtaProps } from '@/types/about';
import styles from '@/app/about/about.module.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutCta: React.FC<AboutCtaProps> = ({ title, text, buttonText, buttonLink }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const titleElement = titleRef.current;
    const textElement = textRef.current;
    const buttonElement = buttonRef.current;

    if (section && content && titleElement && textElement && buttonElement && typeof window !== 'undefined') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(
        titleElement,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo(
        textElement,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      )
      .fromTo(
        buttonElement,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3'
      );
    }
  }, []);

  return (
    <section className={styles.ctaSection} ref={sectionRef}>
      <div className={styles.ctaContent} ref={contentRef}>
        <h2 className={styles.ctaTitle} ref={titleRef}>{title}</h2>
        <p className={styles.ctaText} ref={textRef}>{text}</p>
        <Link href={buttonLink} className={styles.ctaButton} ref={buttonRef}>
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default AboutCta;