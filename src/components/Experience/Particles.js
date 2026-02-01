import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import vertexShader from './shaders/particle.vert.glsl?raw';
import fragmentShader from './shaders/particle.frag.glsl?raw';

export default class Particles {
  constructor(isMobile) {
    this.isMobile = isMobile;
    this.loader = new GLTFLoader();
    this.particles = null;
    this.geometry = null;
    this.material = null;
    this.logoBounds = null;
    
    // Sampling: ridotto drasticamente su mobile per performance
    this.samplingStep = isMobile ? 6 : 1;
    
    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: isMobile ? 0.8 : 0.5 }, // Particelle più grandi su mobile
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uScatter: { value: 1.2 },
      uGlobalAlpha: { value: 1.0 },
      uIsMobile: { value: isMobile },
      uMouseWorld: { value: new THREE.Vector3() },
      uMouseStrength: { value: 0.07 },
      uMouseRadius: { value: 2.8 },
      uHasMouse: { value: 0.0 }
    };
  }
  
  async load() {
    try {
      // Carica solo il logo AT (non serve più la clessidra)
      const logoGLTF = await this.loader.loadAsync('/models/LogoAT.glb');
      
      // Extract geometry
      const logoGeometry = this.extractGeometry(logoGLTF, 'largestXY');
      
      // Create particle system
      this.createParticleSystem(logoGeometry);
      
      return this.particles;
    } catch (error) {
      console.error('Error loading models:', error);
      throw error;
    }
  }
  
  extractGeometry(gltf, mode = 'largest') {
    let bestMesh = null;
    let bestScore = -Infinity;

    gltf.scene.traverse((child) => {
      if (!child.isMesh || !child.geometry) return;

      child.geometry.computeBoundingBox();
      const box = child.geometry.boundingBox;
      const size = new THREE.Vector3();
      box.getSize(size);

      let score = 0;
      if (mode === 'largestXY') {
        const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
        score = dims[0] * dims[1];
      } else {
        score = size.x * size.y * size.z;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMesh = child;
      }
    });

    if (!bestMesh) {
      throw new Error('No geometry found in model');
    }

    return bestMesh.geometry.clone();
  }
  
  createParticleSystem(targetGeometry) {
    // Non serve più sourceGeometry - generiamo posizioni random sparse
    const targetPositions = targetGeometry.attributes.position.array;

    // Prepare target transform: center, orient by thinnest axis, flatten depth
    targetGeometry.computeBoundingBox();
    const targetCenter = new THREE.Vector3();
    targetGeometry.boundingBox.getCenter(targetCenter);
    const targetSize = new THREE.Vector3();
    targetGeometry.boundingBox.getSize(targetSize);

    const axes = [
      { axis: 'x', size: targetSize.x },
      { axis: 'y', size: targetSize.y },
      { axis: 'z', size: targetSize.z }
    ].sort((a, b) => a.size - b.size);
    const thinAxis = axes[0].axis;

    const targetRotation = new THREE.Matrix4();
    if (thinAxis === 'x') {
      targetRotation.makeRotationY(Math.PI / 2);
    } else if (thinAxis === 'y') {
      targetRotation.makeRotationX(Math.PI / 2);
    } else {
      targetRotation.identity();
    }

    const targetScale = new THREE.Vector3(0.72, 0.72, 0.12);
    const tempVec = new THREE.Vector3();
    
    // Determina il numero di particelle basato sul logo (non più sulla clessidra)
    const particleCount = Math.floor(targetPositions.length / (3 * this.samplingStep));
    
    // Create buffers
    const positions = new Float32Array(particleCount * 3);
    const targets = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount * 3);
    
    // Fill buffers
    const minTarget = new THREE.Vector3(Infinity, Infinity, Infinity);
    const maxTarget = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < particleCount; i++) {
      // Source positions: polvere sparsa in distribuzione sferica random
      // (la posizione iniziale effettiva viene calcolata nello shader con aOffset)
      // Qui mettiamo posizioni dummy perché lo shader usa aOffset per generare startPos
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Target positions (logo) - loop if logo has fewer vertices
      const targetIndex = (i * this.samplingStep * 3) % targetPositions.length;
      tempVec.set(
        targetPositions[targetIndex],
        targetPositions[targetIndex + 1],
        targetPositions[targetIndex + 2]
      );
      tempVec.sub(targetCenter);
      tempVec.applyMatrix4(targetRotation);
      tempVec.multiply(targetScale);
      targets[i * 3] = tempVec.x;
      targets[i * 3 + 1] = tempVec.y;
      targets[i * 3 + 2] = tempVec.z;

      // Track logo bounds in world units
      minTarget.min(tempVec);
      maxTarget.max(tempVec);
      
      // Random size and seed
      sizes[i] = Math.random() * 0.7 + 0.3;
      seeds[i] = Math.random();

      // Random scatter offset (small sphere)
      const ox = (Math.random() * 2 - 1) * 1.5;
      const oy = (Math.random() * 2 - 1) * 1.5;
      const oz = (Math.random() * 2 - 1) * 1.5;
      offsets[i * 3] = ox;
      offsets[i * 3 + 1] = oy;
      offsets[i * 3 + 2] = oz;
    }
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targets, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    this.geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
    
    // Shader material for stardust
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    
    // Create points
    this.particles = new THREE.Points(this.geometry, this.material);

    // Store logo bounds for PNG/SVG overlay alignment
    this.logoBounds = {
      width: maxTarget.x - minTarget.x,
      height: maxTarget.y - minTarget.y,
      depth: maxTarget.z - minTarget.z
    };
    
    // Center the model
    this.geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    this.geometry.boundingBox.getCenter(center);
    this.particles.position.sub(center);
  }
  
  update(time, progress) {
    if (this.material) {
      this.uniforms.uTime.value = time;
      this.uniforms.uProgress.value = progress;
    }
  }

  setGlobalOpacity(opacity) {
    if (this.material) {
      this.uniforms.uGlobalAlpha.value = opacity;
    }
  }

  updateMouse(mouseWorld, hasMouse) {
    if (this.material) {
      this.uniforms.uMouseWorld.value.copy(mouseWorld);
      this.uniforms.uHasMouse.value = hasMouse ? 1.0 : 0.0;
    }
  }
  
  updateSize(pixelRatio, isMobile) {
    if (this.material) {
      this.uniforms.uPixelRatio.value = pixelRatio;
      this.uniforms.uIsMobile.value = isMobile;
    }
  }
  
  setDebugParams(params) {
    if (this.material) {
      if (params.progress !== undefined) this.uniforms.uProgress.value = params.progress;
      if (params.size !== undefined) this.uniforms.uSize.value = params.size;
      if (params.scatter !== undefined) this.uniforms.uScatter.value = params.scatter;
    }
  }
  
  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
