import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, BriefcaseBusiness, CheckCircle2, ExternalLink, Github, Globe2, Linkedin, Mail, MapPin, Share2, Twitter, Users } from 'lucide-react';
import { addBookmark, getAgency, getAgencies, getBookmarks, removeBookmark } from '@/lib/api';
import { Agency } from '@/lib/types';
import { StarRating } from '@/components/star-rating';
import { ReviewsModal } from '@/components/reviews-modal';
import { ReviewSubmissionModal } from '@/components/review-submission-modal';
import { AgencyLogo } from '@/components/agency-logo';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const socialIcon = { linkedin: Linkedin, github: Github, twitter: Twitter };
const formatPrice = (agency: Agency) => agency.pricing?.min
  ? `${agency.pricing.currency || 'USD'} ${agency.pricing.min.toLocaleString()}${agency.pricing.max ? `–${agency.pricing.max.toLocaleString()}` : '+'}`
  : 'Request a quote';

function ProfileSkeleton() {
  return <main className="min-h-screen animate-pulse bg-slate-50 p-6 dark:bg-slate-950"><div className="mx-auto max-w-6xl"><div className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800" /><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]"><div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" /><div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" /></div></div></main>;
}

export default function AgencyDetail() {
  const { id = '' } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [similar, setSimilar] = useState<Agency[]>([]);
  const [recommended, setRecommended] = useState<Agency[]>([]);
  const [reviews, setReviews] = useState(false);
  const [write, setWrite] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const result = await getAgency(id);
      setAgency(result.data);
      const [related, top] = await Promise.all([
        result.data.services?.length ? getAgencies(new URLSearchParams({ services: result.data.services[0], limit: '4', sort: 'rating' })) : Promise.resolve({ data: [] as Agency[] }),
        getAgencies(new URLSearchParams({ limit: '4', sort: 'rating' })),
      ]);
      setSimilar(related.data.filter((item) => item.id !== id).slice(0, 3));
      setRecommended(top.data.filter((item) => item.id !== id && !related.data.some((relatedItem) => relatedItem.id === item.id)).slice(0, 3));
      if (user) { const bookmarks = await getBookmarks(); setSaved(bookmarks.data.some((bookmark) => bookmark.agency?.id === id)); }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load this agency profile.');
    }
  };

  useEffect(() => { void load(); }, [id]);
  const toggleBookmark = async () => {
    if (!user) { navigate('/login', { state: { from: `/agency/${id}` } }); return; }
    try { if (saved) await removeBookmark(id); else await addBookmark(id); setSaved((value) => !value); toast({ title: saved ? 'Bookmark removed' : 'Agency saved' }); }
    catch (requestError) { toast({ title: 'Unable to update bookmark', description: requestError instanceof Error ? requestError.message : '', variant: 'destructive' }); }
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast({ title: 'Profile link copied' }); }
    catch { toast({ title: 'Copy failed', description: 'Copy the URL from your browser.', variant: 'destructive' }); }
  };
  if (error) return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center dark:bg-slate-950"><div><h1 className="text-2xl">Profile unavailable</h1><p className="mt-2 text-slate-500">{error}</p><Link to="/" className="mt-5 inline-block font-semibold text-primary">Browse agencies</Link></div></main>;
  if (!agency) return <ProfileSkeleton />;

  const socials = Object.entries(agency.socialLinks || {}).filter(([name, value]) => Boolean(value) && name in socialIcon) as Array<[keyof typeof socialIcon, string]>;
  const hasScreenshots = Boolean(agency.featuredImage || agency.portfolioLinks?.length);
  return <main className="min-h-screen bg-slate-50 pb-16 dark:bg-slate-950">
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950" />
      {agency.featuredImage && <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${agency.featuredImage})` }} />}
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <Link to="/" className="text-sm font-semibold text-blue-200 transition hover:text-white">← All agencies</Link>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
          <AgencyLogo name={agency.name} src={agency.logo} className="h-24 w-24 rounded-2xl border-white/40 shadow-xl" />
          <div className="flex-1"><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100">AGENCY PROFILE</span>{agency.websiteVerified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200"><CheckCircle2 className="h-3.5" /> Verified website</span>}</div><h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{agency.name}</h1><p className="mt-3 flex items-center gap-2 text-lg text-blue-100"><MapPin className="h-5" /> {agency.location}</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={toggleBookmark} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 font-semibold transition hover:bg-white/15"><Bookmark className={saved ? 'fill-current' : ''} /> {saved ? 'Saved' : 'Bookmark'}</button><button onClick={share} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 font-semibold transition hover:bg-white/15"><Share2 className="h-4" /> Share</button></div>
        </div>
      </div>
    </section>

    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-bold">About {agency.name}</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{agency.description || 'Agency information is being prepared.'}</p><div className="mt-7"><h3 className="text-base font-bold">Services</h3><div className="mt-3 flex flex-wrap gap-2">{agency.services.map((service) => <span key={service} className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-200">{service}</span>)}</div></div>{agency.technologies?.length ? <div className="mt-7"><h3 className="text-base font-bold">Technologies and platforms</h3><div className="mt-3 flex flex-wrap gap-2">{agency.technologies.map((technology) => <span key={technology} className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">{technology}</span>)}</div></div> : null}</section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-bold">Portfolio and screenshots</h2>{hasScreenshots ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{agency.featuredImage && <img src={agency.featuredImage} alt={`${agency.name} work`} className="aspect-video w-full rounded-xl border object-cover" loading="lazy" />}{agency.portfolioLinks?.map((link) => <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="group flex min-h-28 flex-col justify-between rounded-xl border bg-slate-50 p-4 font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm dark:bg-slate-950">View case study <ExternalLink className="h-4 transition-transform group-hover:translate-x-0.5" /></a>)}</div> : <p className="mt-3 text-slate-500">Portfolio screenshots will appear when published by the agency.</p>}</section>
        {agency.recommendationReasons?.length ? <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20"><h2 className="text-2xl font-bold">Why this agency</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{agency.recommendationReasons.map((reason) => <p key={reason} className="font-medium text-emerald-800 dark:text-emerald-200">✓ {reason}</p>)}</div></section> : null}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Customer reviews</h2><p className="mt-1 text-slate-500">{agency.reviewCount ? `${agency.reviewCount} customer reviews` : 'Be the first to share your experience.'}</p></div><button onClick={() => setReviews(true)} className="rounded-xl border px-4 py-2.5 font-semibold transition hover:bg-slate-50 dark:hover:bg-slate-800">Read reviews</button></div></section>
      </div>
      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500">Customer rating</p><p className="mt-1 text-4xl font-extrabold">{agency.rating.toFixed(1)}</p></div><StarRating rating={agency.rating} size="sm" showLabel={false} /></div><p className="mt-2 text-sm text-slate-500">From {agency.reviewCount} reviews</p><div className="mt-5 border-t pt-5"><p className="text-sm font-semibold text-slate-500">Ranking score</p><p className="mt-1 text-2xl font-bold">{agency.rankingScore?.toFixed(0) || '—'}</p><p className="mt-1 text-xs leading-5 text-slate-500">Calculated from verified presence, experience, portfolio, team size, technology fit, and customer feedback.</p></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><dl className="space-y-4 text-sm"><div className="flex gap-3"><BriefcaseBusiness className="mt-0.5 h-4 text-primary" /><div><dt className="font-semibold">Typical project pricing</dt><dd className="text-slate-500">{formatPrice(agency)}</dd></div></div>{agency.experienceYears && <div className="flex gap-3"><Globe2 className="mt-0.5 h-4 text-primary" /><div><dt className="font-semibold">Experience</dt><dd className="text-slate-500">{agency.experienceYears} years in business</dd></div></div>}{agency.employees && <div className="flex gap-3"><Users className="mt-0.5 h-4 text-primary" /><div><dt className="font-semibold">Team size</dt><dd className="text-slate-500">{agency.employees}+ professionals</dd></div></div>}</dl></section>
        <div className="space-y-2">{agency.websiteVerified ? <a href={agency.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">Visit Website <ExternalLink className="h-4" /></a> : <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-4 py-3 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Website currently unavailable</button>}<a href={`mailto:?subject=${encodeURIComponent(`Agency enquiry: ${agency.name}`)}`} className="flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"><Mail className="h-4" /> Contact agency</a><button onClick={() => setWrite(true)} className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700">Write a review</button></div>
        {socials.length ? <div className="flex gap-2 px-1">{socials.map(([name, url]) => { const Icon = socialIcon[name]; return <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${agency.name} on ${name}`} className="rounded-lg border bg-white p-2 text-slate-600 transition hover:text-primary dark:bg-slate-900"><Icon className="h-4" /></a>; })}</div> : null}
      </aside>
    </div>
    {(similar.length || recommended.length) ? <section className="mx-auto max-w-6xl px-6"><div className="grid gap-10 lg:grid-cols-2">{[["Similar agencies", similar], ["Recommended agencies", recommended]].map(([title, items]) => (items as Agency[]).length ? <div key={title as string}><h2 className="mb-4 text-2xl font-bold">{title as string}</h2><div className="grid gap-3">{(items as Agency[]).map((item) => <Link key={item.id} to={`/agency/${item.id}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><AgencyLogo name={item.name} src={item.logo} className="h-12 w-12 rounded-xl" /><div className="min-w-0 flex-1"><h3 className="truncate text-base font-bold">{item.name}</h3><p className="truncate text-sm text-slate-500">{item.location}</p></div><span className="text-sm font-semibold text-primary">View</span></Link>)}</div></div> : null)}</div></section> : null}
    <ReviewsModal isOpen={reviews} onClose={() => setReviews(false)} agencyName={agency.name} agencyId={agency.id} rating={agency.rating} reviewCount={agency.reviewCount} onChanged={load} />
    <ReviewSubmissionModal isOpen={write} onClose={() => setWrite(false)} agencyName={agency.name} agencyId={agency.id} onSubmitSuccess={load} />
  </main>;
}
