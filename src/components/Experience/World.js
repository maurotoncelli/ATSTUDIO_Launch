import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Renderer from './Renderer';
import Particles from './Particles';
import PostProcessing from './PostProcessing';
import Starfield from './Starfield';
import Debug from './Debug';

gsap.registerPlugin(ScrollTrigger);

export default class World {
  constructor(canvas) {
    // Singleton pattern
    if (World.instance) {
      return World.instance;
    }
    World.instance = this;
    
    this.canvas = canvas;
    this.isReady = false;
    this.clock = new THREE.Clock();
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.scrollVelocity = 0;
    this.lastScrollProgress = 0;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.hasMouse = false;
    this.logoPNG = null;
    this.logoOpacity = 0;
    
    // Initialize
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupResize();
    this.setupPointer();
    
    // Load and start
    this.init();
  }
  
  setupScene() {
    this.scene = new THREE.Scene();
    // Fog più leggera per vedere le particelle in profondità
    this.scene.fog = new THREE.Fog(0x02040a, 8, 20);
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      65,  // FOV ridotto da 75 a 65 per meno distorsione
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    
    // Adjust initial position based on device
    const isMobileOrTablet = window.innerWidth < 1024;
    this.camera.position.z = isMobileOrTablet ? 7 : 6;
  }
  
  setupRenderer() {
    this.renderer = new Renderer(this.canvas);
  }
  
  setupResize() {
    window.addEventListener('resize', () => {
      const sizes = this.renderer.resize(this.camera);
      
      if (this.particles) {
        this.particles.updateSize(sizes.pixelRatio, sizes.isMobile);
        this.updateLogoOverlaySize();
      }

      if (this.starfield) {
        this.starfield.updateSize(sizes.pixelRatio);
      }
      
      if (this.postProcessing) {
        this.postProcessing.resize(sizes.width, sizes.height);
      }
    });
  }

