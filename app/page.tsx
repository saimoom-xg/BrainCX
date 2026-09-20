import { VoiceAgent } from '@/components/VoiceAgent';

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-surface text-ink">
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      {/* Logo */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-center px-6 pt-8 sm:pt-10">
        <a href="/" className="font-display text-lg font-bold tracking-[-0.04em] text-ink/80 transition hover:text-ink">
          brain<span className="text-accent">cx</span>
        </a>
      </header>

      {/* Voice Agent — centered */}
      <div className="relative z-10">
        <VoiceAgent />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center px-6 pb-6 sm:pb-8">
        <span className="text-[11px] tracking-wide text-subtle">
          BrainCX AI · Voice Demo
        </span>
      </footer>
    </main>
  );
}