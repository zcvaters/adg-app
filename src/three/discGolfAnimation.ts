import * as THREE from 'three';

// Define the function with TypeScript types
export function initDiscGolfAnimation(container: HTMLElement): () => void {
  // Scene setup with fog for depth
  const scene: THREE.Scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x87CEEB, 20, 100);
  scene.background = new THREE.Color(0x87CEEB);

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(50, 100, 50);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  // Ground with texture
  const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
  const groundMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x2E8B57,
    shininess: 0,
    bumpScale: 0.2
  });
  const ground: THREE.Mesh = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Improved disc with better geometry and materials
  const discGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
  const discMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFF4500,
    shininess: 100,
    specular: 0x444444
  });
  const disc: THREE.Mesh = new THREE.Mesh(discGeometry, discMaterial);
  disc.castShadow = true;
  scene.add(disc);

  // Detailed basket components
  const basketGroup = new THREE.Group();

  // Main pole
  const poleGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
  const poleMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x808080,
    shininess: 50
  });
  const pole: THREE.Mesh = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.castShadow = true;
  pole.position.y = 2;
  basketGroup.add(pole);

  // Basket rim
  const rimGeometry: THREE.TorusGeometry = new THREE.TorusGeometry(0.8, 0.03, 16, 32);
  const rimMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x808080,
    shininess: 50
  });
  const rim: THREE.Mesh = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.y = 3.5;
  rim.rotation.x = Math.PI / 2;
  basketGroup.add(rim);

  // Chains
  const chainCount = 12;
  const chainRadius = 0.7;
  for (let i = 0; i < chainCount; i++) {
    const angle = (i / chainCount) * Math.PI * 2;
    const chainGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8);
    const chainMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xC0C0C0,
      shininess: 100
    });
    const chain = new THREE.Mesh(chainGeometry, chainMaterial);
    chain.position.set(
      Math.cos(angle) * chainRadius,
      3.1,
      Math.sin(angle) * chainRadius
    );
    chain.castShadow = true;
    basketGroup.add(chain);
  }

  // Basket bottom
  const basketBottomGeometry = new THREE.CylinderGeometry(0.8, 0.6, 0.4, 32);
  const basketBottomMaterial = new THREE.MeshPhongMaterial({
    color: 0x666666,
    shininess: 30,
    wireframe: true
  });
  const basketBottom = new THREE.Mesh(basketBottomGeometry, basketBottomMaterial);
  basketBottom.position.y = 2.8;
  basketGroup.add(basketBottom);

  basketGroup.position.set(10, 0, 0);
  scene.add(basketGroup);

  // Add trees for environment
  function createTree(x: number, z: number) {
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4A2B0F });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Leaves
    const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x0F4D0F });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2;
    leaves.castShadow = true;
    treeGroup.add(leaves);

    treeGroup.position.set(x, 1, z);
    return treeGroup;
  }

  // Add some trees
  [-8, -5, 15, 18].forEach(x => {
    [-5, 5].forEach(z => {
      scene.add(createTree(x, z));
    });
  });

  // Camera position and target
  camera.position.set(-5, 8, 15);
  camera.lookAt(5, 0, 0);

  // Animation variables
  let time: number = 0;
  const initialDiscPosition = new THREE.Vector3(-10, 1, 0);
  const targetPosition = new THREE.Vector3(10, 3.5, 0);
  const animationDuration = 2;
  let isAnimating = true;

  // Particle system for trail effect
  const particleCount = 50;
  const particles = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xFF6B00,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });
  
  for (let i = 0; i < particleCount * 3; i++) {
    particlePositions[i] = 0;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  // Animation loop with improved physics
  function animate(): void {
    requestAnimationFrame(animate);

    if (isAnimating) {
      time += 0.016; // Approximately 60fps

      const progress = Math.min(time / animationDuration, 1);
      
      // Bezier curve for smooth arc
      const p0 = initialDiscPosition;
      const p1 = new THREE.Vector3(-5, 6, 0); // Control point
      const p2 = targetPosition;
      
      disc.position.x = Math.pow(1 - progress, 2) * p0.x + 2 * (1 - progress) * progress * p1.x + Math.pow(progress, 2) * p2.x;
      disc.position.y = Math.pow(1 - progress, 2) * p0.y + 2 * (1 - progress) * progress * p1.y + Math.pow(progress, 2) * p2.y;
      disc.position.z = Math.pow(1 - progress, 2) * p0.z + 2 * (1 - progress) * progress * p1.z + Math.pow(progress, 2) * p2.z;

      // Disc rotation
      disc.rotation.x = progress * Math.PI * 4;
      disc.rotation.z = progress * Math.PI / 4;

      // Update particle trail
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = particleCount - 1; i > 0; i--) {
        positions[i * 3] = positions[(i - 1) * 3];
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
      }
      positions[0] = disc.position.x;
      positions[1] = disc.position.y;
      positions[2] = disc.position.z;
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Fade out particles based on age
      const opacities = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        opacities[i] = 1 - (i / particleCount);
      }
      particleSystem.geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

      if (progress >= 1) {
        isAnimating = false;
        disc.position.set(10, 3.3, 0);
        particleSystem.visible = false;
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  // Handle window resize
  const handleResize = (): void => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
  };
}