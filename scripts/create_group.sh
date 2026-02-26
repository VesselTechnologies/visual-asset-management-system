#!/bin/bash
set -e

GROUP_NAME="$1"

if [ -z "$GROUP_NAME" ]; then
  echo "Usage: ./create_group.sh <group-name>"
  exit 1
fi

DB_NAME="${GROUP_NAME}"
ADMIN_ROLE_NAME="${GROUP_NAME}_admin"
USER_ROLE_NAME="${GROUP_NAME}_user"
READ_ONLY_ROLE_NAME="${GROUP_NAME}_read_only"
ADMIN_TEMPLATE_FILE="constraint_template_${ADMIN_ROLE_NAME}.json"
USER_TEMPLATE_FILE="constraint_template_${USER_ROLE_NAME}.json"
READ_ONLY_TEMPLATE_FILE="constraint_template_${READ_ONLY_ROLE_NAME}.json"

echo "Creating group resources for: $GROUP_NAME"

# -----------------------------
# 1. Create Roles
# -----------------------------
echo "Creating roles..."
vamscli role create \
  -r "$ADMIN_ROLE_NAME" \
  --description "Auto-created admin role for group $GROUP_NAME"
vamscli role create \
  -r "$USER_ROLE_NAME" \
  --description "Auto-created user role for group $GROUP_NAME"
vamscli role create \
  -r "$READ_ONLY_ROLE_NAME" \
  --description "Auto-created read only role for group $GROUP_NAME"

# -----------------------------
# 2. Create Database
# -----------------------------
echo "Creating database..."
vamscli database create \
  -d "$DB_NAME" \
  --description "Asset database for group $GROUP_NAME" \
  --default-bucket-id "e1899527-25a3-4d4d-9274-2447f1296be2"

