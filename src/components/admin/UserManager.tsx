import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRegistration, ApprovalStatus } from '../../types/portfolio';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  Mail,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const {
    registrations,
    pendingRegistrationsCount,
    fetchRegistrations,
    approveUser,
    rejectUser,
    isAdmin,
  } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'all' | ApprovalStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApprove = async (user: UserRegistration) => {
    setProcessingId(user.id);
    setFeedback(null);
    try {
      const res = await approveUser(user.id || user.email);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `User ${user.fullName} (${user.email}) has been approved as a QA Viewer.`,
        });
      } else {
        setFeedback({
          type: 'error',
          text: res.error || 'Failed to approve user registration.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Error occurred during approval.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (user: UserRegistration) => {
    setProcessingId(user.id);
    setFeedback(null);
    try {
      const res = await rejectUser(user.id || user.email, 'Access declined by administrator.');
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `User ${user.fullName} (${user.email}) has been rejected.`,
        });
      } else {
        setFeedback({
          type: 'error',
          text: res.error || 'Failed to reject user registration.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Error occurred during rejection.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = registrations.filter((u) => {
    const matchesFilter = activeFilter === 'all' || u.status === activeFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCount = registrations.length;
  const approvedCount = registrations.filter((r) => r.status === 'approved').length;
  const rejectedCount = registrations.filter((r) => r.status === 'rejected').length;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#2563eb]" />
            <span>User Registrations & Approvals</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review and approve user registrations. Approving users grants access to protected QA Member resources. Administrative privileges remain strictly exclusive to Lingaraj.
          </p>
        </div>

        <button
          onClick={() => fetchRegistrations()}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-bold">{feedback.text}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* SECURITY BANNER */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
        <Lock className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Strict Role & Privilege Isolation:</span>
          <p className="text-blue-800 dark:text-blue-300">
            Only Lingaraj (<span className="font-mono font-semibold">lingarajmb1997@gmail.com</span>) can hold the Administrator role. Approved users are strictly assigned the <span className="font-bold">Viewer</span> role and cannot edit portfolio content, replace resumes, or approve users.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-blue-50 dark:bg-blue-950/50 border-[#2563eb] ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalCount}
          </div>
        </div>

        <div
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'pending'
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 text-xs font-bold uppercase">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pendingRegistrationsCount}
          </div>
        </div>

        <div
          onClick={() => setActiveFilter('approved')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'approved'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 text-xs font-bold uppercase">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {approvedCount}
          </div>
        </div>

        <div
          onClick={() => setActiveFilter('rejected')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'rejected'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 text-xs font-bold uppercase">
            <span>Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {rejectedCount}
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            <span>Pending</span>
            {pendingRegistrationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-amber-700 font-black">
                {pendingRegistrationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-600 hover:text-emerald-700'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-600 hover:text-rose-700'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
        </div>
      </div>

      {/* USER LIST TABLE */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold">No registrations found matching this filter.</p>
            <p className="text-xs text-slate-400">
              When new visitors register through the portal, their records will appear here for administrator review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredUsers.map((reg) => {
              const isOwnerAccount = reg.email.toLowerCase() === 'lingarajmb1997@gmail.com';
              const isBusy = processingId === reg.id;

              return (
                <div
                  key={reg.id || reg.email}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors"
                >
                  {/* User Identity */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {reg.fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {reg.fullName}
                        </h4>
                        {isOwnerAccount && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#2563eb] dark:bg-blue-900/60 dark:text-blue-300">
                            PORTFOLIO OWNER
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{reg.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(reg.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status, Role & Action Controls */}
                  <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                    {/* Role Pill */}
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {isOwnerAccount ? 'Admin' : 'Viewer'}
                    </span>

                    {/* Status Pill */}
                    {reg.status === 'pending' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}

                    {reg.status === 'approved' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved</span>
                      </span>
                    )}

                    {reg.status === 'rejected' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}

                    {/* Actions (Only Administrator can execute) */}
                    {isAdmin && !isOwnerAccount && (
                      <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                        {reg.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(reg)}
                            disabled={isBusy}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 disabled:opacity-50"
                            title="Approve as Viewer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {reg.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(reg)}
                            disabled={isBusy}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                            title="Reject Registration"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
