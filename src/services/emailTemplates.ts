/**
 * Email Campaign Templates - Automated sequences for different user categories
 * Designed to nurture leads and drive revenue conversions
 */

import { UserCategory, EmailCampaignType } from './emailMarketingEngine';

export interface EmailTemplate {
  id: string;
  name: string;
  type: EmailCampaignType;
  targetCategory: UserCategory[];
  subject: string;
  htmlContent: string;
  textContent: string;
  delayHours?: number;
  triggerConditions?: {
    leadScoreMin?: number;
    daysSinceLastVisit?: number;
    specificBehavior?: string[];
  };
}

export const emailTemplates: EmailTemplate[] = [
  // FIRST-TIME BUYER WELCOME SERIES
  {
    id: 'ftb-welcome-1',
    name: 'First-Time Buyer Welcome',
    type: EmailCampaignType.WELCOME_SERIES,
    targetCategory: [UserCategory.FIRST_TIME_BUYER],
    subject: 'Welcome to Your Property Journey! 🏠 Your Free Guide Inside',
    delayHours: 0,
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PROP.ie! 🏠</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">Your journey to homeownership starts here</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi {{firstName}},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Congratulations on taking the first step towards owning your dream home! As Ireland's most advanced property platform, we're here to make your home-buying journey as smooth as possible.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2B5273; margin-top: 0;">🎁 Your FREE First-Time Buyer Package:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>Complete Guide to Buying Your First Home in Ireland</li>
              <li>Mortgage Calculator & Help-to-Buy Scheme Guide</li>
              <li>Exclusive access to new developments before public launch</li>
              <li>AI-powered property recommendations tailored to your budget</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{baseUrl}}/first-time-buyers/guide?utm_source=email&utm_campaign=ftb_welcome" 
               style="background: #2B5273; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Download Your FREE Guide 📖
            </a>
          </div>
          
          <div style="border-left: 4px solid #28a745; padding-left: 20px; margin: 30px 0;">
            <h4 style="color: #28a745; margin-top: 0;">✅ What makes PROP.ie different:</h4>
            <p style="color: #333; margin: 5px 0;">• AI matches you with properties that fit your lifestyle</p>
            <p style="color: #333; margin: 5px 0;">• Direct connections with Ireland's top developers</p>
            <p style="color: #333; margin: 5px 0;">• Transparent pricing with no hidden fees</p>
            <p style="color: #333; margin: 5px 0;">• Expert support throughout your journey</p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Over the next few days, I'll be sending you insider tips, exclusive property previews, and expert advice to help you navigate the Irish property market with confidence.
          </p>
          
          <p style="font-size: 16px; color: #333;">
            Welcome aboard!<br>
            <strong>The PROP.ie Team</strong>
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            You're receiving this because you joined PROP.ie for property alerts.<br>
            <a href="{{unsubscribeUrl}}" style="color: #6c757d;">Unsubscribe</a> | 
            <a href="{{baseUrl}}" style="color: #6c757d;">Visit PROP.ie</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Welcome to PROP.ie! Your journey to homeownership starts here.

Hi {{firstName}},

Congratulations on taking the first step towards owning your dream home! 

Your FREE First-Time Buyer Package includes:
- Complete Guide to Buying Your First Home in Ireland
- Mortgage Calculator & Help-to-Buy Scheme Guide  
- Exclusive access to new developments
- AI-powered property recommendations

Download your guide: {{baseUrl}}/first-time-buyers/guide

What makes PROP.ie different:
✓ AI matches you with properties that fit your lifestyle
✓ Direct connections with Ireland's top developers
✓ Transparent pricing with no hidden fees
✓ Expert support throughout your journey

Welcome aboard!
The PROP.ie Team

Unsubscribe: {{unsubscribeUrl}}`
  },

  // PROPERTY INVESTOR WELCOME
  {
    id: 'investor-welcome-1',
    name: 'Property Investor Welcome',
    type: EmailCampaignType.WELCOME_SERIES,
    targetCategory: [UserCategory.PROPERTY_INVESTOR],
    subject: 'Exclusive Investment Opportunities Await 📈 ROI Calculator Inside',
    delayHours: 0,
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PROP Investments 📈</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">Exclusive access to Ireland's best investment opportunities</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello {{firstName}},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Welcome to Ireland's premier property investment platform! You now have exclusive access to off-market deals, detailed ROI analytics, and our proven investment opportunities.
          </p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #1e7e34; margin-top: 0;">💼 Your Investor Benefits:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>Exclusive pre-market investment opportunities</li>
              <li>Detailed ROI calculations and market analysis</li>
              <li>Direct developer relationships for better pricing</li>
              <li>Rental yield projections and market insights</li>
              <li>Priority access to high-yield developments</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{baseUrl}}/investors/opportunities?utm_source=email&utm_campaign=investor_welcome" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Current Opportunities 🏗️
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">🔥 Hot Deal Alert:</h4>
            <p style="color: #333; margin: 0;">
              <strong>Fitzgerald Gardens Development</strong><br>
              Projected 8.2% rental yield | €375,000 starting price<br>
              Limited units available - <a href="{{baseUrl}}/developments/fitzgerald-gardens" style="color: #007bff;">View Details</a>
            </p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Our investment team has curated exclusive opportunities with proven developers. Each property includes comprehensive financial analysis, rental projections, and market comparables.
          </p>
          
          <p style="font-size: 16px; color: #333;">
            To profitable investing,<br>
            <strong>PROP Investment Team</strong>
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Exclusive investor updates from PROP.ie<br>
            <a href="{{unsubscribeUrl}}" style="color: #6c757d;">Unsubscribe</a> | 
            <a href="{{baseUrl}}/investors" style="color: #6c757d;">Investor Portal</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Welcome to PROP Investments!

Hello {{firstName}},

Welcome to Ireland's premier property investment platform! 

Your Investor Benefits:
- Exclusive pre-market investment opportunities
- Detailed ROI calculations and market analysis  
- Direct developer relationships for better pricing
- Rental yield projections and market insights
- Priority access to high-yield developments

HOT DEAL ALERT:
Fitzgerald Gardens Development
Projected 8.2% rental yield | €375,000 starting price
View details: {{baseUrl}}/developments/fitzgerald-gardens

View current opportunities: {{baseUrl}}/investors/opportunities

To profitable investing,
PROP Investment Team

Unsubscribe: {{unsubscribeUrl}}`
  },

  // DEVELOPER ONBOARDING
  {
    id: 'developer-onboarding-1',
    name: 'Developer Platform Introduction',
    type: EmailCampaignType.DEVELOPER_ONBOARDING,
    targetCategory: [UserCategory.DEVELOPER],
    subject: 'Transform Your Sales Process - PROP Platform Demo 🚀',
    delayHours: 0,
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PROP Developer Platform 🚀</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0; font-size: 16px;">Accelerate your sales with Ireland's #1 property platform</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear {{firstName}},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Thank you for your interest in the PROP platform! Join Ireland's leading developers who are already seeing 40% faster sales cycles and higher conversion rates.
          </p>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1565c0; margin-top: 0;">📊 Platform Results:</h3>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <div style="text-align: center; margin: 10px;">
                <div style="font-size: 24px; font-weight: bold; color: #1565c0;">40%</div>
                <div style="color: #333; font-size: 14px;">Faster Sales</div>
              </div>
              <div style="text-align: center; margin: 10px;">
                <div style="font-size: 24px; font-weight: bold; color: #1565c0;">€500M+</div>
                <div style="color: #333; font-size: 14px;">Sales Volume</div>
              </div>
              <div style="text-align: center; margin: 10px;">
                <div style="font-size: 24px; font-weight: bold; color: #1565c0;">98%</div>
                <div style="color: #333; font-size: 14px;">Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2B5273; margin-top: 0;">🎯 Complete Sales Solution:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li><strong>Lead Management:</strong> AI-powered buyer matching and nurturing</li>
              <li><strong>3D Virtual Tours:</strong> Immersive property experiences</li>
              <li><strong>PROP Choice:</strong> Furniture and customization revenue streams</li>
              <li><strong>Transaction Management:</strong> End-to-end sales coordination</li>
              <li><strong>Analytics Dashboard:</strong> Real-time sales performance insights</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{baseUrl}}/developers/demo?utm_source=email&utm_campaign=dev_onboarding" 
               style="background: #2B5273; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">
              Book Free Demo 📅
            </a>
            <a href="{{baseUrl}}/developers/pricing" 
               style="background: transparent; color: #2B5273; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; border: 2px solid #2B5273;">
              View Pricing
            </a>
          </div>
          
          <div style="border-left: 4px solid #ffc107; padding-left: 20px; margin: 30px 0; background: #fff8e1;">
            <h4 style="color: #f57c00; margin-top: 0;">💰 Revenue Opportunity:</h4>
            <p style="color: #333; margin: 5px 0;">Average developer sees <strong>€127K additional revenue</strong> from PROP Choice customization sales</p>
            <p style="color: #333; margin: 5px 0;">Platform handles all transactions, you keep the profits</p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Ready to transform your sales process? Our team can show you exactly how PROP will accelerate your development sales and increase average transaction values.
          </p>
          
          <p style="font-size: 16px; color: #333;">
            Best regards,<br>
            <strong>PROP Developer Success Team</strong><br>
            📞 +353 1 234 5678
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Developer updates from PROP.ie<br>
            <a href="{{unsubscribeUrl}}" style="color: #6c757d;">Unsubscribe</a> | 
            <a href="{{baseUrl}}/developers" style="color: #6c757d;">Developer Portal</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Welcome to PROP Developer Platform!

