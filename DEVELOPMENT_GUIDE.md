# AT Studio Launch Page - Development Guide

## 🎯 Project Overview

This is an Awwwards-level launch page featuring a sophisticated WebGL particle system that morphs from an hourglass (representing time) to the AT Studio logo (representing identity). The experience is fully responsive and optimized for both desktop and mobile devices.

## 🚀 Quick Start

The development server is currently running at: **http://localhost:4321/**

### Available Commands

```bash
# Development server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run astro check
```

## 🏗️ Architecture

### Core Components

#### 1. **World.js** - Scene Orchestrator
- Singleton pattern for global access
- Manages scene, camera, renderer lifecycle
- Integrates GSAP ScrollTrigger for animation control
- Dispatches custom events for UI updates

#### 2. **Particles.js** - Particle System
- Loads and parses GLB models
- Extracts vertices from 3D meshes
- Creates BufferGeometry with custom attributes
- Handles mobile optimization (reduced particle count)

#### 3. **Renderer.js** - WebGL Setup
- Configures WebGLRenderer with mobile optimization
- Handles resize events
- Adjusts pixel ratio based on device
- Manages camera aspect ratio and FOV

#### 4. **PostProcessing.js** - Visual Effects
- **Bloom**: Adds glow to particles
- **Chromatic Aberration**: RGB split based on scroll velocity
- **Film Grain**: Subtle noise texture for analog feel

#### 5. **Shaders** (GLSL)
- **Vertex Shader**: Controls particle positions and morphing logic
- **Fragment Shader**: Handles particle appearance (color, shape, alpha)

### UI Components

#### Astro Components
- **MainLayout.astro**: Base layout with Lenis smooth scroll
- **Loader.astro**: Loading screen with progress indicator
- **Interface.astro**: Main UI overlay (header, countdown, CTA)

#### React Component
- **PilotForm.jsx**: Modal form for pilot program applications

## 📊 Animation Phases

### Phase 1: Idle State (No Scroll)
```glsl
// Particles flow through hourglass
- Sand falling simulation
- Infinite loop with mod()
- Turbulence at bottom using curl noise
```

### Phase 2: Explosion (0% - 50% scroll)
```glsl
// Particles break free
- Curl noise for fluid motion
- Radial expansion
- Increased brightness and size
```

### Phase 3: Reformation (50% - 100% scroll)
```glsl
// Particles form logo
- Magnetic attraction to target positions
- Spiral motion for elegance
- Lock to final position at 95%+
```

## 🎨 Design System

### Color Palette
```css
--bg-center: #0b1026     /* Deep Blue */
--bg-edge: #02040a       /* Almost Black */
--particle-base: #ffffff  /* Pure White */
--particle-glow: #a6c1ff  /* Cyan/Ice */
--ui-text: #f0f4ff       /* Off White */
```

### Typography
- **Font**: Space Mono (Monospace)
- **Weights**: 400 (Regular), 700 (Bold)
- **Style**: Uppercase, wide letter-spacing for labels

## 📱 Mobile Optimization

### Performance Strategies

1. **Reduced Pixel Ratio**
   ```javascript
   // Desktop: Math.min(devicePixelRatio, 2)
   // Mobile: Math.min(devicePixelRatio, 1.5)
   ```

2. **Particle Sampling**
   ```javascript
   // Desktop: Every vertex (step = 1)
   // Mobile: Every 3rd vertex (step = 3)
   ```

3. **Camera Adjustment**
   ```javascript
   // Desktop: camera.position.z = 5
   // Mobile: camera.position.z = 6
   ```

4. **Conditional Features**
   - Anti-aliasing disabled on mobile
   - Lower bloom quality on mobile
   - Simplified post-processing

## 🛠️ Customization Guide

### Adjusting Particle Behavior

Edit `/src/components/Experience/shaders/particle.vert.glsl`:

```glsl
// Change fall speed
float fallSpeed = aSpeed * 0.5; // Increase for faster

// Change explosion radius
float explosionDist = explosionProgress * 5.0; // Increase number

// Change spiral intensity
pos.xy += spiralOffset * 0.3; // Increase for tighter spirals
```

### Modifying Colors

Edit `/src/components/Experience/shaders/particle.frag.glsl`:

```glsl
// Base color mix
vColor = mix(vec3(1.0), vec3(0.65, 0.76, 1.0), colorNoise);

// Glow color
finalColor += vec3(0.4, 0.5, 1.0) * core * 0.5;
```

### Changing Scroll Speed

Edit `/src/components/Experience/World.js`:

```javascript
// Damping factor (lower = slower)
this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.1;
```

## 🐛 Debug Mode

In development mode, a Leva panel provides real-time controls:

- **Manual Progress**: Test morphing without scrolling
- **Particle Size**: Adjust scale
- **Curl Strength**: Control explosion intensity
- **Reset Button**: Return to defaults

Access at: `http://localhost:4321` (top-right corner)

## 🔧 Troubleshooting

### Issue: Black Screen
**Solution**: Check browser console for WebGL errors
- Ensure WebGL is supported
- Check if GLB models loaded correctly
- Verify shader compilation

### Issue: Low Performance
**Solutions**:
1. Check `isMobile` detection is working
2. Verify particle count is reduced on mobile
3. Ensure post-processing is using lower quality settings
4. Test with different pixel ratio values

### Issue: Scroll Not Working
**Solutions**:
1. Verify Lenis is initialized
2. Check GSAP ScrollTrigger is registered
3. Ensure body has height (300vh spacer div)

### Issue: Models Not Loading
**Solutions**:
1. Check `/public/models/` contains both GLB files
2. Verify file paths in `Particles.js`
3. Check network tab for 404 errors

## 📦 Production Build

### Before Building

1. **Test on Multiple Devices**
   - Desktop (Chrome, Firefox, Safari)
   - Mobile (iOS Safari, Chrome Android)
   - Tablet

2. **Performance Audit**
   ```bash
   npm run build
   npm run preview
   # Then run Lighthouse audit
   ```

3. **Optimization Checklist**
   - [ ] GLB models are optimized (under 1MB each)
   - [ ] Images compressed
   - [ ] Fonts preloaded
   - [ ] No console errors

### Build Command

```bash
npm run build
```

Output will be in `/dist/` directory.

### Deployment Platforms

Recommended platforms:
- **Vercel**: Zero-config Astro support
- **Netlify**: Great for static sites
- **Cloudflare Pages**: Fast global CDN

## 🎓 Learning Resources

### Three.js
- Official Docs: https://threejs.org/docs/
- Three.js Journey: https://threejs-journey.com/

### GLSL Shaders
- The Book of Shaders: https://thebookofshaders.com/
- Shadertoy: https://www.shadertoy.com/

### GSAP ScrollTrigger
- Docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

### Astro
- Official Docs: https://docs.astro.build/

## 📝 Notes

- Launch date: **April 1st, 2026**
- Pilot program: **3 spots available**
- Target audience: High-end clients seeking WebGL experiences

## 🔄 Future Enhancements

Potential additions:
- [ ] Audio reactive particles (sync with background music)
- [ ] Mouse interaction (particle attraction to cursor)
- [ ] WebXR support for VR/AR experiences
- [ ] Email integration for pilot form
- [ ] Analytics tracking (Plausible/Fathom)
- [ ] A/B testing different morphing speeds
- [ ] Particle color variations based on user preferences

---

**Created by**: Mauro Toncelli
**For**: AT Studio Launch
**Date**: February 2026
