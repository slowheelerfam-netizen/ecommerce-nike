// Authentication component types and interfaces
export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SocialProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  handler: () => void;
  isLoading: boolean;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export interface AuthFormProps {
  type: 'signin' | 'signup';
  formData: AuthFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export interface SocialProvidersProps {
  type: 'signin' | 'signup';
  isLoading: boolean;
}

// Theme constants for consistent styling
export const AUTH_CONSTANTS = {
  ANIMATION_DURATION: '200ms' as const,
  FOCUS_RING_WIDTH: '2px' as const,
  FOCUS_RING_OFFSET: '2px' as const,
  BORDER_RADIUS: '0.5rem' as const,
} as const;

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+([^\s@]+)@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
} as const;
