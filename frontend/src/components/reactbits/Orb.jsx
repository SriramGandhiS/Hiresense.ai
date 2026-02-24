import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Sphere, Color } from 'ogl';

// Helper to convert HSL to RGB since ogl Color might lack setHSL
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const hue2rgb = (t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        r = hue2rgb(h + 1 / 3);
        g = hue2rgb(h);
        b = hue2rgb(h - 1 / 3);
    }
    return [r, g, b];
}

const vertex = /* glsl */ `
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 normal;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        vPosition = position;
        
        // Add subtle distortion to the orb
        vec3 pos = position;
        pos.x += sin(pos.y * 2.0 + uTime) * 0.1;
        pos.y += cos(pos.x * 2.0 + uTime) * 0.1;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragment = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
        
        // Dynamic color pulse
        float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
        vec3 color = uColor * lighting * pulse;
        
        // Add atmospheric glow based on view angle
        float rim = 1.0 - max(0.0, dot(normal, vec3(0.0, 0.0, 1.0)));
        rim = pow(rim, 3.0);
        color += uColor * rim * 0.5;
        
        gl_FragColor = vec4(color, 0.4); // Semi-transparent for layering
    }
`;

const Orb = ({ hue = 40, saturation = 0.5, brightness = 0.8, className = "" }) => {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let renderer, gl, camera, scene, geometry, program, mesh, requestId;

        const resize = () => {
            if (!container || !renderer || !camera) return;
            const width = container.clientWidth || 1;
            const height = container.clientHeight || 1;
            renderer.setSize(width, height);
            camera.perspective({ aspect: width / height });
        };

        try {
            renderer = new Renderer({ alpha: true, antialias: true, dpr: window.devicePixelRatio || 1 });
            gl = renderer.gl;

            if (!gl) {
                console.error("OGL: Could not create WebGL context");
                return;
            }

            container.appendChild(gl.canvas);

            camera = new Camera(gl, { fov: 35 });
            camera.position.z = 5;

            scene = new Transform();

            geometry = new Sphere(gl, {
                radius: 1.5,
                widthSegments: 64,
                heightSegments: 64,
            });

            // Manual HSL to RGB conversion to stay compatible with simplified ogl versions
            const [r, g, b] = hslToRgb(hue / 360, saturation, brightness);
            const color = new Color(r, g, b);

            program = new Program(gl, {
                vertex,
                fragment,
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: color },
                },
                transparent: true,
                depthTest: false,
            });

            mesh = new Mesh(gl, { geometry, program });
            mesh.setParent(scene);

            window.addEventListener('resize', resize, false);
            resize();

            const update = (t) => {
                requestId = requestAnimationFrame(update);

                if (program && program.uniforms) {
                    program.uniforms.uTime.value = t * 0.001;
                }

                if (mesh) {
                    mesh.rotation.y += 0.005;
                    mesh.rotation.z += 0.003;
                }

                renderer.render({ scene, camera });
            };
            requestId = requestAnimationFrame(update);

        } catch (error) {
            console.error("Orb Component Error:", error);
        }

        return () => {
            window.removeEventListener('resize', resize);
            if (requestId) cancelAnimationFrame(requestId);
            if (container && gl && gl.canvas && container.contains(gl.canvas)) {
                container.removeChild(gl.canvas);
            }
            if (gl) {
                const extension = gl.getExtension('WEBGL_lose_context');
                if (extension) extension.loseContext();
            }
            gl = null;
            renderer = null;
        };
    }, [hue, saturation, brightness]);

    return <div ref={containerRef} className={`w-full h-full relative ${className}`} />;
};

export default Orb;
