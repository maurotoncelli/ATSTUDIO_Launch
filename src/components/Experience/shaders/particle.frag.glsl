varying vec3 vColor;
varying float vAlpha;
uniform float uGlobalAlpha;

void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Soft dust particles
    float alpha = smoothstep(0.5, 0.0, dist);
    float core = smoothstep(0.25, 0.0, dist);

    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.5);

    alpha *= vAlpha * uGlobalAlpha;

    if (alpha < 0.02) discard;

    gl_FragColor = vec4(finalColor, alpha);
}
