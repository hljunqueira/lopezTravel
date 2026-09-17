# Lopez Travel — Diretrizes Gemini & Engenharia de Front-end

## Stack Tecnológica
- **Framework**: Next.js 15 (App Router com TypeScript)
- **Estilização**: Tailwind CSS com tema personalizado Midnight Navy (`#0B132B`) e Pure Gold (`#D4AF37`)
- **Tipografia**: Cormorant Garamond (Editorial Serif) + Plus Jakarta Sans (Clean Modern Sans)
- **Animações**: GSAP (GreenSock) com `@gsap/react` e `ScrollTrigger`
- **Banco de Dados & BaaS**: Supabase PostgreSQL + Server Actions com fallback de desenvolvimento resiliente

## Regras de Interatividade e Scroll
1. **Parallax GSAP**: Utilize `useGSAP()` com `scope` em contêineres `relative overflow-hidden`.
2. **ScrollTrigger**: Utilize `scrub: 1` e sincronize camadas com profundidades opostas (fundo em `yPercent: 8`, texto em `yPercent: -12`).
3. **Sem Poluição Visual**: Nunca insira emojis ou ícones de estrelas/varinhas mágicas decorativas. O luxo se comunica através de espaço em branco, contraste tipográfico, proporção áurea e fotografia de classe mundial.

## Arquitetura de Dados (Supabase Relacional)
- `clients`: Clientes com passaporte, preferências e notas exclusivas.
- `leads`: Oportunidades com status Kanban (`new`, `contacted`, `proposal`, `confirmed`).
- `trips`: Roteiros vinculados aos clientes (`client_id` FK) com array de itinerário diário e status.
- `vendors`: Parceiros da rede global (hotéis de luxo, DMCs, operadores de aviação privada).
