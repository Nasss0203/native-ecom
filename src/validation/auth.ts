import { z } from 'zod';
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email/username là bắt buộc')
    .email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email/username là bắt buộc')
    .email('Email không hợp lệ'),
  username: z.string().min(1, 'Email/username là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

// 2. Type của form từ schema
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
