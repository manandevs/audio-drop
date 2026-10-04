'use client';

import React, { useState } from 'react';
import { 
  Music, ShieldCheck, Smartphone, Zap, 
  ChevronDown, ChevronUp, Copy, Check, AlertCircle, RefreshCw, 
  Share2, Headphones, Lock, ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePreview } from '@/hooks/usePreview';

export default function DownCloudMeApp() {
  const [urlInput, setUrlInput] = useState('');
  const { data, isLoading, error, fetchPreview, setError } = usePreview();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  const sampleUrl = 'https://soundcloud.com/jroomy/birds-sound';

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchPreview(urlInput);
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text);
          fetchPreview(text);
          return;
        }
      }
      throw new Error('Clipboard API unavailable');
    } catch {
      setError('Please paste the URL manually into the input box.');
    }
  };

  const handleSampleClick = () => {
    setUrlInput(sampleUrl);
    fetchPreview(sampleUrl);
  };

  const faqs = [
    {
      q: "How to preview SoundCloud tracks on iPhone or Android?",
      a: "Copy the SoundCloud track link, paste it into our search box above, wait for the metadata preview, and play or open it instantly."
    },
    {
      q: "Is DownCloudMe 100% free to use?",
      a: "Yes, DownCloudMe is completely free with no registration, accounts, or subscriptions required."
    },
    {
      q: "What audio quality is provided?",
      a: "We provide original streaming quality as provided directly by SoundCloud servers."
    },
    {
      q: "Can I preview entire playlists or albums?",
      a: "Yes! Paste any SoundCloud track or set link to fetch the official embedded player instantly."
    },
    {
      q: "Is it safe and secure?",
      a: "All previews are loaded securely via encrypted connections. We don't store your URLs or files."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col font-sans selection:bg-[#FF5500] selection:text-white">
      
      {/* 1. Header (Dark Theme) */}
      <header className="sticky top-0 z-50 bg-[#111827] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FF5500] to-amber-500 flex items-center justify-center shadow-lg shadow-[#FF5500]/30">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                DownCloud<span className="text-[#FF5500]">Me</span>
              </Link>
              <p className="text-[11px] text-slate-400 hidden sm:block">Soundcloud Downloader &amp; Preview Tool</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-to" className="hover:text-white transition">How to Use</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#how-to" 
              className="px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#e04c00] text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-[#FF5500]/25 flex items-center gap-1.5"
            >
              <Headphones className="h-4 w-4" />
              <span>Get Started</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#111827] to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF5500_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-medium animate-pulse">
            <Zap className="h-3.5 w-3.5" />
            <span>New: Official SoundCloud oEmbed Player Integration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white balance">
            SoundCloud Track <span className="text-[#FF5500]">Previewer</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Preview and embed SoundCloud tracks and playlists instantly with official high fidelity audio players. No software installation or registration needed.
          </p>

          {/* Search Box Card */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/15 p-3 sm:p-4 rounded-3xl shadow-2xl max-w-3xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Paste SoundCloud track or playlist URL here..."
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setError(null); }}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-4 text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500] transition shadow-inner"
                />
                {urlInput && (
                  <button 
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition border border-slate-700 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  title="Paste from clipboard"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Paste</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 rounded-2xl bg-[#FF5500] hover:bg-[#e04c00] text-white font-bold text-base transition shadow-lg shadow-[#FF5500]/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Headphones className="h-5 w-5" />
                      <span>Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2 text-left">
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-slate-400">Try sample link:</span>
                <button 
                  type="button"
                  onClick={handleSampleClick}
                  className="text-[#FF5500] hover:underline font-mono truncate max-w-[240px] sm:max-w-md text-left cursor-pointer"
                >
                  {sampleUrl}
                </button>
              </span>
              <span className="text-[11px] text-slate-400">Click to test instantly</span>
            </div>
          </form>

        </div>
      </section>

      {/* Result Card (Dark/Orange style, thumbnail, title, author, embedded player, Open on SoundCloud button, no download button) */}
      {data && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full -mt-10 relative z-30">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 shadow-md border border-slate-100">
                <Image 
                  src={data.thumbnailUrl} 
                  alt={data.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 space-y-3 text-center md:text-left w-full">
                <span className="text-xs font-semibold text-[#FF5500] tracking-wider uppercase">
                  SoundCloud Preview Ready
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{data.title}</h3>
                <p className="text-sm font-medium text-slate-600">By {data.author}</p>

                <div className="pt-2">
                  <a
                    href={urlInput}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#FF5500] hover:bg-[#e04c00] text-white font-bold text-sm transition shadow-lg shadow-[#FF5500]/25"
                  >
                    <span>Open on SoundCloud</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded SoundCloud Player */}
            {data.html && (
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-bold text-slate-900 text-sm mb-3">Embedded Player</h4>
                <div 
                  className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-2"
                  dangerouslySetInnerHTML={{ __html: data.html }}
                />
              </div>
            )}

          </div>
        </section>
      )}

      {/* Value Proposition Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'No Account Required', desc: 'Instant access without sign-up', icon: ShieldCheck },
            { title: 'Original Quality', desc: 'Direct streaming preservation', icon: Zap },
            { title: 'Mobile & Desktop Ready', desc: 'Works on iOS, Android, Mac & PC', icon: Smartphone },
            { title: '100% Secure & Private', desc: 'Encrypted & no persistent URLs/logs', icon: Lock },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#FF5500] tracking-wider uppercase">Why Choose DownCloudMe</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Engineered for speed, fidelity, and reliability
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            The ultimate SoundCloud preview tool built to give you uninterrupted access to your favorite music and audio tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Original Quality Streaming",
              desc: "Embed pristine audio streams directly from SoundCloud servers as provided by the artist for clean listening.",
              icon: Headphones
            },
            {
              title: "Playlist & Album Support",
              desc: "Paste any set or track link to fetch official interactive widgets with lightning-fast oEmbed resolution.",
              icon: Music
            },
            {
              title: "100% Safe & Anonymous",
              desc: "No adware, no browser extensions, and no tracking cookies. We don't store your URLs or files.",
              icon: ShieldCheck
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-[#FF5500]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-Step Instructions */}
      <section id="how-to" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-100/70 rounded-3xl my-8 border border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">How to Preview SoundCloud Songs</h2>
          <p className="text-slate-600 text-sm mt-2">Simple 3-step guide for desktop and mobile users.</p>

          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setActiveTab('desktop')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'desktop' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Desktop (PC / Mac)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mobile')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'mobile' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Mobile (iOS / Android)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {activeTab === 'desktop' ? (
            <>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">01</span>
                <h3 className="font-bold text-slate-900 mb-2">Copy Track Link</h3>
                <p className="text-xs text-slate-600">Open SoundCloud, locate your track or playlist, and copy the URL from your browser address bar.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">02</span>
                <h3 className="font-bold text-slate-900 mb-2">Paste into DownCloudMe</h3>
                <p className="text-xs text-slate-600">Paste the URL into the search box at the top of this page and click the Preview button.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">03</span>
                <h3 className="font-bold text-slate-900 mb-2">Play &amp; Enjoy</h3>
                <p className="text-xs text-slate-600">Interact with the embedded SoundCloud audio player or open the track directly on SoundCloud.</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">01</span>
                <h3 className="font-bold text-slate-900 mb-2">Copy Link from App</h3>
                <p className="text-xs text-slate-600">Tap the &apos;Share&apos; button on the SoundCloud mobile app and select &apos;Copy Link&apos;.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">02</span>
                <h3 className="font-bold text-slate-900 mb-2">Paste &amp; Preview</h3>
                <p className="text-xs text-slate-600">Open Safari or Chrome on your phone, visit DownCloudMe, paste the link and hit Preview.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">03</span>
                <h3 className="font-bold text-slate-900 mb-2">Stream on Mobile</h3>
                <p className="text-xs text-slate-600">Stream tracks instantly using the responsive embedded player right inside your mobile browser.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm mt-2">Got questions about previewing SoundCloud tracks? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-[#FF5500] shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer & Sticky Bar */}
      <aside aria-label="Quick sharing toolbar" className="fixed bottom-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 hidden sm:flex items-center gap-3">
        <span className="text-xs font-medium text-slate-300">Share DownCloudMe:</span>
        <button 
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#FF5500] hover:bg-[#e04c00] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
        >
          {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          {copiedLink ? 'Copied!' : 'Copy Link'}
        </button>
      </aside>

      <footer className="bg-[#111827] text-slate-400 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#FF5500] flex items-center justify-center text-white font-bold">
                  D
                </div>
                <span className="text-lg font-bold text-white">DownCloudMe</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                DownCloudMe is a fast, reliable SoundCloud preview and embedding tool designed for music enthusiasts, creators, and listeners worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition">Core Features</a></li>
                <li><a href="#how-to" className="hover:text-white transition">How to Use</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ &amp; Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal &amp; Policy</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Copyright &amp; Fair Use</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
            <p>© {new Date().getFullYear()} DownCloudMe. Not affiliated with SoundCloud Ltd. Designed for personal audio preview.</p>
            <p className="text-[11px] text-slate-600">Only tracks the artist has made downloadable can be saved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
