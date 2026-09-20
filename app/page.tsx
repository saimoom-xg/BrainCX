import { VoiceAgent } from '@/components/VoiceAgent';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-7 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-ink/15 pb-5">
          <a href="/" className="font-display text-xl font-bold tracking-[-0.04em]">brain<span className="text-[#0a8f54]">cx</span></a>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">AI CX Operator</span>
        </header>
        <section className="relative flex flex-1 flex-col justify-center py-20 lg:py-24">
          <div className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full border-[42px] border-[#b9f6d2]/70 sm:h-96 sm:w-96" />
          <div className="relative z-10 max-w-4xl">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[#0a8f54]">For high consequence verticals</p>
            <h1 className="max-w-4xl font-display text-[clamp(3.5rem,9vw,8.5rem)] font-medium leading-[0.88] tracking-[-0.075em]">AI CX Operator<br /><span className="text-ink/45">with a human ear.</span></h1>
            <p className="mt-9 max-w-md text-lg leading-8 text-ink/65">BrainCX redesigns, builds, and runs customer conversations, giving existing teams more capacity at scale.</p>
            <VoiceAgent />
          </div>
          <div className="relative z-10 mt-20 grid max-w-3xl grid-cols-1 gap-6 border-t border-ink/15 pt-6 text-sm text-ink/55 sm:grid-cols-3">
            <div><strong className="font-display text-2xl text-ink">200%</strong><p className="mt-1">enrollment lift across 5 universities</p></div>
            <div><strong className="font-display text-2xl text-ink">40%</strong><p className="mt-1">bilingual booking lift in healthcare</p></div>
            <div><strong className="font-display text-2xl text-ink">35%</strong><p className="mt-1">AHT reduction in telecom</p></div>
          </div>
        </section>
        <footer className="flex flex-col gap-2 border-t border-ink/15 py-5 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between"><span>BrainCX AI Inc. · West Palm Beach, Florida</span><span>Conversation preview · No account required</span></footer>
      </div>
    </main>
  );
}