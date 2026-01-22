# DevFocus

Aplicação feita em **Next.js** com suporte a **Desktop (Electron)**.  
No desktop, em **desenvolvimento** o app abre `http://localhost:3000` e, em **produção**, abre a URL publicada na Vercel: **https://devfocus-seven.vercel.app/**.

---

## Tecnologias
- Next.js (App Router)
- Tailwind CSS
- Electron (desktop)
- electron-builder (geração de instaladores)

---

## Estrutura do projeto
- `focus/` → aplicação Next.js + Electron
  - `electron/` → arquivos do desktop (main/preload)
  - `src/` → código do Next.js
  - `src/app/` → App Router
  - `src/components/` → componentes (ex.: titlebar do Electron)
  - `src/app/globals.css` → estilos globais

---

## Requisitos
- Node.js 18+
- npm
