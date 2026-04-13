import { NextRequest, NextResponse } from 'next/server';

import { getDraftByReviewToken, updateReviewStatus, type ReviewStatus } from '@/lib/blog-posts';

const VALID_ACTIONS: ReviewStatus[] = ['approved', 'rejected', 'edit_requested'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token?.trim()) {
    return NextResponse.json({ error: 'Token saknas.' }, { status: 400 });
  }

  let body: { action?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ogiltig JSON.' }, { status: 400 });
  }

  const { action, notes } = body;

  if (!action || !VALID_ACTIONS.includes(action as ReviewStatus)) {
    return NextResponse.json(
      { error: `Ogiltigt action. Välj ett av: ${VALID_ACTIONS.join(', ')}.` },
      { status: 400 },
    );
  }

  const existing = await getDraftByReviewToken(token);
  if (!existing) {
    return NextResponse.json({ error: 'Utkast hittades inte.' }, { status: 404 });
  }

  const ok = await updateReviewStatus(token, action as ReviewStatus, notes);
  if (!ok) {
    return NextResponse.json({ error: 'Kunde inte uppdatera status.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: action });
}
