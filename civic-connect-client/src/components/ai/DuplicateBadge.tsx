'use client';

/**
 * DuplicateBadge
 * ---------------
 * A compact visual badge indicating that the AI detected a potential duplicate
 * for this complaint. Intended for use in Officer / Admin complaint list views.
 *
 * Usage:
 *   <DuplicateBadge duplicateComplaintId="abc-123" similarityScore={0.82} />
 */

import { AlertTriangle } from 'lucide-react';

interface Props {
  /** The ID of the complaint this was detected as a duplicate of */
  duplicateComplaintId?: string | null;
  /** 0–1 similarity score from the AI service */
  similarityScore?: number | null;
  /** Optional: clicking the badge navigates to the original complaint */
  onClick?: () => void;
}

export function DuplicateBadge({ duplicateComplaintId, similarityScore, onClick }: Props) {
  const pct = similarityScore != null ? Math.round(similarityScore * 100) : null;

  return (
    <button
      id={`duplicate-badge-${duplicateComplaintId ?? 'unknown'}`}
      type="button"
      onClick={onClick}
      title={
        duplicateComplaintId
          ? `Possible duplicate of complaint ${duplicateComplaintId}`
          : 'Possible duplicate detected by AI'
      }
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        'bg-amber-100 text-amber-800 border border-amber-300',
        onClick ? 'cursor-pointer hover:bg-amber-200 transition-colors' : 'cursor-default',
      ].join(' ')}
    >
      <AlertTriangle size={12} className="flex-shrink-0" />
      Possible Duplicate
      {pct !== null && (
        <span className="ml-0.5 bg-amber-200 text-amber-900 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
          {pct}%
        </span>
      )}
    </button>
  );
}
