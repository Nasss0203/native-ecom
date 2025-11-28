// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { login, register } from '../../common/api/auth';
import { QueryKey } from '../../const/queryKey';
import { LoginFormValues, RegisterFormValues } from '../../validation/auth';

export function useAuth() {
  const loginMutation = useMutation({
    mutationKey: [QueryKey.LOGIN],
    mutationFn: (payload: LoginFormValues) => login(payload),
  });

  const registerMutation = useMutation({
    mutationKey: [QueryKey.REGISTER],
    mutationFn: (payload: RegisterFormValues) => register(payload),
  });

  return {
    login: loginMutation,
    register: registerMutation,
  };
}
