/* ============================================================
   WALIFE - shared content (projects + IT/EN strings)
   Loaded before fx.js. Reusable by the future projects page.
   Edit here to add/modify projects or translations.
   ============================================================ */
window.WALIFE = {
  ARCHIVE_URL: 'projects.html',
  LANGS: ['it', 'en'],
  DEFAULT_LANG: 'it',

  /* project categories (filters on the projects page) */
  CATEGORIES: {
    identity: { it: 'Identità', en: 'Identity' },
    events: { it: 'Eventi', en: 'Events' },
    merch: { it: 'Merch', en: 'Merch' },
    vr: { it: 'Lavori VR', en: 'VR Integrated Works' },
    experiments: { it: 'Esperimenti', en: 'Experiments' },
    school: { it: 'Progetti scolastici', en: 'School Projects' }
  },

  /* newest first. `img` = cover, `url` (optional) overrides the link */
  PROJECTS: [
    {
      slug: 'club-italia-flyers',
      cats: ['events', 'vr'],
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
      cats: ['events', 'merch'],
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
      cats: ['experiments'],
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
      cats: ['identity'],
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
      cats: ['experiments'],
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
      cats: ['experiments', 'vr'],
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
      cats: ['school', 'vr'],
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
      cats: ['identity'],
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
      cats: ['vr'],
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
    { name: 'Discord', handle: 'thawalife', url: 'https://discord.com/users/139710182526550016' },
    { name: 'Email', handle: 'thawalife@gmail.com', url: 'mailto:thawalife@gmail.com' },
    { name: 'TikTok', handle: '@thawalife', url: 'https://www.tiktok.com/@thawalife' },
    { name: 'Bluesky', handle: '@thawalife.com', url: 'https://bsky.app/profile/thawalife.com' }
  ],

  DICT: {
    it: {
      pgBack: '← Tutti i progetti',
      pgIdx: 'PROGETTO {n} / {t}',
      pgYear: 'Anno', pgCats: 'Categorie', pgLinks: 'Link',
      pgNext: 'Prossimo progetto', pgPrev: 'Precedente',
      pgNotFound: 'Progetto non trovato.', pgNotFoundLink: 'Vai all’archivio →',
      pgPage: 'Pagina', pgOf: 'di',
      pgPlay: 'Guarda il video', pgClose: 'Chiudi',
      pgPrevImg: 'Immagine precedente', pgNextImg: 'Immagine successiva',
      pgBookPrev: 'Pagina precedente', pgBookNext: 'Pagina successiva',
      pgBookHint: 'Clicca una pagina per vederla a schermo intero',
      pjDocTitle: 'Progetti – Walife',
      pjDocDesc: 'Tutti i progetti di Walife: identità visive, poster per eventi, merch, mondi virtuali ed esperimenti.',
      pjIdx: 'ARCHIVIO / TUTTI I LAVORI',
      pjTitle: 'Tutti i <em>progetti.</em>',
      pjLead: 'Identità, poster, merch, mondi virtuali ed esperimenti: l’archivio completo dei lavori di Walife.',
      pjCount: '{n} progetti',
      pjAll: 'Tutti',
      pjGrid: 'Griglia', pjList: 'Lista',
      pjEmpty: 'Nessun progetto in questa categoria.',
      pjBack: '← Home',
      pjFilterAria: 'Filtra per categoria', pjViewAria: 'Vista',
      docTitle: 'Walife – Graphic Designer',
      docDesc: 'Portfolio di Walife, graphic designer: identità visive, poster per eventi, merch e mondi virtuali.',
      navWork: 'Lavori', navArchive: 'Archivio', navServices: 'Servizi', navContact: 'Contatti',
      menuAll: 'Tutti i progetti ↗',
      eyebrow: 'GRAPHIC DESIGNER',
      h1aria: 'Idee trasformate in immagini.',
      h1a: 'Idee trasformate',
      h1b: 'in',
      rot: ['immagini.', 'brand.', 'poster.', 'identità.', 'mondi.'],
      heroText: 'Creo identità visive, grafiche per eventi e mondi virtuali, pensati per essere riconoscibili, coerenti e memorabili.',
      ctaWork: 'Guarda i lavori', ctaProject: 'Inizia un progetto',
      heroNote: 'Trascina il badge. Clicca per girarlo.',
      scroll: 'SCORRI',
      badgeTop: 'WALIFE / PORTFOLIO', badgeKicker: 'PORTFOLIO 2026', badgeRole: 'GRAPHIC DESIGNER',
      badgeBackKicker: 'INFO & CONTATTI', badgeBackTitle: 'Design con<br>carattere.',
      badgeBio: 'Identità, poster, merch e mondi virtuali per community, club e streamer.',
      badgeWith: 'HO LAVORATO PER',
      badgeFlipHint: 'CLICCA PER TORNARE',
      badgeBottom: 'PS · AI · BLENDER · UNITY',
      pill: 'TRASCINA / GIRA',
      cfIdx: '02 / IN PRIMO PIANO',
      cfTitle: 'Trascina. Gira. Esplora.',
      cfPrev: 'Progetto precedente', cfNext: 'Progetto successivo',
      cfOpen: 'Apri progetto',
      arIdx: '03 / L’ARCHIVIO',
      arTitle: 'Questa è solo <em>la superficie.</em>',
      arCopy: 'Quello che hai visto è una breve selezione. Ogni identità, poster, merch ed esperimento vive nell’archivio completo.',
      arOrb: 'TUTTI I PROGETTI ✦ TUTTI I PROGETTI ✦ TUTTI I PROGETTI ✦ ',
      arAria: 'Vedi tutti i progetti',
      svcIdx: '04 / SERVIZI',
      svcTitle: 'Cosa progetto.',
      s1t: 'Brand Identity', s1p: 'Loghi, linguaggi visivi, sistemi di brand e linee guida.',
      s2t: 'Digital Design', s2p: 'Asset social, campagne, grafiche web ed esperienze digitali.',
      s3t: 'Editorial & Print', s3p: 'Poster, impaginazioni, pubblicazioni e comunicazione fisica.',
      s4t: '3D Modeling & Environment Art', s4p: 'Modelli 3D, props e ambienti renderizzati.',
      ctIdx: '05 / CONTATTI',
      ctLead: 'Hai un progetto in mente?',
      ctLink: 'Facciamolo visivo.',
      ctFooter: 'WALIFE / PORTFOLIO DI GRAPHIC DESIGN',
      ctTime: 'ORA LOCALE',
      toTop: 'TORNA SU ↑'
    },
    en: {
      pgBack: '← All projects',
      pgIdx: 'PROJECT {n} / {t}',
      pgYear: 'Year', pgCats: 'Categories', pgLinks: 'Links',
      pgNext: 'Next project', pgPrev: 'Previous',
      pgNotFound: 'Project not found.', pgNotFoundLink: 'Go to the archive →',
      pgPage: 'Page', pgOf: 'of',
      pgPlay: 'Watch the video', pgClose: 'Close',
      pgPrevImg: 'Previous image', pgNextImg: 'Next image',
      pgBookPrev: 'Previous page', pgBookNext: 'Next page',
      pgBookHint: 'Click a page to view it full screen',
      pjDocTitle: 'Projects – Walife',
      pjDocDesc: 'Every Walife project: visual identities, event posters, merch, virtual worlds and experiments.',
      pjIdx: 'ARCHIVE / ALL WORK',
      pjTitle: 'All <em>projects.</em>',
      pjLead: 'Identities, posters, merch, virtual worlds and experiments: the complete archive of Walife’s work.',
      pjCount: '{n} projects',
      pjAll: 'All',
      pjGrid: 'Grid', pjList: 'List',
      pjEmpty: 'No projects in this category.',
      pjBack: '← Home',
      pjFilterAria: 'Filter by category', pjViewAria: 'View',
      docTitle: 'Walife – Graphic Designer',
      docDesc: 'Walife’s graphic design portfolio: visual identities, event posters, merch and virtual worlds.',
      navWork: 'Work', navArchive: 'Archive', navServices: 'Services', navContact: 'Contact',
      menuAll: 'All projects ↗',
      eyebrow: 'GRAPHIC DESIGNER',
      h1aria: 'Ideas shaped into visuals.',
      h1a: 'Ideas shaped',
      h1b: 'into',
      rot: ['visuals.', 'brands.', 'posters.', 'identities.', 'worlds.'],
      heroText: 'I create visual identities, event graphics and virtual worlds built to be recognizable, coherent and memorable.',
      ctaWork: 'View selected work', ctaProject: 'Start a project',
      heroNote: 'Drag the badge. Click to flip.',
      scroll: 'SCROLL',
      badgeTop: 'WALIFE / PORTFOLIO', badgeKicker: 'PORTFOLIO 2026', badgeRole: 'GRAPHIC DESIGNER',
      badgeBackKicker: 'INFO & CONTACTS', badgeBackTitle: 'Design with<br>character.',
      badgeBio: 'Identities, posters, merch and virtual worlds for communities, clubs and streamers.',
      badgeWith: 'WORKED FOR',
      badgeFlipHint: 'CLICK TO FLIP BACK',
      badgeBottom: 'PS · AI · BLENDER · UNITY',
      pill: 'DRAG / FLIP',
      cfIdx: '02 / IN THE SPOTLIGHT',
      cfTitle: 'Drag. Spin. Explore.',
      cfPrev: 'Previous project', cfNext: 'Next project',
      cfOpen: 'Open project',
      arIdx: '03 / THE ARCHIVE',
      arTitle: 'This is only <em>the surface.</em>',
      arCopy: 'What you’ve seen is a short selection. Every identity, poster, merch piece and experiment lives in the full archive.',
      arOrb: 'SEE ALL PROJECTS ✦ SEE ALL PROJECTS ✦ SEE ALL PROJECTS ✦ ',
      arAria: 'See all projects',
      svcIdx: '04 / SERVICES',
      svcTitle: 'What I design.',
      s1t: 'Brand Identity', s1p: 'Logos, visual languages, brand systems and guidelines.',
      s2t: 'Digital Design', s2p: 'Social assets, campaigns, web visuals and digital experiences.',
      s3t: 'Editorial & Print', s3p: 'Posters, layouts, publications and physical communication.',
      s4t: '3D Modeling & Environment Art', s4p: '3D models, props, and rendered environments',
      ctIdx: '05 / CONTACT',
      ctLead: 'Have a project in mind?',
      ctLink: 'Let’s make it visual.',
      ctFooter: 'WALIFE / GRAPHIC DESIGN PORTFOLIO',
      ctTime: 'LOCAL TIME',
      toTop: 'BACK TO TOP ↑'
    }
  }
};
