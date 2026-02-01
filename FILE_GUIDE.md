# 📁 File Guide - Quick Reference

A quick guide to what each file does in your project.

## 🎯 Start Here

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Immediate next steps and common tasks |
| `PROJECT_SUMMARY.md` | Complete overview of what was built |
| `DEVELOPMENT_GUIDE.md` | Deep dive into architecture and customization |
| `README.md` | Feature overview and tech stack |

---

## 🎨 WebGL / Three.js Core

### `src/components/Experience/World.js`
**What**: Main orchestrator for the entire 3D experience
**Key Functions**:
- Initializes scene, camera, renderer
- Manages animation loop
- Integrates ScrollTrigger
- Dispatches custom events

**Edit when**: You want to change camera position, scene setup, or animation loop logic

---

### `src/components/Experience/Particles.js`
**What**: Loads 3D models and creates particle system
**Key Functions**:
- Loads GLB files (hourglass and logo)
- Extracts vertices from meshes
- Creates BufferGeometry with custom attributes
- Handles mobile optimization (particle sampling)

**Edit when**: You want to change particle count, add new models, or modify particle attributes

---

### `src/components/Experience/Renderer.js`
**What**: Configures WebGL renderer
**Key Functions**:
- Sets up WebGLRenderer with optimization
- Handles window resize
- Adjusts pixel ratio for mobile
- Manages camera aspect ratio

**Edit when**: You want to change rendering settings, pixel ratio, or camera FOV

---

### `src/components/Experience/PostProcessing.js`
**What**: Visual effects layer
**Key Functions**:
- Bloom effect (glow around particles)
- Chromatic aberration (RGB split on fast scroll)
- Film grain (analog texture)
- Effect Composer pipeline

**Edit when**: You want to add new effects, adjust bloom intensity, or modify aberration

---

### `src/components/Experience/Debug.js`
**What**: Development controls panel (Leva)
**Key Functions**:
- Exposes real-time parameter controls
- Only active in dev mode
- Allows manual testing without scrolling

**Edit when**: You want to add new debug controls or change default values

---

## 🎨 Shaders (GLSL)

### `src/components/Experience/shaders/particle.vert.glsl`
**What**: Vertex shader - controls particle positions
**Key Logic**:
- Idle state: Sand falling through hourglass
- Explosion: Curl noise particle dispersion
- Reformation: Spiral attraction to logo
- Mobile optimization flags

**Edit when**: You want to change particle movement, morphing logic, or animation phases

**Pro tip**: This is where the magic happens! Tweaking values here dramatically changes the visual effect.

---

### `src/components/Experience/shaders/particle.frag.glsl`
**What**: Fragment shader - controls particle appearance
**Key Logic**:
- Circular particle shape
- Color variations with noise
- Glow effect in center
- Alpha/transparency

**Edit when**: You want to change particle colors, size, shape, or glow intensity

---

## 🖼️ UI Components (Astro)

### `src/components/UI/Loader.astro`
**What**: Loading screen with progress indicator
**Shows**: During initial model loading (0-100%)
**Edit when**: You want to customize loading animation or messages

---

### `src/components/UI/Interface.astro`
**What**: Main UI overlay
**Contains**:
- Header (AT STUDIO / date)
- Scroll indicator (animated arrow)
- Main content (FUTURE READY headline)
- Countdown timer
- CTA button
- Scarcity label (3 spots left)

**Edit when**: You want to change text, countdown date, or button labels

---

### `src/components/UI/PilotForm.jsx` (React)
**What**: Modal application form
**Contains**:
- Name input
- Email input
- Project type selector
- Budget slider
- Submit button

**Edit when**: You want to add form fields, connect to backend, or change validation

---

## 📄 Layouts & Pages

### `src/layouts/MainLayout.astro`
**What**: Base HTML layout for all pages
**Contains**:
- SEO meta tags
- Global styles import
- Lenis smooth scroll setup
- World initialization script

