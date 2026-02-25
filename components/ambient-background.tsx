export default function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-pulse-slow absolute -top-40 -right-40 h-96 w-96 rounded-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
      <div className="animate-pulse-slow absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-linear-to-tr from-violet-500/15 via-fuchsia-500/10 to-transparent blur-3xl [animation-delay:1s]" />
      <div className="animate-pulse-slow absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-linear-to-tl from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl [animation-delay:2s]" />
    </div>
  );
}
