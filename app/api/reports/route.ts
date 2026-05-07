import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reports } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, category, urgency, analysisText, draftReport } = body;
    
    if (!imageUrl || !category || !urgency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReport = await db.insert(reports).values({
      imageUrl,
      category,
      urgency,
      analysisText,
      draftReport,
      status: 'pending',
    }).returning();

    return NextResponse.json(newReport[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allReports = await db.select().from(reports).orderBy(desc(reports.createdAt));
    return NextResponse.json(allReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