**Edit when**: You want to change meta tags, add analytics, or modify scroll behavior

---

### `src/pages/index.astro`
**What**: Main page that assembles everything
**Imports**: Loader, Interface, PilotForm, MainLayout
**Edit when**: You want to add new sections or change page structure

---

## 🎨 Styles

### `src/styles/global.css`
**What**: Global styles and Tailwind imports
**Contains**:
- Tailwind CSS import
- Custom fonts (Space Mono)
- Global resets
- Canvas positioning
- Scrollbar styling

**Edit when**: You want to change fonts, colors, or global styles

---

## ⚙️ Configuration Files

### `astro.config.mjs`
**What**: Astro configuration
**Contains**:
- React integration
- Tailwind CSS via Vite plugin
- Build settings

**Edit when**: You want to add new integrations or change build settings

---

### `package.json`
**What**: Project dependencies and scripts
**Scripts**:
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Edit when**: You need to add new dependencies or scripts

---

### `tsconfig.json`
**What**: TypeScript configuration
**Contains**:
- Strict mode enabled
- React JSX settings
- Include/exclude paths

**Edit when**: You need to adjust TypeScript settings

---

## 🎯 3D Assets

### `public/models/Clessidra.glb`
**What**: Hourglass 3D model (starting shape)
**Format**: Binary GLTF
**Edit when**: You want to replace with a different model (keep same name or update Particles.js)

---

### `public/models/LogoAT.glb`
**What**: AT Studio logo 3D model (ending shape)
**Format**: Binary GLTF
**Edit when**: You want to use a different logo (keep same name or update Particles.js)

---

## 🛠️ Quick Edit Guide

### Want to change...

**Colors?**
→ `src/styles/global.css`
→ `src/components/Experience/shaders/particle.frag.glsl`

**Particle behavior?**
→ `src/components/Experience/shaders/particle.vert.glsl`

**Particle count?**
→ `src/components/Experience/Particles.js` (line 12: samplingStep)

**Scroll speed?**
→ `src/components/Experience/World.js` (line 102: LERP factor)

**Launch date?**
→ `src/components/UI/Interface.astro` (line 80: targetDate)

**UI text?**
→ `src/components/UI/Interface.astro`

**Form fields?**
→ `src/components/UI/PilotForm.jsx`

**Visual effects?**
→ `src/components/Experience/PostProcessing.js`

**Meta tags / SEO?**
→ `src/layouts/MainLayout.astro`

---

## 📝 File Size Reference

Typical sizes:
- **GLB models**: 200KB - 2MB each (optimize if larger)
- **Shaders**: 3-5KB each
- **Components**: 5-15KB each
- **Total bundle**: ~500KB - 1MB (gzipped)

---

## 🎓 Learning Path

If you want to understand the code better, read in this order:

1. `src/pages/index.astro` - See how it all connects
2. `src/layouts/MainLayout.astro` - Understand the base structure
3. `src/components/Experience/World.js` - Main orchestrator
4. `src/components/Experience/Particles.js` - Particle system
5. `src/components/Experience/shaders/*.glsl` - The visual magic
6. `src/components/UI/Interface.astro` - UI overlay
7. `src/components/Experience/PostProcessing.js` - Effects layer

---

## 🔍 Search Tips

**Find where countdown is defined:**
```bash
grep -r "targetDate" src/
```

**Find where particles are created:**
```bash
grep -r "BufferGeometry" src/
```

**Find where scroll is handled:**
```bash
grep -r "ScrollTrigger" src/
```

---

## 💡 Pro Tips

1. **Shader changes** hot-reload instantly
2. **Component changes** require browser refresh
3. **Config changes** require server restart
4. Use **browser DevTools** for debugging
5. Check **console** for WebGL errors
6. Use **Leva panel** for quick testing

---

**Questions?** Check DEVELOPMENT_GUIDE.md for detailed explanations!
