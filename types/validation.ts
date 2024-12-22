import { z } from 'zod'

export const LoginFormSchema = z.object({
   email: z.string().email({ message: 'Nhập email hợp lệ (user@domain.com).' }).trim(),
   password: z
      .string()
      .min(6, { message: 'Độ dài mật khẩu ít nhất 6 ký tự.' })
      .trim()
});

export const AddUserFormSchema = LoginFormSchema.extend({
   fullName: z.string().trim().min(1, { message: 'Tên không được để trống.' }),
   role: z.string(),
   authorityGroup: z.string().transform((value) => (value === '' ? null : Number(value))),
});

export const EditUserSchemaVerified = AddUserFormSchema.omit({ password: true });
export const EditUserSchemaUnverified = AddUserFormSchema.extend({
   password: z
      .string()
      .min(6, { message: 'Độ dài mật khẩu ít nhất 6 ký tự.' })
      .trim()
      .or(z.literal(''))
});

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
   title: z.string().trim().min(1, { message: 'Tên văn bản không được để trống.' }),
   referenceNumber: z.string().trim(),
   issuanceDate: dateSchema,
   effectiveDate: dateSchema,
   validityStatus: z.string(),
   invalidDate: dateSchema,
   isRegulatory: z.string(),
   documentField: z.string().transform((value) => (value === '' ? null : Number(value))),
   documentType: z.string().transform((value) => (value === '' ? null : Number(value))),
   issuingBody: z.string().transform((value) => (value === '' ? null : Number(value))),
   file: z.any()
   // .refine((files) => files.length === 1 ? allowedFileTypes.includes(files?.[0].type) ? true : false : true, {
   //    message: "Chỉ cho phép văn bản định dạng Word hoặc PDF.",
   // })
   // .refine((files) => {
   //    if (files.length === 1) {
   //       const file = files?.[0];
   //       if (file.type === "application/pdf") {
   //          if (file.size > 5 * 1024 * 1024) return false;
   //       }
   //       else {
   //          if (file.size > 200 * 1024) return false;
   //       }
   //       return true;
   //    }
   //    return true;
   // }, { message: "Vượt quá kích thước tối đa (PDF: 5MB, WORD: 200KB)" }),
}).superRefine((data, ctx) => {
   if (data.validityStatus === "false" && !data.invalidDate) {
      ctx.addIssue({
         code: 'custom',
         path: ["invalidDate"],
         message: "Phải thêm ngày hết hiệu lực.",
      });
   }
});

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

export const ForgotPasswordSchema = z.object({
   email: z.string().email({ message: 'Nhập email hợp lệ (user@domain.com).' }).trim(),
});