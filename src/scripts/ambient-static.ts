const vertexSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentSource = `
    precision highp float;

    uniform vec2 resolution;
    uniform vec2 lightPosition;
    uniform float time;

    float randomValue(vec2 point) {
        vec3 p = fract(vec3(point.xyx) * vec3(0.1031, 0.1030, 0.0973));
        p += dot(p, p.yxz + 33.33);
        return fract((p.x + p.y) * p.z);
    }

    float noise(vec2 point) {
        vec2 cell = floor(point);
        vec2 offset = fract(point);
        vec2 blend = offset * offset * (3.0 - 2.0 * offset);
        float bottom = mix(randomValue(cell), randomValue(cell + vec2(1.0, 0.0)), blend.x);
        float top = mix(randomValue(cell + vec2(0.0, 1.0)), randomValue(cell + 1.0), blend.x);
        return mix(bottom, top, blend.y);
    }

    void main() {
        vec2 screen = gl_FragCoord.xy / resolution;
        screen.y = 1.0 - screen.y;
        vec2 distanceFromLight = (screen - lightPosition) / vec2(0.43, 0.46);
        float exposure = 1.0 - smoothstep(0.04, 0.54, length(distanceFromLight));
        if (exposure < 0.002) discard;

        // Warped bands give the grain a surface to move across.
        vec2 field = distanceFromLight * 6.5;
        field.x *= clamp(resolution.x / resolution.y, 0.7, 2.0);
        float drift = time * 0.12;
        vec2 warp = vec2(
            noise(field * 0.55 + vec2(drift, -drift * 0.5)),
            noise(field * 0.55 + vec2(-drift * 0.6, drift) + 13.0)
        );
        float weathering = noise(field * vec2(1.4, 4.5) + warp * 2.1);
        float seam = field.y * 4.0 + field.x * 2.2 + warp.x * 4.8 - time * 0.36;
        float bands = 0.5 + 0.5 * sin(seam);
        float ridges = smoothstep(0.48, 0.97, bands) * mix(0.42, 1.0, weathering);
        float etchedLines = 0.5 + 0.5 * sin(seam * 5.4 + weathering * 2.4);
        float abrasion = smoothstep(0.48, 0.86, weathering) * etchedLines;
        float surface = bands * 0.30 + ridges * 0.53 + abrasion * 0.17;

        vec2 pixel = floor(gl_FragCoord.xy);
        float grainTick = time * 11.0;
        float frame = floor(grainTick);
        float grain = mix(
            randomValue(pixel + frame * vec2(17.0, 29.0)),
            randomValue(pixel + (frame + 1.0) * vec2(17.0, 29.0)),
            smoothstep(0.0, 1.0, fract(grainTick))
        ) - 0.48;

        float amount = grain * mix(0.10, 0.46, surface) + (surface - 0.36) * 0.14;
        float oxidation = smoothstep(0.49, 0.76, noise(field * 0.72 + warp + 8.0));
        vec3 metal = mix(vec3(0.79, 0.86, 0.91), vec3(0.77, 0.46, 0.29), oxidation * 0.42);
        vec3 tint = amount > 0.0 ? metal : vec3(0.018, 0.022, 0.030);
        float crestBrightness = amount > 0.0 ? mix(1.0, 0.84, smoothstep(0.36, 0.77, surface)) : 1.0;
        gl_FragColor = vec4(tint, abs(amount) * exposure * crestBrightness);
    }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

    gl.deleteShader(shader);
    return null;
}

export function createAmbientStatic(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
    });
    if (!gl) return null;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
        if (program) gl.deleteProgram(program);
        return null;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
    }

    const triangle = gl.createBuffer();
    if (!triangle) {
        gl.deleteProgram(program);
        return null;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "resolution");
    const lightPosition = gl.getUniformLocation(program, "lightPosition");
    const time = gl.getUniformLocation(program, "time");

    return {
        resize(width: number, height: number) {
            const scale = Math.min(1, 1600 / width, 1050 / height);
            canvas.width = Math.max(1, Math.round(width * scale));
            canvas.height = Math.max(1, Math.round(height * scale));
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(resolution, canvas.width, canvas.height);
        },
        draw(seconds: number, lightX: number, lightY: number) {
            if (gl.isContextLost()) return;
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(time, seconds);
            gl.uniform2f(lightPosition, lightX, lightY);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        },
    };
}
