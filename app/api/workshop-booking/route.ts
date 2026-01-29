import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface WorkshopBookingData {
  mode: 'scheduled' | 'custom';
  name: string;
  email: string;
  phone: string;
  // Scheduled booking fields
  workshopTitle?: string;
  workshopDate?: string;
  // Custom inquiry fields
  eventType?: string;
  numberOfPeople?: string;
  preferredDate?: string;
  // Common
  message?: string;
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
    const data: WorkshopBookingData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.mode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate mode-specific fields
    if (data.mode === 'scheduled' && !data.workshopTitle) {
      return NextResponse.json(
        { error: 'Workshop selection required' },
        { status: 400 }
      );
    }

    if (data.mode === 'custom' && !data.eventType) {
      return NextResponse.json(
        { error: 'Event type required' },
        { status: 400 }
      );
    }

    // Determine from address based on mode
    const fromAddress = data.mode === 'scheduled'
      ? 'Doris Einfalt Art <prijava@doriseinfalt.art>'
      : 'Doris Einfalt Art <povprasevanje@doriseinfalt.art>';

    // Build subject line
    const subject = data.mode === 'scheduled'
      ? `Prijava na delavnico: ${data.workshopTitle}`
      : `Povpraševanje za dogodek: ${data.eventType}`;

    // Build email body
    let body = `Novo sporočilo z obrazca za delavnice\n\n`;
    body += `Ime: ${data.name}\n`;
    body += `Email: ${data.email}\n`;
    body += `Telefon: ${data.phone}\n\n`;

    if (data.mode === 'scheduled') {
      body += `Delavnica: ${data.workshopTitle}\n`;
      if (data.workshopDate) {
        body += `Termin: ${data.workshopDate}\n`;
      }
    } else {
      body += `Vrsta dogodka: ${data.eventType}\n`;
      if (data.numberOfPeople) {
        body += `Število oseb: ${data.numberOfPeople}\n`;
      }
      if (data.preferredDate) {
        body += `Želeni datum: ${data.preferredDate}\n`;
      }
    }

    if (data.message) {
      body += `\nSporočilo:\n${data.message}`;
    }

    body += `\n\n---\nTo sporočilo je bilo poslano preko obrazca za delavnice na doriseinfalt.art`;

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: ['einfalt.doris@gmail.com'],
      replyTo: data.email,
      subject,
      text: body,
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
    console.error('Workshop booking form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
