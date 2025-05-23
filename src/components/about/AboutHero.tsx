import React from 'react';
'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { AboutHeroProps } from '@/types/about';
import styles from '@/app/about/about.module.css';

export const AboutHero: React.FC<AboutHeroProps> = ({ title, subtitle, image }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;

    if (hero && titleElement && subtitleElement) {
      const tl = gsap.timeline();

      tl.fromTo(
        hero,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      )
      .fromTo(
        titleElement,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        subtitleElement,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );
    }
  }, []);

  return (
    <section className={styles.heroSection} ref={heroRef}>
      <div className={styles.heroBackground}>
        <Image
          src={image}
          alt="About Us"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle} ref={titleRef}>{title}</h1>
        <p className={styles.heroSubtitle} ref={subtitleRef}>{subtitle}</p>
      </div>
    </section>
  );
};

export default AboutHero;