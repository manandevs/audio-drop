'use client';

import React, { useState } from 'react';
import { 
  Download, Music, ShieldCheck, Smartphone, Zap, CheckCircle2, 
  ChevronDown, ChevronUp, Copy, Check, AlertCircle, RefreshCw, 
  Share2, Headphones, Lock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TrackMetadata {
  id: string;
  url: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  bitrates: string[];
  streamUrl: string;
  fileSize: string;
}

export default function DownCloudMeApp() {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trackData, setTrackData] = useState<TrackMetadata | null>(null);
  const [selectedBitrate, setSelectedBitrate] = useState('320kbps (High Quality)');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  const sampleUrl = 'https://soundcloud.com/jroomy/birds-sound';

  // Handle URL conversion
  const handleConvert = async (targetUrl?: string) => {
    const queryUrl = targetUrl || urlInput;
    if (!queryUrl.trim()) {
      setErrorMsg('Please enter a valid SoundCloud track or playlist URL.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setTrackData(null);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: queryUrl })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to convert URL.');
      }

      setTrackData(data.track);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download MP3
  const handleDownload = async () => {
    if (!trackData) return;
    setIsDownloading(true);

    try {
      const downloadApiUrl = `/api/download?url=${encodeURIComponent(trackData.streamUrl)}&title=${encodeURIComponent(trackData.title)}&artist=${encodeURIComponent(trackData.artist)}`;
      
      const a = document.createElement('a');
      a.href = downloadApiUrl;
      a.download = `${trackData.artist} - ${trackData.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download trigger error:', err);
      setErrorMsg('Failed to download file. Please try again.');
    } finally {
      setTimeout(() => setIsDownloading(false), 1500);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        handleConvert(text);
      }
    } catch {
      setErrorMsg('Clipboard permission denied or unavailable.');
    }
  };

  const faqs = [
    {
      q: "How to download SoundCloud songs on iPhone or Android?",
      a: "Copy the SoundCloud track link, paste it into our search box above, wait for the metadata conversion, and tap the 'Download MP3' button. On iOS (Safari), check your downloads manager to save the file to your Files app."
    },
    {
      q: "Is DownCloudMe 100% free to use?",
      a: "Yes, DownCloudMe is completely free with no registration, accounts, or subscriptions required. Convert and download as many tracks as you need."
    },
    {
      q: "What audio bitrates are supported?",
      a: "We support highest quality up to 320kbps MP3 for pristine listening, as well as 192kbps and 128kbps for compact storage."
    },
    {
      q: "Can I download entire playlists or albums?",
      a: "Yes! Paste any SoundCloud playlist or album link to fetch all tracks instantly for individual download or batch conversion."
    },
    {
      q: "Is it safe and secure?",
      a: "All downloads are processed securely via encrypted connections without storing any personal user data or logs."
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
              <p className="text-[11px] text-slate-400 hidden sm:block">Soundcloud Downloader to MP3 Converter</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-to" className="hover:text-white transition">How to Download</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#how-to" 
              className="px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#e04c00] text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-[#FF5500]/25 flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Get Started</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#111827] to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF5500_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Product update alert badge box */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-medium animate-pulse">
            <Zap className="h-3.5 w-3.5" />
            <span>New: 320kbps Lossless MP3 Engine & Playlist Batch Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white balance">
            SoundCloud to MP3 <span className="text-[#FF5500]">Downloader</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Convert and download SoundCloud tracks, sets, and playlists in high quality 320kbps MP3 instantly. No software installation or registration needed.
          </p>

          {/* Search Box Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-3 sm:p-4 rounded-3xl shadow-2xl max-w-3xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Paste SoundCloud track or playlist URL here..."
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setErrorMsg(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-4 text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FF5500] transition shadow-inner"
                />
                {urlInput && (
                  <button 
                    onClick={() => setUrlInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePasteClipboard}
                  className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition border border-slate-700 flex items-center justify-center gap-1.5 shrink-0"
                  title="Paste from clipboard"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Paste</span>
                </button>

                <button
                  onClick={() => handleConvert()}
                  disabled={isLoading}
                  className="px-8 py-4 rounded-2xl bg-[#FF5500] hover:bg-[#e04c00] text-white font-bold text-base transition shadow-lg shadow-[#FF5500]/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sample Link Display Box */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2 text-left">
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-slate-400">Try sample link:</span>
                <button 
                  onClick={() => { setUrlInput(sampleUrl); handleConvert(sampleUrl); }}
                  className="text-[#FF5500] hover:underline font-mono truncate max-w-[240px] sm:max-w-md text-left"
                >
                  {sampleUrl}
                </button>
              </span>
              <span className="text-[11px] text-slate-400">Click to test instantly</span>
            </div>
          </div>

        </div>
      </section>

      {/* Result Card Modal / Section (When Track Converted) */}
      {trackData && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full -mt-10 relative z-30">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 shadow-md border border-slate-100">
              <Image 
                src={trackData.thumbnail} 
                alt={trackData.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono font-medium">
                  {trackData.duration}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <div>
                <span className="text-xs font-semibold text-[#FF5500] tracking-wider uppercase">Conversion Successful</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 line-clamp-1">{trackData.title}</h3>
                <p className="text-sm font-medium text-slate-600 mt-0.5">{trackData.artist}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <span className="font-semibold text-slate-700">Size:</span> {trackData.fileSize}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <span className="font-semibold text-slate-700">Format:</span> MP3 Audio
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <select
                  value={selectedBitrate}
                  onChange={(e) => setSelectedBitrate(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF5500]"
                >
                  {trackData.bitrates.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#FF5500] hover:bg-[#e04c00] text-white font-bold text-sm transition shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Downloading MP3...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download MP3</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Value Proposition Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'No Account Required', desc: 'Instant access without sign-up', icon: ShieldCheck },
            { title: 'Up to 320kbps Quality', desc: 'Crystal clear high fidelity sound', icon: Zap },
            { title: 'Mobile & Desktop Ready', desc: 'Works on iOS, Android, Mac & PC', icon: Smartphone },
            { title: '100% Secure & Private', desc: 'Encrypted downloads & no logging', icon: Lock },
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

      {/* 4. Core Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#FF5500] tracking-wider uppercase">Why Choose DownCloudMe</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Engineered for speed, fidelity, and reliability
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            The ultimate SoundCloud converter built to give you uninterrupted access to your favorite music and audio tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Hi-Res Audio (320kbps)",
              desc: "Extract pristine audio streams directly from SoundCloud servers encoded at the highest possible bitrate for audiophile playback.",
              icon: Headphones
            },
            {
              title: "Playlist & Album Support",
              desc: "Paste any set or playlist link to convert dozens of tracks simultaneously with lightning-fast batch processing.",
              icon: Music
            },
            {
              title: "100% Safe & Anonymous",
              desc: "No adware, no browser extensions, and no tracking cookies. Your downloads remain completely confidential.",
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

      {/* 5. Step-by-Step Instructions ("How to Download") */}
      <section id="how-to" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-100/70 rounded-3xl my-8 border border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">How to Download SoundCloud Songs</h2>
          <p className="text-slate-600 text-sm mt-2">Simple 3-step guide for desktop and mobile users.</p>

          {/* Desktop / Mobile Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('desktop')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'desktop' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Desktop (PC / Mac)
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
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
                <p className="text-xs text-slate-600">Paste the URL into the search box at the top of this page and click the Download button.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">03</span>
                <h3 className="font-bold text-slate-900 mb-2">Save MP3 File</h3>
                <p className="text-xs text-slate-600">Choose your preferred bitrate (320kbps recommended) and click Download MP3 to save to your computer.</p>
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
                <h3 className="font-bold text-slate-900 mb-2">Paste &amp; Convert</h3>
                <p className="text-xs text-slate-600">Open Safari or Chrome on your phone, visit DownCloudMe, paste the link and hit Download.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-200">03</span>
                <h3 className="font-bold text-slate-900 mb-2">Access in Files App</h3>
                <p className="text-xs text-slate-600">Download the MP3 and access it instantly through your device&apos;s Files or Downloads folder.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 6. Supported Formats & Advanced Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-[#FF5500]/20 text-[#FF5500] text-xs font-semibold">Pro Specifications</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Supported Bitrates &amp; Formats</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Whether you need maximum acoustic fidelity or compact storage for mobile offline listening, DownCloudMe supports 320kbps, 192kbps, and 128kbps MP3 exports. Works seamlessly across Chrome, Safari, Firefox, and Edge.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#FF5500]" />
              <span className="text-sm font-semibold">320kbps Lossless MP3</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#FF5500]" />
              <span className="text-sm font-semibold">Playlist &amp; Set Extraction</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#FF5500]" />
              <span className="text-sm font-semibold">Zero Software Installation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm mt-2">Got questions about downloading from SoundCloud? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
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

      {/* 8. Footer & Sticky Bar */}
      <aside aria-label="Quick sharing toolbar" className="fixed bottom-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 hidden sm:flex items-center gap-3">
        <span className="text-xs font-medium text-slate-300">Share DownCloudMe:</span>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#FF5500] hover:bg-[#e04c00] text-xs font-semibold transition flex items-center gap-1.5"
        >
          {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          {copiedLink ? 'Link Copied!' : 'Copy Link'}
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
                DownCloudMe is a fast, reliable SoundCloud to MP3 downloader tool designed for music enthusiasts, creators, and listeners worldwide. Convert tracks instantly in high fidelity 320kbps.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition">Core Features</a></li>
                <li><a href="#how-to" className="hover:text-white transition">How to Download</a></li>
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
            <p>© {new Date().getFullYear()} DownCloudMe. Not affiliated with SoundCloud Ltd. Designed for personal offline audio conversion.</p>
            <p className="text-[11px] text-slate-600">Please respect artists&apos; copyright. Do not download copyrighted tracks for commercial distribution.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
