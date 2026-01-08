import { NextRequest, NextResponse } from 'next/server';
import type { RentalReservation } from '@/lib/rentals';

export async function POST(request: NextRequest) {
  try {
    const reservation: RentalReservation = await request.json();

    // Validate required fields
    if (!reservation.name || !reservation.email || !reservation.phone || 
        !reservation.pickupDate || !reservation.returnDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format dates for display
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('sl-SI', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // Build admin email content
    const adminSubject = `Nova rezervacija izposoje - ${reservation.rentalTitle}`;
    const adminBody = `
Nova rezervacija izposoje

Izposoja: ${reservation.rentalTitle}
ID: ${reservation.rentalId}

Podatki stranke:
- Ime: ${reservation.name}
- Email: ${reservation.email}
- Telefon: ${reservation.phone}

Termin:
- Prevzem: ${formatDate(reservation.pickupDate)}${reservation.pickupTime ? ` ob ${reservation.pickupTime}` : ''}
- Vrnitev: ${formatDate(reservation.returnDate)}

${reservation.message ? `Sporočilo: ${reservation.message}\n` : ''}

Cena:
- Najem: ${reservation.totalPrice - reservation.deposit} ${reservation.currency}
- Varščina: ${reservation.deposit} ${reservation.currency}
- Skupaj: ${reservation.totalPrice} ${reservation.currency}

Plačilo: Gotovina ob prevzemu
Prevzem: Osebni prevzem

---
To je avtomatsko sporočilo iz sistema rezervacij.
`;

    // Build user confirmation email content
    const userSubject = `Potrditev rezervacije - ${reservation.rentalTitle}`;
    const userBody = `
Pozdravljeni ${reservation.name},

Hvala za vašo rezervacijo izposoje "${reservation.rentalTitle}".

Vaša rezervacija:
- Prevzem: ${formatDate(reservation.pickupDate)}${reservation.pickupTime ? ` ob ${reservation.pickupTime}` : ''}
- Vrnitev: ${formatDate(reservation.returnDate)}

Cena:
- Najem: ${reservation.totalPrice - reservation.deposit} ${reservation.currency}
- Varščina: ${reservation.deposit} ${reservation.currency}
- Skupaj: ${reservation.totalPrice} ${reservation.currency}

Plačilo: Gotovina ob prevzemu
Prevzem: Osebni prevzem

Vaša rezervacija je bila poslana. Kontaktirali vas bomo v najkrajšem možnem času za potrditev.

Lep pozdrav,
Doris Einfalt
`;

    // For now, we'll use mailto links similar to workshops form
    // In production, you would integrate with an email service (e.g., SendGrid, Resend, Nodemailer)
    // This is a placeholder that returns success - actual email sending would be implemented here
    
    // TODO: Implement actual email sending service
    // Example with mailto (client-side will handle):
    const adminMailto = `mailto:info@doriseinfalt.art?subject=${encodeURIComponent(adminSubject)}&body=${encodeURIComponent(adminBody)}`;
    const userMailto = `mailto:${reservation.email}?subject=${encodeURIComponent(userSubject)}&body=${encodeURIComponent(userBody)}`;

    // In a production setup, you would:
    // 1. Send email to admin using email service
    // 2. Send confirmation email to user using email service
    // 3. Return success response

    // For now, return success (actual email sending can be implemented with a service)
    return NextResponse.json({
      success: true,
      message: 'Reservation submitted successfully',
      // Include mailto links for client-side fallback if needed
      adminMailto,
      userMailto,
    });

  } catch (error) {
    console.error('Rental reservation error:', error);
    return NextResponse.json(
      { error: 'Failed to process reservation' },
      { status: 500 }
    );
  }
}


