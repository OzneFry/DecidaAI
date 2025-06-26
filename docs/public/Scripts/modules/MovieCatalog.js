export class MovieCatalog {
    constructor(apiClient, containerId) {
      this.apiClient = apiClient; // Injeção de dependência
      this.container = document.getElementById(containerId);
      this.currentCategory = "popular";
      this.currentPage = 1;
      this.totalPages = 1;
      this.genres = [];
      this.selectedGenre = null;
      this.query = null;
      this.listenNavButtons();
      // Carrega apenas o essencial na primeira renderização
      this.renderMovies().then(() => {
        // Carrega gêneros e outros dados secundários em background
        this.loadGenres();
      });
    }
  
    listenNavButtons() {
      window.addEventListener('changeCategory', (e) => {
        this.currentCategory = e.detail;
        this.currentPage = 1;
        this.query = null;
        this.selectedGenre = null;
        this.renderMovies();
      });
    }
  
    async initUI() {
      // Inicialização otimizada: carrega filmes primeiro, depois gêneros
      await this.renderMovies();
      this.loadGenres();
    }
  
    async loadGenres() {
      const data = await this.apiClient.getGenres();
      this.genres = data.genres;
      const select = document.getElementById("genre-filter");
      select.innerHTML = '<option value="">Todos os Gêneros</option>' +
          this.genres.map(g => `<option value="${g.id}">${g.name}</option>`).join("");
    }
  
    async renderMovies() {
      this.container.innerHTML = '<div class="loading">Carregando filmes...</div>';
      const data = await this.apiClient.getMovies({
          category: this.currentCategory,
          page: this.currentPage,
          genre: this.selectedGenre,
          query: this.query
      });
      this.totalPages = data.total_pages;
      if (!data.results || data.results.length === 0) {
          this.container.innerHTML = '<div class="error">Nenhum filme encontrado.</div>';
          this.renderPagination(); // Garante que a paginação aparece mesmo sem resultados
          return;
      }
      this.container.innerHTML = data.results.map(movie => this.renderMovieCard(movie)).join("");
      this.addCardListeners();
      this.renderPagination();
    }
  
    renderMovieCard(movie) {
      return `
      <div class="movie-card" data-id="${movie.id}">
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <div class="movie-info">
              <span>⭐ ${movie.vote_average?.toFixed(1) ?? "-"}</span>
              <span>${movie.release_date ? movie.release_date.split("-")[0] : ""}</span>
          </div>
          <div class="movie-overview">${movie.overview?.slice(0, 120) ?? ""}${movie.overview?.length > 120 ? "..." : ""}</div>
      </div>
      `;
    }
  
    addCardListeners() {
      this.container.querySelectorAll(".movie-card").forEach(card => {
          card.onclick = () => this.openMovieModal(card.dataset.id);
      });
    }
  
    renderPagination() {
      let pag = document.getElementById("movie-pagination");
      if (!pag) {
          pag = document.createElement("div");
          pag.id = "movie-pagination";
          pag.className = "pagination-fixed";
          document.body.appendChild(pag);
      }
      pag.innerHTML = `
          <button ${this.currentPage === 1 ? "disabled" : ""} id="prev-page">&lt; Anterior</button>
          <span style="margin:0 12px;">Página ${this.currentPage} de ${this.totalPages}</span>
          <button ${this.currentPage === this.totalPages ? "disabled" : ""} id="next-page">Próxima &gt;</button>
      `;
      document.getElementById("prev-page").onclick = () => {
          if (this.currentPage > 1) {
              this.currentPage--;
              this.renderMovies();
          }
      };
      document.getElementById("next-page").onclick = () => {
          if (this.currentPage < this.totalPages) {
              this.currentPage++;
              this.renderMovies();
          }
      };
    }
  
    async openMovieModal(movieId) {
        const data = await this.apiClient.getMovieDetails(movieId);
        // Busca os streamings disponíveis
        let providers = await this.apiClient.getWatchProviders(movieId);
        let streamingHtml = '';
        // Mapeamento dos principais provedores para suas páginas
        const providerLinks = {
            'Netflix': 'https://www.netflix.com/',
            'Amazon Prime Video': 'https://www.primevideo.com/',
            'Disney Plus': 'https://www.disneyplus.com/',
            'Disney+': 'https://www.disneyplus.com/',
            'HBO Max': 'https://www.max.com/',
            'Max': 'https://www.max.com/',
            'Apple TV Plus': 'https://tv.apple.com/',
            'Apple TV+': 'https://tv.apple.com/',
            'Paramount Plus': 'https://www.paramountplus.com/',
            'Paramount+': 'https://www.paramountplus.com/',
            'Globoplay': 'https://globoplay.globo.com/',
            'Star Plus': 'https://www.starplus.com/',
            'Star+': 'https://www.starplus.com/',
            'Claro video': 'https://www.clarovideo.com/',
            'Claro tv+': 'https://clarotvmais.com.br/',
            'Telecine Play': 'https://www.telecineplay.com.br/',
            'Telecine Amazon Channel': 'https://globoplay.globo.com/categorias/telecine-todos-os-filmes/',
            'Looke': 'https://www.looke.com.br/',
            'MGM': 'https://www.mgm.com/',
            'Google Play Movies': 'https://play.google.com/store/movies',
            'YouTube Premium': 'https://www.youtube.com/premium',
            'YouTube': 'https://www.youtube.com/',
            'Apple iTunes': 'https://www.apple.com/br/itunes/',
            'NOW': 'https://www.nowonline.com.br/',
            'Hulu': 'https://www.hulu.com/',
            'Crunchyroll': 'https://www.crunchyroll.com/',
            'Mubi': 'https://mubi.com/',
            'Rakuten TV': 'https://rakuten.tv/',
            'Pluto TV': 'https://pluto.tv/',
            'Oldflix': 'https://www.oldflix.com.br/',
            'NetMovies': 'https://www.netmovies.com.br/',
            'Netflix Standard with Ads': 'https://www.netflix.com/ads-plan'
        };
        if (providers && providers.results) {
            const br = providers.results.BR || providers.results.US || null;
            if (br && br.flatrate && br.flatrate.length > 0) {
                // Remover duplicatas pelo provider_name e ignorar Amazon Channel
                const unique = {};
                br.flatrate.forEach(p => {
                  if (
                    p.provider_name &&
                    !unique[p.provider_name] &&
                    !/Amazon Channel/i.test(p.provider_name) &&
                    !/Amazon Prime Video with Ads/i.test(p.provider_name) &&
                    !/Netflix Standard with Ads/i.test(p.provider_name) &&
                    !/Paramount Plus Premium/i.test(p.provider_name) &&
                    !/Paramount Plus Apple TV Channel/i.test(p.provider_name)
                  ) {
                    unique[p.provider_name] = p;
                  }
                });
                streamingHtml = `<div class="movie-modal-info" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0 8px 0;"><span class='label' style='margin-right:8px;font-size:1em;'>Disponível em:</span>` +
                  Object.values(unique).map(p => {
                    const link = providerLinks[p.provider_name] || '#';
                    if (p.logo_path) {
                      return `<a href="${link}" target="_blank" rel="noopener" style="display:inline-block;">
        <img src='https://image.tmdb.org/t/p/w185${p.logo_path}' alt='${p.provider_name}' title='${p.provider_name}' style='height:48px;width:48px;object-fit:contain;border-radius:5px;background:transparent;display:block;padding:0;margin:0;'>
      </a>`;
                    } else {
                      return '';
                    }
                  }).join('') +
                  `</div>`;
            } else {
                streamingHtml = `<div class="movie-modal-info"><span class='label'>Disponível em:</span> <span style='color:#ccc'>Não disponível em streaming no Brasil</span></div>`;
            }
        }
        let modal = document.getElementById("movie-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "movie-modal";
            modal.className = "movie-modal-overlay";
            document.body.appendChild(modal);
        }
        // Fundo desfocado com imagem do filme
        const bgUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '';
        modal.innerHTML = `
        <div class="movie-modal-bg" style="${bgUrl ? `background-image:url('${bgUrl}');` : ''}"></div>
        <div class="movie-modal-content" style="max-width:900px;width:98vw;max-height:96vh;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;position:relative;padding:24px 18px 18px 18px;border-radius:18px;">
            <button id="close-movie-modal" class="close-modal-btn" style="position:absolute;top:12px;right:18px;z-index:2;font-size:2.2em;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>
            <div class="movie-modal-flex" style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start;justify-content:center;">
                <!-- Cartaz e informações básicas -->
                <div style="display:flex;flex-direction:column;align-items:center;flex:0 0 160px;min-width:120px;">
                    <img src="https://image.tmdb.org/t/p/w300${data.poster_path}" alt="${data.title}" class="movie-modal-poster" style="max-width:200px;border-radius:12px;">
                    <h2 style="font-size:1.5em;margin:12px 0 0 0;text-align:center;word-break:break-word;"><span class=\"label\">${data.title}</span></h2>
                </div>
                <!-- Informações principais -->
                <div style="flex:1 1 420px;min-width:320px;max-width:600px;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;">
                    <div style="width:100%;margin-top:px;margin-bottom:18px;">
                        <div class="movie-modal-info"><span class="label">Lançamento:</span> ${data.release_date || "-"}</div>
                        <div class="movie-modal-info"><span class="label">Nota:</span> <span class="star">⭐</span> ${data.vote_average?.toFixed(1) ?? "-"} (${data.vote_count} votos)</div>
                        <div class="movie-modal-info"><span class="label">Duração:</span> ${data.runtime ? data.runtime + " min" : "-"}</div>
                        <div class="movie-modal-info"><span class="label">Gêneros:</span> ${data.genres?.map(g => g.name).join(", ") || "-"}</div>
                        <div class="movie-modal-info"><span class="label">Elenco:</span> ${data.credits?.cast?.slice(0, 5).map(a => a.name).join(", ") || "-"}</div>
                    </div>
                    
                    <!-- Trailer -->
                    ${
                        data.videos?.results?.length
                        ? `<div class='movie-modal-trailer' style="width:65%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                                <div style="width:100%;max-width:520px;">
                                    <div style="position:relative;width:100%;padding-bottom:56.25%;height:0;">
                                        <iframe 
                                            src="https://www.youtube.com/embed/${data.videos.results.find(v => v.site === 'YouTube')?.key}" 
                                            frameborder="0" 
                                            allowfullscreen 
                                            style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,0.13);background:#000;">
                                        </iframe>
                                    </div>
                                </div>
                            </div>`
                        : ``
                    }
                    
                    <!-- Sinopse e Streaming alinhados -->
                    <div style="margin-top:18px;width:100%;">
                        <div class="movie-modal-sinopse" style="margin-bottom:18px;text-align:left;width:100%;">
                            <span class="label">Sinopse:</span> 
                            ${
                                data.overview 
                                ? data.overview 
                                : `<span style="font-style:italic;color:#bbb;">Sinopse não disponível.</span>`
                            }
                        </div>
                        
                        ${streamingHtml}
                    </div>
                </div>
            </div>
        </div>
        `;
        // Responsividade extra para telas pequenas
        const content = modal.querySelector('.movie-modal-content');
        content.style.minWidth = '0';
        content.style.boxSizing = 'border-box';
        content.style.overflowX = 'hidden';
        // Ajuste para evitar scroll lateral
        modal.style.overflowX = 'hidden';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.onclick = (e) => {
            if (e.target === modal || e.target.id === "close-movie-modal") {
                modal.remove();
            }
        };
    }
  }