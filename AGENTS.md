# Lopez Travel — Regras de Arquitetura, Design & Agentes

## [Visão Geral & Arquitetura]
- **Propósito**: Plataforma web de altíssimo luxo e SaaS Backoffice para a agência de viagens sob medida **Lopez Travel**.
- **Stack**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, GSAP (@gsap/react + ScrollTrigger), Supabase (PostgreSQL + Auth) com Server Actions, Lucide Icons.
- **Identidade Visual**:
  - Backgrounds: Azul marinho profundo (`#0B132B`, `#081026`, `#060A18`).
  - Destaques & Acentos: Dourado metálico e Champagne (`#D4AF37`, `#F7E7CE`, `#E6C868`).
  - Fontes: **Cormorant Garamond** (serif editorial de alta joalheria/hotelaria de luxo) + **Plus Jakarta Sans** (sans limpo, moderno e legível).
  - Textos de apoio: *"Seu mundo começa aqui"*, *"Curadoria sob medida"*, *"Experiências únicas"*.

## [Diretrizes de Design Clean — Anti "Cara de IA"]
- **Zero Ícones e Emojis Decorativos**: Estritamente proibido o uso de emojis (como ✨, ✈️, 🌟, 🏖️, 💎) ou ícones desnecessários de "brilhos mágicos/estrelas de IA" em títulos, botões, abas e cards.
- **Visual Corporativo e Editorial de Alta Classe**: Layout focado em tipografia sóbria, contrastes harmônicos, espaçamento generoso e ausência de efeitos cafonas ou genéricos.
- **Branding Oficial**: Utilizar sempre o monograma circular **LT** com a assinatura **LOPEZ TRAVEL** com linha divisória fina em dourado.

## [Diretrizes de Scroll & Parallax (GSAP & ScrollTrigger)]
- **Uso do GSAP no React**: Sempre utilize o hook oficial `useGSAP()` de `@gsap/react` com o devido `scope` para gerenciar ciclo de vida e evitar memory leaks.
- **ScrollTrigger Suave**: Configurar `scrub: 1` ou `scrub: true` em animações atreladas à rolagem.
- **Estrutura de Camadas**: Estruture o HTML/Tailwind usando `absolute`, `inset-0` e `z-index` bem definidos. O plano de fundo (background/vídeo/imagem) move-se a uma velocidade menor gerando profundidade cinematográfica real.
- **Acessibilidade e Preferência de Movimento**: Sempre verificar `window.matchMedia('(prefers-reduced-motion: reduce)')` e desativar deslocamentos bruscos se o usuário preferir movimento reduzido.
- **Next.js `<Image />`**: Sempre com atributos `priority` para o LCP acima da dobra, `sizes`, `fill` e imagens otimizadas em `.webp`.

## [Skills & Protocolos de Execução Obrigatórios]
### 1. Skill: Systematic Debugging (Zero Tentativa e Erro)
- Em caso de falha ou erro, reproduza o log exato, isole a causa raiz e aplique a correção mínima necessária antes de retestar.

### 2. Skill: Verification Before Completion (Sem "Pronto" Falso)
- Nunca declare uma tarefa concluída sem rodar a validação fresca (`npx tsc --noEmit` ou build).

### 3. Skill: Minto Pyramid & Comunicação Direta
- Responda primeiro com a conclusão e código final funcional, sem divagações.

### 4. Server Components vs Client Components
- Mantenha os componentes o mais próximo possível do servidor. Isole as interações e animações em Client Components pequenos com `'use client'`.
- Use tipagem estrita no TypeScript para todas as props e schema do banco.
