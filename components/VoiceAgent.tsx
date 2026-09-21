'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { publicConfig } from '@/lib/config';

type CallState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'ended' | 'error';

const STATUS_TEXT: Record<CallState, string> = {
  idle: 'Tap to talk',
  connecting: 'Connecting',
  listening: 'Listening',
  speaking: 'BrainCX is speaking',
  ended: 'Conversation ended',
  error: 'Something went wrong',
};

/** Mic icon */
function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

/** Stop / square icon */
function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

/** Waveform bars for speaking state */
function WaveformIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="4" y1="8" x2="4" y2="16" style={{ animation: 'wave-bar 0.8s ease-in-out infinite' }} />
      <line x1="8" y1="5" x2="8" y2="19" style={{ animation: 'wave-bar 0.8s ease-in-out infinite 0.1s' }} />
      <line x1="12" y1="3" x2="12" y2="21" style={{ animation: 'wave-bar 0.8s ease-in-out infinite 0.2s' }} />
      <line x1="16" y1="5" x2="16" y2="19" style={{ animation: 'wave-bar 0.8s ease-in-out infinite 0.3s' }} />
      <line x1="20" y1="8" x2="20" y2="16" style={{ animation: 'wave-bar 0.8s ease-in-out infinite 0.4s' }} />
    </svg>
  );
}

function getOrbIcon(state: CallState) {
  switch (state) {
    case 'connecting':
    case 'listening':
      return <MicIcon />;
    case 'speaking':
      return <WaveformIcon />;
    default:
      return <MicIcon />;
  }
}

export function VoiceAgent() {
  const vapiRef = useRef<Vapi | null>(null);
  const [state, setState] = useState<CallState>('idle');
  const [error, setError] = useState('');
  const [showRipple, setShowRipple] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = state === 'connecting' || state === 'listening' || state === 'speaking';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      vapiRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer for call duration
  useEffect(() => {
    if (active) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const start = useCallback(async () => {
    if (active) return;
    setError('');

    if (!publicConfig.vapiPublicKey || !publicConfig.vapiAssistantId) {
      setState('error');
      setError('Voice setup incomplete. Add Vapi keys to your environment.');
      return;
    }

    // ── Mobile fix: request mic permission explicitly from user gesture ──
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release immediately — Vapi will request its own stream
      stream.getTracks().forEach((t) => t.stop());
    } catch (err: unknown) {
      setState('error');
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone permission denied. Please allow mic access and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No microphone found on this device.');
        } else {
          setError(`Microphone error: ${err.message}`);
        }
      } else {
        setError('Could not access microphone. Please check permissions.');
      }
      return;
    }

    // Ripple animation
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 800);

    try {
      const client = vapiRef.current ?? new Vapi(publicConfig.vapiPublicKey);
      vapiRef.current = client;

      // Remove old listeners to avoid stacking on re-calls
      client.removeAllListeners();

      client.on('call-start', () => setState('listening'));
      client.on('call-end', () => setState('ended'));
      client.on('speech-start', () => setState('speaking'));
      client.on('speech-end', () => setState('listening'));
      client.on('error', () => {
        setState('error');
        setError('Voice connection interrupted. Tap to try again.');
      });

      setState('connecting');

      // Tell Vapi where to send tool calls
      const siteUrl = publicConfig.siteUrl || window.location.origin;
      const serverEndpoint = `${siteUrl}/api/vapi/server-url`;

      await client.start(publicConfig.vapiAssistantId, {
        serverUrl: serverEndpoint,
        server: { url: serverEndpoint },
      });
    } catch {
      setState('error');
      setError('Could not start voice session. Please try again.');
    }
  }, [active]);

  const end = useCallback(() => {
    vapiRef.current?.stop();
    setState('ended');
  }, []);

  const handleClick = () => {
    if (active) {
      end();
    } else {
      start();
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Orb */}
      <div className={`orb-wrapper orb-${state}`}>
        <div className="orb-ring orb-ring-outer" />
        <div className="orb-ring" />
        <div className="orb-ring orb-ring-inner" />

        {showRipple && <div className="orb-ripple" />}

        <button
          type="button"
          className="orb-core"
          onClick={handleClick}
          aria-label={active ? 'End conversation' : 'Start conversation'}
        >
          <div className="orb-icon" style={{ color: 'rgba(255,255,255,0.95)' }}>
            {active ? <StopIcon /> : getOrbIcon(state)}
          </div>
        </button>
      </div>

      {/* Status pill */}
      <div className={`status-pill is-${state}`}>
        <span className="status-dot" />
        <span className="font-display tracking-widest">
          {STATUS_TEXT[state]}
        </span>
        {active && (
          <span className="ml-1 tabular-nums text-[11px] opacity-60">
            {formatTime(elapsed)}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="animate-fade-in-up max-w-xs text-center text-sm leading-6 text-red-600/80">
          {error}
        </p>
      )}

      {/* Ended message */}
      {state === 'ended' && !error && (
        <p className="animate-fade-in-up text-center text-sm text-slate-500">
          Tap the orb to start a new conversation.
        </p>
      )}

      {/* Idle helper text */}
      {state === 'idle' && (
        <p className="max-w-[240px] text-center text-xs leading-5 text-slate-400">
          Your browser will ask for microphone access.
        </p>
      )}
    </div>
  );
}