/* ============================================================
   WALIFE - shared content (projects + IT/EN strings)
   Loaded before fx.js. Reusable by the future projects page.
   Edit here to add/modify projects or translations.
   ============================================================ */
window.WALIFE = {
  ARCHIVE_URL: 'projects.html',
  LANGS: ['it', 'en'],
  DEFAULT_LANG: 'it',

  /* slugs shown in the pinned showcase (in this order) */
  FEATURED: [
    'club-italia-flyers',
    'the-tower-official-merch-design',
    'gdt-identity',
    'urban-hideout',
    'cloud-paradise'
  ],

  /* newest first. `img` = cover, `url` (optional) overrides the link */
  PROJECTS: [
    {
      slug: 'club-italia-flyers',
      title: 'Club Italia flyers',
      date: '2026-10-01',
      img: 'img/projects/club-italia-flyers.webp',
      tags: { it: 'Eventi / Lavori VR', en: 'Events / VR Integrated Works' },
      desc: {
        it: 'Una serie di poster per gli eventi musicali della community Club Italia in VRChat, affiancati da progetti di comunicazione e identità del gruppo.',
        en: 'A series of posters for the Club Italia community’s music events in VRChat, alongside pieces focused on the group’s communication and identity.'
      }
    },
    {
      slug: 'the-tower-official-merch-design',
      title: 'The Tower – Official Merch',
      date: '2026-05-11',
      img: 'img/projects/the-tower-official-merch-design.webp',
      tags: { it: 'Eventi / Merch', en: 'Events / Merch' },
      desc: {
        it: 'La linea di merchandising ufficiale di The Tower, club internazionale nato nella realtà virtuale: un’identità misteriosa e mutevole tradotta in capi da indossare.',
        en: 'The official merchandise line for The Tower, an international club born in virtual reality: a mysterious, ever-changing identity translated into wearable pieces.'
      }
    },
    {
      slug: 'visual-experiments-2',
      title: 'Visual Experiments #2',
      date: '2026-01-10',
      img: 'img/projects/visual-experiments-2.webp',
      tags: { it: 'Esperimenti', en: 'Experiments' },
      desc: {
        it: 'Esperimenti grafici e studi visivi senza un brief preciso: tecniche, composizioni e stili che diventano spunti per progetti futuri.',
        en: 'Graphic experiments and visual studies with no set brief: techniques, compositions and styles that become seeds for future projects.'
      }
    },
    {
      slug: 'gdt-identity',
      title: 'GDT Identity',
      date: '2025-12-04',
      img: 'img/projects/gdt-identity.webp',
      tags: { it: 'Identità', en: 'Identity' },
      desc: {
        it: 'Micro brand identity per il clan GDT (Guerrieri delle Tenebre) di Destiny 2: un logo iconico e aggressivo ispirato alle tre classi del gioco.',
        en: 'Micro brand identity for GDT (Guerrieri delle Tenebre), a Destiny 2 clan: an iconic, aggressive logo inspired by the game’s three classes.'
      }
    },
    {
      slug: 'visual-experiments-1',
      title: 'Visual Experiments #1',
      date: '2025-11-18',
      img: 'img/projects/visual-experiments-1.webp',
      tags: { it: 'Esperimenti', en: 'Experiments' },
      desc: {
        it: 'Una raccolta di esperimenti grafici e studi visivi: alcuni risultati diventano spunti, altri restano semplici tentativi.',
        en: 'A collection of graphic experiments and visual studies: some results become starting points, others stay as simple attempts.'
      }
    },
    {
      slug: 'urban-hideout',
      title: 'Urban Hideout',
      date: '2025-10-14',
      img: 'img/projects/urban-hideout.webp',
      tags: { it: 'Esperimenti / Lavori VR', en: 'Experiments / VR Integrated Works' },
      desc: {
        it: 'Un esperimento creativo personale: un appartamento rimasto fermo nel tempo mentre il mondo esterno è andato avanti. Photoshop, Illustrator, Blender e Unity.',
        en: 'A personal creative experiment: an apartment frozen in time while the outside world moved on. Built with Photoshop, Illustrator, Blender and Unity.'
      }
    },
    {
      slug: 'elaborato-conclusivo-del-percorso-scolastico',
      title: { it: 'Elaborato conclusivo', en: 'Final School Project' },
      date: '2025-06-12',
      img: 'img/projects/elaborato-conclusivo.webp',
      tags: { it: 'Progetti scolastici / Lavori VR', en: 'School Projects / VR Integrated Works' },
      desc: {
        it: 'L’elaborato conclusivo del percorso scolastico: un progetto grafico completo di 62 pagine.',
        en: 'The final project of my school path: a complete 62-page graphic work.'
      }
    },
    {
      slug: 'dragone7-identity',
      title: 'Dragone7 Identity',
      date: '2025-02-27',
      img: 'img/projects/dragone7-identity.webp',
      tags: { it: 'Identità', en: 'Identity' },
      desc: {
        it: 'Identità visiva per lo streamer Dragone7: pagina offline, pannelli, ranks degli iscritti e altri asset per lo streaming.',
        en: 'Visual identity for the streamer Dragone7: offline page, panels, subscriber ranks and other streaming assets.'
      }
    },
    {
      slug: 'cloud-paradise',
      title: 'Cloud Paradise',
      date: '2025-01-03',
      img: 'img/projects/cloud-paradise.webp',
      tags: { it: 'Mondi virtuali', en: 'Virtual worlds' },
      desc: {
        it: 'Un mondo virtuale sopra le nuvole, sereno e avvolgente, e la serie di risorse grafiche costruita attorno a esso.',
        en: 'A virtual world above the clouds, serene and enveloping, and the series of graphic assets built around it.'
      }
    }
  ],

  SOCIALS: [
    { name: 'Discord', url: 'https://discord.com/users/139710182526550016' },
    { name: 'Email', url: 'mailto:thawalife@gmail.com' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@thawalife' },
    { name: 'Bluesky', url: 'https://bsky.app/profile/thawalife.com' }
  ],

  DICT: {
    it: {
      docTitle: 'Walife – Graphic Designer',
      docDesc: 'Portfolio di Walife, graphic designer: identità visive, poster per eventi, merch e mondi virtuali.',
      navWork: 'Lavori', navArchive: 'Archivio', navAbout: 'Chi sono', navServices: 'Servizi', navContact: 'Contatti',
      menuAll: 'Tutti i progetti ↗',
      eyebrow: 'GRAPHIC DESIGNER / CREATIVO VISIVO',
      h1aria: 'Idee trasformate in immagini.',
      h1a: 'Idee trasformate',
      h1b: 'in',
      rot: ['immagini.', 'brand.', 'poster.', 'identità.', 'mondi.'],
      heroText: 'Creo identità visive, grafiche per eventi e mondi virtuali, pensati per essere riconoscibili, coerenti e memorabili.',
      ctaWork: 'Guarda i lavori', ctaProject: 'Inizia un progetto',
      heroNote: 'Trascina il badge. Clicca per girarlo.',
      scroll: 'SCORRI',
      badgeTop: 'WALIFE / PORTFOLIO', badgeKicker: 'PORTFOLIO 2026', badgeRole: 'GRAPHIC DESIGNER',
      badgeBackKicker: 'AMBITI', badgeBackTitle: 'Design con<br>carattere.',
      badgeG1: 'IDENTITÀ', badgeG2: 'EVENTI', badgeG3: 'MERCH', badgeG4: 'MONDI VR',
      badgeBottom: 'PS · AI · BLENDER · UNITY',
      pill: 'TRASCINA / GIRA',
      workIdx: '02 / LAVORI SELEZIONATI',
      workTitle: 'Lavori che non passano inosservati.',
      workCopy: 'Una selezione di identità, poster, merch e mondi virtuali. Continua a scorrere: la galleria si muove con te. L’archivio completo vive in una pagina tutta sua.',
      scFeatured: 'IN EVIDENZA',
      scIntroTitle: '{n} storie,<br>un solo scroll.',
      scIntroText: 'Identità, eventi e mondi virtuali, ognuno costruito attorno a un’idea forte.',
      scKeep: 'CONTINUA A SCORRERE',
      scMore: 'E C’È ALTRO',
      scEndTitle: 'L’archivio<br>completo.',
      scEndText: 'Ogni progetto, in dettaglio, vive in una pagina tutta sua.',
      scEndBtn: 'Tutti i progetti',
      hudHint: 'SCORRI →',
      cfIdx: '03 / IN PRIMO PIANO',
      cfTitle: 'Trascina. Gira. Esplora.',
      cfPrev: 'Progetto precedente', cfNext: 'Progetto successivo',
      cfOpen: 'Apri progetto',
      arIdx: '04 / L’ARCHIVIO',
      arTitle: 'Questa è solo <em>la superficie.</em>',
      arCopy: 'Quello che hai visto è una breve selezione. Ogni identità, poster, merch ed esperimento vive nell’archivio completo.',
      arOrb: 'TUTTI I PROGETTI ✦ TUTTI I PROGETTI ✦ TUTTI I PROGETTI ✦ ',
      arAria: 'Vedi tutti i progetti',
      aboutIdx: '05 / CHI SONO',
      aboutLead: 'Il design grafico non è decorazione. È il modo in cui un’idea diventa chiara, riconoscibile e degna di essere ricordata.',
      aboutBody: 'Walife è il portfolio di un graphic designer che lavora tra identità visiva, comunicazione per eventi e community, merchandising e mondi virtuali. Dai poster per le serate in VRChat alle brand identity per clan e streamer, con Photoshop, Illustrator, Blender e Unity.',
      st1: 'Progetti online', st2: 'Categorie di lavoro', st3: 'Pagine dell’elaborato finale', st4: 'Software principali',
      svcIdx: '06 / SERVIZI',
      svcTitle: 'Cosa progetto.',
      s1t: 'Brand Identity', s1p: 'Loghi, micro brand identity e asset per community, clan e streamer.',
      s2t: 'Poster ed eventi', s2p: 'Poster e comunicazione per eventi musicali e community, anche in realtà virtuale.',
      s3t: 'Merch', s3p: 'Linee di merchandising che traducono un’identità in capi da indossare.',
      s4t: 'Mondi virtuali & 3D', s4p: 'Ambienti per la realtà virtuale, con Blender e Unity.',
      ctIdx: '07 / CONTATTI',
      ctLead: 'Hai un progetto in mente?',
      ctLink: 'Facciamolo visivo.',
      ctFooter: 'WALIFE / PORTFOLIO DI GRAPHIC DESIGN',
      ctTime: 'ORA LOCALE',
      toTop: 'TORNA SU ↑'
    },
    en: {
      docTitle: 'Walife – Graphic Designer',
      docDesc: 'Walife’s graphic design portfolio: visual identities, event posters, merch and virtual worlds.',
      navWork: 'Work', navArchive: 'Archive', navAbout: 'About', navServices: 'Services', navContact: 'Contact',
      menuAll: 'All projects ↗',
      eyebrow: 'GRAPHIC DESIGNER / VISUAL CREATIVE',
      h1aria: 'Ideas shaped into visuals.',
      h1a: 'Ideas shaped',
      h1b: 'into',
      rot: ['visuals.', 'brands.', 'posters.', 'identities.', 'worlds.'],
      heroText: 'I create visual identities, event graphics and virtual worlds built to be recognizable, coherent and memorable.',
      ctaWork: 'View selected work', ctaProject: 'Start a project',
      heroNote: 'Drag the badge. Click to flip.',
      scroll: 'SCROLL',
      badgeTop: 'WALIFE / PORTFOLIO', badgeKicker: 'PORTFOLIO 2026', badgeRole: 'GRAPHIC DESIGNER',
      badgeBackKicker: 'DISCIPLINES', badgeBackTitle: 'Design with<br>character.',
      badgeG1: 'IDENTITY', badgeG2: 'EVENTS', badgeG3: 'MERCH', badgeG4: 'VR WORLDS',
      badgeBottom: 'PS · AI · BLENDER · UNITY',
      pill: 'DRAG / FLIP',
      workIdx: '02 / SELECTED WORK',
      workTitle: 'Work that refuses to blend in.',
      workCopy: 'A selection of identities, posters, merch and virtual worlds. Keep scrolling: the gallery moves with you. The complete archive lives on its own page.',
      scFeatured: 'FEATURED',
      scIntroTitle: '{n} stories,<br>one scroll.',
      scIntroText: 'Identities, events and virtual worlds, each built around one strong idea.',
      scKeep: 'KEEP SCROLLING',
      scMore: 'AND THERE’S MORE',
      scEndTitle: 'The full<br>archive.',
      scEndText: 'Every project, in full detail, lives on its own page.',
      scEndBtn: 'All projects',
      hudHint: 'SCROLL →',
      cfIdx: '03 / IN THE SPOTLIGHT',
      cfTitle: 'Drag. Spin. Explore.',
      cfPrev: 'Previous project', cfNext: 'Next project',
      cfOpen: 'Open project',
      arIdx: '04 / THE ARCHIVE',
      arTitle: 'This is only <em>the surface.</em>',
      arCopy: 'What you’ve seen is a short selection. Every identity, poster, merch piece and experiment lives in the full archive.',
      arOrb: 'SEE ALL PROJECTS ✦ SEE ALL PROJECTS ✦ SEE ALL PROJECTS ✦ ',
      arAria: 'See all projects',
      aboutIdx: '05 / ABOUT',
      aboutLead: 'Graphic design is not decoration. It is the way an idea becomes clear, recognizable and worth remembering.',
      aboutBody: 'Walife is the portfolio of a graphic designer working across visual identity, event and community communication, merchandising and virtual worlds. From posters for VRChat nights to brand identities for clans and streamers, using Photoshop, Illustrator, Blender and Unity.',
      st1: 'Projects online', st2: 'Work categories', st3: 'Pages in the final school project', st4: 'Core tools',
      svcIdx: '06 / SERVICES',
      svcTitle: 'What I design.',
      s1t: 'Brand Identity', s1p: 'Logos, micro brand identities and assets for communities, clans and streamers.',
      s2t: 'Posters & Events', s2p: 'Posters and communication for music events and communities, including in virtual reality.',
      s3t: 'Merch', s3p: 'Merchandise lines that translate an identity into wearable pieces.',
      s4t: 'Virtual Worlds & 3D', s4p: 'Environments for virtual reality, built with Blender and Unity.',
      ctIdx: '07 / CONTACT',
      ctLead: 'Have a project in mind?',
      ctLink: 'Let’s make it visual.',
      ctFooter: 'WALIFE / GRAPHIC DESIGN PORTFOLIO',
      ctTime: 'LOCAL TIME',
      toTop: 'BACK TO TOP ↑'
    }
  }
};
