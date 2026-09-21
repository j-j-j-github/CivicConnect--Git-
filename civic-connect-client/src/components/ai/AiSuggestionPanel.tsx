'use client';

/**
 * AiSuggestionPanel
 * ------------------
 * Displays the AI-generated analysis for a complaint.
 * Intended for use ONLY in Officer / Admin portals.
 *
 * Props:
 *  - complaintId  : The complaint UUID
 *  - insights     : Pre-fetched AI insights object (from GET /complaints/:id/ai-insights)
 *  - onOverride   : Callback after a successful override (patch) operation
 */

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export interface AiInsights {
  id: string;
  ai_category: string | null;
  ai_department: string | null;
  ai_priority: string | null;
  ai_confidence: number | null;
  ai_summary: string | null;
  is_ai_overridden: boolean;
  override_reason: string | null;
  overridden_at: string | null;
  overriddenById: string | null;
}

interface Props {
  complaintId: string;
  insights: AiInsights;
  onOverride?: () => void;
}

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  HIGH:     'bg-orange-100 text-orange-800 border-orange-300',
  MEDIUM:   'bg-yellow-100 text-yellow-800 border-yellow-300',
  LOW:      'bg-gray-100 text-gray-700 border-gray-300',
};

export function AiSuggestionPanel({ complaintId, insights, onOverride }: Props) {
  const [expanded, setExpanded]           = useState(true);
  const [overriding, setOverriding]       = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [newDeptId, setNewDeptId]         = useState('');
  const [newPriority, setNewPriority]     = useState('');
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [success, setSuccess]             = useState(false);

  const confidence = insights.ai_confidence
    ? Math.round(insights.ai_confidence * 100)
    : null;

  const handleAccept = async () => {
    // Accept means no override; user just acknowledges the AI suggestion.
    setSuccess(true);
    onOverride?.();
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) {
      setError('Override reason is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await fetchApi(`/complaints/${complaintId}/override`, {
        method: 'PATCH',
        body: JSON.stringify({
          reason: overrideReason,
          ...(newDeptId   ? { department_id: newDeptId }  : {}),
          ...(newPriority ? { priority: newPriority }      : {}),
        }),
      });
      setSuccess(true);
      setOverriding(false);
      onOverride?.();
    } catch (err: any) {
      setError(err?.message ?? 'Override failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id={`ai-suggestion-panel-${complaintId}`}
      className="rounded-xl border border-blue-200 bg-blue-50/60 overflow-hidden"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-100/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          🤖 AI Analysis
          {confidence !== null && (
            <span className="text-xs font-medium bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full">
              {confidence}% confidence
            </span>
          )}
          {insights.is_ai_overridden && (
            <span className="text-xs font-medium bg-purple-200/70 text-purple-800 px-2 py-0.5 rounded-full">
              Overridden
            </span>
          )}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Summary */}
          {insights.ai_summary && (
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Summary
              </p>
              <p className="text-sm text-blue-950 leading-relaxed">{insights.ai_summary}</p>
            </div>
          )}

          {/* Suggestions row */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Suggested Department
              </p>
              <p className="font-medium text-gray-800">
                {insights.ai_department ?? insights.ai_category ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Suggested Priority
              </p>
              {insights.ai_priority ? (
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-xs font-bold uppercase ${PRIORITY_STYLES[insights.ai_priority] ?? PRIORITY_STYLES.LOW}`}
                >
                  {insights.ai_priority}
                </span>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>
          </div>

          {/* Override info */}
          {insights.is_ai_overridden && (
            <div className="text-xs text-purple-800 bg-purple-50 border border-purple-200 rounded-lg p-2">
              <strong>Override reason:</strong> {insights.override_reason ?? 'No reason recorded.'}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle size={16} /> Action recorded successfully.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          {/* Actions */}
          {!success && !overriding && (
            <div className="flex gap-2 pt-1">
              <button
                id={`ai-accept-btn-${complaintId}`}
                type="button"
                onClick={handleAccept}
                className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Accept AI Suggestion
              </button>
              <button
                id={`ai-override-btn-${complaintId}`}
                type="button"
                onClick={() => setOverriding(true)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Override
              </button>
            </div>
          )}

          {/* Override form */}
          {overriding && (
            <form onSubmit={handleOverrideSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Override Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={`ai-override-reason-${complaintId}`}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  rows={2}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  placeholder="Why are you overriding the AI suggestion?"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    New Department ID <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id={`ai-override-dept-${complaintId}`}
                    type="text"
                    value={newDeptId}
                    onChange={(e) => setNewDeptId(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="UUID"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    New Priority <span className="text-gray-400">(optional)</span>
                  </label>
                  <select
                    id={`ai-override-priority-${complaintId}`}
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="">Keep AI suggestion</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  id={`ai-override-submit-${complaintId}`}
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60 flex items-center gap-1 transition-colors"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  Save Override
                </button>
                <button
                  type="button"
                  onClick={() => { setOverriding(false); setError(null); }}
                  className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
