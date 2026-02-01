import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export default class PostProcessing {
  constructor(renderer, scene, camera, isMobile) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.isMobile = isMobile;
    
    this.composer = new EffectComposer(renderer.instance);
    
    // Render Pass
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);

    // Su mobile: NESSUN post-processing per massime performance
    if (!isMobile) {
      // Liquid refraction pass (very subtle) - SOLO DESKTOP
      this.liquidPass = new ShaderPass(this.liquidShader());
      this.composer.addPass(this.liquidPass);

      // Minimal Film Grain Pass - SOLO DESKTOP
      this.filmGrainPass = new ShaderPass(this.filmGrainShader());
      this.composer.addPass(this.filmGrainPass);
    }
    
    this.scrollVelocity = 0;
    this.time = 0;
    this.liquidTarget = 0.004;
  }
  
  filmGrainShader() {
    return {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0.0 },
        uIntensity: { value: 0.02 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          float noise = random(vUv + uTime) * 2.0 - 1.0;
          color.rgb += noise * uIntensity;
          
          gl_FragColor = color;
        }
      `
    };
  }

  liquidShader() {
    return {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0.0 },
        uIntensity: { value: 0.004 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;

        float wave(vec2 p) {
          return sin(p.x * 6.0 + uTime * 0.4) * cos(p.y * 5.0 + uTime * 0.3);
        }

        void main() {
          vec2 uv = vUv;
          float w = wave(uv);
          vec2 offset = vec2(w, -w) * uIntensity;
          vec4 color = texture2D(tDiffuse, uv + offset);
          gl_FragColor = color;
        }
      `
    };
  }
  
  update(scrollVelocity, time) {
    this.scrollVelocity = scrollVelocity;
    this.time = time;

    // Update effetti solo su desktop
    if (!this.isMobile) {
      // Update liquid refraction time + intensity lerp
      if (this.liquidPass) {
        this.liquidPass.uniforms.uTime.value = time;
        const current = this.liquidPass.uniforms.uIntensity.value;
        this.liquidPass.uniforms.uIntensity.value = current + (this.liquidTarget - current) * 0.12;
      }

      // Update film grain time
      if (this.filmGrainPass) {
        this.filmGrainPass.uniforms.uTime.value = time;
      }
    }
  }
  
  resize(width, height) {
    this.composer.setSize(width, height);
  }
  
  render() {
    this.composer.render();
  }
  
  dispose() {
    this.composer.dispose();
  }
}
