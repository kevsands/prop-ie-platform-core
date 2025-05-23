import React from 'react';
'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutValuesProps, CompanyValue } from '@/types/about';
import styles from '@/app/about/about.module.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ValueCard: React.FC<{ value: CompanyValue; index: number }> = ({ value, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (card && typeof window !== 'undefined') {
      gsap.fromTo(
        card,
        { 
          y: 30, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [index]);

  return (
    <div className={styles.valueCard} ref={cardRef}>
      {value.icon && (
        <Image
          src={value.icon}
          alt={value.title}
          width={60}
          height={60}
          className={styles.valueIcon}
        />
      )}
      <h3 className={styles.valueTitle}>{value.title}</h3>
      <p className={styles.valueDescription}>{value.description}</p>
    </div>
  );
};

export const AboutValues: React.FC<AboutValuesProps> = ({ values }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;

    if (section && title && typeof window !== 'undefined') {
      gsap.fromTo(
        title,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  return (
    <section className={`${styles.section} ${styles.valuesSection}`} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle} ref={titleRef}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {values.map((valueindex: any) => (
            <ValueCard key={value.id} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;