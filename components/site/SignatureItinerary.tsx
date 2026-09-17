'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

export interface ItineraryPhase {
  period: string
  title: string
  description: string
  highlights: string
}

export interface SignatureDestinationItinerary {
  id: string
  destination: string
  country: string
  duration: string
  title: string
  lodging: string
  overview: string
  phases: ItineraryPhase[]
}

export const SIGNATURE_ITINERARIES: SignatureDestinationItinerary[] = [
  {
    id: 'rio',
    destination: 'Rio de Janeiro',
    country: 'Brasil',
    duration: '6 Dias / 5 Noites',
    title: 'Sobrevoo & Acesso Exclusivo ao Corcovado',
    lodging: 'Copacabana Palace, A Belmond Hotel',
    overview:
      'Uma imersão privativa que combina a majestade do Cristo Redentor antes da abertura pública, navegação em barco de mogno pelas ilhas oceânicas e alta gastronomia brasileira sob medida.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Recepção VIP & Boas-Vindas Cariocas',
        description:
          'Trâmite acelerado na pista de pouso com recepção em jato executivo e transfer executivo blindado até a Suíte Ocean Front no Copacabana Palace. Jantar inaugural assinado pelo chef titular.',
        highlights: 'Transfer VIP • Suíte Ocean Front • Degustação Privativa',
      },
      {
        period: 'Dia 03 — 04',
        title: 'Sobrevoo no Corcovado & Acesso Antecipado',
        description:
          'Subida privativa ao pico do Corcovado ao alvorecer com o mirante fechado ao público geral. À tarde, voo panorâmico em helicóptero privativo sobrevoando o Pão de Açúcar e a Baía de Guanabara.',
        highlights: 'Helicóptero Privativo • Cristo Sem Público • Mirante Reservado',
      },
      {
        period: 'Dia 05 — 06',
        title: 'Charter Náutico nas Ilhas & Despedida',
        description:
          'Navegação privativa pelas Ilhas Cagarras e enseadas secretas com chef a bordo preparando menu contemporâneo de frutos do mar frescos. Pôr do sol reservado no Morro da Urca.',
        highlights: 'Charter de Mogno • Chef a Bordo • Pôr do Sol na Urca',
      },
    ],
  },
  {
    id: 'paris',
    destination: 'Paris',
    country: 'França',
    duration: '7 Dias / 6 Noites',
    title: 'Alta Gastronomia & Visitas Noturnas Privadas',
    lodging: 'Le Bristol Paris & The Ritz Paris',
    overview:
      'A Cidade Luz vivenciada no mais refinado padrão aristocrático: do Museu do Louvre fechado a cruzeiros privativos em lancha clássica sob as pontes históricas do Rio Sena.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Chegada Concierge & Bistrôs Estrelados',
        description:
          'Acolhimento com concierge dedicado na saída da aeronave em Charles de Gaulle, acomodação em suíte de época e jantar de boas-vindas em restaurante 3 estrelas Michelin.',
        highlights: 'Fast-Track Charles de Gaulle • Suíte Histórica • Michelin 3 Estrelas',
      },
      {
        period: 'Dia 03 — 04',
        title: 'Louvre Noturno & Alta Costura Fechada',
        description:
          'Acesso exclusivo noturno com portas fechadas às galerias do Museu do Louvre conduzido por historiador da École du Louvre, seguido de tour privativo pelas maisons da Place Vendôme.',
        highlights: 'Louvre Fechado • Historiador Exclusivo • Place Vendôme Privée',
      },
      {
        period: 'Dia 05 — 07',
        title: 'Sena em Barco Riva & Caves de Épernay',
        description:
          'Navegação noturna em barco clássico de mogno pelo Rio Sena diante da Torre Eiffel cintilante, e voo de helicóptero até as históricas caves subterrâneas de Champagne em Épernay.',
        highlights: 'Lancha Riva no Sena • Helicóptero a Champagne • Degustação Grand Cru',
      },
    ],
  },
  {
    id: 'noronha',
    destination: 'Fernando de Noronha',
    country: 'Brasil',
    duration: '6 Dias / 5 Noites',
    title: 'Santuário Oceânico & Mergulho Reservado',
    lodging: 'Pousada Maravilha — Bangalô Oceânico',
    overview:
      'O ecossistema marinho mais preservado do Atlântico Sul com charters náuticos dedicados, expedições com biólogos marinhos titulares e os mirantes mais icônicos do Brasil.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Chegada no Arquipélago & Pôr do Sol Ícone',
        description:
          'Recepção exclusiva na pista com veículo 4x4 dedicado e acomodação em bangalô com ofurô sobre a Baía do Sueste. Pôr do sol no Mirante dos Dois Irmãos com sommelier.',
        highlights: 'Transfer 4x4 • Bangalô Oceânico • Degustação nos Dois Irmãos',
      },
      {
        period: 'Dia 03 — 04',
        title: 'Mergulho de Contemplação & Baía do Sancho',
        description:
          'Expedição de flutuação nas piscinas naturais da Atalaia e Sancho guiada por biólogo marinho titular, com registro subaquático profissional de tartarugas e golfinhos.',
        highlights: 'Biólogo Dedicado • Sancho Privativo • Fotografia Submersa',
      },
      {
        period: 'Dia 05 — 06',
        title: 'Veleiro Privativo & Gastronomia Insular',
        description:
          'Charter reservado em veleiro contornando as ilhas secundárias com parada para almoço em enseada deserta. Banquete de despedida com peixes frescos da costa.',
        highlights: 'Charter de Veleiro • Ilhotas Virgens • Jantar Sensorial',
      },
    ],
  },
  {
    id: 'maldivas',
    destination: 'Maldivas',
    country: 'Oceano Índico',
    duration: '8 Dias / 7 Noites',
    title: 'Vilas Flutuantes & Enologia Subaquática',
    lodging: 'Cheval Blanc Randheli & Soneva Jani',
    overview:
      'Privacidade absoluta sobre lagoas azul-turquesa cristalinas, com transfers fretados em hidroavião, banquetes em bancos de areia e adegas submersas no oceano.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Hidroavião Customizado & Bangalô Sobre o Mar',
        description:
          'Conexão direta em hidroavião VIP exclusivo para o atol privativo. Recepção com mordomo dedicado 24/7 e instalação na vila sobre a água com piscina infinita privativa.',
        highlights: 'Hidroavião Exclusivo • Mordomo 24/7 • Vila com Teto Retrátil',
      },
      {
        period: 'Dia 03 — 05',
        title: 'Sandbank Secreto & Adega Submersa',
        description:
          'Banquete gastronômico montado em banco de areia efêmero cercado de água morna, e degustação vertical de rótulos Grand Cru em salão de cristal a 6 metros sob a superfície marinha.',
        highlights: 'Banquete em Sandbank • Adega Submersa • Recifes Intocados',
      },
      {
        period: 'Dia 06 — 08',
        title: 'Charter em Superiate & Navegação ao Pôr do Sol',
        description:
          'Navegação diária em superiate privativo de 85 pés em busca de raias-manta e golfinhos selvagens, finalizando com jantar sob as estrelas na praia privativa da ilha.',
        highlights: 'Superiate Privativo • Nado com Mantas • Jantar Sob as Estrelas',
      },
    ],
  },
  {
    id: 'santorini',
    destination: 'Santorini',
    country: 'Grécia',
    duration: '7 Dias / 6 Noites',
    title: 'Caldeira Vulcânica & Enoturismo no Egeu',
    lodging: 'Canaves Oia Epitome & Grace Hotel',
    overview:
      'A essência arquitetônica das Cíclades entre vilas caiadas e penhascos dramáticos, com cruzeiros privativos em catamarã e degustações em adegas vulcânicas de 300 anos.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Chegada em Oia & Terraço sobre a Caldeira',
        description:
          'Transfer em helicóptero privativo de Atenas diretamente ao heliponto de Oia. Acomodação em vila com piscina esculpida na rocha vulcânica e vista ininterrupta para o pôr do sol.',
        highlights: 'Helicóptero Atenas-Oia • Vila Esculpida na Rocha • Vista Infinita',
      },
      {
        period: 'Dia 03 — 04',
        title: 'Catamarã na Caldeira & Águas Termais',
        description:
          'Charter privativo de catamarã navegando pelas crateras submersas da caldeira, banho em nascentes de águas termais sulfúricas e almoço mediterrâneo grelhado a bordo.',
        highlights: 'Catamarã Exclusivo • Termas Vulcânicas • Red & White Beach',
      },
      {
        period: 'Dia 05 — 07',
        title: 'Akrotiri Arqueológico & Enoturismo Milenar',
        description:
          'Acesso exclusivo fechado às ruínas de Akrotiri conduzido por arqueólogo titular, seguido de degustação vertical de uvas assyrtiko em adega de pedra tricentenária em Pyrgos.',
        highlights: 'Akrotiri Privativo • Arqueólogo Titular • Vinhos Vulcânicos Raros',
      },
    ],
  },
  {
    id: 'kyoto',
    destination: 'Kyoto',
    country: 'Japão',
    duration: '8 Dias / 7 Noites',
    title: 'Tradição Zen & Alta Cozinha Kaiseki',
    lodging: 'Aman Kyoto & Suiran, a Luxury Collection Hotel',
    overview:
      'Uma travessia pela espiritualidade milenar do Japão em ryokans e pavilhões históricos, com cerimônia do chá conduzida por mestres de 15ª geração e acesso matinal exclusivo aos templos.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Transfer em Rolls-Royce & Pavilhões de Cedro',
        description:
          'Recepção no desembarque internacional com trâmite VIP acelerado e transfer em Rolls-Royce até as florestas de Aman Kyoto. Jantar kaiseki servido na privacidade do pavilhão.',
        highlights: 'Rolls-Royce Dedicado • Onsen Privativo • Banquete Kaiseki',
      },
      {
        period: 'Dia 03 — 05',
        title: 'Templo Dourado & Bosque de Bambu ao Alvorecer',
        description:
          'Abertura antecipada exclusiva dos portões da Floresta de Bambu de Arashiyama e do Pavilhão Dourado Kinkaku-ji para contemplação meditativa sem presença de outros visitantes.',
        highlights: 'Arashiyama Vazia • Kinkaku-ji Antecipado • Fotografia Silenciosa',
      },
      {
        period: 'Dia 06 — 08',
        title: 'Cerimônia do Chá Secreta & Gion Tradicional',
        description:
          'Cerimônia do chá particular conduzida por grão-mestre secular em ochaya histórica preservada em Gion, e meditação privativa em jardim seco de rochas zen do século XIV.',
        highlights: 'Mestre Secular do Chá • Distrito de Gion • Templo Kiyomizu-dera',
      },
    ],
  },
  {
    id: 'dolomitas',
    destination: 'Dolomitas',
    country: 'Itália',
    duration: '7 Dias / 6 Noites',
    title: 'Picos Alpinos & Refúgios Gourmet nas Alturas',
    lodging: 'Rosa Alpina, Aman Partner Hotel & Forestis Dolomites',
    overview:
      'O encontro grandioso entre paredões monumentais de calcário rosado, navegação em botes clássicos no Lago di Braies e a mais premiada gastronomia alpina do planeta.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Chegada Alpina & Espelho do Lago di Braies',
        description:
          'Transfer panorâmico em SUV executivo com parada matinal reservada no Lago di Braies para navegação em bote artesanal de madeira antes do fluxo público.',
        highlights: 'SUV Executivo • Lago di Braies Exclusivo • Chalé Contemporâneo',
      },
      {
        period: 'Dia 03 — 04',
        title: 'Tre Cime di Lavaredo & Expedição com Guia Sênior',
        description:
          'Trilha privativa aos pés das monumentais muralhas do Tre Cime di Lavaredo com almoço sensorial em refúgio alpino estrelado a 2.400 metros de altitude.',
        highlights: 'Tre Cime Privativo • Guia Alpino Sênior • Gastronomia de Altitude',
      },
      {
        period: 'Dia 05 — 07',
        title: 'Heliesqui & Enoturismo em Cortina d’Ampezzo',
        description:
          'Sobrevoo em helicóptero privativo pelo Val di Funes e picos de Odle, com descidas em pistas virgens e degustação de trufas brancas e vinhos raros em castelo medieval.',
        highlights: 'Helicóptero nos Picos • Cortina d’Ampezzo • Trufas & Vinhos Raros',
      },
    ],
  },
  {
    id: 'serengeti',
    destination: 'Serengeti',
    country: 'Tanzânia',
    duration: '8 Dias / 7 Noites',
    title: 'A Grande Migração & Safári Aéreo na Savana',
    lodging: 'Singita Sasakwa Lodge & Four Seasons Serengeti',
    overview:
      'A mais autêntica e emocionante expedição selvagem do continente africano com sobrevoos em balão ao amanhecer, safáris 4x4 privativos e tendas coloniais de ultraluxo.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Aeronave Executiva Direta & Tenda Imperial',
        description:
          'Pouso em pista privativa na savana a bordo de aeronave Cessna Caravan fretada. Recepção por rangers titulares e acomodação em tenda com deck panorâmico e mordomo.',
        highlights: 'Aeronave Fretada • Ranger Titular • Tenda Imperial de Luxo',
      },
      {
        period: 'Dia 03 — 05',
        title: 'Safári em Balão ao Alvorecer & Café na Savana',
        description:
          'Sobrevoo silencioso em balão de ar quente acompanhando o deslocamento das manadas da Grande Migração ao nascer do sol, seguido de banquete com champanhe nas campinas.',
        highlights: 'Balão ao Amanhecer • Banquete na Savana • Grande Migração',
      },
      {
        period: 'Dia 06 — 08',
        title: 'Kopjes dos Felinos & Travessia do Rio Mara',
        description:
          'Expedições diárias em veículos 4x4 abertos guiadas por zoólogo sênior em busca de leopardos e leões nos morros de granito, com observação reservada do cruzamento do rio.',
        highlights: 'Zoólogo Dedicado • Rinocerontes de Ngorongoro • Pôr do Sol Selvagem',
      },
    ],
  },
  {
    id: 'dubai',
    destination: 'Dubai',
    country: 'Emirados Árabes',
    duration: '6 Dias / 5 Noites',
    title: 'Arranha-Céus Futuristas & Oásis Imperial no Deserto',
    lodging: 'Burj Al Arab Jumeirah & Bab Al Shams Desert Resort',
    overview:
      'Uma viagem de contrastes entre o horizonte futurista dos recordes arquitetônicos e o silêncio dourado das maiores dunas do planeta com atendimento de hospitalidade 7 estrelas.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Chegada Real no Burj Al Arab & Suíte Duplex',
        description:
          'Recepção com serviço de imigração real na pista de pouso e transfer em Rolls-Royce Phantom até a icônica suíte duplex no Burj Al Arab, com mordomo pessoal dedicado.',
        highlights: 'Rolls-Royce Phantom • Suíte Duplex 7 Estrelas • Mordomo Pessoal',
      },
      {
        period: 'Dia 03 — 04',
        title: 'Helicóptero sobre Palm Jumeirah & Lounge 148',
        description:
          'Voo de helicóptero privativo sobre os arquipélagos artificiais e costa do Golfo Pérsico, seguido de acesso exclusivo ao The Lounge no 148º andar do Burj Khalifa.',
        highlights: 'Helicóptero Privativo • Burj Khalifa Andar 148 • Charter em Iate',
      },
      {
        period: 'Dia 05 — 06',
        title: 'Acampamento de Seda no Deserto & Falcoaria',
        description:
          'Expedição em comboio 4x4 blindado até tendas de seda privativas nas dunas de areia vermelha, com demonstração de falcoaria imperial e jantar assinado sob o céu estrelado.',
        highlights: 'Dunas Vermelhas • Falcoaria Imperial • Jantar Sob as Estrelas',
      },
    ],
  },
  {
    id: 'borabora',
    destination: 'Bora Bora',
    country: 'Polinésia Francesa',
    duration: '8 Dias / 7 Noites',
    title: 'Lagoas Cristalinas & Refúgio sob o Monte Otemanu',
    lodging: 'The St. Regis Bora Bora Resort & Four Seasons Bora Bora',
    overview:
      'O ápice do romance e do isolamento no Pacífico Sul em vilas flutuantes sobre lagoas turquesa de águas mornas diante da imponente silhueta verdejante do Monte Otemanu.',
    phases: [
      {
        period: 'Dia 01 — 02',
        title: 'Chegada de Barco Rápido & Bangalô Sobre as Águas',
        description:
          'Pouso no aeroporto do motu e transfer em lancha privativa até a vila flutuante com piscina infinita, deck de madeira nobre e painel de vidro no piso para observação marinha.',
        highlights: 'Lancha Rápida Privativa • Bangalô Flutuante • Vista Monte Otemanu',
      },
      {
        period: 'Dia 03 — 05',
        title: 'Navegação em Catamarã & Nado com Raias',
        description:
          'Expedição náutica em catamarã privativo pelas baías mais intocadas do atol para mergulho livre com raias dóceis e cardumes em jardins de corais multicoloridos.',
        highlights: 'Catamarã Exclusivo • Nado com Raias • Recifes de Corais Virgens',
      },
      {
        period: 'Dia 06 — 08',
        title: 'Almoço no Motu Deserto & Banquete Polinésio',
        description:
          'Mesa montada com os pés dentro da água cristalina em uma ilhota particular para almoço de frutos do mar preparados na brasa, seguido de massagem tradicional com óleo de monoi.',
        highlights: 'Mesa na Água • Ilhota Particular • Massagem Polinésia',
      },
    ],
  },
]

