# Lopez Travel — Hero com vídeo

## Escopo aprovado
- Implementar somente a hero cinematográfica com vídeo Pexels aprovado pelo usuário, botão de pausa, imagem alternativa e scroll natural com GSAP.
- Texto aprovado mais recente: Para onde você quer ir? / Conte com a gente para montar o roteiro, escolher os hotéis e organizar os detalhes da sua viagem.
- Fonte da hero: Inter sem serifa, sem itálico; dourado nos detalhes. Botões: Ver destinos / Falar com a equipe.
- Posicionamento global: viagens pelo Brasil e pelo mundo. Vídeo brasileiro é apenas paisagem, não delimita a oferta.
- Preservar identidade navy/champagne/dourado, destinos existentes, formulário, API, MongoDB e backoffice.
- Parar para avaliação após esta entrega. Usuário AUTORIZOU os testes automatizados de frontend e a correção da reprodução do vídeo.

## Mídia
- Vídeo aprovado: Pexels 6363735, João Pavese, Drone Shot of Cove in Brazil.
- Fonte: https://www.pexels.com/video/drone-shot-of-cove-in-brazil-6363735/
- Licença: https://www.pexels.com/license/ — permite uso comercial e edição, sem atribuição obrigatória, sujeita às restrições da licença e direitos de terceiros.
- Local informado pela fonte: Brasil. Município não confirmado; não identificar como Noronha.
- Poster selecionado pela ferramenta de curadoria: imagem do próprio clipe.
- Armazenamento: arquivos otimizados em public/media, servidos por paths relativos; nenhuma API externa em runtime.

## Critérios de aceite
- Fundo reproduz sem som e inline; pausa manual persiste ao sair e retornar à seção.
- Autoplay bloqueado permite reprodução por gesto; falha preserva fotografia e indica modo estático.
- Movimento reduzido e economia de dados detectável não iniciam download do vídeo.
- Vídeo pausa fora da viewport e em aba oculta.
- Animações GSAP sem scroll hijacking/pinning; desktop e mobile; cleanup ao desmontar.
- Nenhuma mudança no banco, autenticação ou destinos nesta entrega.

## Próxima entrega aprovada em conceito, execução pendente
- Brasil em destaque + aba Internacionais.
- Coleção: Fernando de Noronha, Lençóis Maranhenses, Amazônia, Trancoso, Rio de Janeiro, Serra Gaúcha.
- Cards conectados ao formulário com destino pré-preenchido, preservando os outros campos.

## Outras sugestões ainda não aprovadas
- Filtros de Leads e Viagens; exportação PDF; notificações por e-mail com provedor/credenciais; páginas de destinos com galerias e roteiros.

## Estado
Implementação da hero em andamento; validação pendente. Histórico anterior: backend 30/30, frontend automatizado não autorizado ainda. Nenhuma integração ou resposta de API simulada adicionada nesta entrega.
