"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

interface LiquidEtherWebGL {
  output?: { simulation?: { options: SimOptions; resize: () => void } };
  autoDriver?: {
    enabled: boolean;
    speed: number;
    resumeDelay: number;
    rampDurationMs: number;
    mouse?: { autoIntensity: number; takeoverDuration: number };
    forceStop: () => void;
  };
  resize: () => void;
  start: () => void;
  pause: () => void;
  dispose: () => void;
}

const defaultColors = ['#9400D3', '#6A0094', '#13001A'];

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<LiquidEtherWebGL | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops: string[]): THREE.DataTexture {
      let arr: string[];
      if (Array.isArray(stops) && stops.length > 0) {
        arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      } else {
        arr = ['#ffffff', '#ffffff'];
      }
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    class CommonClass {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      isMobile = false;
      breakpoint = 768;
      fboWidth: number | null = null;
      fboHeight: number | null = null;
      time = 0;
      delta = 0;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;
      init(container: HTMLElement) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        const el = this.renderer.domElement;
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.display = 'block';
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        if (!this.clock) return;
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }
    const Common = new CommonClass();

    class MouseClass {
      mouseMoved = false;
      coords = new THREE.Vector2();
      coords_old = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: number | null = null;
      container: HTMLElement | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2.0;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;
      private _onMouseMove = this.onDocumentMouseMove.bind(this);
      private _onTouchStart = this.onDocumentTouchStart.bind(this);
      private _onTouchMove = this.onDocumentTouchMove.bind(this);
      private _onMouseEnter = this.onMouseEnter.bind(this);
      private _onMouseLeave = this.onMouseLeave.bind(this);
      private _onTouchEnd = this.onTouchEnd.bind(this);
      init(container: HTMLElement) {
        this.container = container;
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('touchstart', this._onTouchStart, { passive: true });
        document.addEventListener('touchmove', this._onTouchMove, { passive: true });
        container.addEventListener('mouseenter', this._onMouseEnter);
        container.addEventListener('mouseleave', this._onMouseLeave);
        document.addEventListener('touchend', this._onTouchEnd);
      }
      dispose() {
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('touchstart', this._onTouchStart);
        document.removeEventListener('touchmove', this._onTouchMove);
        if (this.container) {
          this.container.removeEventListener('mouseenter', this._onMouseEnter);
          this.container.removeEventListener('mouseleave', this._onMouseLeave);
        }
        document.removeEventListener('touchend', this._onTouchEnd);
      }
      setCoords(x: number, y: number) {
        if (!Common.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const rect = Common.container.getBoundingClientRect();
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx, 1-ny);
        this.mouseMoved = true;
        this.timer = window.setTimeout(() => {
          this.mouseMoved = false;
        }, 100);
      }
      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }
      onDocumentMouseMove(event: MouseEvent) {
        if (this.onInteract) this.onInteract();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!Common.container) return;
          const rect = Common.container.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width;
          const ny = 1 - (event.clientY - rect.top) / rect.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx, ny);
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(event.clientX, event.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (this.onInteract) this.onInteract();
          this.setCoords(t.pageX, t.pageY);
          this.hasUserControl = true;
        }
      }
      onDocumentTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
          const t = event.touches[0];
          if (this.onInteract) this.onInteract();
          this.setCoords(t.pageX, t.pageY);
        }
      }
      onTouchEnd() {
        this.isHoverInside = false;
      }
      onMouseEnter() {
        this.isHoverInside = true;
      }
      onMouseLeave() {
        this.isHoverInside = false;
      }
      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse = new MouseClass();

    class AutoDriver {
      mouse: MouseClass;
      manager: WebGLManager;
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;
      active = false;
      current = new THREE.Vector2(0, 0);
      target = new THREE.Vector2();
      lastTime = performance.now();
      activationTime = 0;
      margin = 0.2;
      private _tmpDir = new THREE.Vector2();
      constructor(
        mouse: MouseClass,
        manager: WebGLManager,
        opts: { enabled: boolean; speed: number; resumeDelay: number; rampDuration: number }
      ) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }
      pickNewTarget() {
        const r = Math.random;
        this.target.set(r() * (1 - this.margin * 2) + this.margin, r() * (1 - this.margin * 2) + this.margin);
      }
      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }
      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;
        if (idle < this.resumeDelay) {
          if (this.active) this.forceStop();
          return;
        }
        if (this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        if (!this.active) return;
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this._tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const step = this.speed * dtSec * ramp;
        const move = Math.min(step, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    const quad_vert = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const advection_frag = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_velocity;
    uniform sampler2D u_source;
    uniform vec2 u_texelSize;
    uniform float u_dt;
    uniform float u_dissipation;

    void main() {
      vec2 coord = vUv - u_dt * texture2D(u_velocity, vUv).xy * u_texelSize;
      gl_FragColor = u_dissipation * texture2D(u_source, coord);
      gl_FragColor.a = 1.0;
    }
    `;
    
    const splat_frag = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_target;
    uniform float u_aspectRatio;
    uniform vec3 u_color;
    uniform vec2 u_point;
    uniform float u_radius;

    void main() {
      vec2 p = vUv - u_point.xy;
      p.x *= u_aspectRatio;
      vec3 splat = exp(-dot(p, p) / u_radius) * u_color;
      vec3 base = texture2D(u_target, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
    }
    `;

    const divergence_frag = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 v_uvR;
    varying vec2 v_uvL;
    varying vec2 v_uvT;
    varying vec2 v_uvB;
    uniform sampler2D u_velocity;

    void main() {
      float L = texture2D(u_velocity, v_uvL).x;
      float R = texture2D(u_velocity, v_uvR).x;
      float B = texture2D(u_velocity, v_uvB).y;
      float T = texture2D(u_velocity, v_uvT).y;
      vec2 C = texture2D(u_velocity, vUv).xy;
      if (v_uvL.x < 0.0) { L = -C.x; }
      if (v_uvR.x > 1.0) { R = -C.x; }
      if (v_uvB.y < 0.0) { B = -C.y; }
      if (v_uvT.y > 1.0) { T = -C.y; }
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
    `;
    
    const pressure_frag = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 v_uvR;
    varying vec2 v_uvL;
    varying vec2 v_uvT;
    varying vec2 v_uvB;
    uniform sampler2D u_pressure;
    uniform sampler2D u_divergence;

    void main() {
      float L = texture2D(u_pressure, v_uvL).x;
      float R = texture2D(u_pressure, v_uvR).x;
      float B = texture2D(u_pressure, v_uvB).x;
      float T = texture2D(u_pressure, v_uvT).x;
      float C = texture2D(u_pressure, vUv).x;
      float divergence = texture2D(u_divergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
    `;

    const gradient_subtract_frag = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 v_uvR;
    varying vec2 v_uvL;
    varying vec2 v_uvT;
    varying vec2 v_uvB;
    uniform sampler2D u_pressure;
    uniform sampler2D u_velocity;

    void main() {
      float L = texture2D(u_pressure, v_uvL).x;
      float R = texture2D(u_pressure, v_uvR).x;
      float B = texture2D(u_pressure, v_uvB).x;
      float T = texture2D(u_pressure, v_uvT).x;
      vec2 velocity = texture2D(u_velocity, vUv).xy;
      velocity.xy -= 0.5 * vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
    `;

    const final_frag = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_dye;
    uniform sampler2D u_palette;

    void main() {
      vec4 dye = texture2D(u_dye, vUv);
      float l = length(dye.rgb);
      vec3 color = texture2D(u_palette, vec2(l, 0.5)).rgb;
      gl_FragColor = vec4(color, l * 0.5);
    }
    `;

    const varying_uv_vert = `
      varying vec2 vUv;
      varying vec2 v_uvR;
      varying vec2 v_uvL;
      varying vec2 v_uvT;
      varying vec2 v_uvB;
      uniform vec2 u_texelSize;

      void main () {
        vUv = uv;
        v_uvR = vUv + vec2(u_texelSize.x, 0.0);
        v_uvL = vUv - vec2(u_texelSize.x, 0.0);
        v_uvT = vUv + vec2(0.0, u_texelSize.y);
        v_uvB = vUv - vec2(0.0, u_texelSize.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    class Simulation {
      options: SimOptions;
      fbos: Record<string, THREE.WebGLRenderTarget> = {};
      scene: THREE.Scene;
      camera: THREE.Camera;
      mesh: THREE.Mesh;
      splatMaterial: THREE.RawShaderMaterial;
      advectionMaterial: THREE.RawShaderMaterial;
      divergenceMaterial: THREE.RawShaderMaterial;
      pressureMaterial: THREE.RawShaderMaterial;
      gradientSubtractMaterial: THREE.RawShaderMaterial;
      fboSize: THREE.Vector2;
      texelSize: THREE.Vector2;

      constructor(options?: Partial<SimOptions>) {
        this.options = {
          iterations_poisson: 32,
          iterations_viscous: 32,
          mouse_force: 20,
          resolution: 0.5,
          cursor_size: 100,
          viscous: 30,
          isBounce: false,
          dt: 0.016,
          isViscous: false,
          BFECC: true,
          ...options
        };
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
        this.scene.add(this.mesh);
        
        this.fboSize = new THREE.Vector2();
        this.texelSize = new THREE.Vector2();
        this.calcSize();
        
        const type = this.getFloatType();
        this.fbos.dye = this.createFBO(type);
        this.fbos.newDye = this.createFBO(type);
        this.fbos.velocity = this.createFBO(type);
        this.fbos.newVelocity = this.createFBO(type);
        this.fbos.divergence = this.createFBO(type);
        this.fbos.pressure = this.createFBO(type);
        this.fbos.newPressure = this.createFBO(type);
        
        this.splatMaterial = this.createSplatMaterial();
        this.advectionMaterial = this.createAdvectionMaterial();
        this.divergenceMaterial = this.createDivergenceMaterial();
        this.pressureMaterial = this.createPressureMaterial();
        this.gradientSubtractMaterial = this.createGradientSubtractMaterial();
      }

      getFloatType() {
        return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
      }

      createFBO(type: THREE.TextureDataType) {
        const fbo = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, {
          type,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping,
          depthBuffer: false,
          stencilBuffer: false,
        });
        return fbo;
      }
      
      createSplatMaterial() {
        return new THREE.RawShaderMaterial({
          vertexShader: quad_vert,
          fragmentShader: splat_frag,
          uniforms: {
            u_target: { value: null },
            u_aspectRatio: { value: Common.aspect },
            u_color: { value: new THREE.Vector3() },
            u_point: { value: new THREE.Vector2() },
            u_radius: { value: 0.0 }
          }
        });
      }

      createAdvectionMaterial() {
        return new THREE.RawShaderMaterial({
          vertexShader: quad_vert,
          fragmentShader: advection_frag,
          uniforms: {
            u_velocity: { value: null },
            u_source: { value: null },
            u_texelSize: { value: this.texelSize },
            u_dt: { value: this.options.dt },
            u_dissipation: { value: 1.0 }
          }
        });
      }

      createDivergenceMaterial() {
        return new THREE.RawShaderMaterial({
          vertexShader: varying_uv_vert,
          fragmentShader: divergence_frag,
          uniforms: {
            u_velocity: { value: null },
            u_texelSize: { value: this.texelSize }
          }
        });
      }

      createPressureMaterial() {
        return new THREE.RawShaderMaterial({
          vertexShader: varying_uv_vert,
          fragmentShader: pressure_frag,
          uniforms: {
            u_pressure: { value: null },
            u_divergence: { value: null },
            u_texelSize: { value: this.texelSize }
          }
        });
      }

      createGradientSubtractMaterial() {
        return new THREE.RawShaderMaterial({
          vertexShader: varying_uv_vert,
          fragmentShader: gradient_subtract_frag,
          uniforms: {
            u_pressure: { value: null },
            u_velocity: { value: null },
            u_texelSize: { value: this.texelSize }
          }
        });
      }

      render(material: THREE.Material, to: THREE.WebGLRenderTarget) {
        this.mesh.material = material;
        Common.renderer!.setRenderTarget(to);
        Common.renderer!.render(this.scene, this.camera);
        Common.renderer!.setRenderTarget(null);
      }

      splat(point: THREE.Vector2, color: THREE.Vector3, radius: number) {
        this.splatMaterial.uniforms.u_target.value = this.fbos.velocity.texture;
        this.splatMaterial.uniforms.u_point.value = point;
        this.splatMaterial.uniforms.u_color.value = color;
        this.splatMaterial.uniforms.u_radius.value = radius;
        this.render(this.splatMaterial, this.fbos.newVelocity);
        this.swap('velocity');
      
        this.splatMaterial.uniforms.u_target.value = this.fbos.dye.texture;
        this.render(this.splatMaterial, this.fbos.newDye);
        this.swap('dye');
      }

      swap(name: string) {
        const temp = this.fbos[name];
        this.fbos[name] = this.fbos['new' + name.charAt(0).toUpperCase() + name.slice(1)];
        this.fbos['new' + name.charAt(0).toUpperCase() + name.slice(1)] = temp;
      }
      
      calcSize() {
        const width = Math.max(1, Math.round(this.options.resolution * Common.width));
        const height = Math.max(1, Math.round(this.options.resolution * Common.height));
        this.fboSize.set(width, height);
        this.texelSize.set(1 / width, 1 / height);
      }

      resize() {
        this.calcSize();
        for (const key in this.fbos) {
          this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
        }
      }

      update() {
        this.advectionMaterial.uniforms.u_velocity.value = this.fbos.velocity.texture;
        this.advectionMaterial.uniforms.u_source.value = this.fbos.velocity.texture;
        this.advectionMaterial.uniforms.u_dissipation.value = 0.998;
        this.render(this.advectionMaterial, this.fbos.newVelocity);
        this.swap('velocity');

        this.advectionMaterial.uniforms.u_source.value = this.fbos.dye.texture;
        this.advectionMaterial.uniforms.u_dissipation.value = 0.99;
        this.render(this.advectionMaterial, this.fbos.newDye);
        this.swap('dye');

        if(Mouse.diff.length() > 0.001) {
            this.splat(Mouse.coords, new THREE.Vector3(Mouse.diff.x, Mouse.diff.y, 0).multiplyScalar(this.options.mouse_force), this.options.cursor_size / Common.width);
        }

        this.divergenceMaterial.uniforms.u_velocity.value = this.fbos.velocity.texture;
        this.render(this.divergenceMaterial, this.fbos.divergence);

        this.pressureMaterial.uniforms.u_divergence.value = this.fbos.divergence.texture;
        for (let i = 0; i < this.options.iterations_poisson; i++) {
          this.pressureMaterial.uniforms.u_pressure.value = this.fbos.pressure.texture;
          this.render(this.pressureMaterial, this.fbos.newPressure);
          this.swap('pressure');
        }

        this.gradientSubtractMaterial.uniforms.u_pressure.value = this.fbos.pressure.texture;
        this.gradientSubtractMaterial.uniforms.u_velocity.value = this.fbos.velocity.texture;
        this.render(this.gradientSubtractMaterial, this.fbos.newVelocity);
        this.swap('velocity');
      }
    }

    class Output {
      simulation: Simulation;
      scene: THREE.Scene;
      camera: THREE.Camera;
      output: THREE.Mesh;
      constructor() {
        this.simulation = new Simulation();
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: quad_vert,
            fragmentShader: final_frag,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
              u_dye: { value: this.simulation.fbos.dye.texture },
              u_palette: { value: paletteTex },
            }
          })
        );
        this.scene.add(this.output);
      }
      resize() {
        this.simulation.resize();
      }
      render() {
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
      update() {
        this.simulation.update();
        this.render();
      }
    }

    class WebGLManager implements LiquidEtherWebGL {
      props: any;
      output!: Output;
      autoDriver?: AutoDriver;
      lastUserInteraction = performance.now();
      running = false;
      private _loop = this.loop.bind(this);
      private _resize = this.resize.bind(this);
      private _onVisibility?: () => void;
      constructor(props: any) {
        this.props = props;
        Common.init(props.$wrapper);
        Mouse.init(props.$wrapper);
        Mouse.autoIntensity = props.autoIntensity;
        Mouse.takeoverDuration = props.takeoverDuration;
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          if (this.autoDriver) this.autoDriver.forceStop();
        };
        this.autoDriver = new AutoDriver(Mouse, this as any, {
          enabled: props.autoDemo,
          speed: props.autoSpeed,
          resumeDelay: props.autoResumeDelay,
          rampDuration: props.autoRampDuration
        });
        this.init();
        window.addEventListener('resize', this._resize);
        this._onVisibility = () => {
          const hidden = document.hidden;
          if (hidden) {
            this.pause();
          } else if (isVisibleRef.current) {
            this.start();
          }
        };
        document.addEventListener('visibilitychange', this._onVisibility);
      }
      init() {
        if (!Common.renderer) return;
        this.props.$wrapper.prepend(Common.renderer.domElement);
        this.output = new Output();
      }
      resize() {
        Common.resize();
        this.output.resize();
      }
      render() {
        if (this.autoDriver) this.autoDriver.update();
        Mouse.update();
        Common.update();
        this.output.update();
      }
      loop() {
        if (!this.running) return;
        this.render();
        rafRef.current = requestAnimationFrame(this._loop);
      }
      start() {
        if (this.running) return;
        this.running = true;
        this._loop();
      }
      pause() {
        this.running = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }
      dispose() {
        try {
          window.removeEventListener('resize', this._resize);
          if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
          Mouse.dispose();
          if (Common.renderer) {
            const canvas = Common.renderer.domElement;
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            Common.renderer.dispose();
          }
        } catch {
        }
      }
    }

    const container = mountRef.current;
    container.style.position = container.style.position || 'relative';
    container.style.overflow = container.style.overflow || 'hidden';

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration
    });
    webglRef.current = webgl;

    const applyOptionsFromProps = () => {
      if (!webglRef.current) return;
      const sim = webglRef.current.output?.simulation;
      if (!sim) return;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: mouseForce,
        cursor_size: cursorSize,
        isViscous,
        viscous,
        iterations_viscous: iterationsViscous,
        iterations_poisson: iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });
      if (resolution !== prevRes) sim.resize();
    };
    applyOptionsFromProps();
    webgl.start();

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        isVisibleRef.current = isVisible;
        if (!webglRef.current) return;
        if (isVisible && !document.hidden) {
          webglRef.current.start();
        } else {
          webglRef.current.pause();
        }
      },
      { threshold: [0, 0.01, 0.1] }
    );
    io.observe(container);
    intersectionObserverRef.current = io;

    const ro = new ResizeObserver(() => {
      if (!webglRef.current) return;
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        if (!webglRef.current) return;
        webglRef.current.resize();
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch {
        }
      }
      if (intersectionObserverRef.current) {
        try {
          intersectionObserverRef.current.disconnect();
        } catch {
        }
      }
      if (webglRef.current) {
        webglRef.current.dispose();
      }
      webglRef.current = null;
    };
  }, [colors]);

  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;
    const sim = webgl.output?.simulation;
    if (!sim) return;
    const prevRes = sim.options.resolution;
    Object.assign(sim.options, {
      mouse_force: mouseForce,
      cursor_size: cursorSize,
      isViscous,
      viscous,
      iterations_viscous: iterationsViscous,
      iterations_poisson: iterationsPoisson,
      dt,
      BFECC,
      resolution,
      isBounce
    });
    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = autoDemo;
      webgl.autoDriver.speed = autoSpeed;
      webgl.autoDriver.resumeDelay = autoResumeDelay;
      webgl.autoDriver.rampDurationMs = autoRampDuration * 1000;
      if (webgl.autoDriver.mouse) {
        webgl.autoDriver.mouse.autoIntensity = autoIntensity;
        webgl.autoDriver.mouse.takeoverDuration = takeoverDuration;
      }
    }
    if (resolution !== prevRes) sim.resize();
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full absolute top-0 left-0 overflow-hidden pointer-events-none touch-none ${className || ''}`}
      style={style}
    />
  );
}
