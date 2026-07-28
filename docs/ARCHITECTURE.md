westcoast-trailer-configurator/
│
├── frontend/                              # Configurador 3D (Vite + React Three Fiber)
│   ├── public/
│   │   └── models/                        # (vacío, para glTF futuros)
│   ├── src/
│   │   ├── components/
│   │   │   ├── viewer3d/
│   │   │   │   ├── Scene.jsx              # ✅ cámara, luces, carretera, controles
│   │   │   │   ├── TrailerModel.jsx       # ✅ trailer (paredes transparentes, tamaño dinámico)
│   │   │   │   └── CameraControls.jsx     # (vacío, sin usar aún — lógica está en Scene.jsx)
│   │   │   ├── configurator/
│   │   │   │   ├── OptionsPanel.jsx       # ✅ panel liquid glass, tamaños, checklist, precio
│   │   │   │   ├── PriceSummary.jsx       # (vacío)
│   │   │   │   └── StepSelector.jsx       # (vacío)
│   │   │   └── ui/                        # (vacío)
│   │   ├── hooks/
│   │   │   ├── usePricing.js              # (vacío)
│   │   │   └── useTrailerConfig.js        # (vacío)
│   │   ├── context/
│   │   │   └── ConfiguratorContext.jsx    # ✅ estado global (tamaño, items, precio)
│   │   ├── services/
│   │   │   └── api.js                     # (vacío, pendiente Supabase)
│   │   ├── styles/
│   │   │   └── panel.css                  # ✅ estilos liquid glass + responsive
│   │   ├── App.jsx                        # ✅ layout con Provider + Scene + OptionsPanel
│   │   ├── main.jsx                       # ✅ generado por Vite
│   │   └── index.css                      # ✅ reset básico
│   ├── package.json
│   └── vite.config.js
│
├── website/                                # Página principal (Next.js)
│   ├── app/
│   │   ├── page.tsx                       # ✅ Home (hero, trust, testimonial, CTA)
│   │   ├── layout.tsx                     # generado por Next.js, nav pendiente de integrar
│   │   ├── globals.css
│   │   ├── about/                         # (no existe aún)
│   │   ├── gallery/                       # (no existe aún)
│   │   └── contact/                       # (no existe aún)
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── backend/                                # FastAPI (no iniciado)
│   └── app/
│       ├── main.py                        # (vacío)
│       ├── api/
│       │   ├── leads.py                   # (vacío)
│       │   ├── builds.py                  # (vacío)
│       │   ├── pricing.py                 # (vacío)
│       │   └── quotes.py                  # (vacío)
│       ├── core/
│       │   ├── config.py                  # (vacío)
│       │   └── security.py                # (vacío)
│       ├── db/
│       │   ├── supabase_client.py         # (vacío)
│       │   └── models.py                  # (vacío)
│       └── services/
│           ├── gemini_service.py          # (vacío)
│           └── pdf_service.py             # (vacío)
│
├── database/                               # (no iniciado)
│   ├── schema.sql                         # (vacío)
│   ├── rls_policies.sql                   # (vacío)
│   └── seed_data.sql                      # (vacío)
│
├── docs/
│   ├── CONTEXT.md                         # (vacío — aquí van los checkpoints)
│   ├── ARCHITECTURE.md                    # (vacío)
│   └── API.md                             # (vacío)
│
├── .github/workflows/                      # (vacíos, sin CI/CD configurado)
├── .gitignore
├── .env.example
└── README.md