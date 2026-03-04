import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { name, email, startDate, endDate, locations } = body;
        if (!name || !email || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: name, email, startDate, endDate' },
                { status: 400 }
            );
        }

        // Log the inquiry (in production, this would go to a database or email service)
        console.log('\n========================================');
        console.log('📬 NEW TRAVEL INQUIRY RECEIVED');
        console.log('========================================');
        console.log('👤 Name:', name);
        console.log('📧 Email:', email);
        console.log('📱 Phone:', body.phone || 'Not provided');
        console.log('📅 Dates:', startDate, '→', endDate);
        console.log('👥 Group Size:', body.groupSize || 'Not specified');
        console.log('📝 Notes:', body.notes || 'None');
        console.log('🗺️  Destinations:', locations?.length || 0);
        if (locations?.length) {
            locations.forEach((loc: { name: string; category: string }, i: number) => {
                console.log(`   ${i + 1}. ${loc.name} (${loc.category})`);
            });
        }
        console.log('⏰ Submitted:', body.submittedAt);
        console.log('========================================\n');

        return NextResponse.json({
            success: true,
            message: 'Inquiry received! We will contact you within 24 hours.',
            reference: `KG-${Date.now().toString(36).toUpperCase()}`,
        });
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
