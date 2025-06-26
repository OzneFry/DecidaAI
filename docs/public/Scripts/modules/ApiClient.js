export class ApiClient {
    constructor(apiKey) {
      this.tmdbBaseUrl = "https://api.themoviedb.org/3";
      this.chatWebhookUrl = "https://graziellapr.app.n8n.cloud/webhook/62be32e3-baf2-4ee6-aefa-f1e326078d31/chat";
      this.apiKey = apiKey;
    }
  
    async getMovies({ category = "popular", page = 1, genre = null, query = null } = {}) {
        let url = `${this.tmdbBaseUrl}/movie/${category}?api_key=${this.apiKey}&language=pt-BR&page=${page}`;
        if (genre) url += `&with_genres=${genre}`;
        if (query) url = `${this.tmdbBaseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&page=${page}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        return response.json();
    }
  
    async getMovieDetails(movieId) {
        const response = await fetch(
            `${this.tmdbBaseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=pt-BR&append_to_response=credits,videos`
        );
        return response.json();
    }
  
    async getGenres() {
        const response = await fetch(
            `${this.tmdbBaseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`
        );
        return response.json();
    }
  
    async sendChatMessage(message) {
      const response = await fetch(this.chatWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      return response.json();
    }
  
    async getWatchProviders(movieId) {
      const response = await fetch(
        `${this.tmdbBaseUrl}/movie/${movieId}/watch/providers?api_key=${this.apiKey}`
      );
      return response.json();
    }
  }