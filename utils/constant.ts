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
   MANAGE_DOCUMENTS: 'manage_documents',
   MANAGE_DOCUMENTS_PROPERTIES: 'manage_documents_properties', 
   MANAGE_USERS: 'manage_users',
   VIEW_STATISTIC_CHATBOT: 'view_statistic_chatbot',
}

export const PermissionsConstant = [
   { id: 1, name: 'manage_documents_properties', description: 'Quản lý văn bản và các thuộc tính.' },
   { id: 2, name: 'manage_documents', description: 'Quản lý văn bản.' },
   { id: 3, name: 'manage_users', description: 'Quản lý người dùng.' },
   { id: 4, name: 'view_statistic_chatbot', description: 'Xem thống kê truy vấn chatbot.' },
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