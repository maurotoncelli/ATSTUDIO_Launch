uniform float uTime;
uniform float uPixelRatio;

attribute float aSize;
attribute float aTwinkle;
attribute float aAlpha;

varying float vAlpha;
varying float vTwinkle;

void main() {
    vec3 pos = position;

    // Slow drift for depth
    pos.x += sin(uTime * 0.08 + position.y * 0.2) * 0.08;
    pos.y += cos(uTime * 0.06 + position.x * 0.2) * 0.06;
    pos.z += sin(uTime * 0.04 + position.z * 0.15) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Small point size with distance attenuation
    gl_PointSize = aSize * uPixelRatio;
    gl_PointSize *= (70.0 / -mvPosition.z);

    vAlpha = aAlpha;
    vTwinkle = aTwinkle;
}
