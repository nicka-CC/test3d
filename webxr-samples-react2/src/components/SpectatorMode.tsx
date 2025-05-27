import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const SpectatorMode: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем сцену
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    // Создаем камеру для VR
    const vrCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    vrCamera.position.z = 1;

    // Создаем камеру для наблюдателя
    const spectatorCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    spectatorCamera.position.set(0, 2, 3);
    spectatorCamera.lookAt(0, 0, 0);

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    containerRef.current.appendChild(VRButton.createButton(renderer));

    // Добавляем свет
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Создаем куб
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Создаем плоскость для отображения вида наблюдателя
    const spectatorPlane = document.createElement('div');
    spectatorPlane.style.position = 'absolute';
    spectatorPlane.style.top = '10px';
    spectatorPlane.style.right = '10px';
    spectatorPlane.style.width = '320px';
    spectatorPlane.style.height = '180px';
    spectatorPlane.style.border = '2px solid white';
    spectatorPlane.style.backgroundColor = 'black';
    containerRef.current.appendChild(spectatorPlane);

    // Создаем второй рендерер для вида наблюдателя
    const spectatorRenderer = new THREE.WebGLRenderer({ antialias: true });
    spectatorRenderer.setSize(320, 180);
    spectatorPlane.appendChild(spectatorRenderer.domElement);

    // Обработчик изменения размера окна
    const handleResize = () => {
      vrCamera.aspect = window.innerWidth / window.innerHeight;
      vrCamera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Анимация
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Обновляем позицию камеры наблюдателя
      spectatorCamera.position.x = Math.sin(Date.now() * 0.001) * 3;
      spectatorCamera.lookAt(cube.position);

      // Рендерим вид наблюдателя
      spectatorRenderer.render(scene, spectatorCamera);

      renderer.setAnimationLoop(animate);
    };
    animate();

    // Очистка
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      spectatorRenderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        containerRef.current.removeChild(spectatorPlane);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SpectatorMode; 