"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function GlobeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const container = containerRef.current;

    async function initGlobe() {
      if (!container) return;
      const el = container;

      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );

      const isMobile = el.clientWidth < 768;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        isMobile ? 50 : 45,
        el.clientWidth / el.clientHeight,
        0.1,
        1000
      );
      const camDist = isMobile ? 3.8 : 3.0;
      camera.position.set(0, 0.6, camDist);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      el.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.6;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.9;
      controls.minDistance = isMobile ? 2.0 : 1.8;
      controls.maxDistance = isMobile ? 7.0 : 5.5;
      controls.enablePan = false;

      // Stars
      const starsGeo = new THREE.BufferGeometry();
      const starCount = 3000;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 200;
      }
      starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Points(starsGeo, starMat));

      // Earth
      const EARTH_RADIUS = 1.0;
      const earthGroup = new THREE.Group();
      scene.add(earthGroup);

      const textureLoader = new THREE.TextureLoader();
      const earthMap = textureLoader.load(
        "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
      );
      const earthMat = new THREE.MeshStandardMaterial({
        map: earthMap,
        roughness: 0.5,
        metalness: 0.1,
      });
      const earth = new THREE.Mesh(
        new THREE.SphereGeometry(EARTH_RADIUS, 64, 64),
        earthMat
      );
      earthGroup.add(earth);

      // Gulf-focused atmosphere (gold/blue tint)
      const glowVertex = `varying vec3 vNormal; varying vec3 vViewDir; void main() {
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }`;
      const glowFragment = `uniform vec3 glowColor; uniform float intensity;
        varying vec3 vNormal; varying vec3 vViewDir;
        void main() {
          float rim = 1.0 - max(0.0, dot(vNormal, vViewDir));
          rim = pow(rim, 3.0) * intensity;
          gl_FragColor = vec4(glowColor, rim * 0.6);
        }`;
      const atmosphereMat = new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        uniforms: {
          glowColor: { value: new THREE.Color(0xD4AF37) },
          intensity: { value: 1.0 },
        },
        side: THREE.FrontSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(EARTH_RADIUS * 1.015, 48, 48),
        atmosphereMat
      );
      earthGroup.add(atmosphere);

      // Lights
      scene.add(new THREE.AmbientLight(0x4488ff, 0.8));
      const sun = new THREE.DirectionalLight(0xbbddff, 2.5);
      sun.position.set(5, 3, 5);
      scene.add(sun);
      const back = new THREE.DirectionalLight(0x4488ff, 0.8);
      back.position.set(-3, -1, -4);
      scene.add(back);

      // Gulf-focused cities (primary Gulf + India + global hubs)
      const cities = [
        // Gulf Region (Primary focus)
        { name: "Riyadh", lat: 24.7136, lon: 46.6756 },
        { name: "Dubai", lat: 25.2048, lon: 55.2708 },
        { name: "Doha", lat: 25.2854, lon: 51.5310 },
        { name: "Kuwait City", lat: 29.3758, lon: 47.9432 },
        { name: "Manama", lat: 26.2285, lon: 50.5510 },
        { name: "Muscat", lat: 23.5880, lon: 58.3820 },
        { name: "Abu Dhabi", lat: 24.4532, lon: 54.3769 },
        { name: "Jeddah", lat: 21.4858, lon: 39.1925 },
        { name: "Dammam", lat: 26.4333, lon: 50.1000 },
        // India (Major Gulf workforce source)
        { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
        { name: "Delhi", lat: 28.6139, lon: 77.2090 },
        { name: "Chennai", lat: 13.0827, lon: 80.2707 },
        // Global Hubs
        { name: "London", lat: 51.5, lon: -0.1 },
        { name: "New York", lat: 40.7, lon: -74.0 },
        { name: "Singapore", lat: 1.35, lon: 103.8 },
      ];

      function latLonToVec3(lat: number, lon: number, radius: number) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lon + 180) * Math.PI) / 180;
        return new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }

      // Markers
      const markerGroup = new THREE.Group();
      earthGroup.add(markerGroup);

      const glowMat = new THREE.SpriteMaterial({
        map: (() => {
          const canvas = document.createElement("canvas");
          canvas.width = 64; canvas.height = 64;
          const ctx = canvas.getContext("2d")!;
          const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          g.addColorStop(0, "rgba(212, 175, 55, 1)");
          g.addColorStop(0.2, "rgba(212, 175, 55, 0.8)");
          g.addColorStop(1, "rgba(212, 175, 55, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 64, 64);
          return new THREE.CanvasTexture(canvas);
        })(),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });

      const cityPositions: Array<import("three").Vector3> = [];
      cities.forEach((city) => {
        const pos = latLonToVec3(city.lat, city.lon, EARTH_RADIUS * 1.002);
        cityPositions.push(pos);
        const pinGroup = new THREE.Group();
        pinGroup.position.copy(pos);
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.018, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xD4AF37 })
        );
        pinGroup.add(core);
        const glowSprite = new THREE.Sprite(glowMat);
        glowSprite.scale.set(0.2, 0.2, 1);
        pinGroup.add(glowSprite);
        markerGroup.add(pinGroup);
      });

      // 21 Gulf Route Pairs (connecting Gulf cities + India migration paths)
      const routePairs: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4], // Riyadh to major Gulf + Kuwait
        [1, 5], [1, 6], [1, 10], [1, 11], // Dubai connections
        [2, 1], [2, 6], [2, 12], // Doha connections
        [3, 4], [3, 7], // Kuwait connections
        [4, 5], [4, 8], // Manama connections
        [5, 6], [5, 12], // Muscat connections
        [6, 1], [6, 10], // Abu Dhabi connections
        [7, 0], [7, 10], // Jeddah connections
        [8, 0], [8, 3], // Dammam connections
        [10, 11], [11, 12], // India connections
      ];

      const routeData: {
        curve: import("three").QuadraticBezierCurve3;
        dashLine: import("three").Line;
        beacon: import("three").Sprite;
        progress: number;
        speed: number;
      }[] = [];

      routePairs.forEach(([iA, iB]) => {
        const start = cityPositions[iA];
        const end = cityPositions[iB];
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const distance = start.distanceTo(end);
        const height = EARTH_RADIUS + distance * 0.55 + 0.2;
        const control = mid.clone().normalize().multiplyScalar(height);
        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const points = curve.getPoints(60);

        const dashMat = new THREE.LineDashedMaterial({
          color: 0xD4AF37,
          dashSize: 0.035,
          gapSize: 0.025,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        });
        const dashGeo = new THREE.BufferGeometry().setFromPoints(points);
        const dashLine = new THREE.Line(dashGeo, dashMat);
        dashLine.computeLineDistances();
        earthGroup.add(dashLine);

        const beaconMat = new THREE.SpriteMaterial({
          map: (() => {
            const canvas = document.createElement("canvas");
            canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext("2d")!;
            const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            g.addColorStop(0, "rgba(212, 175, 55, 1)");
            g.addColorStop(0.1, "rgba(212, 175, 55, 0.9)");
            g.addColorStop(0.5, "rgba(246, 226, 122, 0.6)");
            g.addColorStop(1, "rgba(212, 175, 55, 0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 128, 128);
            return new THREE.CanvasTexture(canvas);
          })(),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        });
        const beacon = new THREE.Sprite(beaconMat);
        beacon.scale.set(0.1, 0.1, 1);
        earthGroup.add(beacon);

        routeData.push({
          curve, dashLine, beacon,
          progress: Math.random(),
          speed: 0.001 + Math.random() * 0.002,
        });
      });

      // Resize
      function resizeRenderer() {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
      window.addEventListener("resize", resizeRenderer);
      resizeRenderer();

      // Animate
      const clock = new THREE.Clock();
      let animFrameId: number;
      function animate() {
        const delta = clock.getDelta();
        const elapsed = performance.now() / 1000;
        routeData.forEach((r) => {
          r.progress += r.speed * delta * 30;
          if (r.progress > 1) r.progress -= 1;
          (r.dashLine.material as any).dashOffset = -elapsed * 0.06;
          const pos = r.curve.getPoint(r.progress);
          r.beacon.position.copy(pos);
          const pulse = 0.1 + Math.sin(elapsed * 4 + r.progress * 10) * 0.025;
          r.beacon.scale.set(pulse, pulse, 1);
        });
        controls.update();
        renderer.render(scene, camera);
        animFrameId = requestAnimationFrame(animate);
      }
      animate();

      // Pause auto-rotate on interaction
      let wheelTimer: ReturnType<typeof setTimeout>;
      renderer.domElement.addEventListener("pointerdown", () => { controls.autoRotate = false; });
      renderer.domElement.addEventListener("pointerup", () => {
        setTimeout(() => { controls.autoRotate = true; }, 3000);
      });
      renderer.domElement.addEventListener("wheel", () => {
        controls.autoRotate = false;
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => { controls.autoRotate = true; }, 3000);
      });

      // Cleanup
      cleanup = () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener("resize", resizeRenderer);
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material?.dispose();
            }
          }
          if (obj instanceof THREE.Line) {
            obj.geometry?.dispose();
            obj.material?.dispose();
          }
          if (obj instanceof THREE.Points) {
            obj.geometry?.dispose();
            obj.material?.dispose();
          }
        });
      };
    }

    initGlobe();
    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#07070E]">
      <div ref={containerRef} className="absolute inset-0 z-[1]" />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(7,7,14,0.7) 100%)" }}
      />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 md:px-6 pointer-events-none">
              <div className="pointer-events-auto flex flex-col items-center max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 md:px-5 md:py-2 md:mb-8 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(212,175,55,0.08)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#F6E27A",
              boxShadow: "0 0 40px rgba(212,175,55,0.05)",
            }}
          >
            <Award className="w-4 h-4" />
            <span>#1 AI Career Platform for the Gulf</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-[clamp(32px,9vw,80px)] md:text-[clamp(40px,8vw,80px)] font-extrabold leading-[1.05] max-w-[1000px] mx-auto mb-3 md:mb-5"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 20%, rgba(255,255,255,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 80px rgba(212,175,55,0.08)",
            }}
          >
            Land Your Dream Job in the Gulf
            <span style={{ background: "linear-gradient(135deg, #F6E27A, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {" "}&mdash; with AI Precision
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[clamp(13px,1.2vw,20px)] md:text-[clamp(15px,1.3vw,20px)] font-light max-w-[580px] mx-auto mb-6 md:mb-10 leading-relaxed tracking-[0.3px]"
            style={{ color: "#B0C4DE", opacity: 0.7 }}
          >
            ATS-optimized resumes, interview coaching, and job tracking — built for Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman.
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070E] to-transparent z-[3]" />
    </section>
  );
}