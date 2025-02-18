'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

interface TimeBlock {
  value: string;
  label: string;
}

interface TimerSceneProps {
  timeBlocks: TimeBlock[];
  color: string;
}

export default function TimerScene({ timeBlocks, color }: TimerSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    texts: Text[];
    particles: THREE.Points;
    animationFrameId?: number;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    const texts: Text[] = [];

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    // Create enhanced particle system
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      sizes[i] = Math.random() * 2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: new THREE.TextureLoader().load('/spark.png') }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(time * 2.0 + position.z * 0.1) * 0.5;
          pos.y += cos(time * 2.0 + position.x * 0.1) * 0.5;
          pos.z += sin(time * 2.0 + position.y * 0.1) * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Calculate responsive text sizes
    const calculateSizes = () => {
      const width = containerRef.current?.clientWidth || 1000;
      const height = containerRef.current?.clientHeight || 500;
      const baseSize = Math.min(width, height) / 15;
      return {
        numberSize: baseSize,
        labelSize: baseSize * 0.4,
        spacing: baseSize * 1.2
      };
    };

    const { numberSize, labelSize, spacing } = calculateSizes();

    // Create text layout in a grid
    timeBlocks.forEach((block, index) => {
      const isEvenIndex = index % 2 === 0;
      const row = Math.floor(index / 2);
      const col = isEvenIndex ? -1 : 1;
      
      // Create number text
      const numberText = new Text();
      numberText.text = block.value;
      numberText.fontSize = numberSize;
      numberText.position.x = col * spacing * 2;
      numberText.position.y = row * -spacing * 2;
      numberText.position.z = 0;
      numberText.color = color;
      numberText.anchorX = 'center';
      numberText.anchorY = 'middle';
      numberText.material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color(color).multiplyScalar(0.2)
      });
      scene.add(numberText);
      texts.push(numberText);

      // Create label text
      const labelText = new Text();
      labelText.text = block.label;
      labelText.fontSize = labelSize;
      labelText.position.x = col * spacing * 2;
      labelText.position.y = (row * -spacing * 2) - spacing * 0.8;
      labelText.position.z = 0;
      labelText.color = color;
      labelText.anchorX = 'center';
      labelText.anchorY = 'middle';
      labelText.material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.5,
        roughness: 0.5,
        emissive: new THREE.Color(color).multiplyScalar(0.1)
      });
      scene.add(labelText);
      texts.push(labelText);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Camera position
    camera.position.z = 15;

    // Enhanced animation
    let time = 0;
    const animate = () => {
      if (!sceneRef.current) return;
      time += 0.002;

      // Dynamic camera movement
      const camRadius = 20 + Math.sin(time * 0.5) * 5;
      camera.position.x = Math.sin(time * 0.5) * camRadius;
      camera.position.y = Math.cos(time * 0.3) * camRadius * 0.5;
      camera.position.z = Math.cos(time * 0.5) * camRadius;
      camera.lookAt(0, 0, 0);

      // Update particle positions
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.02;
        positions[i + 1] += Math.cos(time + i) * 0.02;
        positions[i + 2] += Math.sin(time + i) * 0.02;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Update particle material time uniform
      (particles.material as THREE.ShaderMaterial).uniforms.time.value = time;

      // Subtle text animation with glow effect
      texts.forEach((text, i) => {
        if (i % 2 === 0) {
          const floatOffset = Math.sin(time * 2 + i) * 0.1;
          text.position.y += floatOffset;
          text.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.05);
        }
        text.sync();
      });

      composer.render();
      sceneRef.current.animationFrameId = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Update text sizes
      const { numberSize, labelSize, spacing } = calculateSizes();
      texts.forEach((text, i) => {
        const isNumber = i % 2 === 0;
        text.fontSize = isNumber ? numberSize : labelSize;
        
        // Recalculate positions
        const blockIndex = Math.floor(i / 2);
        const isEvenIndex = blockIndex % 2 === 0;
        const row = Math.floor(blockIndex / 2);
        const col = isEvenIndex ? -1 : 1;
        
        text.position.x = col * spacing * 2;
        text.position.y = row * -spacing * 2;
        if (!isNumber) {
          text.position.y -= spacing * 0.8;
        }
        
        text.sync();
      });
    };

    window.addEventListener('resize', handleResize);

    // Store references
    sceneRef.current = { scene, camera, renderer, composer, texts, particles };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
      texts.forEach(text => text.dispose());
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, [timeBlocks, color]);

  return <div ref={containerRef} className="w-full h-[500px]" />;
}
