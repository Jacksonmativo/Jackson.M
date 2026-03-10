import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CyberGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const dotGroup = new THREE.Group();
    scene.add(dotGroup);

    // Load Earth texture and create dots
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      (earthTexture) => {
        const canvas = document.createElement('canvas');
        canvas.width = earthTexture.image.width;
        canvas.height = earthTexture.image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(earthTexture.image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        const dotGeometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const radius = 1.01;
        const phiSteps = 1080;
        const thetaSteps = 540;
        const maxDots = 800000;

        let count = 0;
        for (let t = 0; t < thetaSteps && count < maxDots; t++) {
          const theta = (t / thetaSteps) * Math.PI;
          for (let p = 0; p < phiSteps && count < maxDots; p++) {
            const phi = (p / phiSteps) * 2 * Math.PI;
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            const u = (Math.atan2(x, z) / (2 * Math.PI) + 0.5) * canvas.width;
            const v = (0.5 - Math.asin(y) / Math.PI) * canvas.height;
            const idx = (Math.floor(u) + Math.floor(v) * canvas.width) * 4;

            const r = imageData[idx];
            const g = imageData[idx + 1];
            const b = imageData[idx + 2];

            if (b < 150 && (r > 70 || g > 50)) {
              positions.push(x, y, z);
              count++;
            }
          }
        }

        dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const dotMaterial = new THREE.PointsMaterial({
          color: 0x00ccff,
          size: 0.0095,
          transparent: true,
          opacity: 0.92,
          alphaTest: 0.45
        });

        dotGroup.add(new THREE.Points(dotGeometry, dotMaterial));

        // Security services labels
        const services = [
          { text: "VAPT", lon: 135, lat: -25 },
          { text: "API Security", lon: 20, lat: 0 },
          { text: "Web Security", lon: -100, lat: 40 },
          { text: "SIEM", lon: -60, lat: -15 },
          { text: "Compliance", lon: 10, lat: 50 },
          { text: "Risk Assessment", lon: 100, lat: 30 },
          { text: "Infrastructure", lon: 0, lat: -80 },
          { text: "Threat Modeling", lon: -40, lat: 70 }
        ];

        services.forEach((item, i) => {
          const c = document.createElement('canvas');
          c.width = 640;
          c.height = 96;
          const ctx2d = c.getContext('2d');
          if (!ctx2d) return;

          ctx2d.fillStyle = 'rgba(0,0,0,0.45)';
          ctx2d.fillRect(0, 0, c.width, c.height);

          ctx2d.font = 'bold 32px Arial';
          ctx2d.fillStyle = '#e0f7ff';
          ctx2d.textAlign = 'center';
          ctx2d.textBaseline = 'middle';
          ctx2d.fillText(item.text, c.width / 2, c.height / 2);

          const texture = new THREE.CanvasTexture(c);
          const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0
          });

          const sprite = new THREE.Sprite(material);

          const phi = (item.lon * Math.PI) / 180;
          const theta = ((90 + item.lat) * Math.PI) / 180;
          const r = 1.28;

          sprite.position.set(
            r * Math.sin(theta) * Math.cos(phi),
            r * Math.cos(theta),
            r * Math.sin(theta) * Math.sin(phi)
          );

          sprite.scale.set(1.1, 0.275, 1);
          sprite.userData.phase = i * (Math.PI * 2 / services.length);

          dotGroup.add(sprite);
        });
      }
    );

    // Lighting
    scene.add(new THREE.AmbientLight(0x404040));
    scene.add(new THREE.PointLight(0xffffff, 1.1, 100).position.set(6, 4, 6));

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(1200 * 3);
    for (let i = 0; i < starsPos.length; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 240;
      starsPos[i + 1] = (Math.random() - 0.5) * 240;
      starsPos[i + 2] = (Math.random() - 0.5) * 240;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    scene.add(
      new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({
          color: 0xeeeeee,
          size: 0.12,
          transparent: true
        })
      )
    );

    // Camera position
    const camR = 3.2;
    const camPhi = (135 * Math.PI) / 180;
    const camTheta = (115 * Math.PI) / 180;
    camera.position.set(
      camR * Math.sin(camTheta) * Math.cos(camPhi),
      camR * Math.cos(camTheta),
      camR * Math.sin(camTheta) * Math.sin(camPhi)
    );
    camera.lookAt(0, 0, 0);

    // Animation loop
    let startTime = Date.now();
    function animate() {
      requestAnimationFrame(animate);

      const t = Date.now() - startTime;
      dotGroup.rotation.y += 0.0048;

      dotGroup.children.forEach(child => {
        if (child instanceof THREE.Sprite) {
          child.material.opacity = Math.max(0, Math.sin(t * 0.0007 + (child as any).userData.phase));
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    />
  );
}
