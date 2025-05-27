import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const PositionalAudio: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем сцену
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.z = 1;

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

    // Создаем аудио слушатель
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Создаем источник звука
    const sound = new THREE.PositionalAudio(listener);

    // Загружаем аудио файл
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/media/audio/positional-audio.mp3', (buffer: AudioBuffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(1);
      sound.setLoop(true);
      sound.play();
    });

    // Создаем сферу для визуализации источника звука
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, -1);
    sphere.add(sound);
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
      sphere.rotation.y += 0.01;
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
      sound.stop();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default PositionalAudio; 