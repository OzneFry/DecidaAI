import { ApiClient } from "./modules/ApiClient.js";
import { MovieCatalog } from "./modules/MovieCatalog.js";
import { ChatService } from "./modules/ChatService.js";


// Configuração
const API_KEY = "c1aa3d5f837c90129415e860a0bdc4a9";
const apiClient = new ApiClient(API_KEY);

// Inicializa módulos
const movieCatalog = new MovieCatalog(apiClient, "movie-catalog");
new ChatService(); // Só cria o botão de redirecionamento

// Inicia o catálogo
movieCatalog.renderMovies();

// Faz a barra de pesquisa funcionar automaticamente ao digitar
const searchInput = document.getElementById("movie-search");
let searchTimeout;
if (searchInput) {
  const doSearch = () => {
    const query = searchInput.value.trim();
    movieCatalog.query = query || null;
    movieCatalog.currentPage = 1;
    movieCatalog.renderMovies();
  };
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(doSearch, 500); // 500ms após parar de digitar
  });
}

