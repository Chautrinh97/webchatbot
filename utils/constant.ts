export const LoginConstantMessage = {
   NOT_VERIFIED_EMAIL: 'NOT_VERIFIED_EMAIL',
   DISABLED_EMAIL: 'DISABLED_EMAIL',
   TEMPORARILY_BLOCKED: 'TEMPORARILY_BLOCKED',
   LOGGED_IN: 'LOGGED_IN',
}

export const UserRoleConstant = {
   SUPERADMIN: 'superadmin',
   OFFICER: 'officer',
}

export const UserPermissionConstant = {
   MANAGE_DOCUMENTS: 'manage_documents',
   MANAGE_ISSUING_BODIES: 'manage_issuing_bodies',
   MANAGE_DOCUMENT_TYPES: 'manage_document_types',
   MANAGE_DOCUMENT_FIELDS: 'manage_document_fields',
   VIEW_DOCUMENT_STATISTIC: 'view_document_statistic',
   VIEW_CHATBOT_STATISTIC: 'view_chatbot_statistic',
}

export const PermissionsConstant = [
   { id: 1, name: 'manage_documents', description: 'Quản lý tài liệu.' },
   { id: 2, name: 'manage_issuing_bodies', description: 'Quản lý cơ quan ban hành.' },
   { id: 3, name: 'manage_document_types', description: 'Quản lý loại tài liệu.' },
   { id: 4, name: 'manage_document_fields', description: 'Quản lý tài liệu.' },
   { id: 6, name: 'view_documents_statistic', description: 'Xem thống kê tài liệu.' },
   { id: 7, name: 'view_chatbot_statistic', description: 'Xem thống kê truy vấn chatbot.' },
];

export const getAuthorityGroup = (role: string, authorityGroup: any) => {
   if (role === UserRoleConstant.SUPERADMIN)
      return 'Quyền quản trị viên';
   if (!authorityGroup)
      return 'Không thuộc nhóm quyền nào';
   return authorityGroup.name;
}

export const MimeType = {
   PDF: 'application/pdf',
   DOC: 'application/msword',
   DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}