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
    // IMPROVEMENT 10: Reduced pixel ratio on mobile (was Math.min(dpr, 2))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.appendChild(renderer.domElement);

    // ─── HOLOGRAM MATERIALS ───────────────────────────────────────────────
    const hologramMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.5,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      toneMapped: false,
    });

    const hologramSolidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x052e16,
      emissive: 0x022c22,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.0, // IMPROVEMENT 4: start invisible for entrance animation
    });

    // ─── WARRIOR GROUP ────────────────────────────────────────────────────
    const warriorGroup = new THREE.Group();
    scene.add(warriorGroup);

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
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        const meshes: THREE.Mesh[] = [];
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) meshes.push(child);
        });

        meshes.forEach((child) => {
          child.material = hologramSolidMaterial;
          if (child instanceof THREE.SkinnedMesh) {
            const skinnedWireframe = new THREE.SkinnedMesh(child.geometry, hologramMaterial);
            skinnedWireframe.scale.set(1.01, 1.01, 1.01);
            skinnedWireframe.skeleton = child.skeleton;
            skinnedWireframe.bindMatrix.copy(child.bindMatrix);
            child.add(skinnedWireframe);
          } else {
            const wireframeMesh = new THREE.Mesh(child.geometry, hologramMaterial);
            wireframeMesh.scale.set(1.01, 1.01, 1.01);
            child.add(wireframeMesh);
          }
        });

        warriorGroup.add(model);

        // IMPROVEMENT 4: Cinematic entrance — fade in + elastic scale up
        gsap.to(hologramSolidMaterial, {
          opacity: 0.9,
          duration: 1.8,
          ease: "power3.out",
          delay: 0.2,
        });
        gsap.from(warriorGroup.scale, {
          x: 0.55,
          y: 0.55,
          z: 0.55,
          duration: 2.2,
          ease: "elastic.out(1, 0.55)",
          delay: 0.1,
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
        warriorGroup.add(fallbackGroup);

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
    });

    const particleSystem = new THREE.Points(pGeo, particlesMaterial);
    scene.add(particleSystem);

    // ─── IMPROVEMENT 7: Tri-tone Lighting ─────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    // Primary green rim (front-right)
    const rimLight = new THREE.DirectionalLight(0x10b981, 4);
    rimLight.position.set(5, 5, -5);
    scene.add(rimLight);

    // Cyan back-rim — adds edge depth and separation
    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3);
    cyanRim.position.set(-5, 3, -8);
    scene.add(cyanRim);

    // Purple underglow — makes the base feel like it's hovering
    const underGlow = new THREE.PointLight(0x7c3aed, 2.5, 18);
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

    // ─── IMPROVEMENT 8: Smoother Scroll Scrub (2.5 + eased tweens) ────────
    const baseY = isMobile ? -1.5 : -3.0;
    warriorGroup.position.set(0, baseY, 0);
    const shiftX = isMobile ? 0 : 3;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5, // was 1.5 — smoother lag
      },
    });

    tl.to(warriorGroup.position, { x: shiftX, y: -2, z: -2, duration: 1, ease: "power2.inOut" })
      .to(warriorGroup.rotation, { y: -Math.PI / 6, duration: 1, ease: "power2.inOut" }, "<")
      .to(warriorGroup.position, { x: -shiftX, y: -1, z: 0, duration: 1, ease: "power2.inOut" })
      .to(warriorGroup.rotation, { y: Math.PI / 4, duration: 1, ease: "power2.inOut" }, "<")
      .to(warriorGroup.position, { x: 0, y: -2, z: isMobile ? 0 : 2, duration: 1, ease: "power2.inOut" })
      .to(warriorGroup.rotation, { y: 0, x: -0.1, duration: 1, ease: "power2.inOut" }, "<");

    // ─── ANIMATION LOOP ───────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;
    // IMPROVEMENT 6: 60fps frame cap
    let lastTime = 0;
    // IMPROVEMENT 3: Hologram glitch state
    let nextGlitch = 2.0;

    const animate = (time: number = 0) => {
      rafId = requestAnimationFrame(animate);

      // IMPROVEMENT 6: Skip frame if too soon (60fps cap ~16.6ms)
      if (time - lastTime < 16.6) return;
      lastTime = time;

      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      // Update GPU particle time uniform (replaces entire JS particle loop!)
      particleUniforms.uTime.value = elapsed;

      // Update skeletal animation mixer
      if (mixer) {
        mixer.update(delta);
      } else if (modelLoaded && warriorGroup.children[0]) {
        // Procedural float on static models
        warriorGroup.children[0].position.y = Math.sin(elapsed * 2) * 0.1;
      }

      // IMPROVEMENT 2: Smooth mouse parallax lerp (added on top of scroll rotation)
      if (!isMobile) {
        warriorGroup.rotation.x += (targetRotX - warriorGroup.rotation.x) * 0.04;
        // We blend toward target, but don't override GSAP's Y — add as offset
        const parallaxY = targetRotY * 0.5;
        warriorGroup.rotation.y += (parallaxY - warriorGroup.rotation.y) * 0.04;
      }

      // IMPROVEMENT 3: Hologram emissive pulse + random glitch spike
      const pulse = 1.2 + Math.sin(elapsed * 2.8) * 0.35;
      let glitch = 0;
      if (elapsed > nextGlitch) {
        glitch = Math.random() * 0.8;
        nextGlitch = elapsed + 2.5 + Math.random() * 3.5;
      }
      hologramMaterial.emissiveIntensity = pulse + glitch;

      // Subtle particle field rotation for depth (very slow — no JS position loop)
      particleSystem.rotation.y = Math.sin(elapsed * 0.08) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // IMPROVEMENT 5: Pause rendering when tab is hidden
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
      cancelAnimationFrame(rafId);
      tl.kill();

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
