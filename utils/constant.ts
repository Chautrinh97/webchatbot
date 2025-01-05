export const LoginConstantMessage = {
   NOT_VERIFIED_EMAIL: 'NOT_VERIFIED_EMAIL',
   DISABLED_EMAIL: 'DISABLED_EMAIL',
   TEMPORARILY_BLOCKED: 'TEMPORARILY_BLOCKED',
   LOGGED_IN: 'LOGGED_IN',
}

export const UserRoleConstant = {
   SUPERADMIN: 'superadmin',
   OFFICER: 'officer',
   GUEST: 'guest',
}

export const UserPermissionConstant = {
   MANAGE_DOCUMENT_PROPERTIES: 'manage_document_properties', 
   MANAGE_ALL_DOCUMENTS: 'manage_all_documents',
   MANAGE_OWN_DOCUMENTS: 'manage_own_documents',
   MANAGE_USERS: 'manage_users',
}

export const PermissionsConstant = [
   { id: 1, name: 'manage_document_properties', description: 'Quản lý các thuộc tính văn bản.' },
   { id: 2, name: 'manage_all_documents', description: 'Quản lý tất cả các văn bản.' },
   { id: 3, name: 'manage_own_documents', description: 'Quản lý chỉ các văn bản tự tạo.' },
   { id: 4, name: 'manage_users', description: 'Quản lý người dùng.' },
];

export const MimeType = {
   PDF: 'application/pdf',
   DOC: 'application/msword',
   DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export const SyncStatus = {
   SYNC: "SYNC",
   NOT_SYNC: "NOT_SYNC",
   PENDING_SYNC: "PENDING_SYNC",
   FAILED_RESYNC: "FAILED_RESYNC"
}