# -----------------------------
# 3. Build Constraint Templates
# -----------------------------
cat > "$ADMIN_TEMPLATE_FILE" <<EOF
{
  "metadata": {
    "name": "${ADMIN_ROLE_NAME} Constraints",
    "description": "Group level administrative access for the ${GROUP_NAME} group",
    "version": "1.0"
  },
  "variables": [
    {"name": "DATABASE_ID", "required": true},
    {"name": "ROLE_NAME", "required": true}
  ],
  "variableValues": {
    "ROLE_NAME": "${ADMIN_ROLE_NAME}",
    "DATABASE_ID": "${DB_NAME}"
  },
  "constraints": [
    {
      "name": "{{ROLE_NAME}}-database",
      "description": "Allow GET/PUT/POST access to the ${GROUP_NAME} database for {{ROLE_NAME}}",
      "objectType": "database",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "{{DATABASE_ID}}"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-database-public",
      "description": "Allow GET access to the PUBLIC database for {{ROLE_NAME}}",
      "objectType": "database",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "PUBLIC"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-assets",
      "description": "Allow GET/PUT/POST/DELETE access to assets in the ${GROUP_NAME} database for {{ROLE_NAME}}",
      "objectType": "asset",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "{{DATABASE_ID}}"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-assets-public",
      "description": "Allow GET access to assets in the PUBLIC database for {{ROLE_NAME}}",
      "objectType": "asset",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "PUBLIC"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-api",
      "description": "Allow GET/PUT/POST/DELETE on all apis for {{ROLE_NAME}}",
      "objectType": "api",
      "criteriaAnd": [
        {"field": "route__path", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-web",
      "description": "Allow GET/PUT/POST/DELETE on all allowed web paths for {{ROLE_NAME}}",
      "objectType": "web",
      "criteriaAnd": [],
      "criteriaOr": [
        {"field": "route__path", "operator": "starts_with", "value": "/assets"},
        {"field": "route__path", "operator": "starts_with", "value": "/databases"},
        {"field": "route__path", "operator": "starts_with", "value": "/search"},
        {"field": "route__path", "operator": "starts_with", "value": "/upload"},
        {"field": "route__path", "operator": "starts_with", "value": "/auth/userroles"},
        {"field": "route__path", "operator": "starts_with", "value": "/auth/subscriptions"},
        {"field": "route__path", "operator": "starts_with", "value": "/auth/cognitousers"}
      ],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-tag",
      "description": "Allow GET on all tags for {{ROLE_NAME}}",
      "objectType": "tag",
      "criteriaAnd": [
        {"field": "tagName", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-tagtype",
      "description": "Allow GET on all tag types for {{ROLE_NAME}}",
      "objectType": "tagType",
      "criteriaAnd": [
        {"field": "tagTypeName", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-role",
      "description": "Allow GET/PUT/POST/DELETE on allowed roles for {{ROLE_NAME}}",
      "objectType": "role",
      "criteriaAnd": [],
      "criteriaOr": [
        {"field": "roleName", "operator": "equals", "value": "${ADMIN_ROLE_NAME}"},
        {"field": "roleName", "operator": "equals", "value": "${USER_ROLE_NAME}"},
        {"field": "roleName", "operator": "equals", "value": "${READ_ONLY_ROLE_NAME}"}
      ],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-userrole",
      "description": "Allow GET/PUT/POST/DELETE on allowed user roles for {{ROLE_NAME}}",
      "objectType": "userRole",
      "criteriaAnd": [],
      "criteriaOr": [
        {"field": "roleName", "operator": "equals", "value": "${ADMIN_ROLE_NAME}"},
        {"field": "roleName", "operator": "equals", "value": "${USER_ROLE_NAME}"},
        {"field": "roleName", "operator": "equals", "value": "${READ_ONLY_ROLE_NAME}"}
      ],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-pipelines",
      "description": "Allow GET/POST on all pipelines for {{ROLE_NAME}}",
      "objectType": "pipeline",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-workflows",
      "description": "Allow GET/POST on all workflows for {{ROLE_NAME}}",
      "objectType": "workflow",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-metadataschemas",
      "description": "Allow GET on all metadata schemas for {{ROLE_NAME}}",
      "objectType": "metadataSchema",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    }
  ]
}
EOF

cat > "$USER_TEMPLATE_FILE" <<EOF
{
  "metadata": {
    "name": "${USER_ROLE_NAME} Constraints",
    "description": "Group level user access for the ${GROUP_NAME} group",
    "version": "1.0"
  },
  "variables": [
    {"name": "DATABASE_ID", "required": true},
    {"name": "ROLE_NAME", "required": true}
  ],
  "variableValues": {
    "ROLE_NAME": "${USER_ROLE_NAME}",
    "DATABASE_ID": "${DB_NAME}"
  },
  "constraints": [
    {
      "name": "{{ROLE_NAME}}-database",
      "description": "Allow GET/PUT/POST access to the ${GROUP_NAME} database for {{ROLE_NAME}}",
      "objectType": "database",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "{{DATABASE_ID}}"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-database-public",
      "description": "Allow GET access to the PUBLIC database for {{ROLE_NAME}}",
      "objectType": "database",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "PUBLIC"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-assets",
      "description": "Allow GET/PUT/POST/DELETE access to assets in the ${GROUP_NAME} database for {{ROLE_NAME}}",
      "objectType": "asset",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "{{DATABASE_ID}}"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-assets-public",
      "description": "Allow GET access to assets in the PUBLIC database for {{ROLE_NAME}}",
      "objectType": "asset",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "PUBLIC"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-api",
      "description": "Allow GET/PUT/POST/DELETE on all apis for {{ROLE_NAME}}",
      "objectType": "api",
      "criteriaAnd": [
        {"field": "route__path", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-web",
      "description": "Allow GET/PUT/POST/DELETE on all allowed web paths for {{ROLE_NAME}}",
      "objectType": "web",
      "criteriaAnd": [],
      "criteriaOr": [
        {"field": "route__path", "operator": "starts_with", "value": "/assets"},
        {"field": "route__path", "operator": "starts_with", "value": "/databases"},
        {"field": "route__path", "operator": "starts_with", "value": "/search"},
        {"field": "route__path", "operator": "starts_with", "value": "/upload"}
      ],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "PUT", "type": "allow"},
        {"action": "POST", "type": "allow"},
        {"action": "DELETE", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-tag",
      "description": "Allow GET on all tags for {{ROLE_NAME}}",
      "objectType": "tag",
      "criteriaAnd": [
        {"field": "tagName", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-tagtype",
      "description": "Allow GET on all tag types for {{ROLE_NAME}}",
      "objectType": "tagType",
      "criteriaAnd": [
        {"field": "tagTypeName", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-pipelines",
      "description": "Allow GET/POST on all pipelines for {{ROLE_NAME}}",
      "objectType": "pipeline",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-workflows",
      "description": "Allow GET/POST on all workflows for {{ROLE_NAME}}",
      "objectType": "workflow",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-metadataschemas",
      "description": "Allow GET on all metadata schemas for {{ROLE_NAME}}",
      "objectType": "metadataSchema",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    }
  ]
}
EOF

cat > "$READ_ONLY_TEMPLATE_FILE" <<EOF
{
  "metadata": {
    "name": "${READ_ONLY_ROLE_NAME} Constraints",
    "description": "Group level read-only access for the ${GROUP_NAME} group",
    "version": "1.0"
  },
  "variables": [
    {"name": "DATABASE_ID", "required": true},
    {"name": "ROLE_NAME", "required": true}
  ],
  "variableValues": {
    "ROLE_NAME": "${READ_ONLY_ROLE_NAME}",
    "DATABASE_ID": "${DB_NAME}"
  },
  "constraints": [
    {
      "name": "{{ROLE_NAME}}-database",
      "description": "Allow GET access to the ${GROUP_NAME} database for {{ROLE_NAME}}",
      "objectType": "database",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "{{DATABASE_ID}}"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-database-public",
      "description": "Allow GET access to the PUBLIC database for {{ROLE_NAME}}",
      "objectType": "database",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "PUBLIC"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-assets",
      "description": "Allow GET access to assets in the ${GROUP_NAME} database for {{ROLE_NAME}}",
      "objectType": "asset",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "{{DATABASE_ID}}"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-assets-public",
      "description": "Allow GET access to assets in the PUBLIC database for {{ROLE_NAME}}",
      "objectType": "asset",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "equals", "value": "PUBLIC"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-api",
      "description": "Allow GET on all apis for {{ROLE_NAME}}",
      "objectType": "api",
      "criteriaAnd": [
        {"field": "route__path", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-api-post",
      "description": "Allow POST on select api paths for {{ROLE_NAME}}",
      "objectType": "api",
      "criteriaAnd": [],
      "criteriaOr": [
        {"field": "route__path", "operator": "starts_with", "value": "/auth/routes"},
        {"field": "route__path", "operator": "starts_with", "value": "/check-subscription"},
        {"field": "route__path", "operator": "starts_with", "value": "/search"}
      ],
      "groupPermissions": [
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-web",
      "description": "Allow GET on all allowed web paths for {{ROLE_NAME}}",
      "objectType": "web",
      "criteriaAnd": [],
      "criteriaOr": [
        {"field": "route__path", "operator": "starts_with", "value": "/assets"},
        {"field": "route__path", "operator": "starts_with", "value": "/databases"},
        {"field": "route__path", "operator": "starts_with", "value": "/search"},
        {"field": "route__path", "operator": "starts_with", "value": "/upload"}
      ],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-tag",
      "description": "Allow GET on all tags for {{ROLE_NAME}}",
      "objectType": "tag",
      "criteriaAnd": [
        {"field": "tagName", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-tagtype",
      "description": "Allow GET on all tag types for {{ROLE_NAME}}",
      "objectType": "tagType",
      "criteriaAnd": [
        {"field": "tagTypeName", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-pipelines",
      "description": "Allow GET/POST on all pipelines for {{ROLE_NAME}}",
      "objectType": "pipeline",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-workflows",
      "description": "Allow GET/POST on all workflows for {{ROLE_NAME}}",
      "objectType": "workflow",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"},
        {"action": "POST", "type": "allow"}
      ]
    },
    {
      "name": "{{ROLE_NAME}}-metadataschemas",
      "description": "Allow GET on all metadata schemas for {{ROLE_NAME}}",
      "objectType": "metadataSchema",
      "criteriaAnd": [
        {"field": "databaseId", "operator": "contains", "value": ".*"}
      ],
      "criteriaOr": [],
      "groupPermissions": [
        {"action": "GET", "type": "allow"}
      ]
    }
  ]
}
EOF

# -----------------------------
# 4. Import Templates
# -----------------------------
echo "Importing constraint template for ${ADMIN_ROLE_NAME}..."
vamscli role constraint template import -j "$ADMIN_TEMPLATE_FILE"
echo "Importing constraint template for ${USER_ROLE_NAME}..."
vamscli role constraint template import -j "$USER_TEMPLATE_FILE"
echo "Importing constraint template for ${READ_ONLY_ROLE_NAME}..."
vamscli role constraint template import -j "$READ_ONLY_TEMPLATE_FILE"

echo "Done."