  setupPointer() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.set(x, y);
      this.hasMouse = true;
      this.updateMouseWorld();
    });

    window.addEventListener('mouseleave', () => {
      this.hasMouse = false;
    });
  }

  updateMouseWorld() {
    // Project mouse to z=0 plane
    const vec = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    vec.unproject(this.camera);
    const dir = vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z;
    this.mouseWorld.copy(this.camera.position).add(dir.multiplyScalar(distance));
  }

  updateLogoOverlaySize() {
    if (!this.logoPNG || !this.particles || !this.particles.logoBounds) return;

    const img = this.logoPNG.querySelector('img');
    if (!img) return;

    const { width, height } = this.particles.logoBounds;
    const distance = this.camera.position.z;
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const viewportHeight = 2 * Math.tan(vFov / 2) * distance;
    const viewportWidth = viewportHeight * this.camera.aspect;

    const pxPerUnitX = this.renderer.sizes.width / viewportWidth;
    const pxPerUnitY = this.renderer.sizes.height / viewportHeight;

    const widthPx = Math.max(1, Math.round(width * pxPerUnitX));
    const heightPx = Math.max(1, Math.round(height * pxPerUnitY));

    // Upscale del 10% su desktop e 10% anche su mobile per migliore match
    const isMobile = window.innerWidth < 768;
    const scale = window.innerWidth >= 1024 ? 1.10 : (isMobile ? 1.10 : 1.05);

    img.style.width = `${Math.round(widthPx * scale)}px`;
    img.style.height = `${Math.round(heightPx * scale)}px`;
  }
  
  async init() {
    try {
      const isMobileOrTablet = window.innerWidth < 1024;
      
      // Show loading state
      this.dispatchEvent('loading', { progress: 0 });

      // Cache SVG logo overlay
      if (typeof document !== 'undefined') {
        this.logoPNG = document.getElementById('logo-png');
        
        if (this.logoPNG) {
          if (isMobileOrTablet) {
            // Su mobile/tablet: mostra subito il logo
            this.logoPNG.style.opacity = '1';
            this.logoPNG.style.transition = 'none';
          } else {
            // Su desktop: parte invisibile per l'animazione
            this.logoPNG.style.opacity = '0';
            this.logoPNG.style.transition = 'opacity 0.3s ease-out';
          }
        }
      }
      
      // Create starfield background (sempre attivo)
      this.starfield = new Starfield(isMobileOrTablet);
      this.scene.add(this.starfield.points);

      this.dispatchEvent('loading', { progress: 50 });

      if (!isMobileOrTablet) {
        // SOLO SU DESKTOP: carica particelle e post-processing
        this.particles = new Particles(false);
        
        this.dispatchEvent('loading', { progress: 60 });
        
        const particleSystem = await this.particles.load();
        this.scene.add(particleSystem);

        this.updateLogoOverlaySize();
        
        this.dispatchEvent('loading', { progress: 80 });
        
        // Setup post-processing
        this.postProcessing = new PostProcessing(
          this.renderer,
          this.scene,
          this.camera,
          false
        );
        
        // Setup scroll trigger (solo desktop)
        this.setupScrollTrigger();
        
        // Setup debug (only in dev)
        if (import.meta.env.DEV) {
          this.debug = new Debug(this.particles);
        }
      }
      
      this.dispatchEvent('loading', { progress: 90 });
      
      // Start animation loop
      this.isReady = true;
      this.tick();
      
      this.dispatchEvent('ready');
      this.dispatchEvent('loading', { progress: 100 });
      
    } catch (error) {
      console.error('Failed to initialize World:', error);
      this.dispatchEvent('error', { error });
    }
  }
  
  setupScrollTrigger() {
    // Create a scroll trigger that controls the morph progress
    gsap.to(this, {
      targetScrollProgress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          this.targetScrollProgress = self.progress;
        }
      }
    });
    
    // Handle touch events for mobile
    if ('ontouchstart' in window) {
      let touchStartY = 0;
      
      window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      });
      
      window.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const delta = touchStartY - touchY;
        
        // Simulate scroll velocity
        this.scrollVelocity = delta * 0.01;
        touchStartY = touchY;
      });
      
      window.addEventListener('touchend', () => {
        this.scrollVelocity *= 0.9;
      });
    }
  }
  
  tick() {
    if (!this.isReady) return;
    
    const elapsedTime = this.clock.getElapsedTime();
    
    // Solo su desktop: gestione scroll e animazioni particelle
    if (this.particles) {
      // Smooth scroll progress with LERP (damping effect)
      this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.03;
      
      // Calculate scroll velocity
      this.scrollVelocity = (this.scrollProgress - this.lastScrollProgress) * 60;
      this.lastScrollProgress = this.scrollProgress;
      
      // Cross-fade particles to PNG logo ONLY after animation is complete
      const fadeStart = 0.98;
      const fadeEnd = 1.0;
      
      const rawProgress = Math.min(1.0, this.scrollProgress);
      let fadeProgress = 0.0;
      
      if (rawProgress >= fadeStart) {
        const linear = Math.min(
          (rawProgress - fadeStart) / (fadeEnd - fadeStart),
          1.0
        );
        fadeProgress = linear * linear * linear * (linear * (6.0 * linear - 15.0) + 10.0);
      }

      // Update particles
      this.logoOpacity += (fadeProgress - this.logoOpacity) * 0.1;
      this.particles.update(elapsedTime, this.scrollProgress);
      this.particles.setGlobalOpacity(1.0 - this.logoOpacity);
      this.particles.updateMouse(this.mouseWorld, this.hasMouse);

      // Update SVG logo opacity (desktop)
      if (this.logoPNG) {
        this.logoPNG.style.opacity = String(this.logoOpacity);
      }
    }
    // Su mobile/tablet: logo sempre visibile (già impostato opacity=1)

    // Update starfield (sempre attivo)
    if (this.starfield) {
      this.starfield.update(elapsedTime);
    }
    
    // Update post-processing (solo desktop)
    if (this.postProcessing) {
      this.postProcessing.update(this.scrollVelocity, elapsedTime);
      this.postProcessing.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    
    // Continue loop
    window.requestAnimationFrame(() => this.tick());
  }
  
  dispatchEvent(eventName, data = {}) {
    window.dispatchEvent(new CustomEvent(`world:${eventName}`, { detail: data }));
  }
  
  dispose() {
    if (this.particles) this.particles.dispose();
    if (this.starfield) this.starfield.dispose();
    if (this.postProcessing) this.postProcessing.dispose();
    if (this.renderer) this.renderer.dispose();
    if (this.debug) this.debug.destroy();
    
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    World.instance = null;
  }
}
