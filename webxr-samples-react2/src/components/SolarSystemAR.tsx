import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const SolarSystemAR: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isARSupported, setIsARSupported] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Проверка поддержки WebXR
    if (!navigator.xr) {
      setError('Ваш браузер не поддерживает WebXR. Пожалуйста, используйте Chrome на Android или Safari на iOS.');
      return;
    }

    // Проверяем поддержку AR
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      setIsARSupported(supported);
      if (!supported) {
        setError('AR не поддерживается на вашем устройстве');
      }
    });

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
      
      // Создаем кнопку AR только если поддерживается
      if (isARSupported) {
        const arButton = ARButton.createButton(renderer, {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: containerRef.current }
        });
        containerRef.current.appendChild(arButton);
      }

      // Добавляем свет
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Создаем Землю
      const earthGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const earthMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2233ff,
        emissive: 0x112244,
        emissiveIntensity: 0.2
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earth.position.set(0, 1.5, -1);
      scene.add(earth);

      // Обработчик изменения размера окна
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Анимация
      const animate = () => {
        earth.rotation.y += 0.01;
      };

      renderer.setAnimationLoop(animate);

      // Очистка
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      setError('Ошибка при инициализации: ' + (err as Error).message);
      return;
    }
  }, [isARSupported]);

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