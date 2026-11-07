import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getSupabaseClient } from '../../lib/supabase';
import { Mail, Save, CheckCircle, Plus, X, Inbox, Trash2, Check, Clock, RefreshCw, AlertCircle } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at?: string;
  submittedAt?: string;
  is_read?: boolean;
  isRead?: boolean;
}

export const ContactManager: React.FC = () => {
  const { contactInfo, updateContactInfo, isSupabaseConfigured } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'settings' | 'messages'>('settings');
  const [formData, setFormData] = useState({ ...contactInfo });
  const [newTag, setNewTag] = useState('');
  const [saved, setSaved] = useState(false);

  // Inbound messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadInboundMessages();
  }, [isSupabaseConfigured]);

  const loadInboundMessages = async () => {
    setLoadingMessages(true);
    let allMsgs: ContactMessage[] = [];

    // 1. Load from Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('portfolio_contact_messages')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (!error && data) {
          allMsgs = data.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            submitted_at: m.submitted_at,
            is_read: Boolean(m.is_read),
          }));
        }
      } catch (e) {
        console.warn('Failed to load messages from Supabase:', e);
      }
    }

    // 2. Load from local backup storage
    const localMsgs = JSON.parse(localStorage.getItem('lingaraj_contact_messages') || '[]');
    if (localMsgs.length > 0 && allMsgs.length === 0) {
      allMsgs = localMsgs.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        submitted_at: m.submittedAt,
        is_read: Boolean(m.isRead),
      }));
    }

    setMessages(allMsgs);
    setLoadingMessages(false);
  };

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, is_read: !currentStatus, isRead: !currentStatus } : m
    );
    setMessages(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('portfolio_contact_messages')
          .update({ is_read: !currentStatus })
          .eq('id', id);
      } catch (e) {
        console.warn('Failed to update message status:', e);
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);

    // Remove from local storage
    const localMsgs = JSON.parse(localStorage.getItem('lingaraj_contact_messages') || '[]');
    localStorage.setItem(
      'lingaraj_contact_messages',
      JSON.stringify(localMsgs.filter((m: any) => m.id !== id))
    );

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_contact_messages').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete message in Supabase:', e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateContactInfo(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setFormData({
      ...formData,
      availabilityTags: [...(formData.availabilityTags || []), newTag.trim()],
    });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      availabilityTags: formData.availabilityTags.filter((t) => t !== tag),
    });
  };

  const unreadCount = messages.filter((m) => !m.is_read && !m.isRead).length;
  const filteredMessages =
    messageFilter === 'unread'
      ? messages.filter((m) => !m.is_read && !m.isRead)
      : messages;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#2563eb]" />
            <span>Contact & Inbound Communications</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your public contact information, immediate availability badges, and review inbound inquiries.
          </p>
        </div>

        {/* Tab switch between Settings and Messages */}
        <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Contact Settings
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'messages'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbound Messages</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
          <CheckCircle className="w-4 h-4" />
          <span>Contact details and availability tags updated successfully in Supabase!</span>
        </div>
      )}

      {/* TAB 1: CONTACT SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Direct Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.linkedInUrl}
                  onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.gitHubUrl}
                  onChange={(e) => setFormData({ ...formData, gitHubUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Notice Status Badge
                </label>
                <input
                  type="text"
                  value={formData.statusBadge}
                  onChange={(e) => setFormData({ ...formData, statusBadge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Role Headline
                </label>
                <input
                  type="text"
                  value={formData.roleHeadline}
                  onChange={(e) => setFormData({ ...formData, roleHeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Availability Summary
              </label>
              <textarea
                rows={2}
                value={formData.availabilitySummary}
                onChange={(e) => setFormData({ ...formData, availabilitySummary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Availability Filter Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.availabilityTags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] text-xs font-bold"
                  >
                    <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <X className="w-3.5 h-3.5 hover:text-rose-500" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. Immediate Joiner, Hybrid, Remote..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact Info</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: INBOUND MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessageFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  messageFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All Messages ({messages.length})
              </button>
              <button
                onClick={() => setMessageFilter('unread')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  messageFilter === 'unread'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <button
              onClick={loadInboundMessages}
              disabled={loadingMessages}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#2563eb]"
              title="Refresh messages from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${loadingMessages ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white">
                No Inbound Messages
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Visitor inquiries submitted via the public contact form will appear here and in your Supabase database table.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => {
                const isRead = Boolean(msg.is_read || msg.isRead);
                return (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border transition-all ${
                      isRead
                        ? 'border-slate-200 dark:border-slate-700 opacity-90'
                        : 'border-blue-400 dark:border-blue-600 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isRead ? 'bg-slate-300 dark:bg-slate-600' : 'bg-blue-600 animate-pulse'
                          }`}
                        />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {msg.name}
                        </h4>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.submitted_at && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.submitted_at).toLocaleString()}
                          </span>
                        )}

                        <button
                          onClick={() => handleMarkAsRead(msg.id, isRead)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
                          title={isRead ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          <Check className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-500' : ''}`} />
                          <span className="hidden sm:inline">{isRead ? 'Read' : 'Mark Read'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                      Subject: {msg.subject}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
