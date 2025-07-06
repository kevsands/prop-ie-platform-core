'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FAQListProps, FAQItem } from '@/types/contact';
import styles from '@/app/contact/contact.module.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type FAQItemComponentProps = {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
};

const FAQItemComponent: React.FC<FAQItemComponentProps> = ({ faq, isOpen, onToggle, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    const question = questionRef.current;

    if (item && question && typeof window !== 'undefined') {
      gsap.fromTo(
        item,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [index]);

  useEffect(() => {
    const answer = answerRef.current;
    
    if (answer) {
      if (isOpen) {
        gsap.fromTo(
          answer,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(
          answer,
          { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }
        );
      }
    }
  }, [isOpen]);

  return (
    <div className={styles.faqItem} ref={itemRef}>
      <div 
        className={styles.faqQuestion} 
        onClick={onToggle}
        ref={questionRef}
        aria-expanded={isOpen}
      >
        <h3>{faq.question}</h3>
        <span className={styles.faqIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      <div 
        className={styles.faqAnswer} 
        ref={answerRef}
        style={{ height: 0, overflow: 'hidden', opacity: 0 }}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
};

export const ContactFaq: React.FC<FAQListProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`${styles.section} ${styles.faqSection}`} ref={sectionRef}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle} ref={titleRef}>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <FAQItemComponent
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFaq;