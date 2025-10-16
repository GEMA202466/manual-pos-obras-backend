# Documentação da API - Sistema de Gestão Pós-Obras

## Visão Geral

A API do Sistema de Gestão Pós-Obras fornece endpoints RESTful para gerenciar propriedades, manutenções, patologias, documentos e notificações relacionadas a empreendimentos construídos ou reformados.

**Base URL:** `http://localhost:3001/api`

**Versão:** 1.0.0

---

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após o login, o token deve ser incluído no header de todas as requisições protegidas:

```
Authorization: Bearer {seu_token_jwt}
```

### Endpoints de Autenticação

#### POST /auth/register
Registra um novo usuário (cliente ou construtora).

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "cliente",
  "phone": "+55 11 99999-9999"
}
```

**Response (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "role": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Realiza login no sistema.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "role": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /auth/me
Retorna os dados do usuário autenticado.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": 1,
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "role": "cliente",
  "phone": "+55 11 99999-9999",
  "created_at": "2024-08-15T10:00:00Z"
}
```

---

## Propriedades

### GET /properties
Lista todas as propriedades do usuário autenticado.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Response (200):**
```json
{
  "properties": [
    {
      "id": 1,
      "name": "Edifício Residencial Solar",
      "type": "Residencial Multifamiliar",
      "unit": "Apartamento 302",
      "area": 85.00,
      "delivery_date": "2024-08-15",
      "constructor": {
        "id": 1,
        "name": "Construtora Exemplo Ltda"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /properties/:id
Obtém detalhes de uma propriedade específica.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": 1,
  "name": "Edifício Residencial Solar",
  "type": "Residencial Multifamiliar",
  "unit": "Apartamento 302",
  "area": 85.00,
  "address": "Rua Exemplo, 123 - São Paulo, SP",
  "delivery_date": "2024-08-15",
  "warranty_structural_years": 5,
  "warranty_general_years": 1,
  "constructor": {
    "id": 1,
    "name": "Construtora Exemplo Ltda",
    "email": "contato@construtora.com",
    "phone": "+55 11 3333-3333"
  },
  "created_at": "2024-08-15T10:00:00Z"
}
```

### POST /properties
Cria uma nova propriedade (apenas construtoras).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "Edifício Residencial Solar",
  "type": "Residencial Multifamiliar",
  "unit": "Apartamento 302",
  "area": 85.00,
  "address": "Rua Exemplo, 123 - São Paulo, SP",
  "delivery_date": "2024-08-15",
  "owner_id": 2
}
```

**Response (201):**
```json
{
  "message": "Propriedade criada com sucesso",
  "property": {
    "id": 1,
    "name": "Edifício Residencial Solar",
    "type": "Residencial Multifamiliar",
    "unit": "Apartamento 302"
  }
}
```

### GET /properties/:id/status
Obtém o status geral da propriedade (manutenções, alertas, etc).

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "property_id": 1,
  "maintenance_summary": {
    "ok": 12,
    "attention": 3,
    "critical": 1
  },
  "upcoming_maintenance": [
    {
      "id": 4,
      "item_name": "Sistema de Tubulação",
      "next_maintenance_date": "2025-11-15",
      "days_until": 30
    }
  ],
  "overdue_maintenance": [],
  "recent_notifications": [
    {
      "id": 1,
      "message": "Manutenção do sistema hidráulico vencendo em 30 dias",
      "created_at": "2025-10-14T10:00:00Z"
    }
  ]
}
```

---

## Manutenção

### GET /maintenance/property/:propertyId
Lista todos os itens de manutenção de uma propriedade.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status` (opcional): Filtrar por status (ok, atenção, crítico)
- `category` (opcional): Filtrar por categoria

**Response (200):**
```json
{
  "maintenance_items": [
    {
      "id": 1,
      "category": "Piso",
      "item_name": "Porcelanato Polido",
      "description": "Limpeza com produtos neutros a cada 15 dias",
      "frequency_days": 15,
      "next_maintenance_date": "2026-01-15",
      "status": "atenção"
    }
  ]
}
```

### POST /maintenance
Cria um novo item de manutenção (apenas construtoras).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "property_id": 1,
  "category": "Piso",
  "item_name": "Porcelanato Polido",
  "description": "Limpeza com produtos neutros a cada 15 dias",
  "frequency_days": 15,
  "next_maintenance_date": "2026-01-15"
}
```

**Response (201):**
```json
{
  "message": "Item de manutenção criado com sucesso",
  "maintenance_item": {
    "id": 1,
    "item_name": "Porcelanato Polido",
    "status": "ok"
  }
}
```

### POST /maintenance/:id/schedule
Agenda uma manutenção.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "scheduled_date": "2025-11-15T14:00:00Z",
  "service_provider": "Empresa de Manutenção XYZ",
  "service_provider_contact": "+55 11 4444-4444",
  "notes": "Verificar pressão da água"
}
```

**Response (201):**
```json
{
  "message": "Manutenção agendada com sucesso",
  "scheduled_maintenance": {
    "id": 1,
    "scheduled_date": "2025-11-15T14:00:00Z",
    "status": "agendado"
  }
}
```

### POST /maintenance/:id/complete
Marca uma manutenção como concluída.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "performed_date": "2025-11-15T15:30:00Z",
  "notes": "Manutenção realizada com sucesso. Pressão normalizada."
}
```