Dear {{firstName}},

Thank you for your interest in the PROP platform! 

Platform Results:
- 40% Faster Sales
- €500M+ Sales Volume  
- 98% Developer Satisfaction

Complete Sales Solution:
✓ AI-powered buyer matching and nurturing
✓ 3D Virtual Tours and immersive experiences
✓ PROP Choice furniture and customization revenue
✓ End-to-end transaction management
✓ Real-time sales performance analytics

Revenue Opportunity:
Average developer sees €127K additional revenue from PROP Choice customization sales.

Book your free demo: {{baseUrl}}/developers/demo
View pricing: {{baseUrl}}/developers/pricing

Best regards,
PROP Developer Success Team
📞 +353 1 234 5678

Unsubscribe: {{unsubscribeUrl}}`
  },

  // ABANDONED SEARCH RECOVERY
  {
    id: 'abandoned-search-1',
    name: 'Abandoned Search Recovery',
    type: EmailCampaignType.ABANDONED_SEARCH,
    targetCategory: [UserCategory.FIRST_TIME_BUYER, UserCategory.PROPERTY_INVESTOR, UserCategory.CASUAL_BROWSER],
    subject: 'Found something better! 🏠 New matches for your search',
    delayHours: 24,
    triggerConditions: {
      specificBehavior: ['searched-properties', 'no-property-views']
    },
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Don't Miss Out! 🏠</h1>
          <p style="color: #fff; margin: 10px 0 0; font-size: 16px;">New properties matching your search just listed</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi {{firstName}},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            I noticed you were searching for properties yesterday but didn't find the perfect match. Good news - we have new listings that might be exactly what you're looking for!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎯 Your Search: {{searchQuery}}</h3>
            <p style="color: #333; margin: 10px 0;">3 new properties match your criteria</p>
            <p style="color: #333; margin: 0;">Price range: {{priceRange}} | Location: {{location}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{baseUrl}}/properties/search?saved=true&utm_source=email&utm_campaign=abandoned_search" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View New Matches 🔍
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">⏰ Move Fast:</h4>
            <p style="color: #333; margin: 0;">
              Properties in your price range are getting 40% more interest this month. The best ones are going fast!
            </p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Want me to save this search and notify you when new properties are listed? It's free and you can unsubscribe anytime.
          </p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{baseUrl}}/save-search?query={{searchQuery}}" 
               style="background: transparent; color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 8px; border: 2px solid #007bff; display: inline-block;">
              Save This Search 💾
            </a>
          </div>
          
          <p style="font-size: 16px; color: #333;">
            Happy house hunting!<br>
            <strong>The PROP.ie Team</strong>
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Property alerts from PROP.ie<br>
            <a href="{{unsubscribeUrl}}" style="color: #6c757d;">Unsubscribe</a> | 
            <a href="{{baseUrl}}" style="color: #6c757d;">Visit PROP.ie</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Don't Miss Out! New properties matching your search just listed.

Hi {{firstName}},

I noticed you were searching for properties yesterday but didn't find the perfect match. Good news - we have new listings that might be exactly what you're looking for!

Your Search: {{searchQuery}}
3 new properties match your criteria
Price range: {{priceRange}} | Location: {{location}}

View new matches: {{baseUrl}}/properties/search?saved=true

⏰ Move Fast:
Properties in your price range are getting 40% more interest this month. The best ones are going fast!

Save this search for future alerts: {{baseUrl}}/save-search?query={{searchQuery}}

Happy house hunting!
The PROP.ie Team

Unsubscribe: {{unsubscribeUrl}}`
  },

  // PROP CHOICE UPSELL
  {
    id: 'prop-choice-upsell-1',
    name: 'PROP Choice Furniture Upsell',
    type: EmailCampaignType.PROP_CHOICE_UPSELL,
    targetCategory: [UserCategory.FIRST_TIME_BUYER, UserCategory.HIGH_VALUE_PROSPECT],
    subject: 'Complete Your Dream Home 🪑 Exclusive PROP Choice Preview',
    delayHours: 48,
    triggerConditions: {
      specificBehavior: ['viewed-property', 'no-customization']
    },
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">Complete Your Dream Home 🪑</h1>
          <p style="color: #666; margin: 10px 0 0; font-size: 16px;">Exclusive furniture packages from top Irish designers</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi {{firstName}},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            I saw you've been looking at properties on PROP.ie. Now imagine walking into your new home and finding it perfectly furnished with designer pieces chosen specifically for your space!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2B5273; margin-top: 0;">✨ PROP Choice Benefits:</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li><strong>Designer Curation:</strong> Furniture selected by top Irish interior designers</li>
              <li><strong>Perfect Fit:</strong> Pieces chosen specifically for your property layout</li>
              <li><strong>Move-in Ready:</strong> Everything delivered and installed before you arrive</li>
              <li><strong>Flexible Payment:</strong> Spread costs over 12-24 months</li>
              <li><strong>Quality Guarantee:</strong> Premium brands with 5-year warranties</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{baseUrl}}/prop-choice/preview?utm_source=email&utm_campaign=prop_choice_upsell" 
               style="background: #2B5273; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Explore PROP Choice 🎨
            </a>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1e7e34; margin-top: 0;">💚 Customer Love:</h4>
            <p style="color: #333; font-style: italic; margin: 0;">
              "Walking into our fully furnished home was magical. PROP Choice saved us months of shopping and the results are stunning!" 
              <br><strong>- Sarah & James, Fitzgerald Gardens</strong>
            </p>
          </div>
          
          <div style="border-left: 4px solid #ffc107; padding-left: 20px; margin: 30px 0;">
            <h4 style="color: #f57c00; margin-top: 0;">🏷️ Exclusive Launch Offer:</h4>
            <p style="color: #333; margin: 5px 0;"><strong>15% off your first PROP Choice package</strong></p>
            <p style="color: #333; margin: 5px 0;">Plus free design consultation (worth €500)</p>
            <p style="color: #999; font-size: 14px; margin: 5px 0;">Offer valid until {{expiryDate}}</p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Ready to see your future home fully furnished? Browse our curated collections and imagine coming home to perfection.
          </p>
          
          <p style="font-size: 16px; color: #333;">
            Dream big,<br>
            <strong>PROP Choice Design Team</strong>
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Exclusive offers from PROP Choice<br>
            <a href="{{unsubscribeUrl}}" style="color: #6c757d;">Unsubscribe</a> | 
            <a href="{{baseUrl}}/prop-choice" style="color: #6c757d;">Browse Collections</a>
          </p>
        </div>
      </div>
    `,
    textContent: `Complete Your Dream Home 🪑

