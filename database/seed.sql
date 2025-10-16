-- Dados de exemplo para o Manual Pós-Obras

-- Inserir usuários (senha: 123456)
INSERT INTO users (name, email, password, user_type, company_name, phone) VALUES
('João Silva', 'joao@email.com', '$2a$10$rOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxK', 'owner', NULL, '(11) 98765-4321'),
('Maria Santos', 'maria@email.com', '$2a$10$rOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxK', 'owner', NULL, '(11) 91234-5678'),
('Construtora ABC', 'contato@construtorabc.com', '$2a$10$rOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxK', 'builder', 'Construtora ABC Ltda', '(11) 3456-7890'),
('Engenharia XYZ', 'contato@engxyz.com', '$2a$10$rOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxKxKxKxKxOZxHQXQxKxKxK', 'builder', 'Engenharia XYZ S/A', '(11) 3789-0123')
ON CONFLICT (email) DO NOTHING;

-- Inserir propriedades
INSERT INTO properties (owner_id, builder_id, name, address, property_type, construction_year, total_area, built_area, description) VALUES
(1, 3, 'Apartamento Jardim Paulista', 'Rua Augusta, 1500 - Jardim Paulista, São Paulo - SP', 'Apartamento', 2023, 120.00, 95.00, 'Apartamento moderno de 3 dormitórios com suíte'),
(2, 3, 'Casa Condomínio Alphaville', 'Alameda das Flores, 250 - Alphaville, Barueri - SP', 'Casa', 2022, 450.00, 280.00, 'Casa térrea em condomínio fechado'),
(1, 4, 'Cobertura Vila Madalena', 'Rua Harmonia, 800 - Vila Madalena, São Paulo - SP', 'Cobertura', 2024, 200.00, 150.00, 'Cobertura duplex com terraço gourmet')
ON CONFLICT DO NOTHING;

-- Inserir manutenções
INSERT INTO maintenances (property_id, item_name, description, frequency_months, last_date, next_date, priority, status, instructions) VALUES
(1, 'Limpeza de Ar Condicionado', 'Limpeza dos filtros e verificação do sistema', 6, '2024-10-01', '2025-04-01', 'medium', 'pending', 'Contratar técnico especializado. Limpar filtros e verificar gás refrigerante.'),
(1, 'Impermeabilização de Banheiros', 'Verificação e manutenção da impermeabilização', 24, '2023-10-15', '2025-10-15', 'high', 'pending', 'Verificar presença de infiltrações. Se necessário, refazer impermeabilização.'),
(1, 'Pintura Interna', 'Repintura das paredes internas', 36, '2023-10-15', '2026-10-15', 'low', 'pending', 'Usar tinta lavável de boa qualidade. Preparar superfície antes da pintura.'),
(2, 'Limpeza de Calhas', 'Remoção de folhas e detritos das calhas', 6, '2024-09-01', '2025-03-01', 'high', 'pending', 'Limpar calhas e ralos. Verificar se há entupimentos.'),
(2, 'Revisão Elétrica', 'Inspeção do quadro elétrico e disjuntores', 12, '2024-01-15', '2025-01-15', 'critical', 'pending', 'Contratar eletricista. Verificar todos os disjuntores e fiação.'),
(3, 'Manutenção de Piscina', 'Limpeza e tratamento químico da água', 1, '2024-10-01', '2024-11-01', 'high', 'pending', 'Verificar pH, cloro e alcalinidade. Limpar bordas e fundo.')
ON CONFLICT DO NOTHING;

-- Inserir patologias comuns
INSERT INTO pathologies (name, category, description, causes, prevention, treatment, severity) VALUES
('Infiltração em Paredes', 'Umidade', 'Manchas de umidade e mofo nas paredes', 'Falha na impermeabilização, vazamentos, condensação', 'Impermeabilização adequada, ventilação, manutenção preventiva', 'Identificar origem, reparar vazamento, refazer impermeabilização, tratar mofo', 'high'),
('Trincas em Alvenaria', 'Estrutural', 'Fissuras e rachaduras nas paredes', 'Movimentação estrutural, recalque de fundação, dilatação térmica', 'Fundação adequada, juntas de dilatação, materiais de qualidade', 'Avaliar causa, reparar estrutura se necessário, preencher trincas', 'critical'),
('Piso Cerâmico Solto', 'Revestimento', 'Peças de piso ou azulejo soltas ou ocas', 'Argamassa inadequada, contrapiso irregular, falta de junta', 'Aplicação correta, argamassa adequada, juntas de dilatação', 'Remover peças soltas, preparar base, reaplicar com argamassa adequada', 'medium'),
('Mofo em Banheiros', 'Umidade', 'Manchas escuras de fungos em rejuntes e cantos', 'Ventilação insuficiente, umidade excessiva, falta de limpeza', 'Ventilação adequada, limpeza regular, produtos anti-mofo', 'Limpar com produtos específicos, melhorar ventilação', 'low'),
('Porta de Madeira Empenada', 'Esquadria', 'Porta não fecha corretamente, empenamento', 'Umidade, variação térmica, madeira de baixa qualidade', 'Madeira tratada, proteção contra umidade, ventilação', 'Lixar, ajustar dobradiças, aplicar selador, em casos graves substituir', 'medium')
ON CONFLICT DO NOTHING;

-- Inserir notificações
INSERT INTO notifications (user_id, property_id, title, message, notification_type, is_read) VALUES
(1, 1, 'Manutenção Próxima', 'A limpeza do ar condicionado está programada para 01/04/2025', 'maintenance_reminder', false),
(1, 1, 'Atenção: Manutenção Crítica', 'A impermeabilização dos banheiros precisa ser verificada em breve', 'maintenance_alert', false),
(2, 2, 'Manutenção Urgente', 'A limpeza das calhas está próxima do vencimento', 'maintenance_reminder', false),
(1, 3, 'Manutenção Mensal', 'Não esqueça da manutenção mensal da piscina', 'maintenance_reminder', true)
ON CONFLICT DO NOTHING;

