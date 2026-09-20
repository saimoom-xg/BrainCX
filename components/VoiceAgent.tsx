'use client';

import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { publicConfig } from '@/lib/config';

type CallState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'ended' | 'error';

const statusCopy: Record<CallState, string> = { idle: 'Talk to BrainCX', connecting: 'Connecting...', listening: 'Listening...', speaking: 'BrainCX is speaking...', ended: 'Conversation ended', error: 'Something went wrong. Please try again.' };

export function VoiceAgent() {
  const vapi = useRef<Vapi | null>(null);
  const [state, setState] = useState<CallState>('idle');
  const [error, setError] = useState('');

  useEffect(() => () => { vapi.current?.stop(); }, []);

  const start = async () => {
    if (state === 'connecting' || state === 'listening' || state === 'speaking') return;
    setError('');
    if (!publicConfig.vapiPublicKey || !publicConfig.vapiAssistantId) {
      setState('error');
      setError('Voice setup is not complete. Add the Vapi public key and assistant ID to your environment.');
      return;
    }
    try {
      const client = vapi.current ?? new Vapi(publicConfig.vapiPublicKey);
      vapi.current = client;
      client.on('call-start', () => setState('listening'));
      client.on('call-end', () => setState('ended'));
      client.on('speech-start', () => setState('speaking'));
      client.on('speech-end', () => setState('listening'));
      client.on('error', () => { setState('error'); setError('The voice connection was interrupted. Please try again.'); });
      setState('connecting');
      await client.start(publicConfig.vapiAssistantId);
    } catch {
      setState('error');
      setError('We could not access the voice agent. Check microphone permission and try again.');
    }
  };

  const end = () => { vapi.current?.stop(); setState('ended'); };
  const active = state === 'connecting' || state === 'listening' || state === 'speaking';

  return <div className="mt-12 flex flex-col items-start gap-5">
    <div className="flex flex-wrap items-center gap-4">
      <button type="button" onClick={active ? end : start} aria-label={active ? 'End BrainCX conversation' : 'Start BrainCX conversation'} className={`group inline-flex items-center gap-3 rounded-full px-6 py-4 font-display text-base font-bold transition focus:outline-none focus:ring-4 focus:ring-[#0a8f54]/25 ${active ? 'bg-ink text-paper' : 'bg-[#0a8f54] text-white hover:bg-[#087444]'}`}>
        <span className={`flex h-3 w-3 rounded-full bg-current ${active ? 'animate-pulse' : ''}`} />
        {active ? 'End conversation' : statusCopy[state]}
      </button>
      {active && <span role="status" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">{statusCopy[state]}</span>}
    </div>
    {(error || state === 'ended') && <p role="status" className={`max-w-lg text-sm ${error ? 'text-[#a43b2e]' : 'text-ink/55'}`}>{error || statusCopy[state]}</p>}
    <p className="max-w-sm text-xs leading-5 text-ink/45">Your browser will ask for microphone access. This demo uses a live voice connection and real calendar data when configured.</p>
  </div>;
}