import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'Doris Einfalt Art <onboarding@resend.dev>',
      to: ['einfalt.doris@gmail.com'],
      replyTo: data.email,
      subject: data.subject || `Novo sporočilo od ${data.name}`,
      text: `
Novo sporočilo s kontaktnega obrazca

Ime: ${data.name}
Email: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}
${data.subject ? `Zadeva: ${data.subject}` : ''}

Sporočilo:
${data.message}

---
To sporočilo je bilo poslano preko kontaktnega obrazca na doriseinfalt.art
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
