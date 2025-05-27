import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const SolarSystemAR: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем сцену
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.set(0, 0, 0);

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    containerRef.current.appendChild(renderer.domElement);
    containerRef.current.appendChild(ARButton.createButton(renderer));

    // Добавляем свет
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Создаем текстуру Земли
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBumpMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');

    // Создаем Землю
    const earthGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthBumpMap,
      bumpScale: 0.05,
      specularMap: earthSpecularMap,
      specular: new THREE.Color(0x333333),
      shininess: 5
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, -2);
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
      earth.rotation.y += 0.005;
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
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SolarSystemAR; 