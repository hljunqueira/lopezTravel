'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, MapPin } from 'lucide-react'

export interface TouristSpot {
  id: string
  name: string
  category: string
  description: string
  imageSrc: string
}

export interface DestinationCard {
  id: string
  name: string
  region: string
  country: string
  tagline: string
  coverImage: string
  bestSeason: string
  spots: TouristSpot[]
}

export const DESTINATIONS_CATALOG: DestinationCard[] = [
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brasil',
    region: 'América do Sul',
    tagline: 'A Cidade Maravilhosa entre a floresta tropical e o oceano',
    coverImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Abril a Outubro',
    spots: [
      {
        id: 'rio-1',
        name: 'Cristo Redentor & Corcovado',
        category: 'Monumento & Panorama',
        description:
          'Acesso exclusivo à plataforma superior do monumento antes do horário de abertura pública, com vista de 360 graus sobre a Baía de Guanabara e o Maciço da Tijuca.',
        imageSrc: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'rio-2',
        name: 'Pão de Açúcar & Morro da Urca',
        category: 'Mirante Icônico',
        description:
          'Subida panorâmica com recepção privativa e sobrevoo de helicóptero partindo do heliponto reservado com brinde de champanhe ao entardecer.',
        imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'rio-3',
        name: 'Jardim Botânico & Parque Lage',
        category: 'História & Natureza',
        description:
          'Passeio pelas históricas alamedas de palmeiras-reais imperiais fundadas em 1808 e café privativo no casarão neoclássico do Parque Lage.',
        imageSrc: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'rio-4',
        name: 'Ilhas Cagarras & Marina da Glória',
        category: 'Iatismo & Mar Aberto',
        description:
          'Charter privativo em iate com chef particular contornando a costa oceânica carioca para nado livre e observação marinha em águas profundas.',
        imageSrc: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'rio-5',
        name: 'Orla de Ipanema & Arpoador',
        category: 'Cultura Praiana de Luxo',
        description:
          'Lounge reservado na praia de Ipanema com concierge dedicado e acesso a terraços residenciais de Copacabana para o pôr do sol clássico.',
        imageSrc: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'França',
    region: 'Europa',
    tagline: 'Arte, palácios e a elegância atemporal da Cidade Luz',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Maio a Outubro',
    spots: [
      {
        id: 'paris-1',
        name: 'Torre Eiffel & Champ de Mars',
        category: 'Marco Universal',
        description:
          'Acesso privativo ao mirante superior e reservas reservadas no restaurante Le Jules Verne, harmonizado com safras raras da Borgonha.',
        imageSrc: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'paris-2',
        name: 'Museu do Louvre Fechado',
        category: 'Arte Sob Custódia Privativa',
        description:
          'Visita noturna com portas fechadas conduzida por historiador titular da École du Louvre, admirando a Mona Lisa e a Vênus de Milo em absoluto silêncio.',
        imageSrc: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'paris-3',
        name: 'Arco do Triunfo & Champs-Élysées',
        category: 'Monumento Imperial',
        description:
          'Acesso exclusivo à cobertura do monumento monumental erguido por Napoleão, revelando a perspectiva perfeita das doze avenidas históricas.',
        imageSrc: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'paris-4',
        name: 'Rio Sena em Barco Riva Clássico',
        category: 'Navegação Histórica',
        description:
          'Cruzeiro privado em lancha artesanal de mogno pelas pontes de pedra de Paris, passando iluminado sob a Pont Alexandre III.',
        imageSrc: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'paris-5',
        name: 'Palácio de Versalhes & Jardins Reais',
        category: 'Herança Aristocrática',
        description:
          'Entrada privativa pelos Grandes Apartamentos da Coroa e navegação em barcos a remo exclusivos pelo Grande Canal dos jardins de Le Nôtre.',
        imageSrc: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'noronha',
    name: 'Fernando de Noronha',
    country: 'Brasil',
    region: 'América do Sul',
    tagline: 'O santuário marinho mais intocado e preservado do Atlântico',
    coverImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Agosto a Janeiro',
    spots: [
      {
        id: 'noronha-1',
        name: 'Baía do Sancho',
        category: 'Melhor Praia do Mundo',
        description:
          'Eleita a praia mais bonita do planeta, com águas transparentes, paredões de rocha basáltica e piscinas repletas de fauna marinha.',
        imageSrc: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'noronha-2',
        name: 'Baía dos Porcos & Morro Dois Irmãos',
        category: 'Cartão-Postal Geológico',
        description:
          'Piscinas naturais formadas entre rochas vulcânicas escuras, ponto de contemplação mais icônico de todo o litoral brasileiro.',
        imageSrc: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'noronha-3',
        name: 'Mirante dos Golfinhos',
        category: 'Santuário de Vida Silvestre',
        description:
          'Observação matinal de dezenas de golfinhos-rotadores a partir de mirante no topo da falésia em área de proteção ambiental rigorosa.',
        imageSrc: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'noronha-4',
        name: 'Praia do Leão & Atalaia',
        category: 'Berçário Marinho',
        description:
          'Expedição de flutuação em piscinas naturais com monitoramento de biólogo marinho, avistando tartarugas-verdes e raias.',
        imageSrc: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'noronha-5',
        name: 'Forte Nossa Senhora dos Remédios',
        category: 'Fortaleza Histórica',
        description:
          'Ruínas do século XVIII com vista panorâmica para o Mar de Dentro e lounge montado para degustação de espumantes ao entardecer.',
        imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'maldivas',
    name: 'Maldivas',
    country: 'Oceano Índico',
    region: 'Ásia Meridional',
    tagline: 'Refúgios sobre águas translúcidas e horizontes de cristal',
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Novembro a Abril',
    spots: [
      {
        id: 'maldivas-1',
        name: 'Reserva da Biosfera de Hanifaru (UNESCO)',
        category: 'Santuário de Arraias-Manta',
        description:
          'Nado monitorado com centenas de arraias-manta e tubarões-baleia em baía protegida com licença de acesso especial concedida pela marinha.',
        imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'maldivas-2',
        name: 'Sandbanks Virgens Isolados',
        category: 'Privacidade Solitária',
        description:
          'Bancos de areia efêmeros que surgem na maré baixa no meio do oceano, preparados para banquetes gastronômicos à luz de velas.',
        imageSrc: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'maldivas-3',
        name: 'Restaurante & Adega Submersa',
        category: 'Experiência Subaquática',
        description:
          'Descida a 6 metros sob a superfície da água em salão de cristal, degustando rótulos Grand Cru enquanto cardumes tropicais cercam o recife.',
        imageSrc: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'maldivas-4',
        name: 'Atol de Baa & Recifes Intocados',
        category: 'Mergulho & Preservação',
        description:
          'Jardins de corais multicoloridos preservados com visibilidade superior a 40 metros para expedições em iates privativos.',
        imageSrc: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'maldivas-5',
        name: 'Vilas Sobre o Mar com Hidroavião',
        category: 'Hotelaria de Vanguarda',
        description:
          'Bangalôs com teto retrátil para observação estelar, piscina infinita e transfers diretos em hidroavião bimotor fretado.',
        imageSrc: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Grécia',
    region: 'Europa',
    tagline: 'Casas caiadas, cúpulas azuis e a caldeira sobre o Mar Egeu',
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Maio a Outubro',
    spots: [
      {
        id: 'santorini-1',
        name: 'Vilarejo de Oia & Cúpulas Azuis',
        category: 'Arquitetura Cicládica',
        description:
          'Passeio reservado pelas ruelas de mármore e mirantes privativos com vista ininterrupta para o pôr do sol mais reverenciado do Mediterrâneo.',
        imageSrc: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'santorini-2',
        name: 'Caldeira Vulcânica & Nea Kameni',
        category: 'Navegação em Catamarã',
        description:
          'Cruzeiro privativo pelas crateras marinhas e banho relaxante em enseadas de águas termais sulfúricas vulcânicas.',
        imageSrc: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'santorini-3',
        name: 'Sítio Arqueológico de Akrotiri',
        category: 'Arqueologia & Civilização Minoica',
        description:
          'A Pompeia do Egeu com acesso fechado conduzido por arqueólogo titular, caminhando por ruínas urbanas soterradas em 1627 a.C.',
        imageSrc: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'santorini-4',
        name: 'Red Beach & White Beach',
        category: 'Falésias Multicoloridas',
        description:
          'Paredões verticais de cinzas vermelhas e rochas brancas acessíveis com conforto exclusivamente por charters náuticos dedicados.',
        imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'santorini-5',
        name: 'Vilarejo Histórico de Pyrgos',
        category: 'Enoturismo de Altitude',
        description:
          'O burgo fortificado medieval mais preservado da ilha, com degustações verticais de uvas assyrtiko em adegas tricentenárias de pedra.',
        imageSrc: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japão',
    region: 'Ásia',
    tagline: 'Santuários milenares, jardins zen e a serenidade ancestral',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Março a Maio & Outubro a Novembro',
    spots: [
      {
        id: 'kyoto-1',
        name: 'Floresta de Bambu de Arashiyama',
        category: 'Natureza Zen',
        description:
          'Caminho silencioso sob altas colunas de bambu secular com acesso privativo ao amanhecer antes da chegada de turistas.',
        imageSrc: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'kyoto-2',
        name: 'Templo Dourado (Kinkaku-ji)',
        category: 'Patrimônio Mundial UNESCO',
        description:
          'Pavilhão revestido em ouro puro refletido sobre as águas calmas do lago Kyoko-chi com jardins desenhados no século XIV.',
        imageSrc: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'kyoto-3',
        name: 'Santuário Fushimi Inari-Taisha',
        category: 'Santuário Shintoísta',
        description:
          'Trilha sagrada sob milhares de portais torii vermelhos vermelhão nas encostas da montanha sagrada dedicada à divindade da prosperidade.',
        imageSrc: 'https://images.unsplash.com/photo-1478436127897-769e00d28e19?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'kyoto-4',
        name: 'Distrito Histórico de Gion',
        category: 'Cultura Tradicional',
        description:
          'Ruelas de machiya preservadas com banquete kaiseki exclusivo em ochaya histórica na presença de mestres de cerimônia.',
        imageSrc: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'kyoto-5',
        name: 'Templo Kiyomizu-dera',
        category: 'Mirante Sagrado de Madeira',
        description:
          'Estrutura secular de madeira erguida sem um único prego sobre a encosta do Monte Otowa com vista sobre todo o vale de Kyoto.',
        imageSrc: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'dolomitas',
    name: 'Dolomitas',
    country: 'Itália',
    region: 'Europa',
    tagline: 'Picos alpinos majestosos e lagos esmeralda cristalinos',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Junho a Setembro & Dezembro a Março',
    spots: [
      {
        id: 'dol-1',
        name: 'Lago di Braies & Tre Cime di Lavaredo',
        category: 'Monumento Natural Alpino',
        description:
          'Espelho d’água esmeralda aos pés de paredões monumentais de calcário, com navegação privativa em botes clássicos de madeira.',
        imageSrc: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dol-2',
        name: 'Villa del Balbianello (Lago di Como)',
        category: 'Palacete Renascentista',
        description:
          'Residência histórica do século XVIII construída sobre penhasco verdejante que serviu de cenário para clássicos do cinema mundial.',
        imageSrc: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dol-3',
        name: 'Vilas de Bellagio & Varenna',
        category: 'Charme Aristocrático',
        description:
          'Passeio em lancha de mogno Riva Aquarama atracando nos cais de pedras antigas e restaurantes estrelados das margens do Como.',
        imageSrc: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dol-4',
        name: 'Val di Funes & Igreja Santa Maddalena',
        category: 'Vale dos Sonhos Alpinos',
        description:
          'Paisagem bucólica de pastos verdes e a lendária igrejinha alpina isolada sob as agulhas dramáticas do maciço Odle.',
        imageSrc: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dol-5',
        name: 'Cortina d’Ampezzo & Passo Gardena',
        category: 'Estação de Esqui de Elite',
        description:
          'Heliesqui em pistas virgens e refúgios gourmet servindo trufas brancas e vinhos de montanha a 2.500 metros de altitude.',
        imageSrc: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'serengeti',
    name: 'Serengeti',
    country: 'Tanzânia',
    region: 'África',
    tagline: 'A imensidão selvagem da savana e a Grande Migração',
    coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Junho a Outubro',
    spots: [
      {
        id: 'ser-1',
        name: 'Planícies Infinitas do Serengeti',
        category: 'Reserva Natural Global',
        description:
          'Território de savana intocada onde milhões de gnus, zebras e antílopes percorrem o ciclo milenar da Grande Migração anual.',
        imageSrc: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ser-2',
        name: 'Cratera de Ngorongoro',
        category: 'Maior Caldeira Vulcânica do Mundo',
        description:
          'Bacia vulcânica circular de 20 km de diâmetro onde habitam rinocerontes-negros, manadas de elefantes e grandes felinos africanos.',
        imageSrc: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ser-3',
        name: 'Travessia do Rio Mara',
        category: 'Espetáculo Selvagem',
        description:
          'O momento mais dramático da natureza: o cruzamento das correntes fluviais repletas de crocodilos sob vigilância de zoólogos titulares.',
        imageSrc: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ser-4',
        name: 'Safári em Balão ao Alvorecer',
        category: 'Voo Panorâmico',
        description:
          'Sobrevoo em silêncio absoluto ao nascer do sol acompanhando as manadas do alto, seguido de café imperial com champanhe na relva.',
        imageSrc: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'ser-5',
        name: 'Kopjes de Granito de Moru',
        category: 'Mirante dos Grandes Felinos',
        description:
          'Saliências rochosas monumentais que se elevam sobre as campinas, refúgio preferido dos leões e guepardos para espreitar a planície.',
        imageSrc: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'Emirados Árabes',
    region: 'Oriente Médio',
    tagline: 'Vanguarda futurista e o silêncio dourado das maiores dunas do mundo',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Novembro a Março',
    spots: [
      {
        id: 'dxb-1',
        name: 'Dunas Vermelhas de Liwa (Rub’ al-Khali)',
        category: 'Deserto Intocado',
        description:
          'Acampamento privativo em tendas de seda montadas nas maiores dunas de areia do mundo, com demonstração de falcoaria imperial.',
        imageSrc: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dxb-2',
        name: 'Burj Khalifa & The Lounge 148',
        category: 'Arquitetura dos Recordes',
        description:
          'Acesso privativo ao mirante mais alto do planeta com serviço de mordomo e varanda aberta para todo o skyline do Golfo Pérsico.',
        imageSrc: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dxb-3',
        name: 'Palm Jumeirah & Ilhas Privadas',
        category: 'Arquipélago de Luxo',
        description:
          'Charter em iate privativo navegando ao redor da palmeira monumental e ancoragem em clubes de praia de alto prestígio.',
        imageSrc: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dxb-4',
        name: 'Bairro Histórico Al Fahidi & Dubai Creek',
        category: 'Herança das Caravanas',
        description:
          'Passeio em barco abra de madeira histórico e visita a pátios com torres de vento originais do século XIX guiada por conservador do patrimônio.',
        imageSrc: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'dxb-5',
        name: 'Museu do Futuro',
        category: 'Vanguarda do Design',
        description:
          'Visita após o expediente à obra-prima da arquitetura toróide gravada com poesia caligráfica árabe sobre inovação e sustentabilidade.',
        imageSrc: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'borabora',
    name: 'Bora Bora',
    country: 'Polinésia Francesa',
    region: 'Pacífico Sul',
    tagline: 'O santuário definitivo com bangalôs sobre lagoas multicoloridas',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    bestSeason: 'Maio a Outubro',
    spots: [
      {
        id: 'bb-1',
        name: 'Monte Otemanu',
        category: 'Pico Vulcânico Místico',
        description:
          'Pico de basalto de 727 metros que se eleva acima da lagoa turquesa, cenário mítico da Polinésia acessível por sobrevoo de helicóptero.',
        imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bb-2',
        name: 'Jardim de Corais & Baía das Arraias',
        category: 'Lagoa Cristalina',
        description:
          'Mergulho livre em águas rasas mornas na companhia de arraias-manta e pequenos tubarões de recife inofensivos em recifes virgens.',
        imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bb-3',
        name: 'Praia de Matira',
        category: 'Paraíso de Areia Branca',
        description:
          'Extensão intocada de areia de coral branco que desce suavemente para uma lagoa protegida de ondas, ideal para passeios ao pôr do sol.',
        imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bb-4',
        name: 'Motus Isolados com Banquete Polinésio',
        category: 'Ilhotas Exclusivas',
        description:
          'Transfer de piroga tradicional até uma ilhota particular com mesa montada na água para almoço de frutos do mar preparados na brasa.',
        imageSrc: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'bb-5',
        name: 'Vilas Flutuantes com Fundo de Vidro',
        category: 'Hotelaria Privativa',
        description:
          'Bangalôs sobre a água com painel de vidro no piso para observação da vida marinha, piscina privativa e canoa trazendo café da manhã.',
        imageSrc: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
]

export default function DestinationActivities() {
  const [activeModalDest, setActiveModalDest] = useState<DestinationCard | null>(null)
  const [regionFilter, setRegionFilter] = useState<string>('todos')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock background body scroll and listen for Escape key while modal is open
  useEffect(() => {
    if (activeModalDest) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveModalDest(null)
        }
      }
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        document.body.style.overflow = prevOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [activeModalDest])

  const regions = [
    { id: 'todos', label: 'Todos os Destinos' },
    { id: 'América do Sul', label: 'Brasil & América do Sul' },
    { id: 'Europa', label: 'Europa' },
    { id: 'Ásia', label: 'Ásia' },
    { id: 'África', label: 'África' },
    { id: 'Oriente Médio', label: 'Oriente Médio' },
    { id: 'Pacífico Sul', label: 'Pacífico Sul' },
  ]

  const filteredDestinations =
    regionFilter === 'todos'
      ? DESTINATIONS_CATALOG
      : DESTINATIONS_CATALOG.filter((d) => d.region === regionFilter || (regionFilter === 'Ásia' && d.region === 'Ásia Meridional'))

  const handleOpenModal = (dest: DestinationCard) => {
    setActiveModalDest(dest)
  }

  const handleCloseModal = () => {
    setActiveModalDest(null)
  }

  const handlePlanTrip = (destinationName: string) => {
    setActiveModalDest(null)
    const target = document.getElementById('planeje-sua-viagem')
    if (target) {
      const top = window.scrollY + target.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="o-que-fazer"
      aria-label="O Que Fazer em Cada Destino"
      className="relative bg-[#081026] py-28 sm:py-36 text-champagne overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-navy-700/20 blur-[140px]"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Minimalist Editorial Header (No Tacky Badges) */}
        <div className="mb-14 text-center max-w-4xl mx-auto">
          <h2 className="font-editorial italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFF6E0] sm:whitespace-nowrap">
            O Que Fazer em Cada Destino
          </h2>

          <p className="mt-4 text-sm sm:text-base font-light text-champagne/70 leading-relaxed">
            Experiências sob medida e os principais marcos históricos e naturais do mundo.
            Clique em qualquer destino para abrir os principais lugares de turismo.
          </p>

          {/* Clean Region Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {regions.map((reg) => {
              const isSelected = regionFilter === reg.id
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setRegionFilter(reg.id)}
                  className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-all duration-300 ${
                    isSelected
                      ? 'bg-gold text-navy-950 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-navy-900/60 border border-gold/15 text-champagne/70 hover:border-gold/40 hover:text-gold'
                  }`}
                >
                  {reg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Minimalist Cards Grid with Pure Photography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleOpenModal(dest)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gold/15 bg-navy-950/60 transition-all duration-500 hover:border-gold/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col aspect-[4/5]"
            >
              {/* Image Container with Zoom */}
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={dest.coverImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Cinematic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060A18] via-[#060A18]/40 to-transparent" />
                <div className="absolute inset-0 bg-[#060A18]/20 transition-opacity group-hover:opacity-0" />
              </div>

              {/* Card Footer Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end">
                <div className="text-[10px] uppercase font-semibold tracking-[0.24em] text-gold/90 mb-1.5">
                  {dest.country} • {dest.region}
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#FFF6E0] leading-tight mb-2 group-hover:text-gold transition-colors">
                  {dest.name}
                </h3>

                <p className="text-xs font-light text-champagne/80 line-clamp-2 leading-relaxed mb-4">
                  {dest.tagline}
                </p>

                {/* Click to open action prompt */}
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold group-hover:translate-x-1 transition-transform">
                  <span>Ver {dest.spots.length} Principais Lugares</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal: Principais Lugares de Turismo portalled directly to document.body */}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeModalDest && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-6">
                {/* Backdrop covering entire viewport including Navbar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCloseModal}
                  className="fixed inset-0 bg-[#060A18]/90 backdrop-blur-2xl"
                />

                {/* Modal Dialog Content (Wider, Compact, Flex Scrollable) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative z-10 w-full max-w-5xl lg:max-w-6xl max-h-[85vh] flex flex-col rounded-2xl border border-gold/30 bg-[#081026] p-5 sm:p-6 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
                >
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-navy-950/80 text-champagne hover:border-gold hover:text-gold transition-colors"
                    aria-label="Fechar janela"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Modal Header (Compact & Fixed) */}
                  <div className="shrink-0 border-b border-gold/15 pb-4 pr-12">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#FFF6E0]">
                          {activeModalDest.name}
                        </h3>
                        <span className="text-xs uppercase font-semibold tracking-[0.2em] text-gold/90">
                          {activeModalDest.country}
                        </span>
                      </div>
                      <span className="text-xs font-light text-champagne/70">
                        Melhor Época: <strong className="text-champagne font-medium">{activeModalDest.bestSeason}</strong>
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm font-light text-champagne/80">
                      {activeModalDest.tagline}
                    </p>
                  </div>

                  {/* Scrollable Body: Principais Lugares de Turismo */}
                  <div
                    className="flex-1 overflow-y-auto py-4 pr-1 sm:pr-2.5 my-1"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(212,175,55,0.35) rgba(6,10,24,0.5)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <h4 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-gold flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-gold" />
                        <span>Principais Lugares de Turismo ({activeModalDest.spots.length} atrações)</span>
                      </h4>
                      <span className="text-[10px] text-champagne/50 uppercase tracking-widest hidden sm:inline">
                        Role para explorar
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                      {activeModalDest.spots.map((spot, index) => (
                        <div
                          key={spot.id}
                          className="group relative flex items-start gap-3 rounded-xl border border-gold/15 bg-navy-900/60 p-3 transition-all duration-300 hover:border-gold/45 hover:bg-navy-900/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                        >
                          {/* Spot Thumbnail */}
                          <div className="relative h-20 w-24 sm:h-22 sm:w-26 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={spot.imageSrc}
                              alt={spot.name}
                              fill
                              sizes="120px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Spot Information */}
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <div className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-gold/80 mb-0.5">
                              0{index + 1} • {spot.category}
                            </div>
                            <h5 className="font-editorial text-base sm:text-lg font-normal text-[#FFF6E0] leading-tight mb-1 truncate group-hover:text-gold transition-colors">
                              {spot.name}
                            </h5>
                            <p className="text-[11px] font-light text-champagne/70 line-clamp-2 leading-relaxed">
                              {spot.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer CTA (Compact & Fixed) */}
                  <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 pt-3.5 mt-1">
                    <div className="text-xs text-champagne/70 font-light">
                      <span>Roteiro personalizado e acesso VIP com </span>
                      <span className="text-gold font-medium">Concierge Lopez Travel</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-full border border-champagne/20 px-4 py-2 text-[11px] uppercase tracking-wider text-champagne/70 hover:text-champagne transition-colors"
                      >
                        Fechar
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlanTrip(activeModalDest.name)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-950 transition-all duration-300 hover:shadow-[0_0_18px_rgba(212,175,55,0.4)]"
                      >
                        <span>Planejar Esta Viagem</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  )
}
