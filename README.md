# 🎬 Decida AI

DecidaAI é uma aplicação web moderna para explorar, pesquisar e descobrir filmes, com integração a um chat inteligente para recomendações personalizadas. Desenvolvida com JavaScript puro e CSS modular, utiliza a API do The Movie Database (TMDb) para exibir catálogos, detalhes, filtragem por gênero, busca e informações sobre onde assistir.

## 🎬 Funcionalidades

- Catálogo de Filmes: Explore listas de filmes populares, em cartaz, melhores avaliados e próximos lançamentos.
- Busca Inteligente: Pesquise filmes por nome com resposta instantânea.
- Filtragem por Gênero: Filtre filmes por gênero usando um menu suspenso dinâmico.
- Detalhes Completos: Veja informações detalhadas, elenco, trailer e provedores de streaming de cada filme.
- Paginação Moderna: Navegue facilmente entre páginas de resultados.
- Chat Externo Integrado: Abra um chat inteligente em nova aba para recomendações e dúvidas sobre filmes.
- Design Responsivo: Interface adaptada para desktop e dispositivos móveis.

## Tecnologias Utilizadas

- HTML5, CSS3 (modularizado)
- JavaScript (ES6+, módulos)
- [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)
- [n8n Chat Widget](https://github.com/n8n-io/chat)
- Nenhum framework front-end (Vanilla JS)

## 🗂️ Estrutura de Pastas

```
DecidaAI/
├── public/
│   ├── index.html
│   ├── logo.png
│   ├── Styles/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── navigation.css
│   │   ├── pagination.css
│   │   ├── modal.css
│   │   ├── responsive.css
│   │   └── utilities.css
│   └── Scripts/
│       ├── app.js
│       └── modules/
│           ├── ApiClient.js
│           ├── MovieCatalog.js
│           └── ChatService.js
└── README.md
```

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/DecidaAI.git
   cd DecidaAI/public
   ```

2. **Abra o arquivo `index.html` no navegador:**
   - Não é necessário backend, apenas um navegador moderno.
   - Se preferir, rode um servidor local:
     ```bash
     npx serve .
     # ou
     python -m http.server
     ```

3. **Configuração da API:**
   - O site já está configurado com uma chave pública da TMDB para demonstração.
   - Para produção, obtenha sua própria chave em [TMDB](https://www.themoviedb.org/settings/api) e substitua no arquivo `app.js`:
     ```js
     const API_KEY = "SUA_CHAVE_AQUI";
     ```

## 🛠️ Principais Arquivos e Classes
  **app.js**
    Script principal que inicializa os módulos, integra a UI e conecta os eventos de busca e navegação.
    
  **ApiClient.js**
    Classe responsável por todas as requisições à API do TMDb e ao webhook do chat.
    
  `getMovies({ category, page, genre, query }):` Busca filmes por categoria, página, gênero ou termo.
  `getMovieDetails(movieId):` Detalhes completos de um filme.
  `getGenres():` Lista de gêneros disponíveis.
  `getWatchProviders(movieId):` Plataformas de streaming disponíveis para o filme.
  `sendChatMessage(message):` Envia mensagem ao webhook do chat.
  **MovieCatalog.js**
    Gerencia a renderização do catálogo de filmes, filtragem, paginação, exibição de detalhes e integração com provedores de streaming.
    
  `renderMovies():` Renderiza a lista de filmes conforme filtros e busca.
  `loadGenres():` Carrega e exibe os gêneros no filtro.
  `openMovieModal(movieId):` Exibe modal com detalhes completos do filme.
  **ChatService.js**
    Adiciona funcionalidade ao botão de chat externo, abrindo o chat em nova aba.
  
## 💡 Tecnologias Utilizadas
**HTML5** e **CSS3** (modular, responsivo e moderno)
**JavaScript (ES6+)**
**API TMDb** para dados de filmes
**Integração com Chat N8N** para recomendações

## 🌐 Publicação

A aplicação pode ser publicada facilmente em qualquer serviço de hospedagem estática. Basta enviar o conteúdo da pasta public para o serviço desejado.

**Exemplos de hospedagem:**
  `Vercel`
  `Netlify`
  `GitHub Pages`
  `Azure Static Web Apps`

## 📝 Personalização

- Para alterar o logo, substitua `public/logo.png`.
- Para mudar o visual, edite os arquivos em `public/Styles/`.
- Para integrar outro chatbot, altere o trecho do widget no `index.html`.

## Créditos

- API de filmes: [TMDB](https://www.themoviedb.org/)
- Chatbot: [n8n](https://n8n.io/)

## 📄 Licença

Este projeto é open-source e pode ser usado livremente para fins educacionais e não comerciais. Consulte o arquivo LICENSE para mais detalhes.

