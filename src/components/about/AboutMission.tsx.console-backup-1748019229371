'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutMissionProps } from '@/types/about';
import styles from '@/app/about/about.module.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutMission: React.FC<AboutMissionProps> = ({ title, statement, image }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const imageContainer = imageRef.current;

    if (section && content && imageContainer && typeof window !== 'undefined') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 70%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(
        content,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo(
        imageContainer,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );
    }
  }, []);

  return (
    <section className={`${styles.section} ${styles.missionSection}`} ref={sectionRef}>
      <div className={styles.missionContent} ref={contentRef}>
        <h2 className={styles.missionTitle}>{title}</h2>
        <p className={styles.missionStatement}>{statement}</p>
      </div>
      
      {image && (
        <div ref={imageRef}>
          <Image
            src={image}
            alt="Our Mission"
            width={500}
            height={600}
            className={styles.missionImage}
          />
        </div>
      )}
    </section>
  );
};

export default AboutMission;