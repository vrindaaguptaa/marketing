import { useState } from 'react';

export function AgencyLogo({ name, src, className = '' }: { name: string; src?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'A';
  const frame = `grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm ${className}`;
  if (!src || failed) return <div className={`${frame} bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-0 text-sm font-extrabold tracking-wide text-white shadow-blue-900/15`} aria-label={`${name} initials`}>{initials}</div>;
  return <div className={frame}><img src={src} alt={`${name} logo`} onError={() => setFailed(true)} className="h-full w-full object-contain opacity-0 transition-opacity duration-500 motion-reduce:transition-none" onLoad={(event) => { event.currentTarget.classList.remove('opacity-0'); }} loading="lazy" decoding="async" /></div>;
}
