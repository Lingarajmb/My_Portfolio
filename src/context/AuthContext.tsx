import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabaseClient, AUTHORIZED_ADMIN_EMAIL, getSupabaseCredentials } from '../lib/supabase';
import { UserRegistration, ApprovalStatus, UserRole } from '../types/portfolio';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isOwner: boolean;
  approvalStatus: ApprovalStatus;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isApproved: boolean;
  isPending: boolean;
  isRejected: boolean;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  authorizedAdminEmail: string;
  registrations: UserRegistration[];
  pendingRegistrationsCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; status?: ApprovalStatus; message?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; message?: string; status?: ApprovalStatus }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  fetchRegistrations: () => Promise<void>;
  approveUser: (idOrEmail: string) => Promise<{ success: boolean; error?: string }>;
  rejectUser: (idOrEmail: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(false);
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);

  const fetchRegistrations = useCallback(async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('portfolio_user_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: UserRegistration[] = data.map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          email: r.email,
          fullName: r.full_name || r.email.split('@')[0],
          status: r.status as ApprovalStatus,
          role: (r.role === 'admin' ? 'viewer' : r.role) as UserRole, // Security guarantee: non-admin accounts cannot have admin role
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          approvedBy: r.approved_by,
          approvedAt: r.approved_at,
          notes: r.notes,
        }));
        setRegistrations(mapped);
      }
    } catch (err) {
      console.warn('Failed to fetch user registrations:', err);
    }
  }, []);

  const verifyAndSetUser = useCallback(async (supabaseUser: any): Promise<AuthUser | null> => {
    if (!supabaseUser?.email) {
      setUser(null);
      return null;
    }

    const email = supabaseUser.email.toLowerCase().trim();
    const isOwner = email === AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim();

    // 1. Permanent authorized administrator check
    if (isOwner) {
      const adminUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        fullName: 'Lingaraj Belagali',
        role: 'admin',
        isOwner: true,
        approvalStatus: 'approved',
      };
      setUser(adminUser);
      // Fetch user registrations for admin management
      fetchRegistrations();
      return adminUser;
    }

    // 2. Regular registered users: check registration approval record in database
    const supabase = getSupabaseClient();
    let approvalStatus: ApprovalStatus = 'pending';
    let fullName = supabaseUser.user_metadata?.full_name || email.split('@')[0];

    if (supabase) {
      try {
        const { data: regRecord } = await supabase
          .from('portfolio_user_registrations')
          .select('*')
          .or(`email.eq.${email},user_id.eq.${supabaseUser.id}`)
          .limit(1)
          .maybeSingle();

        if (regRecord) {
          approvalStatus = regRecord.status as ApprovalStatus;
          if (regRecord.full_name) fullName = regRecord.full_name;
        } else {
          // If registration record does not exist yet, create initial pending record
          await supabase.from('portfolio_user_registrations').insert({
            user_id: supabaseUser.id,
            email: email,
            full_name: fullName,
            status: 'pending',
            role: 'viewer',
          });
          approvalStatus = 'pending';
        }
      } catch (e) {
        console.warn('Error verifying user registration record:', e);
      }
    }

    const regularUser: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      fullName,
      role: 'viewer', // Security rule: approving another user NEVER grants admin
      isOwner: false,
      approvalStatus,
    };

    setUser(regularUser);
    return regularUser;
  }, [fetchRegistrations]);

  const initAuth = useCallback(async () => {
    setIsLoading(true);
    const { isConfigured } = getSupabaseCredentials();
    setIsSupabaseConfigured(isConfigured);

    const supabase = getSupabaseClient();

    if (supabase && isConfigured) {
      try {
        // 1. Get initial active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          await verifyAndSetUser(session.user);
        } else {
          setUser(null);
        }

        // 2. Subscribe to auth state updates
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user?.email) {
            await verifyAndSetUser(session.user);
          } else {
            setUser(null);
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } catch (err) {
        console.warn('Supabase Auth initialization warning:', err);
        setUser(null);
      }
    }

    setIsLoading(false);
  }, [verifyAndSetUser]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  /**
   * Supabase Auth: Sign in with Email and Password
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; status?: ApprovalStatus; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const { isConfigured } = getSupabaseCredentials();
    const supabase = getSupabaseClient();

    if (!supabase || !isConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured yet with a valid API key.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Invalid email or password.',
        };
      }

      if (data.user) {
        const authUser = await verifyAndSetUser(data.user);

        if (!authUser) {
          return { success: false, error: 'Failed to verify account session.' };
        }

        // 1. Owner always granted immediate entry
        if (authUser.isOwner) {
          return { success: true, status: 'approved' };
        }

        // 2. Check approval status for regular registered users
        if (authUser.approvalStatus === 'rejected') {
          return {
            success: false,
            status: 'rejected',
            error: 'Access Denied: Your registration was reviewed and rejected by the administrator.',
          };
        }

        if (authUser.approvalStatus === 'pending') {
          return {
            success: true,
            status: 'pending',
            message: 'Your registration is awaiting admin approval.',
          };
        }

        return {
          success: true,
          status: 'approved',
        };
      }

      return {
        success: false,
        error: 'No user session returned by Supabase Auth.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Authentication failed due to a network error.',
      };
    }
  };

  /**
   * Supabase Auth: Sign up new user account
   */
  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string; message?: string; status?: ApprovalStatus }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const { isConfigured } = getSupabaseCredentials();
    const supabase = getSupabaseClient();

    if (!supabase || !isConfigured) {
      return {
        success: false,
        error: 'Supabase client is not configured with an API key.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const isOwner = cleanEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
        const initialStatus: ApprovalStatus = isOwner ? 'approved' : 'pending';

        // Register user in portfolio_user_registrations
        try {
          await supabase.from('portfolio_user_registrations').upsert(
            {
              user_id: data.user.id,
              email: cleanEmail,
              full_name: cleanName,
              status: initialStatus,
              role: 'viewer',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'email' }
          );
        } catch (dbErr) {
          console.warn('Notice: registration record will sync via trigger:', dbErr);
        }

        if (isOwner) {
          await verifyAndSetUser(data.user);
          return {
            success: true,
            status: 'approved',
            message: 'Admin account created and authenticated successfully!',
          };
        }

        // Display exact requirement message for pending users
        return {
          success: true,
          status: 'pending',
          message: 'Your registration is awaiting admin approval.',
        };
      }

      return {
        success: true,
        status: 'pending',
        message: 'Your registration is awaiting admin approval.',
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  /**
   * Supabase Auth: Approve user registration (Admin only)
   */
  const approveUser = async (idOrEmail: string): Promise<{ success: boolean; error?: string }> => {
    const isOwner = user && user.isOwner && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
    if (!isOwner) {
      return { success: false, error: 'Unauthorized: Only Lingaraj has administrator permissions.' };
    }

    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase is not connected.' };

    try {
      // 1. Try atomic secure RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('approve_user_registration', {
        p_user_id_or_email: idOrEmail,
        p_role: 'viewer', // Enforce viewer role: approving another user NEVER grants admin
      });

      if (!rpcError && rpcData?.success) {
        await fetchRegistrations();
        return { success: true };
      }

      // 2. Direct fallback update with RLS check
      const { error: updateError } = await supabase
        .from('portfolio_user_registrations')
        .update({
          status: 'approved',
          role: 'viewer',
          approved_by: AUTHORIZED_ADMIN_EMAIL,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${idOrEmail},email.eq.${idOrEmail},user_id.eq.${idOrEmail}`);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      await fetchRegistrations();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to approve user registration.' };
    }
  };

  /**
   * Supabase Auth: Reject user registration (Admin only)
   */
  const rejectUser = async (
    idOrEmail: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const isOwner = user && user.isOwner && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
    if (!isOwner) {
      return { success: false, error: 'Unauthorized: Only Lingaraj has administrator permissions.' };
    }

    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase is not connected.' };

    try {
      // 1. Try atomic secure RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('reject_user_registration', {
        p_user_id_or_email: idOrEmail,
        p_notes: notes || 'Registration rejected by administrator.',
      });

      if (!rpcError && rpcData?.success) {
        await fetchRegistrations();
        return { success: true };
      }

      // 2. Direct fallback update with RLS check
      const { error: updateError } = await supabase
        .from('portfolio_user_registrations')
        .update({
          status: 'rejected',
          notes: notes || 'Registration rejected by administrator.',
          approved_by: AUTHORIZED_ADMIN_EMAIL,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${idOrEmail},email.eq.${idOrEmail},user_id.eq.${idOrEmail}`);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      await fetchRegistrations();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to reject user registration.' };
    }
  };

  /**
   * Supabase Auth: Sign out
   */
  const logout = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setUser(null);
  };

  /**
   * Supabase Auth: Password recovery
   */
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const { isConfigured } = getSupabaseCredentials();
    const supabase = getSupabaseClient();

    if (!supabase || !isConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please configure your publishable key first.',
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: `Password reset email dispatched to ${cleanEmail}. Please check your inbox.`,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Password reset request failed' };
    }
  };

  /**
   * Supabase Auth: Update password
   */
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const supabase = getSupabaseClient();
    if (supabase && user) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: false, error: 'No authenticated session found.' };
  };

  const pendingRegistrationsCount = registrations.filter((r) => r.status === 'pending').length;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user && user.isOwner && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()),
        isApproved: Boolean(user && user.approvalStatus === 'approved'),
        isPending: Boolean(user && user.approvalStatus === 'pending'),
        isRejected: Boolean(user && user.approvalStatus === 'rejected'),
        isLoading,
        isSupabaseConfigured,
        authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL,
        registrations,
        pendingRegistrationsCount,
        login,
        signUp,
        logout,
        resetPassword,
        updatePassword,
        fetchRegistrations,
        approveUser,
        rejectUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