**Response (200):**
```json
{
  "message": "Manutenção marcada como concluída",
  "maintenance_item": {
    "id": 1,
    "status": "ok",
    "last_maintenance_date": "2025-11-15",
    "next_maintenance_date": "2026-05-15"
  }
}
```

---

## Patologias

### GET /pathologies
Lista todas as patologias cadastradas (base de conhecimento).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `category` (opcional): Filtrar por categoria
- `severity` (opcional): Filtrar por severidade (baixa, média, alta)
- `search` (opcional): Buscar por palavra-chave

**Response (200):**
```json
{
  "pathologies": [
    {
      "id": 1,
      "title": "Manchas em Piso de Madeira",
      "category": "Piso",
      "cause": "Contato prolongado com água",
      "prevention": "Secar imediatamente qualquer líquido derramado. Usar produtos específicos para madeira.",
      "severity": "alta",
      "image_url": "https://exemplo.com/imagem.jpg"
    }
  ]
}
```

### GET /pathologies/:id
Obtém detalhes de uma patologia específica.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": 1,
  "title": "Manchas em Piso de Madeira",
  "category": "Piso",
  "cause": "Contato prolongado com água",
  "prevention": "Secar imediatamente qualquer líquido derramado. Usar produtos específicos para madeira.",
  "solution": "Lixar a área afetada e aplicar verniz protetor. Em casos graves, substituir a tábua.",
  "severity": "alta",
  "image_url": "https://exemplo.com/imagem.jpg",
  "created_at": "2024-08-15T10:00:00Z"
}
```

---

## Documentos

### GET /documents/property/:propertyId
Lista todos os documentos de uma propriedade.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `type` (opcional): Filtrar por tipo (manual, garantia, projeto, etc)

**Response (200):**
```json
{
  "documents": [
    {
      "id": 1,
      "name": "Manual do Proprietário",
      "type": "manual",
      "file_size": 2516582,
      "mime_type": "application/pdf",
      "created_at": "2024-08-15T10:00:00Z"
    }
  ]
}
```

### POST /documents
Faz upload de um novo documento (apenas construtoras).

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Body (form-data):**
- `file`: Arquivo (PDF, imagem, Word, Excel)
- `property_id`: ID da propriedade
- `name`: Nome do documento
- `type`: Tipo do documento (manual, garantia, projeto, etc)

**Response (201):**
```json
{
  "message": "Documento enviado com sucesso",
  "document": {
    "id": 1,
    "name": "Manual do Proprietário",
    "type": "manual",
    "file_path": "/uploads/manual-1234567890.pdf"
  }
}
```

### GET /documents/:id/download
Faz download de um documento.

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Arquivo binário

---

## Notificações

### GET /notifications
Lista todas as notificações do usuário.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `is_read` (opcional): Filtrar por lidas/não lidas (true/false)
- `type` (opcional): Filtrar por tipo

**Response (200):**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "manutenção",
      "title": "Manutenção Próxima",
      "message": "Manutenção do sistema hidráulico vencendo em 30 dias",
      "priority": "alta",
      "is_read": false,
      "created_at": "2025-10-14T10:00:00Z"
    }
  ]
}
```

### PUT /notifications/:id/read
Marca uma notificação como lida.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Notificação marcada como lida"
}
```

### PUT /notifications/read-all
Marca todas as notificações como lidas.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Todas as notificações foram marcadas como lidas"
}
```

---

## Integração com Diário de Obras

### POST /integration/diary-webhook
Webhook para receber dados do Diário de Obras.

**Headers:** 
- `X-Webhook-Secret`: Secret para validação

**Body:**
```json
{
  "property_id": 1,
  "diary_entry_id": "DO-2024-001",
  "activity_type": "Instalação Hidráulica",
  "description": "Instalação completa do sistema de tubulação",
  "performed_by": "João Silva",
  "performed_date": "2024-07-20",
  "execution_time_hours": 8.5,
  "status": "concluído"
}
```

**Response (200):**
```json
{
  "message": "Dados do diário importados com sucesso",
  "work_diary_entry": {
    "id": 1,
    "activity_type": "Instalação Hidráulica",
    "imported_at": "2025-10-14T10:00:00Z"
  }
}
```

### POST /integration/sync-diary/:propertyId
Sincroniza dados do Diário de Obras manualmente (apenas construtoras).

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Sincronização iniciada",
  "entries_imported": 15,
  "last_sync": "2025-10-14T10:00:00Z"
}
```

### GET /integration/work-history/:propertyId
Obtém o histórico completo da obra importado do Diário.

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "property_id": 1,
  "work_history": [
    {
      "id": 1,
      "activity_type": "Instalação Hidráulica",
      "description": "Instalação completa do sistema de tubulação",
      "performed_by": "João Silva",
      "performed_date": "2024-07-20",
      "execution_time_hours": 8.5,
      "status": "concluído"
    }
  ],
  "total_entries": 15
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "error": {
    "message": "Descrição do erro",
    "status": 400,
    "details": ["Campo 'email' é obrigatório"]
  }
}
```

---

## Rate Limiting

A API implementa rate limiting para prevenir abuso:
- **100 requisições por minuto** por IP
- **1000 requisições por hora** por usuário autenticado

---

## Versionamento

A API utiliza versionamento via URL. A versão atual é `v1` (implícita na base URL `/api`).

---

## Suporte

Para questões técnicas ou suporte, entre em contato:
- Email: suporte@manual-pos-obras.com
- Documentação: https://docs.manual-pos-obras.com

