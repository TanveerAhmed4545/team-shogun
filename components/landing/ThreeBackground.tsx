"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── GLSL Shaders — GPU-side particle animation ───────────────────────────
const PARTICLE_VERTEX_SHADER = `
  precision highp float;
  attribute float aSpeed;
  attribute float aSize;
  uniform float uTime;

  void main() {
    vec3 pos = position;

    // GPU-side falling — no JS loop needed
    float range = 40.0;
    pos.y = mod(pos.y - uTime * aSpeed, range) - (range * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Perspective-correct point sizing: far = small, near = large
    gl_PointSize = aSize * (280.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 6.0);
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform float uTime;

  void main() {
    // Soft circular point
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = 0.7 * (1.0 - d * 2.0);
    gl_FragColor = vec4(0.063, 0.725, 0.506, alpha); // emerald-400
  }
`;

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const isMobile = window.innerWidth < 768;

    // ─── SCENE SETUP ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    // Softer atmospheric fog — not harsh black cutoff
    scene.fog = new THREE.FogExp2(0x000000, 0.012);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // disable antialiasing on mobile for perf
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const canvas = renderer.domElement;
    containerRef.current.appendChild(canvas);

    // ─── WEBGL CONTEXT LOSS RECOVERY ─────────────────────────────────────
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(rafId);
    };

    const handleContextRestored = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
      lastTime = performance.now();
      clock.getDelta();
      animate();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    // ─── HOLOGRAM MATERIALS ───────────────────────────────────────────────
    const hologramMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.0,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      toneMapped: true,
    });

    const hologramSolidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x052e16,
      emissive: 0x022c22,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.0, // start invisible for entrance animation
      polygonOffset: true, // GPU depth offset eliminates wireframe z-fighting
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    // ─── WARRIOR HIERARCHY ────────────────────────────────────────────────
    // warriorGroup: Position & continuous 360° rotation driven by GSAP ScrollTrigger
    // warriorInner: Mouse parallax tilt & organic hover (isolated transforms)
    const warriorGroup = new THREE.Group();
    scene.add(warriorGroup);

    const warriorInner = new THREE.Group();
    warriorGroup.add(warriorInner);

    // ─── GLTF LOADER ──────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let modelLoaded = false;

    loader.load(
      "/shadowflame_samurai.glb",
      (gltf) => {
        modelLoaded = true;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = isMobile ? 4.5 : 6.5;
        const scale = baseScale / maxDim;

        model.scale.set(scale, scale, scale);
        const baseOffsetY = -center.y * scale;
        model.position.x = -center.x * scale;
        model.position.y = baseOffsetY;
        model.position.z = -center.z * scale;
        model.userData.baseY = baseOffsetY;

        const meshes: THREE.Mesh[] = [];
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) meshes.push(child);
        });

        meshes.forEach((child) => {
          child.material = hologramSolidMaterial;
          if (child instanceof THREE.SkinnedMesh) {
            const skinnedWireframe = new THREE.SkinnedMesh(child.geometry, hologramMaterial);
            skinnedWireframe.skeleton = child.skeleton;
            skinnedWireframe.bindMatrix.copy(child.bindMatrix);
            child.add(skinnedWireframe);
          } else {
            const wireframeMesh = new THREE.Mesh(child.geometry, hologramMaterial);
            child.add(wireframeMesh);
          }
        });

        warriorInner.add(model);

        // Cinematic entrance — fade in + rise up from bottom to starting position + elastic scale
        gsap.to(hologramSolidMaterial, {
          opacity: 0.9,
          duration: 1.8,
          ease: "power3.out",
          delay: 0.2,
        });
        gsap.from(warriorGroup.scale, {
          x: 0.6,
          y: 0.6,
          z: 0.6,
          duration: 2.2,
          ease: "elastic.out(1, 0.55)",
          delay: 0.1,
        });
        gsap.from(warriorGroup.position, {
          y: (isMobile ? 0.0 : 0.8) - 3.0,
          duration: 2.0,
          ease: "power3.out",
          delay: 0.1,
          overwrite: "auto",
        });

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.log("Could not load /shadowflame_samurai.glb, using fallback.", error);

        const fallbackGroup = new THREE.Group();
        const coreGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
        const coreMesh = new THREE.Mesh(coreGeo, hologramSolidMaterial);
        const wireGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
        const wireMesh = new THREE.Mesh(wireGeo, hologramMaterial);
        wireMesh.scale.set(1.02, 1.02, 1.02);
        coreMesh.add(wireMesh);
        fallbackGroup.add(coreMesh);
        warriorInner.add(fallbackGroup);

        // Entrance for fallback too
        gsap.to(hologramSolidMaterial, { opacity: 0.9, duration: 1.5, ease: "power3.out" });
        gsap.to(fallbackGroup.rotation, {
          y: Math.PI * 2,
          x: Math.PI * 2,
          duration: 20,
          repeat: -1,
          ease: "none",
        });

        modelLoaded = true;
      }
    );

    // ─── IMPROVEMENT 9: GPU-side Particles with size variation ────────────
    const particleCount = isMobile ? 1000 : 2000;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      speeds[i] = Math.random() * 0.06 + 0.02;
      // IMPROVEMENT 9: varied sizes — creates depth illusion
      sizes[i] = Math.random() * 5.0 + 1.0;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    // IMPROVEMENT 1: Custom ShaderMaterial — GPU does all the work
    const particleUniforms = { uTime: { value: 0.0 } };
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    const particleSystem = new THREE.Points(pGeo, particlesMaterial);
    scene.add(particleSystem);

    // ─── IMPROVEMENT 7: Tri-tone Lighting ─────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    // Primary green rim (front-right)
    const rimLight = new THREE.DirectionalLight(0x10b981, 3.2);
    rimLight.position.set(5, 5, -5);
    scene.add(rimLight);

    // Cyan back-rim — adds edge depth and separation
    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 2.5);
    cyanRim.position.set(-5, 3, -8);
    scene.add(cyanRim);

    // Purple underglow — makes the base feel like it's hovering
    const underGlow = new THREE.PointLight(0x7c3aed, 2.0, 18);
    underGlow.position.set(0, -5, 2);
    scene.add(underGlow);

    // ─── IMPROVEMENT 2: Mouse Parallax ────────────────────────────────────
    let targetRotX = 0;
    let targetRotY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.18;
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.28;
    };
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // ─── IMPROVEMENT 8: 360° Continuous Scroll Rotation & Spatial Staging ─
    const baseY = isMobile ? 0.0 : 0.8;
    warriorGroup.position.set(0, baseY, 0);
    warriorGroup.rotation.set(0, 0, 0);
    const shiftX = isMobile ? 0 : 2.8;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    // 360-degree rotation continuously scrubbed with scroll depth:
    // Completes 3 full 360° revolutions across the page journey, perfectly facing front at every key milestone
    tl.to(
      warriorGroup.rotation,
      {
        y: Math.PI * 6,
        x: -0.08,
        ease: "none",
        duration: 3,
      },
      0
    );

    // Dynamic spatial staging flanking content as user scrolls
    tl.to(
      warriorGroup.position,
      {
        x: shiftX,
        y: baseY - 1.0,
        z: -2,
        duration: 1,
        ease: "power1.inOut",
      },
      0
    )
      .to(
        warriorGroup.position,
        {
          x: -shiftX,
          y: baseY - 0.4,
          z: 0,
          duration: 1,
          ease: "power1.inOut",
        },
        1
      )
      .to(
        warriorGroup.position,
        {
          x: 0,
          y: baseY - 1.5,
          z: isMobile ? 0 : 1.5,
          duration: 1,
          ease: "power1.inOut",
        },
        2
      );

    // ─── ANIMATION LOOP ───────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;
    let lastTime = 0;
    let nextGlitch = 2.0;

    const animate = (time: number = 0) => {
      rafId = requestAnimationFrame(animate);

      // Frame cap on high-frequency monitors
      if (time - lastTime < 8.3) return;
      lastTime = time;

      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05); // clamped delta avoids lag-warp
      const elapsed = clock.elapsedTime;

      // Update GPU particle time uniform (replaces entire JS particle loop!)
      particleUniforms.uTime.value = elapsed;

      // Update skeletal animation mixer or procedural floating
      if (mixer) {
        mixer.update(delta);
      } else if (modelLoaded && warriorInner.children[0]) {
        // Procedural organic float on inner group
        warriorInner.position.y = Math.sin(elapsed * 1.5) * 0.06;
        warriorInner.rotation.z = Math.sin(elapsed * 0.8) * 0.012;
      }

      // Smooth mouse parallax lerp on inner group (never interferes with GSAP scroll rotation on warriorGroup)
      if (!isMobile) {
        warriorInner.rotation.x += (targetRotX - warriorInner.rotation.x) * 0.05;
        warriorInner.rotation.y += (targetRotY * 0.35 - warriorInner.rotation.y) * 0.05;
      }

      // IMPROVEMENT 3: Hologram emissive pulse + random glitch spike
      const pulse = 1.0 + Math.sin(elapsed * 2.8) * 0.25;
      let glitch = 0;
      if (elapsed > nextGlitch) {
        glitch = Math.random() * 0.5;
        nextGlitch = elapsed + 2.5 + Math.random() * 3.5;
      }
      hologramMaterial.emissiveIntensity = pulse + glitch;

      // Subtle particle field rotation for depth
      particleSystem.rotation.y = Math.sin(elapsed * 0.08) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Pause rendering when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        clock.getDelta(); // consume stale delta so no jump
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ─── RESIZE HANDLING ─────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.0 : 1.5)
      );
    };
    window.addEventListener("resize", handleResize);

    // ─── CLEANUP ─────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isMobile) window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      cancelAnimationFrame(rafId);
      tl.scrollTrigger?.kill();
      tl.kill();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });

      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
      pGeo.dispose();
      particlesMaterial.dispose();
      hologramMaterial.dispose();
      hologramSolidMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-[100dvh]"
      style={{ background: "#000000" }}
    />
  );
}