Hi {{firstName}},

I saw you've been looking at properties on PROP.ie. Now imagine walking into your new home and finding it perfectly furnished with designer pieces!

PROP Choice Benefits:
✓ Designer curation by top Irish interior designers
✓ Perfect fit for your property layout  
✓ Move-in ready with delivery and installation
✓ Flexible payment over 12-24 months
✓ Quality guarantee with 5-year warranties

Customer Review:
"Walking into our fully furnished home was magical. PROP Choice saved us months of shopping and the results are stunning!" - Sarah & James

🏷️ Exclusive Launch Offer:
15% off your first PROP Choice package
Plus free design consultation (worth €500)
Offer valid until {{expiryDate}}

Explore PROP Choice: {{baseUrl}}/prop-choice/preview

Dream big,
PROP Choice Design Team

Unsubscribe: {{unsubscribeUrl}}`
  }
];

/**
 * Get email template by ID
 */
export function getEmailTemplate(templateId: string): EmailTemplate | null {
  return emailTemplates.find(template => template.id === templateId) || null;
}

/**
 * Get templates by campaign type
 */
export function getTemplatesByCampaignType(type: EmailCampaignType): EmailTemplate[] {
  return emailTemplates.filter(template => template.type === type);
}

/**
 * Get templates for specific user category
 */
export function getTemplatesForCategory(category: UserCategory): EmailTemplate[] {
  return emailTemplates.filter(template => 
    template.targetCategory.includes(category)
  );
}

/**
 * Render email template with variables
 */
export function renderEmailTemplate(
  template: EmailTemplate, 
  variables: Record<string, string>
): { subject: string; htmlContent: string; textContent: string } {
  const renderText = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  };

  return {
    subject: renderText(template.subject),
    htmlContent: renderText(template.htmlContent),
    textContent: renderText(template.textContent)
  };
}