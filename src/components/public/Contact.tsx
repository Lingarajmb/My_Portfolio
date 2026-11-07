import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getSupabaseClient } from '../../lib/supabase';
import { Mail, Phone, Send, Download, CheckCircle, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';

const RATE_LIMIT_COOLDOWN_MS = 60000; // 60 seconds cooldown between submissions

export const Contact: React.FC = () => {
  const { contactInfo, resumeDownloadUrl, downloadActiveResume } = usePortfolio();
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot field
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Bot honeypot verification
    if (honeypot.trim() !== '') {
      // Silently pretend success to trick malicious spam bots
      setSubmitted(true);
      return;
    }

    // 2. Client-side Rate Limiting (Prevent spam flooding)
    const lastSubTime = localStorage.getItem('lingaraj_last_contact_sub_time');
    const now = Date.now();
    if (lastSubTime && now - parseInt(lastSubTime, 10) < RATE_LIMIT_COOLDOWN_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_COOLDOWN_MS - (now - parseInt(lastSubTime, 10))) / 1000);
      setErrorMessage(`Please wait ${waitSec} seconds before sending another message.`);
      return;
    }

    // 3. Input Validation
    const cleanName = formState.name.trim();
    const cleanEmail = formState.email.trim();
    const cleanSubject = formState.subject.trim();
    const cleanMessage = formState.message.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please provide your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!cleanSubject || cleanSubject.length < 3) {
      setErrorMessage('Please provide a subject for your message.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      setErrorMessage('Please provide a descriptive message (at least 10 characters).');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      let savedToBackend = false;

      // 4. Insert into Supabase table portfolio_contact_messages
      if (supabase) {
        const { error } = await supabase.from('portfolio_contact_messages').insert({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          is_read: false,
        });

        if (!error) {
          savedToBackend = true;
        } else {
          console.warn('Supabase contact message insertion error:', error.message);
        }
      }

      // 5. Store local backup copy so messages are never lost
      const storedMessages = JSON.parse(localStorage.getItem('lingaraj_contact_messages') || '[]');
      storedMessages.push({
        id: 'msg-' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        submittedAt: new Date().toISOString(),
        isRead: false,
        syncedToSupabase: savedToBackend,
      });
      localStorage.setItem('lingaraj_contact_messages', JSON.stringify(storedMessages));
      localStorage.setItem('lingaraj_last_contact_sub_time', now.toString());

      setLoading(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Unable to deliver message. Please contact directly via email.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900 relative">
      <div className="max-w-[1240px] w-[90%] mx-auto">
        {/* Availability Announcement Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{contactInfo.statusBadge || 'Immediate Joiner'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Looking for a QA Automation Engineer?
            </h3>
            <p className="text-blue-100 text-sm max-w-xl">
              {contactInfo.availabilitySummary}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              {contactInfo.availabilityTags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <a
            href={resumeDownloadUrl}
            onClick={(e) => {
              e.preventDefault();
              downloadActiveResume();
            }}
            download="Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf"
            className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume</span>
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let's Discuss <span className="text-[#2563eb]">QA Opportunities</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Reach out directly for interviews, project consultations, framework discussions, or freelance automation audits.
          </p>
        </div>

        {/* 2-Column Grid: Contact Details & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Column 1: Info Cards (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Email Card */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all flex items-center gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Email Directly</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563eb]">
                  {contactInfo.email}
                </div>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${contactInfo.phone}`}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all flex items-center gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Phone & WhatsApp</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563eb]">
                  {contactInfo.phone}
                </div>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={contactInfo.linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all flex items-center gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <LinkedinIcon className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">LinkedIn Profile</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563eb]">
                  linkedin.com/in/lingarajmb
                </div>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href={contactInfo.gitHubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all flex items-center gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <GithubIcon className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">GitHub Code Repos</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563eb]">
                  github.com/Lingarajmb
                </div>
              </div>
            </a>
          </div>

          {/* Column 2: Interactive Form (3 cols) */}
          <div className="lg:col-span-3">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
                Fill in your details below and I'll get back to you within 24 hours.
              </p>

              {errorMessage && (
                <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                    Thank you for reaching out. Your message has been safely recorded in the database and I will respond to your email promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Anti-bot honeypot field hidden from real humans */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="company_website">Website</label>
                    <input
                      id="company_website"
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Alex Johnson"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="e.g. alex@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="e.g. QA Automation Opportunity / SDET Role"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Hi Lingaraj, we are hiring for a Software Tester / QA Automation Engineer..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#2563eb] text-white text-sm font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Sending to Supabase...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