export default function SignatureItinerary() {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = SIGNATURE_ITINERARIES[activeIndex]

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SIGNATURE_ITINERARIES.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SIGNATURE_ITINERARIES.length) % SIGNATURE_ITINERARIES.length)
  }

  const handlePlanTrip = (destName: string) => {
    const el = document.getElementById('planeje-sua-viagem')
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="roteiro-assinatura"
      aria-label="Roteiros Sob Medida"
      className="relative bg-[#060A18] py-28 sm:py-36 text-champagne overflow-hidden"
    >
      {/* Subtle Background Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[160px]"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Minimalist Editorial Header (No Tacky Badges) */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="font-editorial italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFF6E0] sm:whitespace-nowrap">
            Roteiros Sob Medida
          </h2>

          <p className="mt-4 text-sm sm:text-base font-light text-champagne/70 leading-relaxed">
            Nenhum itinerário é pré-fabricado. Conheça a anatomia de nossas jornadas planejadas
            com precisão cirúrgica e concierge dedicado em cada um dos nossos 10 destinos globais.
          </p>
        </div>

        {/* Clean Destination Selector Buttons (Flex Wrapped & Fully Visible) */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto px-2">
          {SIGNATURE_ITINERARIES.map((item, idx) => {
            const isSelected = activeIndex === idx
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group inline-flex items-center rounded-full px-4 py-2 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy-950 font-semibold shadow-[0_0_18px_rgba(212,175,55,0.35)] scale-[1.03]'
                    : 'bg-navy-900/70 border border-gold/20 text-champagne/80 hover:border-gold/50 hover:text-gold hover:bg-navy-900'
                }`}
              >
                <span
                  className={`font-mono text-[10px] mr-1.5 font-semibold ${
                    isSelected ? 'text-navy-950/70' : 'text-gold/70 group-hover:text-gold'
                  }`}
                >
                  0{idx + 1}
                </span>
                <span className="whitespace-nowrap">{item.destination}</span>
              </button>
            )
          })}
        </div>

        {/* Active Itinerary Showcase Card (Split Editorial Presentation) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-2xl border border-gold/20 bg-gradient-to-b from-[#081026] to-[#060A18] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Destination Overview & Primary CTA */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full border-b lg:border-b-0 lg:border-r border-gold/15 pb-8 lg:pb-0 lg:pr-10">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs uppercase font-semibold tracking-[0.24em] text-gold">
                      {current.country} • {current.duration}
                    </span>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Destino anterior"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-navy-900/80 text-champagne/70 hover:border-gold hover:text-gold transition-colors"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Próximo destino"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-navy-900/80 text-champagne/70 hover:border-gold hover:text-gold transition-colors"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFF6E0] leading-tight mb-3">
                    {current.destination}
                  </h3>

                  <p className="font-editorial italic text-lg sm:text-xl text-gold-light/90 mb-5">
                    {current.title}
                  </p>

                  <div className="mb-6 rounded-xl border border-gold/15 bg-navy-900/50 p-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gold/80 block mb-1">
                      Hospedagem Recomendada
                    </span>
                    <span className="text-sm font-medium text-champagne">
                      {current.lodging}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-light text-champagne/80 leading-relaxed mb-6">
                    {current.overview}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handlePlanTrip(current.destination)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                  >
                    <span>Personalizar Este Roteiro</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: 3 Sequential Phases (Clean, Editorial, No Badges) */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div className="text-[11px] uppercase tracking-[0.24em] font-semibold text-gold mb-1">
                  Etapas Principais do Itinerário
                </div>

                {current.phases.map((phase, pIdx) => (
                  <div
                    key={pIdx}
                    className="group rounded-xl border border-gold/15 bg-navy-900/40 p-5 transition-all duration-300 hover:border-gold/40 hover:bg-navy-900/70"
                  >
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <span className="text-xs font-mono font-semibold tracking-wider text-gold uppercase">
                        {phase.period}
                      </span>
                      <span className="text-[10px] font-light tracking-wider text-champagne/50">
                        Fase 0{pIdx + 1}
                      </span>
                    </div>

                    <h4 className="font-editorial text-xl font-normal text-[#FFF6E0] leading-snug mb-2 group-hover:text-gold transition-colors">
                      {phase.title}
                    </h4>

                    <p className="text-xs font-light text-champagne/75 leading-relaxed mb-3">
                      {phase.description}
                    </p>

                    <div className="text-[10px] tracking-wider text-gold/80 font-light border-t border-gold/10 pt-2.5">
                      {phase.highlights}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Trust Bar */}
        <div className="mt-14 rounded-2xl border border-gold/15 bg-navy-900/30 p-6 sm:p-8 backdrop-blur-md">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <span className="mb-1.5 font-editorial text-3xl font-light text-gold">100%</span>
              <span className="text-xs tracking-widest text-champagne/70 uppercase">
                Roteiros Feitos Sob Medida
              </span>
            </div>

            <div className="flex flex-col items-center border-y border-gold/10 sm:border-y-0 sm:border-x sm:border-gold/10 py-4 sm:py-0">
              <span className="mb-1.5 font-editorial text-3xl font-light text-gold">24/7</span>
              <span className="text-xs tracking-widest text-champagne/70 uppercase">
                Concierge Privativo Dedicado
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="mb-1.5 font-editorial text-3xl font-light text-gold">Virtuoso</span>
              <span className="text-xs tracking-widest text-champagne/70 uppercase">
                Parcerias Globais de Ultra-Luxo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
