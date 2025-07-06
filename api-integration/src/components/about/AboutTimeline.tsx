'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutTimelineProps, TimelineItem } from '@/types/about';
import styles from '@/app/about/about.module.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TimelineItemComponent: React.FC<{ item: TimelineItem; index: number }> = ({ item, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const itemElement = itemRef.current;
    const yearElement = yearRef.current;
    const contentElement = contentRef.current;

    if (itemElement && yearElement && contentElement && typeof window !== 'undefined') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: itemElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(
        yearElement,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 }
      )
      .fromTo(
        contentElement,
        { x: index % 2 === 0 ? -30 : 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        '-=0.3'
      );
    }
  }, [index]);

  return (
    <div className={styles.timelineItem} ref={itemRef}>
      <div className={styles.timelineYear} ref={yearRef}>
        {item.year}
      </div>
      <div className={styles.timelineContent} ref={contentRef}>
        <h3 className={styles.timelineTitle}>{item.title}</h3>
        <p className={styles.timelineDescription}>{item.description}</p>
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={250}
            className={styles.timelineImage}
          />
        )}
      </div>
    </div>
  );
};

export const AboutTimeline: React.FC<AboutTimelineProps> = ({ items }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const container = containerRef.current;

    if (section && title && container && typeof window !== 'undefined') {
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
    <section className={`${styles.section} ${styles.timelineSection}`} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle} ref={titleRef}>Our Journey</h2>
        <div className={styles.timelineContainer} ref={containerRef}>
          {items.map((item, index) => (
            <TimelineItemComponent key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;