'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ReviewStatus } from '@/lib/blog-posts';

type Props = {
  token: string;
  currentStatus: ReviewStatus;
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending_review: 'Väntar på granskning',
  approved: 'Godkänd — publicerad',
  rejected: 'Avvisad',
  edit_requested: 'Redigering begärd',
};

const STATUS_VARIANTS: Record<ReviewStatus, 'default' | 'secondary' | 'destructive' | 'outline'> =
  {
    pending_review: 'outline',
    approved: 'default',
    rejected: 'destructive',
    edit_requested: 'secondary',
  };

export function ReviewActions({ token, currentStatus }: Props) {
  const [status, setStatus] = useState<ReviewStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const [activeAction, setActiveAction] = useState<'rejected' | 'edit_requested' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: ReviewStatus, submitNotes?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/review/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: submitNotes }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Något gick fel.');
      }
      setStatus(action);
      setActiveAction(null);
      setNotes('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Okänt fel.');
    } finally {
      setLoading(false);
    }
  }

  if (status !== 'pending_review') {
    return (
      <div className="flex items-center gap-3">
        <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
        {status === 'approved' && (
          <p className="text-muted-foreground text-sm">Inlägget är nu publicerat på sajten.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => submit('approved')}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading ? 'Sparar…' : '✓ Godkänn & publicera'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setActiveAction(activeAction === 'edit_requested' ? null : 'edit_requested')}
          disabled={loading}
        >
          ✏ Begär redigering
        </Button>
        <Button
          variant="destructive"
          onClick={() => setActiveAction(activeAction === 'rejected' ? null : 'rejected')}
          disabled={loading}
        >
          ✕ Avvisa
        </Button>
      </div>

      {activeAction ? (
        <div className="space-y-3">
          <Textarea
            placeholder={
              activeAction === 'edit_requested'
                ? 'Beskriv vad som ska ändras…'
                : 'Valfri anledning till avvisning…'  // activeAction === 'rejected'
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="max-w-lg"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeAction === 'rejected' ? 'destructive' : 'default'}
              onClick={() => submit(activeAction, notes || undefined)}
              disabled={loading}
            >
              {loading ? 'Sparar…' : 'Skicka'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setActiveAction(null);
                setNotes('');
              }}
              disabled={loading}
            >
              Avbryt
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
