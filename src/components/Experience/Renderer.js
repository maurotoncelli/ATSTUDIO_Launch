import * as THREE from 'three';

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
    };
    
    this.isMobile = window.innerWidth < 768;
    this.isMobileOrTablet = window.innerWidth < 1024;
    
    // On mobile/tablet, limit pixel ratio aggressively for performance
    if (this.isMobileOrTablet) {
      this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 1.2);
    }
    
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isMobile, // Disable AA on mobile for performance
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.setClearColor(0x02040a, 1);
    
    // Enable tone mapping for better colors
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.2;
    
    // Optimize for particles
    this.instance.sortObjects = false;
  }
  
  resize(camera) {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.isMobile = window.innerWidth < 768;
    this.isMobileOrTablet = window.innerWidth < 1024;
    
    // Adjust pixel ratio on mobile/tablet - aggressivo per performance
    if (this.isMobileOrTablet) {
      this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 1.2);
    } else {
      this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
    
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    
    // Update camera aspect ratio
    if (camera) {
      camera.aspect = this.sizes.width / this.sizes.height;
      
      // Adjust camera position based on device
      if (this.isMobileOrTablet) {
        camera.position.z = 7;
      } else {
        camera.position.z = 6;
      }
      
      camera.updateProjectionMatrix();
    }
    
    return {
      width: this.sizes.width,
      height: this.sizes.height,
      pixelRatio: this.sizes.pixelRatio,
      isMobile: this.isMobile
    };
  }
  
  render(scene, camera) {
    this.instance.render(scene, camera);
  }
  
  dispose() {
    this.instance.dispose();
  }
}
