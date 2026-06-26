'use client';

import React, { useState } from 'react';
import { Badge, Button, showToast } from '@gratiaos/ui';

function formatTimestamp(ts: string): string {
    try {
        const date = new Date(ts);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        // Fallback: readable date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return ts;
    }
}

function getToneForKind(kind: string): 'accent' | 'positive' | 'warning' | 'danger' | 'subtle' {
    const k = kind.toLowerCase();
    if (k === 'coherence') return 'accent';
    if (k === 'gratitude' || k === 'joy') return 'positive';
    if (k === 'receptive') return 'subtle';
    if (k === 'panic' || k === 'anxiety' || k === 'anger') return 'danger';
    if (k === 'shame' || k === 'paradox') return 'warning';
    return 'subtle';
}

function getToneForIntensity(
    intensity: number
): 'accent' | 'positive' | 'warning' | 'danger' | 'subtle' {
    if (intensity >= 0.8) return 'accent';
    if (intensity >= 0.5) return 'positive';
    if (intensity >= 0.3) return 'warning';
    return 'subtle';
}

export function LedgerCard({ emotion, index }: { emotion: any; index: number }) {
    const [isElevating, setIsElevating] = useState(false);

    const toneColor = getToneForKind(emotion.kind);
    const isHighIntensity = emotion.intensity >= 0.7;

    const handleElevate = async () => {
        if (!window.confirm(`Elevate "${emotion.kind}" to Firegate Memory Pool for deep processing?`)) {
            return;
        }

        setIsElevating(true);
        try {
            const resp = await fetch('http://localhost:3000/api/kernel/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emotion),
            });

            if (!resp.ok) throw new Error('Failed to elevate');

            showToast({
                title: 'Scene elevated ⚡',
                desc: 'Added to Firegate Memory Pool.',
                variant: 'positive',
                icon: '🌌',
            });
        } catch (err) {
            console.error(err);
            showToast({
                title: 'Elevation failed',
                desc: 'Could not reach Firegate Kernel.',
                variant: 'danger',
            });
        } finally {
            setIsElevating(false);
        }
    };

    return (
        <article
            className="animate-sceneIn group ease-soft relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
            style={{
                animationDelay: `${index * 80}ms`,
                borderRadius: '0.875rem',
                padding: '1rem',
                background: 'color-mix(in oklab, var(--color-elev) 95%, var(--color-surface) 5%)',
                border: '1px solid color-mix(in oklab, var(--color-border) 35%, transparent)',
                boxShadow: `
          0 2px 8px color-mix(in oklab, var(--color-text) 6%, transparent),
          0 1px 2px color-mix(in oklab, var(--color-text) 4%, transparent)
        `,
            }}
        >
            {/* Ambient aura (tone-based radial gradient) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        toneColor === 'subtle'
                            ? `radial-gradient(600px 400px at 20% 80%,
                  color-mix(in oklab, var(--color-muted) ${isHighIntensity ? '12' : '8'}%, transparent) 0%,
                  transparent 70%)`
                            : `radial-gradient(600px 400px at 20% 80%,
                  color-mix(in oklab, var(--color-${toneColor}) ${isHighIntensity ? '14' : '10'}%, transparent) 0%,
                  transparent 70%)`,
                }}
            />

            {/* Content (relative to aura) */}
            <div className="relative">
                {/* Header: Kind + Timestamp */}
                <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="soft" tone={toneColor}>
                            {emotion.kind}
                        </Badge>
                        <Badge
                            variant="outline"
                            tone={getToneForIntensity(emotion.intensity)}
                            size="sm"
                        >
                            {emotion.intensity.toFixed(2)}
                        </Badge>
                        {emotion.sealed && (
                            <Badge variant="subtle" tone="subtle" size="sm">
                                sealed
                            </Badge>
                        )}

                        {isHighIntensity && (
                            <Button
                                variant="ghost"
                                className="ml-2 !px-2 !py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleElevate}
                                disabled={isElevating}
                            >
                                {isElevating ? 'Elevating...' : '⚡ Elevate to Kernel'}
                            </Button>
                        )}
                    </div>
                    <time className="shrink-0 text-sm" style={{ color: 'var(--text-subtle)' }}>
                        {formatTimestamp(emotion.ts)}
                    </time>
                </div>

                {/* Details (if present) */}
                {emotion.details && (
                    <p className="mb-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                        {emotion.details}
                    </p>
                )}

                {/* Footer: Band + Archetype */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                        className="rounded px-2 py-0.5"
                        style={{
                            background:
                                'color-mix(in oklab, var(--color-elev) 70%, var(--color-surface) 30%)',
                            color: 'var(--text-subtle)',
                        }}
                    >
                        {emotion.band} band
                    </span>
                    {emotion.archetype && (
                        <span
                            className="rounded px-2 py-0.5"
                            style={{
                                background:
                                    'color-mix(in oklab, var(--color-elev) 70%, var(--color-surface) 30%)',
                                color: 'var(--text-subtle)',
                            }}
                        >
                            {emotion.archetype}
                        </span>
                    )}
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span style={{ opacity: 0.7, color: 'var(--text-subtle)' }}>{emotion.who}</span>
                </div>
            </div>
        </article>
    );
}
