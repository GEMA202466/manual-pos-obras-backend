-- Schema do Banco de Dados para Sistema de Gestão Pós-Obras
-- PostgreSQL

-- ============================================
-- TABELA: users
-- Armazena usuários do sistema (clientes e construtoras)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('cliente', 'construtora', 'admin')),
    phone VARCHAR(20),
    constructor_id INTEGER REFERENCES constructors(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABELA: constructors
-- Armazena informações das construtoras
-- ============================================
CREATE TABLE constructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- TABELA: properties
-- Armazena informações dos imóveis
-- ============================================
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    constructor_id INTEGER NOT NULL REFERENCES constructors(id) ON DELETE CASCADE,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'residencial', 'comercial', 'multifamiliar', etc
    unit VARCHAR(100), -- Ex: 'Apartamento 302'
    area DECIMAL(10, 2), -- Área em m²
    address TEXT,
    delivery_date DATE,
    warranty_structural_years INTEGER DEFAULT 5,
    warranty_general_years INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: maintenance_items
-- Armazena itens de manutenção cadastrados
-- ============================================
CREATE TABLE maintenance_items (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'piso', 'porta', 'pintura', 'hidráulica', etc
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency_days INTEGER, -- Frequência de manutenção em dias
    next_maintenance_date DATE,
    last_maintenance_date DATE,
    status VARCHAR(50) DEFAULT 'ok' CHECK (status IN ('ok', 'atenção', 'crítico')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: maintenance_history
-- Histórico de manutenções realizadas
-- ============================================
CREATE TABLE maintenance_history (
    id SERIAL PRIMARY KEY,
    maintenance_item_id INTEGER NOT NULL REFERENCES maintenance_items(id) ON DELETE CASCADE,
    performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    performed_date TIMESTAMP NOT NULL,
    notes TEXT,
    status VARCHAR(50), -- Status após a manutenção
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: pathologies
-- Base de conhecimento de patologias
-- ============================================
CREATE TABLE pathologies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cause TEXT NOT NULL,
    prevention TEXT NOT NULL,
    solution TEXT,
    severity VARCHAR(50) CHECK (severity IN ('baixa', 'média', 'alta')),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: documents
-- Documentos relacionados às propriedades
-- ============================================
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'manual', 'garantia', 'projeto', 'especificacao', etc
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER, -- Tamanho em bytes
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: notifications
-- Notificações para usuários
-- ============================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'manutenção', 'documento', 'alerta', etc
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'baixa' CHECK (priority IN ('baixa', 'média', 'alta')),
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50), -- 'maintenance', 'document', 'property', etc
    related_entity_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: work_diary_integration
-- Dados importados do Diário de Obras
-- ============================================
CREATE TABLE work_diary_integration (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    diary_entry_id VARCHAR(255), -- ID da entrada no sistema de Diário de Obras
    activity_type VARCHAR(100) NOT NULL, -- Tipo de atividade realizada
    description TEXT,
    performed_by VARCHAR(255), -- Nome do responsável
    performed_date DATE NOT NULL,
    execution_time_hours DECIMAL(10, 2), -- Tempo de execução em horas
    status VARCHAR(50), -- Status da atividade
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: scheduled_maintenance
-- Agendamentos de manutenção
-- ============================================
CREATE TABLE scheduled_maintenance (
    id SERIAL PRIMARY KEY,
    maintenance_item_id INTEGER NOT NULL REFERENCES maintenance_items(id) ON DELETE CASCADE,
    scheduled_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP NOT NULL,
    service_provider VARCHAR(255),
    service_provider_contact VARCHAR(100),
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'concluído', 'cancelado')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES para melhorar performance
-- ============================================
CREATE INDEX idx_properties_constructor ON properties(constructor_id);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_maintenance_items_property ON maintenance_items(property_id);
CREATE INDEX idx_maintenance_items_status ON maintenance_items(status);
CREATE INDEX idx_maintenance_items_next_date ON maintenance_items(next_maintenance_date);
CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_work_diary_property ON work_diary_integration(property_id);
CREATE INDEX idx_scheduled_maintenance_item ON scheduled_maintenance(maintenance_item_id);
CREATE INDEX idx_scheduled_maintenance_date ON scheduled_maintenance(scheduled_date);

-- ============================================
-- TRIGGERS para atualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constructors_updated_at BEFORE UPDATE ON constructors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_items_updated_at BEFORE UPDATE ON maintenance_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pathologies_updated_at BEFORE UPDATE ON pathologies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_maintenance_updated_at BEFORE UPDATE ON scheduled_maintenance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

