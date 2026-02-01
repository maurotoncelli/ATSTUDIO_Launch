# ⚡ Quick Start Guide - AT Studio Launch Page

## 🎉 Your Project is Ready!

The development server is running at: **http://localhost:4321/**

## 📁 What You Got

✅ **Fully functional WebGL particle system** with hourglass → logo morphing
✅ **Mobile-optimized** rendering and performance
✅ **Custom GLSL shaders** with curl noise and fluid animation
✅ **Post-processing effects** (bloom, chromatic aberration, film grain)
✅ **Smooth scroll integration** with Lenis
✅ **Interactive UI** with countdown and pilot form
✅ **Debug controls** (dev mode only)
✅ **Professional project structure**

## 🚀 Next Steps

### 1. View the Experience
Open your browser to: http://localhost:4321/

### 2. Test the Interaction
- **Scroll down** to trigger the particle morphing
- Watch the hourglass explode and reform into the logo
- Continue scrolling to reveal the "FUTURE READY" message
- Click **"APPLY FOR PILOT"** to test the form modal

### 3. Debug Mode (Optional)
Look for the **Leva panel** in the top-right corner to manually control:
- Morph progress
- Particle size
- Explosion curl strength

### 4. Test on Mobile
- Open the same URL on your mobile device (use your local network IP)
- Or use browser DevTools responsive mode
- Verify performance and particle count reduction

## 🛠️ Common Tasks

### Stop the Dev Server
```bash
# Press Ctrl+C in the terminal where it's running
```

### Restart the Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 Customization Points

### 1. Change Colors
Edit: `src/styles/global.css` and shader files

### 2. Adjust Countdown Date
Edit: `src/components/UI/Interface.astro` (line ~80)
```javascript
const targetDate = new Date('2026-04-01T00:00:00').getTime();
```

### 3. Modify Particle Behavior
Edit: `src/components/Experience/shaders/particle.vert.glsl`

### 4. Update Company Info
Edit: `src/components/UI/Interface.astro`
- Header text: "AT STUDIO"
- Date: "01/04/2026"
- CTA button text

### 5. Connect Form to Backend
Edit: `src/components/UI/PilotForm.jsx` (handleSubmit function)
- Add your API endpoint
- Implement real form submission

## 📱 Mobile Testing Tips

1. **Find your local IP**:
   ```bash
   # On macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Or start server with --host flag
   npm run dev -- --host
   ```

2. **Access from mobile**: 
   - Connect phone to same WiFi
   - Visit: http://YOUR_IP:4321/

3. **Check performance**:
   - Open Safari/Chrome DevTools
   - Monitor FPS (should be 60fps)
   - Check particle count in console

## 🐛 Troubleshooting

### Black Screen?
- Check browser console for errors
- Ensure WebGL is supported
- Verify GLB models exist in `/public/models/`

### Performance Issues?
- Check if mobile optimization is active (look for console logs)
- Reduce particle count in `Particles.js` (increase samplingStep)
- Lower bloom quality in `PostProcessing.js`

### Scroll Not Working?
- Verify Lenis is initialized (check console)
- Ensure body has proper height (300vh spacer div)

### Models Not Loading?
- Check `/public/models/` contains:
  - `Clessidra.glb` (hourglass)
  - `LogoAT.glb` (logo)
- Check network tab for 404 errors

## 📚 Documentation

- **README.md**: Overview and features
- **DEVELOPMENT_GUIDE.md**: Deep dive into architecture
- **This file**: Quick reference

## 🎯 Launch Checklist

Before going live:
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iOS and Android
- [ ] Verify countdown shows correct date
- [ ] Test form submission
- [ ] Run Lighthouse audit (aim for 90+ performance)
- [ ] Optimize GLB models if needed
- [ ] Add analytics (Plausible, Fathom, or Google Analytics)
- [ ] Set up form backend/email integration
- [ ] Test on slow 3G connection
- [ ] Verify SEO meta tags

## 💡 Pro Tips

1. **Debug Shader Changes**: 
   - Shaders hot-reload in dev mode
   - Check console for GLSL compilation errors

2. **Performance Profiling**:
   - Chrome DevTools > Performance tab
   - Record while scrolling
   - Look for long frames (>16ms)

3. **Particle Count Sweet Spot**:
   - Desktop: 50,000 - 150,000 particles
   - Mobile: 15,000 - 40,000 particles
   - Adjust `samplingStep` in Particles.js

4. **Scroll Speed**:
   - Slower = more dramatic
   - Faster = more dynamic
   - Adjust LERP factor in World.js

## 🎨 Design Philosophy

This page follows the "Infinite Time" concept:
- **Hourglass** = Time / Waiting / Anticipation
- **Explosion** = Transformation / Energy
- **Logo** = Identity / Arrival / Future

The morphing represents the journey from concept to reality.

## 🌟 Inspiration

This project was built following Awwwards-level standards:
- Fluid animations
- Premium aesthetics
- Performance-first approach
- Attention to detail
- Mobile-friendly

## 📞 Support

Having issues? Check:
1. Terminal output for error messages
2. Browser console for JavaScript errors
3. Network tab for failed requests
4. DEVELOPMENT_GUIDE.md for detailed troubleshooting

---

**Enjoy building your launch page!** 🚀

Made with ❤️ for AT Studio
