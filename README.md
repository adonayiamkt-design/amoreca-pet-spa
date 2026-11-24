# Amoreca Pet Spa — Website

Site institucional e comercial de banho e tosa. HTML/CSS/JS puro — sem build, sem dependências.

## Como abrir

Dê duplo clique em `index.html` ou use um servidor local:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura

```
index.html          → Home completa (todas as seções do PRD)
privacidade.html    → Política de privacidade (LGPD)
css/style.css       → Design system completo (cores, tipografia, layout)
js/config.js        → ← edite aqui dados comerciais (WhatsApp, endereço, etc.)
js/main.js          → Menu, WhatsApp, galeria, animações
img/                → Logo e fotos do site
```

## ✏️ O que editar antes de publicar

### 1. Dados comerciais — só em `js/config.js`
- **WhatsApp:** campo `whatsapp` (formato `55` + DDD + número, só dígitos)
- **Mensagem automática:** campo `whatsappMensagem`
- **Instagram:** campo `instagram` e `instagramExibicao`
- **Endereço:** campos `endereco` e `cidade`
- **Horários:** lista `horarios`

### 2. Fotos — substitua os arquivos em `img/` (mantendo o nome)
Cada espaço reservado indica o nome do arquivo e a proporção:

| Arquivo | Uso | Proporção |
|---|---|---|
| `hero.jpg` | Hero — dois pets bem cuidados | 4:5 |
| `apresentacao.jpg` | Seção "Sobre nós" | 4:5 |
| `servico-banho.jpg` | Card: Banho | 4:3 |
| `servico-tosa.jpg` | Card: Tosa na tesoura | 4:3 |
| `servico-higienica.jpg` | Card: Tosa higiênica | 4:3 |
| `servico-cuidados.jpg` | Card: Cuidados especiais | 4:3 |
| `pet-1.jpg`, `pet-2.jpg`, `pet-3.jpg` | Prova social | 1:1 |
| `experiencia.jpg` | Seção "Nossa experiência" | 4:5 |
| `galeria-1..5.jpg` | Galeria | 4:5 e 1:1 |
| `galeria-6.jpg` | Galeria destaque | 21:9 |

Basta colocar a foto com **exatamente o mesmo nome** na pasta `img/` — o espaço reservado some automaticamente.

### 3. Serviços — em `index.html` (seção 4)
Edite nome, descrição e foto de cada card conforme os serviços reais do estabelecimento.

### 4. Depoimentos — em `index.html` (seção 5)
Substitua pelos depoimentos e avaliações **reais** dos clientes.

### 5. SEO — em `index.html`
- `title` e `meta description`
- `link rel="canonical"`
- URL nos metadados Open Graph
- JSON-LD (dados estruturados do negócio local) — endereço, telefone, horários
- Adicione a cidade nos textos para buscas locais ("banho e tosa em [cidade]")

### 6. Logotipo
- `img/logo-wordmark.jpg` → versão recortada usada no header
- `img/logo-oficial.jpg` → versão completa usada no rodapé e no compartilhamento

## Publicar (Netlify Drop — já configurado)

O site está preparado para a URL **`https://amoreca-pet-spa.netlify.app`** (canonical, Open Graph, JSON-LD, sitemap e robots já apontam para ela).

1. Descompacte `site-publicacao.zip` (gerado na pasta do projeto)
2. Acesse **app.netlify.com/drop**
3. Arraste a pasta descompactada na área indicada
4. Pronto — o site sai do ar com HTTPS automático em ~30 segundos

> Se a Netlify atribuir outro nome ao site, atualize o endereço em: `index.html` (canonical, og:url, og:image, JSON-LD), `privacidade.html` (canonical), `sitemap.xml` e `robots.txt` — busca rápida por `amoreca-pet-spa.netlify.app`.

Para domínio próprio no futuro, é só repetir a busca/replace pelo domínio novo e subir de novo.

## Medição de conversão (seção 9 do PRD)

O site já dispara eventos para `window.dataLayer` (compatível com Google Tag Manager):

- `whatsapp_click` (com origem: header, hero, serviços, rodapé, flutuante…)
- `ver_galeria`
- `galeria_foto_visualizada`
- `instagram_click`

Para ativar, basta ligar o GTM/GA4 no site.

## Funcionalidades futuras (MVP → v2)

Agendamento online com calendário, painel administrativo, cadastro de clientes/pets, histórico, lembretes e fidelidade — requerem backend/integrações.
