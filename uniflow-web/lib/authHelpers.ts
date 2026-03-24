import { getSupabase } from './supabase';

/**
 * Normalize email: convert to lowercase for consistency
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Register a new user with email and password
 */
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  specialization: string,
  userType: 'student' | 'mentor'
) {
  try {
    const normalizedEmail = normalizeEmail(email);

    // Validate email
    if (!validateEmail(normalizedEmail)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') };
    }

    const supabase = getSupabase();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
          specialization,
          user_type: userType,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    return {
      success: true,
      user: authData.user,
      message: 'Account created successfully! Check your email to verify.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign in a user with email and password
 */
export async function loginUser(email: string, password: string) {
  try {
    const normalizedEmail = normalizeEmail(email);

    // Validate email
    if (!validateEmail(normalizedEmail)) {
      return { success: false, error: 'Invalid email address' };
    }

    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    const supabase = getSupabase();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to sign in' };
    }

    return {
      success: true,
      user: authData.user,
      message: 'Signed in successfully!',
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign out the current user
 */
export async function logoutUser() {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Signed out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, session: data.session };
  } catch (error) {
    console.error('Session error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
