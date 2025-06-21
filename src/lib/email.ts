import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY || 'your-resend-api-key');
const prisma = new PrismaClient();

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// Email template registry
const templates: Record<string, (data: any) => EmailTemplate> = {
  'reservation-confirmation': (data) => ({
    subject: `Property Reservation Confirmed - ${data.propertyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reservation Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { background: #374151; color: white; padding: 20px; text-align: center; }
          .property-details { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
          .price { font-size: 24px; font-weight: bold; color: #059669; }
          ul { padding-left: 20px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Reservation Confirmed</h1>
            <p>Your property reservation has been successfully processed</p>
          </div>
          
          <div class="content">
            <h2>Dear ${data.buyerName},</h2>
            
            <p>Congratulations! Your reservation for <strong>${data.propertyName}</strong> in <strong>${data.developmentName}</strong> has been confirmed.</p>
            
            <div class="property-details">
              <h3>Reservation Details</h3>
              <p><strong>Reference Number:</strong> ${data.reservationRef}</p>
              <p><strong>Property:</strong> ${data.propertyName}</p>
              <p><strong>Development:</strong> ${data.developmentName}</p>
              <p><strong>Deposit Amount:</strong> <span class="price">€${data.depositAmount?.toLocaleString()}</span></p>
            </div>
            
            <h3>Next Steps</h3>
            <ul>
              ${data.nextSteps?.map((step: string) => `<li>${step}</li>`).join('') || ''}
            </ul>
            
            ${data.agreementUrl ? `
              <p>
                <a href="${data.agreementUrl}" class="button">Download Reservation Agreement</a>
              </p>
            ` : ''}
            
            <p>Our sales team will contact you within 24 hours to guide you through the next steps.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br/>
            Kevin Fitzgerald Developments<br/>
            📧 info@fitzgeralddevelopments.ie<br/>
            📞 041-987-6543</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 Kevin Fitzgerald Developments. All rights reserved.</p>
            <p>Ballymakenny Road, Drogheda, Co. Louth</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      PROPERTY RESERVATION CONFIRMED

      Dear ${data.buyerName},

      Your reservation for ${data.propertyName} in ${data.developmentName} has been confirmed.

      Reservation Details:
      - Reference: ${data.reservationRef}
      - Property: ${data.propertyName}
      - Development: ${data.developmentName}
      - Deposit: €${data.depositAmount?.toLocaleString()}

      Next Steps:
      ${data.nextSteps?.map((step: string) => `- ${step}`).join('\n') || ''}

      Best regards,
      Kevin Fitzgerald Developments
      info@fitzgeralddevelopments.ie
      041-987-6543
    `
  }),

  'new-reservation-notification': (data) => ({
    subject: `🏠 New Reservation Alert - ${data.propertyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Reservation Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .buyer-details { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
          .price { font-size: 20px; font-weight: bold; color: #059669; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Property Reservation</h1>
            <p>A new reservation has been placed</p>
          </div>
          
          <div class="content">
            <h2>Reservation Details</h2>
            
            <div class="buyer-details">
              <h3>Property Information</h3>
              <p><strong>Property:</strong> ${data.propertyName}</p>
              <p><strong>Development:</strong> ${data.developmentName}</p>
              <p><strong>Reference:</strong> ${data.reservationRef}</p>
              <p><strong>Deposit:</strong> <span class="price">€${data.depositAmount?.toLocaleString()}</span></p>
              
              <h3>Buyer Information</h3>
              <p><strong>Name:</strong> ${data.buyerName}</p>
              <p><strong>Email:</strong> ${data.buyerEmail}</p>
              <p><strong>Phone:</strong> ${data.buyerPhone}</p>
            </div>
            
            <p><strong>Action Required:</strong> Contact the buyer within 24 hours to confirm next steps.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      NEW PROPERTY RESERVATION

      Property: ${data.propertyName}
      Development: ${data.developmentName}
      Reference: ${data.reservationRef}
      Deposit: €${data.depositAmount?.toLocaleString()}

      Buyer: ${data.buyerName}
      Email: ${data.buyerEmail}
      Phone: ${data.buyerPhone}

      Action: Contact buyer within 24 hours.
    `
  })
};

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Get template
    const templateFunc = templates[options.template];
    if (!templateFunc) {
      console.error(`Email template '${options.template}' not found`);
      return false;
    }

    const template = templateFunc(options.data);

    // Send email via Resend
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@prop.ie',
      to: options.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (response.error) {
      console.error('Email send error:', response.error);
      return false;
    }

    console.log('✅ Email sent successfully:', {
      id: response.data?.id,
      to: options.to,
      template: options.template
    });

    // Log email to database (optional)
    try {
      await prisma.transactionCommunication.create({
        data: {
          transactionId: options.data.transactionId || 'system',
          type: 'EMAIL',
          direction: 'OUTBOUND',
          subject: template.subject,
          content: template.text || template.html,
          recipientEmail: options.to,
          status: 'SENT',
          sentAt: new Date(),
          performedById: options.data.userId || 'system'
        }
      }).catch(() => {
        // Silently fail database logging if table doesn't exist
      });
    } catch (dbError) {
      // Database logging is optional
    }

    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}

export async function generatePDF(template: string, data: any): Promise<{ url: string; size: number }> {
  // Mock PDF generation for now
  // In production, this would generate actual PDFs
  console.log(`📄 PDF generated for template: ${template}`);
  
  return {
    url: `/pdfs/generated/${template}-${Date.now()}.pdf`,
    size: 150000 // Mock size in bytes
  };
}