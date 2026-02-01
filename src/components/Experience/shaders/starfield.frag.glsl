uniform float uTime;

varying float vAlpha;
varying float vTwinkle;

void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Soft circular points
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);

    // Twinkle effect
    float twinkle = sin(uTime * vTwinkle) * 0.3 + 0.7;

    // Soft white star with slight blue tint
    vec3 color = vec3(0.82, 0.88, 1.0);

    alpha *= vAlpha * twinkle;

    if (alpha < 0.02) discard;

    gl_FragColor = vec4(color, alpha * 0.6);
}
