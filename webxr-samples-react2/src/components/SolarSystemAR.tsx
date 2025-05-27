import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const SolarSystemAR: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Проверка поддержки WebXR
    if (!navigator.xr) {
      setError('Ваш браузер не поддерживает WebXR. Пожалуйста, используйте Chrome на Android или Safari на iOS.');
      return;
    }

    // Создаем сцену
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.set(0, 1.6, 3);

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    try {
      containerRef.current.appendChild(renderer.domElement);
      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: containerRef.current }
      });
      containerRef.current.appendChild(arButton);
    } catch (err) {
      setError('Ошибка при инициализации AR: ' + (err as Error).message);
      return;
    }

    // Добавляем свет
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Создаем Солнце
    const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    
    // Создаем планеты
    const planets = [
      { name: 'Mercury', radius: 0.1, distance: 1, color: 0x888888, speed: 0.01 },
      { name: 'Venus', radius: 0.15, distance: 1.5, color: 0xe39e1c, speed: 0.008 },
      { name: 'Earth', radius: 0.2, distance: 2, color: 0x2233ff, speed: 0.006 },
      { name: 'Mars', radius: 0.15, distance: 2.5, color: 0xc1440e, speed: 0.004 },
      { name: 'Jupiter', radius: 0.4, distance: 3.5, color: 0xd8ca9d, speed: 0.002 },
      { name: 'Saturn', radius: 0.35, distance: 4.5, color: 0xead6b8, speed: 0.001 }
    ];

    const planetMeshes = planets.map(planet => {
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color: planet.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = planet.distance;
      scene.add(mesh);
      return { ...planet, mesh };
    });

    // Создаем орбиты
    planetMeshes.forEach(planet => {
      const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.01, planet.distance + 0.01, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });

    // Обработчик изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Анимация
    const animate = () => {
      // Вращаем Солнце
      sun.rotation.y += 0.005;

      // Вращаем планеты
      planetMeshes.forEach(planet => {
        planet.mesh.position.x = Math.cos(Date.now() * planet.speed) * planet.distance;
        planet.mesh.position.z = Math.sin(Date.now() * planet.speed) * planet.distance;
        planet.mesh.rotation.y += 0.01;
      });

      renderer.setAnimationLoop(animate);
    };
    animate();

    // Очистка
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SolarSystemAR; 