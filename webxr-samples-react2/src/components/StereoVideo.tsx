import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const StereoVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем сцену
    const scene = new THREE.Scene();

    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 0.1;

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    containerRef.current.appendChild(VRButton.createButton(renderer));

    // Создаем видео элемент
    const video = document.createElement('video');
    video.src = '/media/videos/stereo-video.mp4';
    video.loop = true;
    video.muted = true;
    video.play();

    // Создаем текстуру из видео
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // Создаем сферу для отображения видео
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Инвертируем геометрию, чтобы видео отображалось внутри сферы
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Обработчик изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Анимация
    const animate = () => {
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
      video.pause();
      video.src = '';
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default StereoVideo; 