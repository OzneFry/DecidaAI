export class ChatService {
    constructor() {
      // Adiciona funcionalidade ao botão externo
      const btn = document.getElementById('open-external-chat');
      if (btn) {
        btn.onclick = () => {
          window.open("https://graziellapr.app.n8n.cloud/webhook/62be32e3-baf2-4ee6-aefa-f1e326078d31/chat", '_blank');
        };
      }
    }
}