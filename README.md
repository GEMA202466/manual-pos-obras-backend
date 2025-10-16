# 🏗️ Sistema de Gestão Pós-Obras

Sistema completo de gestão pós-entrega de empreendimentos, permitindo que construtoras gerenciem e proprietários acessem informações sobre manutenções, documentos, patologias e muito mais.

---

## 📦 Repositórios

### Backend API
**Repositório**: https://github.com/GEMA202466/manual-pos-obras-backend

Stack: Node.js + Express + PostgreSQL + JWT

Funcionalidades:
- ✅ Autenticação e autorização completa
- ✅ CRUD de propriedades
- ✅ CRUD de manutenções
- ✅ Sistema de notificações
- ✅ Gestão de documentos
- ✅ Catálogo de patologias

### Frontend Web
**Repositório**: https://github.com/GEMA202466/manual-pos-obras-frontend

Stack: React + Vite + CSS Moderno

Funcionalidades:
- ✅ Interface moderna e responsiva
- ✅ Dashboard completo
- ✅ Cronograma de manutenções
- ✅ Guia de patologias
- ✅ Sistema de documentos
- ✅ Notificações em tempo real

---

## 🚀 Como Executar

### Backend

```bash
# Clonar repositório
git clone https://github.com/GEMA202466/manual-pos-obras-backend.git
cd manual-pos-obras-backend

# Instalar dependências
npm install

# Configurar banco de dados PostgreSQL
# 1. Criar banco: CREATE DATABASE manual_pos_obras;
# 2. Executar schema: psql -d manual_pos_obras -f database/schema-simple.sql
# 3. Popular dados: psql -d manual_pos_obras -f database/seed.sql

# Configurar .env
cp .env.example .env
# Editar .env com suas configurações

# Iniciar servidor
node src/index.js
```

Backend rodará em: **http://localhost:3000**

### Frontend

```bash
# Clonar repositório
git clone https://github.com/GEMA202466/manual-pos-obras-frontend.git
cd manual-pos-obras-frontend

# Instalar dependências
pnpm install
# ou
npm install

# Iniciar servidor de desenvolvimento
pnpm run dev
# ou
npm run dev
```

Frontend rodará em: **http://localhost:5173**

---

## 🔑 Credenciais de Teste

```
Email: teste@email.com
Senha: 123456
Tipo: Proprietário (owner)
```

---

## 📚 Documentação

- **Arquitetura do Sistema**: Ver `ARQUITETURA_SISTEMA.md`
- **Documentação da API**: Ver `manual-pos-obras-backend/API_DOCUMENTATION.md`
- **Guia de Implementação**: Ver `IMPLEMENTACAO_COMPLETA.md`
- **Guia Rápido**: Ver `GUIA_RAPIDO.md`

---

## 🎯 Funcionalidades Principais

### Para Proprietários
- 📋 Visualizar informações completas da propriedade
- 🔧 Acompanhar cronograma de manutenções
- 📄 Acessar documentos (manuais, garantias, projetos)
- ⚠️ Guia de patologias e prevenção
- 🔔 Receber notificações de manutenções

### Para Construtoras
- 🏢 Cadastrar e gerenciar propriedades
- ✏️ Criar e atualizar manutenções
- 📤 Upload de documentos
- 📊 Dashboard de métricas
- 🔗 Integração com Diário de Obras (estrutura pronta)

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL 14
- **Autenticação**: JWT (JSON Web Tokens)
- **Criptografia**: bcryptjs
- **Validação**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Estilização**: CSS Moderno
- **HTTP Client**: Fetch API

### DevOps (Preparado para)
- **Containerização**: Docker
- **CI/CD**: GitHub Actions
- **Deploy Backend**: Heroku, AWS, DigitalOcean
- **Deploy Frontend**: Vercel, Netlify

---

## 📈 Roadmap

### ✅ Fase 1 - MVP (Concluído)
- Backend API completo
- Frontend web responsivo
- Autenticação e autorização
- CRUD de propriedades e manutenções
- Banco de dados estruturado

### 🔄 Fase 2 - Melhorias (Em Progresso)
- Integração completa com Diário de Obras
- Sistema de notificações por email
- Upload de arquivos
- Testes automatizados
- Deploy em produção

### 📅 Fase 3 - Apps Mobile (Planejado)
- Desenvolvimento React Native
- Push notifications
- Sincronização offline
- Publicação nas lojas

### 🚀 Fase 4 - Funcionalidades Avançadas (Futuro)
- Marketplace de prestadores
- IA para predição de manutenções
- Chatbot de suporte
- Analytics avançado
- Integração com IoT

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Equipe

Desenvolvido como solução completa para gestão pós-obras de empreendimentos.

---

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação completa
- Entre em contato com a equipe

---

## 🎉 Status do Projeto

**Status**: ✅ MVP Completo e Funcional

O sistema está totalmente operacional e pronto para uso em ambiente de desenvolvimento. Próximos passos incluem testes em produção e desenvolvimento mobile.

---

**Última atualização**: Outubro 2024

