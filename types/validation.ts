import { z } from 'zod'

export const LoginFormSchema = z.object({
   email: z.string().email({ message: 'Nhập email hợp lệ (user@domain.com).' }).trim(),
   password: z
      .string()
      .min(6, { message: 'Độ dài mật khẩu ít nhất 6 ký tự.' })
      .regex(/[0-9]/, { message: 'Mật khẩu chứa ít nhất một chữ số.' })
      .regex(/[^a-zA-Z0-9]/, {
         message: 'Mật khẩu chứa ít nhất một ký tự đặc biệt.',
      })
      .trim()
      .regex(/^[A-Z]/, { message: 'Mật khẩu bắt đầu bằng chữ cái in hoa.' })
});

export const SignupFormSchema = LoginFormSchema.extend({
   confirmPassword: z.string().trim()
}).refine((data) => data.password === data.confirmPassword, {
   message: "Mật khẩu và Xác nhận mật khẩu không khớp.",
   path: ["confirmPassword"],
});

export const ResetPasswordSchema = z.object({
   password: LoginFormSchema.shape.password,
   confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
   message: "Mật khẩu và Xác nhận mật khẩu không khớp.",
   path: ["confirmPassword"],
});

export const AddPositionFormSchema = z.object({
   name: z
      .string()
      .min(1, { message: 'Tên không được để trống.' })
      .trim(),
   description: z
      .string()
      .max(1000, { message: 'Mô tả không quá 1000 ký tự.' })
      .trim(),
   permissionLevel: z.string({message: 'Vui lòng chọn phân quyền.'}).trim(),
});