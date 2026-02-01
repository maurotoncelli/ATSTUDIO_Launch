uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;
uniform bool uIsMobile;
uniform vec3 uMouseWorld;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uHasMouse;

attribute vec3 targetPosition;
attribute float aSize;
attribute float aSeed;
attribute vec3 aOffset;

varying vec3 vColor;
varying float vAlpha;

float ease(float t) {
    return t * t * (3.0 - 2.0 * t);
}

void main() {
    float p = clamp(uProgress, 0.0, 1.0);

    vec3 logo = targetPosition;

    // Start: wide dust (spherical distribution)
    vec3 seedDir = normalize(aOffset + vec3(0.001, 0.002, 0.003));
    float radius = 5.0 + aSeed * 2.0;
    vec3 startPos = seedDir * radius;

    // Animazione semplificata: polvere sparsa → direttamente al logo
    float t = ease(p);
    vec3 pos = mix(startPos, logo, t);

    // Subtle ambient drift (ridotto su mobile per performance)
    if (!uIsMobile) {
        float driftFade = 1.0 - smoothstep(0.55, 0.90, p);
        vec3 driftDir = seedDir;
        float flow = sin(uTime * 0.25 + aSeed * 8.0) * 0.05;
        vec3 swirl = normalize(vec3(
            sin(uTime * 0.18 + pos.y),
            cos(uTime * 0.20 + pos.x),
            sin(uTime * 0.14 + pos.z)
        )) * 0.07;
        pos += (swirl + driftDir * flow) * driftFade;
    }

    // Soft force-field interaction (solo desktop - mobile non ha mouse hover)
    if (!uIsMobile && uHasMouse > 0.5) {
        vec3 toMouse = pos - uMouseWorld;
        float dist = length(toMouse);
        float influence = smoothstep(uMouseRadius, 0.0, dist) * uMouseStrength;
        pos += normalize(toMouse) * influence;
    }

    // Continuous shimmer (semplificato su mobile)
    float twinkleA = uIsMobile ? 1.0 : (sin(uTime * (1.1 + aSeed) + aSeed * 10.0) * 0.25 + 0.75);
    float twinkleB = uIsMobile ? 1.0 : (sin(uTime * 2.0 + aSeed * 12.0) * 0.15 + 0.85);
    float logoFade = 1.0 - smoothstep(0.7, 1.0, p) * 0.30;
    vAlpha = mix(0.55, 0.82, p) * twinkleA * twinkleB * logoFade;

    // Micro shimmer on the logo (solo desktop per performance)
    if (!uIsMobile) {
        float microFactor = smoothstep(0.8, 1.0, p);
        vec3 micro = vec3(
            sin(uTime * 0.7 + aSeed * 10.0),
            cos(uTime * 0.6 + aSeed * 7.0),
            sin(uTime * 0.5 + aSeed * 5.0)
        ) * 0.008;
        pos += micro * microFactor;
    }

    // Nessuno scaling/breathing - il logo mantiene le dimensioni costanti

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float baseSize = uIsMobile ? aSize * 0.7 : aSize;
    float sizeFade = 1.0 - smoothstep(0.7, 1.0, p) * 0.22;
    
    gl_PointSize = baseSize * uSize * uPixelRatio * sizeFade;
    gl_PointSize *= (90.0 / -mvPosition.z);

    float tint = aSeed * 0.4;
    vAlpha = mix(0.55, 0.82, p) * twinkleA * twinkleB * logoFade;
    vColor = mix(vec3(0.9, 0.92, 1.0), vec3(0.7, 0.82, 1.0), tint);
}
