import * as THREE from 'three';
import vertexShader from './shaders/starfield.vert.glsl?raw';
import fragmentShader from './shaders/starfield.frag.glsl?raw';

export default class Starfield {
  constructor(isMobile) {
    this.isMobile = isMobile;
    this.count = isMobile ? 1500 : 6000; // Ridotto ulteriormente per performance mobile
    this.geometry = null;
    this.material = null;
    this.points = null;

    this.uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    };

    this.create();
  }

  create() {
    const positions = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);
    const twinkles = new Float32Array(this.count);
    const alphas = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      // Random points in a sphere shell
      const radius = Math.random() * 12 + 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.6 + 0.2;
      twinkles[i] = Math.random() * 1.5 + 0.5;
      alphas[i] = Math.random() * 0.6 + 0.2;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1));
    this.geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  update(time) {
    if (this.material) {
      this.uniforms.uTime.value = time;
    }
    if (this.points) {
      // Slow drift for background movement
      this.points.rotation.y += 0.0002;
      this.points.rotation.x += 0.0001;
    }
  }

  updateSize(pixelRatio) {
    if (this.material) {
      this.uniforms.uPixelRatio.value = pixelRatio;
    }
  }

  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
