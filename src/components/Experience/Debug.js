import { useControls, button } from 'leva';

export default class Debug {
  constructor(particles) {
    this.particles = particles;
    this.enabled = import.meta.env.DEV;
    
    if (this.enabled) {
      this.setupControls();
    }
  }
  
  setupControls() {
    // Use Leva to create debug controls
    if (typeof window !== 'undefined' && this.particles) {
      const controls = {
        progress: {
          value: 0,
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Morph Progress',
          onChange: (value) => {
            this.particles.setDebugParams({ progress: value });
          }
        },
        size: {
          value: 0.5,
          min: 0.1,
          max: 1.5,
          step: 0.05,
          label: 'Particle Size',
          onChange: (value) => {
            this.particles.setDebugParams({ size: value });
          }
        },
        scatter: {
          value: 1.2,
          min: 0.0,
          max: 3.0,
          step: 0.1,
          label: 'Scatter',
          onChange: (value) => {
            this.particles.setDebugParams({ scatter: value });
          }
        },
        reset: button(() => {
          this.particles.setDebugParams({ 
            progress: 0,
            size: 0.5,
            scatter: 1.2
          });
        })
      };
      
      console.log('🎮 Debug controls enabled. Open Leva panel (top-right) to adjust parameters.');
    }
  }
  
  destroy() {
    // Leva cleanup if needed
  }
}
