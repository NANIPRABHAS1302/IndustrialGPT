from enum import Enum


class RoleEnum(str, Enum):
    ADMIN = "admin"
    OPERATOR = "operator"
    MAINTENANCE_ENGINEER = "maintenance_engineer"
    COMPLIANCE_OFFICER = "compliance_officer"
    VIEWER = "viewer"


class PermissionEnum(str, Enum):
    # User Management
    MANAGE_USERS = "user:manage"
    VIEW_USERS = "user:view"

    # Document Intelligence & RAG
    UPLOAD_DOCUMENTS = "document:upload"
    DELETE_DOCUMENTS = "document:delete"
    VIEW_DOCUMENTS = "document:view"
    QUERY_RAG = "rag:query"

    # Asset Management
    CREATE_ASSET = "asset:create"
    UPDATE_ASSET = "asset:update"
    VIEW_ASSET = "asset:view"

    # Maintenance & Inspections
    CREATE_MAINTENANCE_LOG = "maintenance:create"
    UPDATE_MAINTENANCE_LOG = "maintenance:update"
    VIEW_MAINTENANCE_LOG = "maintenance:view"
    RUN_PREDICTIONS = "analytics:predict"

    # Knowledge Graph
    MANAGE_KNOWLEDGE_GRAPH = "kg:manage"
    VIEW_KNOWLEDGE_GRAPH = "kg:view"


DEFAULT_ROLE_PERMISSIONS = {
    RoleEnum.ADMIN: [p.value for p in PermissionEnum],
    RoleEnum.OPERATOR: [
        PermissionEnum.VIEW_DOCUMENTS.value,
        PermissionEnum.QUERY_RAG.value,
        PermissionEnum.VIEW_ASSET.value,
        PermissionEnum.CREATE_MAINTENANCE_LOG.value,
        PermissionEnum.VIEW_MAINTENANCE_LOG.value,
        PermissionEnum.VIEW_KNOWLEDGE_GRAPH.value,
    ],
    RoleEnum.MAINTENANCE_ENGINEER: [
        PermissionEnum.VIEW_DOCUMENTS.value,
        PermissionEnum.QUERY_RAG.value,
        PermissionEnum.CREATE_ASSET.value,
        PermissionEnum.UPDATE_ASSET.value,
        PermissionEnum.VIEW_ASSET.value,
        PermissionEnum.CREATE_MAINTENANCE_LOG.value,
        PermissionEnum.UPDATE_MAINTENANCE_LOG.value,
        PermissionEnum.VIEW_MAINTENANCE_LOG.value,
        PermissionEnum.RUN_PREDICTIONS.value,
        PermissionEnum.VIEW_KNOWLEDGE_GRAPH.value,
    ],
    RoleEnum.COMPLIANCE_OFFICER: [
        PermissionEnum.VIEW_DOCUMENTS.value,
        PermissionEnum.QUERY_RAG.value,
        PermissionEnum.VIEW_ASSET.value,
        PermissionEnum.VIEW_MAINTENANCE_LOG.value,
        PermissionEnum.VIEW_KNOWLEDGE_GRAPH.value,
    ],
    RoleEnum.VIEWER: [
        PermissionEnum.VIEW_DOCUMENTS.value,
        PermissionEnum.QUERY_RAG.value,
        PermissionEnum.VIEW_ASSET.value,
        PermissionEnum.VIEW_MAINTENANCE_LOG.value,
        PermissionEnum.VIEW_KNOWLEDGE_GRAPH.value,
    ],
}
