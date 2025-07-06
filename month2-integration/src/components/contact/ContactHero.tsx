'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ContactHeroProps } from '@/types/contact';
import styles from '@/app/contact/contact.module.css';

export const ContactHero: React.FC<ContactHeroProps> = ({ title, subtitle, image }) => {
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
      {image && (
        <div className={styles.heroBackground}>
          <Image
            src={image}
            alt="Contact Us"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      )}
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle} ref={titleRef}>{title}</h1>
        <p className={styles.heroSubtitle} ref={subtitleRef}>{subtitle}</p>
      </div>
    </section>
  );
};

export default ContactHero;