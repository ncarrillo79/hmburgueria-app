# 📦 Manual de Deploy — Hamburgueria App

Este manual está dividido em duas partes:

- **Parte 1** — O que o cliente precisa fazer **antes** da sessão remota
- **Parte 2** — O que a desenvolvedora faz **durante** a sessão remota

---

# PARTE 1 — Preparação do Cliente

> Siga os passos abaixo antes de combinar a sessão remota.
> Se tiver dúvidas, tire uma foto da tela e mande no WhatsApp.

---

## 1. Especificações mínimas do computador

Verifique se o computador atende aos requisitos abaixo:

| Item | Mínimo recomendado |
|---|---|
| Sistema operacional | Windows 10 ou Windows 11 |
| Memória RAM | 4 GB |
| Espaço em disco | 2 GB livres |
| Conexão à internet | Sim (durante o uso) |
| Porta USB | 1 porta livre para a impressora |

---

## 2. Instalar AnyDesk

O AnyDesk permite que a desenvolvedora acesse o computador remotamente para fazer a instalação.

1. Abra o navegador e acesse: **anydesk.com**
2. Clique no botão de download
3. Abra o arquivo baixado e siga as instruções de instalação
4. Quando o AnyDesk abrir, você verá um número de 9 dígitos na tela — **anote esse número e envie para a desenvolvedora pelo WhatsApp**

> Não feche o AnyDesk. Deixe ele aberto até a sessão remota.

---

## 3. Instalar Git

O Git é o programa que baixa o sistema no computador.

1. Acesse: **git-scm.com/download/win**
2. O download começa automaticamente
3. Abra o arquivo baixado
4. Clique em **Next** em todas as telas sem alterar nada
5. Clique em **Install** e depois em **Finish**

Para verificar se instalou corretamente:
1. Aperte as teclas `Windows + R`
2. Digite `cmd` e aperte Enter
3. Na janela preta que abrir, digite: `git --version` e aperte Enter
4. Se aparecer algo como `git version 2.x.x` — instalado com sucesso ✅

---

## 4. Instalar Node.js v18 ou superior

O Node.js é o motor que roda o sistema.

1. Acesse: **nodejs.org**
2. Clique na versão **LTS** (é a recomendada)
3. Abra o arquivo baixado
4. Clique em **Next** em todas as telas sem alterar nada
5. Clique em **Install** e depois em **Finish**

Para verificar se instalou corretamente:
1. Aperte `Windows + R`, digite `cmd` e aperte Enter
2. Digite: `node --version` e aperte Enter
3. Se aparecer algo como `v18.x.x` ou superior — instalado com sucesso ✅

---

## 5. Conectar a impressora térmica por USB

1. Ligue a impressora na tomada
2. Conecte o cabo USB da impressora em uma porta USB do computador
3. Aguarde alguns segundos — o Windows instala os drivers automaticamente
4. A impressora estará pronta quando parar de piscar

---

## 6. Identificar o número da porta USB da impressora

O sistema precisa saber em qual porta USB a impressora está conectada.

1. Clique no botão **Iniciar** (ícone do Windows)
2. Digite **Painel de Controle** e aperte Enter
3. Clique em **Dispositivos e Impressoras**
4. Clique com o botão direito na sua impressora térmica
5. Clique em **Propriedades da impressora**
6. Vá na aba **Portas**
7. Anote o nome da porta marcada (geralmente `USB001` ou `USB002`)
8. **Envie esse número para a desenvolvedora pelo WhatsApp**

---

# PARTE 2 — Checklist da Desenvolvedora

> Execute cada item em ordem durante a sessão remota.

---

## ✅ 1. Verificar pré-requisitos

```bash
git --version
node --version
npm --version
```

Todos devem retornar versões válidas antes de continuar.

---

## ✅ 2. Clonar o repositório

```bash
cd %USERPROFILE%\Desktop
git clone https://github.com/ncarrillo79/hmburgueria-app.git
cd hmburgueria-app
```

---

## ✅ 3. Criar o arquivo `.env`

```bash
cd backend
copy .env.example .env
```

Abrir o `.env` e preencher com os dados reais:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
PRINTER_MODE=thermal
THERMAL_PRINTER_PATH=\\.\USB001
```

> Substituir `USB001` pela porta identificada pelo cliente no Passo 6 da Parte 1.

---

## ✅ 4. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install
```

---

## ✅ 5. Confirmar porta USB da impressora

No Gerenciador de Dispositivos do Windows, confirmar que a porta no `.env`
corresponde à porta real da impressora térmica.

Se necessário, atualizar `THERMAL_PRINTER_PATH` no `.env` e salvar.

---

## ✅ 6. Instalar e configurar PM2

O PM2 mantém o backend rodando mesmo após fechar a janela do terminal.

```bash
npm install -g pm2
pm2 start backend/server.js --name hamburgueria
pm2 save
pm2 startup
```

Executar o comando que o PM2 mostrar na tela para que o sistema
inicie automaticamente com o Windows.

Verificar que está rodando:

```bash
pm2 status
```

Deve aparecer `hamburgueria` com status `online` ✅

---

## ✅ 7. Teste completo end-to-end

Executar cada item e confirmar o resultado:

| Teste | Como testar | Resultado esperado |
|---|---|---|
| Backend responde | Abrir `http://localhost:3001/pedidos` no navegador | Lista de pedidos em JSON |
| Frontend carrega | Abrir `http://localhost:5173` no navegador | Tela do Kanban aparece |
| Novo pedido aparece | Inserir pedido de teste no Google Sheets | Pedido aparece na tela em até 3s |
| Som de alerta | Aguardar pedido novo | Toca `notify.mp3` |
| Impressão | Verificar se o ticket saiu na impressora | Ticket impresso corretamente |
| Mudança de status | Clicar em "Preparar" em um pedido | Status atualiza no Kanban e no Sheets |
| Eliminar pedido | Clicar no ícone 🗑️ | Pedido some do Kanban |

---

## ✅ 8. Confirmação final

- [ ] PM2 está com status `online`
- [ ] Sistema inicia automaticamente com o Windows
- [ ] Cliente consegue ver os pedidos na tela
- [ ] Impressora imprime os tickets corretamente
- [ ] Cliente sabe que não deve fechar o terminal do PM2

> Ao finalizar, combinar com o cliente um contato de suporte
> para os primeiros dias de operação.
