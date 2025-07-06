'use client';

import { useEffect } from 'react';
import { 
  ContactHero,
  ContactInfo,
  ContactForm,
  ContactMap,
  ContactOffices,
  ContactFaq,
  ContactSocialCta
} from '@/components/contact';
import { ContactPageData, ContactFormData } from '@/types/contact';
import styles from '@/app/contact/contact.module.css';

// Client component to handle client-side functionality
export default function ContactPageClient({ data }: { data: ContactPageData }) {
  useEffect(() => {
    // Register gsap plugins if needed
    if (typeof window !== 'undefined') {
      // Add any global animations here if needed
    }
  }, []);

  return (
    <main>
      <ContactHero 
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        image={data.heroImage}
      />
      
      <section className={`${styles.section} ${styles.contactInfoSection}`}>
        <div className={styles.container}>
          <div className={styles.contactInfoSection}>
            <ContactInfo 
              email={data.contactInfo.email}
              phone={data.contactInfo.phone}
              address={data.contactInfo.address}
            />
            <ContactForm 
              onSubmit={async (formData: ContactFormData) => {
                // In a real application, you would send the form data to your API
                console.log('Form submitted:', formData);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true };
              }}
            />
          </div>
        </div>
      </section>
      
      <ContactMap offices={data.offices} />
      
      <ContactOffices offices={data.offices} />
      
      <ContactFaq faqs={data.faqs} />
      
      <ContactSocialCta 
        title={data.ctaTitle}
        text={data.ctaText}
        socialLinks={data.socialLinks}
      />
    </main>
  );
}