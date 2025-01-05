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

export const EditUserSchemaVerified = AddUserFormSchema.omit({password: true});
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

const dateSchema =
   z.string()
      .optional()
      .refine(
         (value) =>
            !value ||
            /^\d{4}-\d{2}-\d{2}$/.test(value),
         {
            message: "Ngày phải đúng định dạng YYYY-MM-DD",
         }
      );
export const DocumentFormSchema = z.object({
   title: z.string().trim().min(1, { message: 'Tên văn bản không được để trống.' }),
   referenceNumber: z.string().trim(),
   issuanceDate: dateSchema,
   effectiveDate: dateSchema,
   invalidDate: dateSchema,
   isRegulatory: z.string(),
   validityStatus: z.string(),
   documentField: z.string().transform((value) => (value === '' ? null : Number(value))),
   documentType: z.string().transform((value) => (value === '' ? null : Number(value))),
   issuingBody: z.string().transform((value) => (value === '' ? null : Number(value))),
   files: z.any()
}).refine(
   ({ issuanceDate, effectiveDate, invalidDate }) =>
      !(issuanceDate && invalidDate) || effectiveDate,
   {
      message: 'Ngày hiệu lực là bắt buộc.',
      path: ['effectiveDate'],
   },
).refine(
   ({ issuanceDate, effectiveDate }) =>
      !issuanceDate || !effectiveDate || issuanceDate <= effectiveDate,
   {
      message: 'Ngày ban hành không vượt quá ngày hiệu lực.',
      path: ['issuanceDate'],
   },
).refine(
   ({ effectiveDate, invalidDate }) =>
      !effectiveDate || !invalidDate || effectiveDate <= invalidDate,
   {
      message: 'Ngày hết hiệu lực không nhỏ hơn ngày hiệu lực.',
      path: ['invalidDate'],
   },
).refine(
   ({ validityStatus, invalidDate }) => {
      if (validityStatus === "false" && invalidDate) {
         const currentDate = new Date().toISOString().split("T")[0];
         return invalidDate <= currentDate;
      }
      return true;
   },
   {
      message: "Ngày hết hiệu lực không vượt quá ngày hiện tại.",
      path: ["invalidDate"],
   }
).refine(
   ({ validityStatus, invalidDate }) =>
      !(validityStatus === "false") || invalidDate, 
   {
      message: "Ngày hết hiệu lực là bắt buộc.",
      path: ["invalidDate"],
   }
);

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