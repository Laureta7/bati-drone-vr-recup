import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import img360 from '../Assets/test360.jpg'

function ThreeScene() {
    const canvasRef = useRef(null);
    const textureRef = useRef(null);
    let scene, camera, renderer;
    let circles = [], circlePositions = [];
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let galleryScene, galleryMesh;
  
    useEffect(() => {
      function init() {
        // Create a new scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
  
        // Create a new renderer and add it to the DOM
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);
  
        // Create the circles and add them to the scene
        for (var i = 0; i < 5; i++) {
          var geometry = new THREE.CircleGeometry(0.5, 32);
          var material = new THREE.MeshBasicMaterial({ color: 0xfffaaa, side: THREE.DoubleSide });
          var circle = new THREE.Mesh(geometry, material);
          circle.position.set(Math.random() * 8 - 4, Math.random() * 4 - 2, 0);
          scene.add(circle);
          circles.push(circle);
          circlePositions.push(circle.position.clone());
        }
  
        // Add event listeners for mouse movement and clicks
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
      }
  
      function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
  
      function onDocumentMouseDown(event) {
        event.preventDefault();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(circles);
        if (intersects.length > 0) {
          var circle = intersects[0].object;
          showGallery(circle.position);
        }
      }
  
      function showGallery(position) {
        // Create a new scene for the gallery
        galleryScene = new THREE.Scene();
  
        // Load the image and create a new textured mesh
        textureRef.current = new THREE.TextureLoader().load(img360, function() {
          var geometry = new THREE.PlaneGeometry(5, 5);
          var material = new THREE.MeshBasicMaterial({ map: textureRef.current });
          galleryMesh = new THREE.Mesh(geometry, material);
          galleryMesh.position.set(position.x, position.y, 0);
          galleryScene.add(galleryMesh);
  
          // Add the gallery scene to the main scene
          scene.add(galleryScene);
        });
      }
  
      function animate() {
        requestAnimationFrame(animate);
  
        // Move the circles smoothly using TweenJS
        for (var i = 0; i < circles.length; i++) {
          var targetPosition = circlePositions[i];
          var circle = circles[i];
          new TWEEN.Tween(circle.position).to(targetPosition, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
        }

      // Update the raycaster and render the scene
      raycaster.setFromCamera(mouse, camera);
      renderer.render(scene, camera);
      TWEEN.update();
    }

    init();
    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ThreeScene;
