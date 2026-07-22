export type AuthMode = 'login' | 'forgot' | 'reset';

export type AuthFormState = {
  email: string;
  password: string;
  passwordConfirmation: string;
  rememberMe: boolean;
};
