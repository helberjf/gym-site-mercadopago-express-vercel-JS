# Maquina Team - Site de Academia de Lutas

Site institucional da Maquina Team com integração de pagamentos via Mercado Pago.

## 🚀 Tecnologias

- **Front-end**: HTML5, CSS3, JavaScript (Vanilla), Bootstrap 4.5
- **Back-end**: Node.js, Express
- **Pagamentos**: Mercado Pago SDK
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
site-gym/
├── api/                 # API Serverless (Vercel)
│   ├── index.js        # Endpoint principal da API
│   └── package.json    # Dependências da API
├── front-end/          # Front-end estático
│   ├── index.html      # Página principal
│   ├── script.js       # JavaScript do front-end
│   ├── styles.css      # Estilos CSS
│   ├── images/         # Imagens do site
│   └── *.html          # Outras páginas (success, failure, etc)
├── vercel.json         # Configuração do Vercel
└── README.md           # Este arquivo
```

## 🔧 Configuração Local

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Mercado Pago (para credenciais de API)

### Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd site-gym
```

2. Instale as dependências da API:
```bash
cd api
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `api/`
   - Adicione suas credenciais do Mercado Pago:
```env
MP_ACCESS_TOKEN=seu_access_token_aqui
```

4. Inicie a API localmente:
```bash
cd api
node index.js
```
A API estará rodando em `http://localhost:8080`

5. Para testar o front-end:
   - Abra `front-end/index.html` no navegador
   - Ou use um servidor local (ex: `python -m http.server` na pasta front-end)

## 🌐 Deploy no Vercel

### Configuração via GitHub

1. **Crie um repositório no GitHub** e faça push do código:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/site-gym.git
git push -u origin main
```

2. **Conecte ao Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Importe o repositório `site-gym`

3. **Configure as variáveis de ambiente** no Vercel:
   - Vá em Settings → Environment Variables
   - Adicione:
     - `MP_ACCESS_TOKEN`: Seu Access Token do Mercado Pago
     - (Opcional) Outras variáveis conforme necessário

4. **Deploy automático**:
   - O Vercel detectará automaticamente o `vercel.json`
   - O deploy será feito automaticamente a cada push no GitHub

### Configuração Manual (Vercel CLI)

```bash
npm i -g vercel
vercel login
vercel
```

## 📝 Variáveis de Ambiente

### Obrigatórias

- `MP_ACCESS_TOKEN`: Token de acesso do Mercado Pago (Production ou Sandbox)

### Opcionais

- `MP_INTEGRATOR_ID`: ID do integrador (já configurado como `dev_24c65fb163bf11ea96500242ac130004` no código)

- `MP_BACK_URL_SUCCESS`: URL de redirecionamento após pagamento aprovado
- `MP_BACK_URL_FAILURE`: URL de redirecionamento após pagamento recusado
- `MP_BACK_URL_PENDING`: URL de redirecionamento para pagamento pendente
- `MP_NOTIFICATION_URL`: URL do webhook para notificações
- `MP_MAX_INSTALLMENTS`: Número máximo de parcelas (padrão: 1)

## 🔑 Obter Credenciais do Mercado Pago

1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br)
2. Faça login na sua conta
3. Vá em [Desenvolvedores](https://www.mercadopago.com.br/developers)
4. Crie uma aplicação
5. Copie o **Access Token** (Production ou Test)

## 🧪 Testar Pagamentos

### Ambiente de Teste (Sandbox)

Use credenciais de teste do Mercado Pago para testar sem realizar pagamentos reais.

### Cartões de Teste

- **Aprovado**: 5031 4332 1540 6351
- **Recusado**: 5031 4332 1540 6352
- CVV: 123
- Data: 11/30
- Nome: APRO Demo
- Email: 
- CPF: 12345678909
- Usuario Teste: TESTUSER5576313915996878460
- Senha: eRvDcIrPT0
- Email: test_user_5576313915996878469@testuser.com

## 📦 Scripts Disponíveis

### API
```bash
cd api
npm start      # Inicia o servidor
npm run dev    # Modo desenvolvimento (com nodemon)
```

## 🛠️ Estrutura da API

### Endpoints

- `POST /api/create-preference` - Cria uma preferência de pagamento
- `GET /api/ping` - Health check
- `POST /api/webhook` - Webhook do Mercado Pago

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido para Maquina Team** 🥊

