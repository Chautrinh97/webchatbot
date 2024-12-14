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

export const AddUserFormSchema = LoginFormSchema.extend({
   fullName: z.string().trim().min(1, { message: 'Tên không được để trống.' }),
   authorityGroup: z.string().transform((value) => (value === '' ? null : Number(value))),
});

export const EditUserSchemaVerified = AddUserFormSchema.omit({ password: true });
export const EditUserSchemaUnverified = AddUserFormSchema;

export const ResetPasswordSchema = z.object({
   password: LoginFormSchema.shape.password,
   confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
   message: "Mật khẩu và Xác nhận mật khẩu không khớp.",
   path: ["confirmPassword"],
});

export const DocumentPropertiesSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, { message: 'Tên không được để trống.' }),
   description: z
      .string()
      .max(1000, { message: 'Mô tả không quá 1000 ký tự.' })
      .trim(),
});

const allowedFileTypes =
   [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
   ];

const dateSchema = z.string()
   .optional()
   .refine(
      (value) =>
         !value ||
         /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
         message: "Ngày phải đúng định dạng YYYY-MM-DD",
      });
export const DocumentFormSchema = z.object({
   title: z.string().trim().min(1, { message: 'Tên tài liệu không được để trống.' }),
   referenceNumber: z.string().trim(),
   issuanceDate: dateSchema,
   effectiveDate: dateSchema,
   isPublic: z.string(),
   validityStatus: z.string(),
   isRegulatory: z.string(),
   documentField: z.string().transform((value) => (value === '' ? null : Number(value))),
   documentType: z.string().transform((value) => (value === '' ? null : Number(value))),
   issuingBody: z.string().transform((value) => (value === '' ? null : Number(value))),
   file: z.any()
      .refine((file) => file.length === 1 ? file?.[0].size <= 10 * 1024 * 1024 ? true : false : true, {
         message: "Kích thước tài liệu không quá 10MB.",
      })
      .refine((file) => file.length === 1 ? allowedFileTypes.includes(file?.[0].type) ? true : false : true, {
         message: "Chỉ cho phép tài liệu định dạng Word hoặc PDF.",
      }),
})

export const ChangePasswordSchemas = z.object({
   oldPassword: z.string().trim(),
   newPassword: z
      .string()
      .trim()
      .min(6, { message: 'Độ dài mật khẩu ít nhất 6 ký tự.' })
      .regex(/[0-9]/, { message: 'Mật khẩu chứa ít nhất một chữ số.' })
      .regex(/[^a-zA-Z0-9]/, {
         message: 'Mật khẩu chứa ít nhất một ký tự đặc biệt.',
      })
      .regex(/^[A-Z]/, { message: 'Mật khẩu bắt đầu bằng chữ cái in hoa.' }),
   confirmPassword: z.string().trim(),
}).refine((data) => data.newPassword === data.confirmPassword, {
   message: "Mật khẩu và Xác nhận mật khẩu không khớp.",
   path: ["confirmPassword"],
});

export const AuthorityGroupSchema = z.object({
   name: z
   .string()
   .trim()
   .min(1, { message: 'Tên không được để trống.' }),
   description: z.string().trim(),
});