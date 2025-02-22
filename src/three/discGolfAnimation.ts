import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import type { TextGeometryParameters } from 'three/addons/geometries/TextGeometry.js';
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js';

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

  // Ground with texture and heightmap for St. John's winter terrain
  const groundSize = 100;
  const groundSegments = 128;
  const groundGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(groundSize, groundSize, groundSegments, groundSegments);
  
  // Create heightmap for snow-covered hills
  const vertices = groundGeometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    // Create rolling hills with gentler slopes for snow
    vertices[i + 1] = 
      Math.sin(x * 0.2) * 2 + 
      Math.cos(z * 0.3) * 2 +
      Math.sin((x + z) * 0.5) * 1.5 +
      (Math.random() * 0.3); // Subtle snow drifts
    
    // Flatten area around the basket and throw zone
    if (Math.abs(x - 10) < 3 && Math.abs(z) < 3) {
      vertices[i + 1] *= 0.1;
    }
    if (Math.abs(x + 10) < 3 && Math.abs(z) < 3) {
      vertices[i + 1] *= 0.1;
    }
  }
  groundGeometry.computeVertexNormals();

  // Snow material with slight sparkle
  const groundMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFFFFFF,
    shininess: 70,
    flatShading: true,
    specular: 0x99CCFF
  });
  const ground: THREE.Mesh = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create tee box
  const teeBoxGroup = new THREE.Group();
  
  // Tee pad base
  const teePadGeometry = new THREE.BoxGeometry(2, 0.1, 3);
  const teePadMaterial = new THREE.MeshPhongMaterial({
    color: 0xCCCCCC,
    shininess: 30,
    flatShading: true
  });
  const teePad = new THREE.Mesh(teePadGeometry, teePadMaterial);
  teePad.position.set(-10, 0.05, 0);
  teePad.receiveShadow = true;
  teePad.castShadow = true;
  teeBoxGroup.add(teePad);

  // Tee sign post
  const signPostGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
  const signPostMaterial = new THREE.MeshPhongMaterial({
    color: 0x4B2F1D,
    flatShading: true
  });
  const signPost = new THREE.Mesh(signPostGeometry, signPostMaterial);
  signPost.position.set(-11, 0.75, -1);
  signPost.castShadow = true;
  teeBoxGroup.add(signPost);

  // Tee sign
  const signGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.05);
  const signMaterial = new THREE.MeshPhongMaterial({
    color: 0x2F4F4F,
    flatShading: true
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(-11, 1.3, -1);
  sign.castShadow = true;
  teeBoxGroup.add(sign);

  scene.add(teeBoxGroup);

  // Create player figure
  const playerGroup = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.15, 1.2, 8);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x2F4F4F, // Dark winter jacket color
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.9;
  body.rotation.x = -Math.PI * 0.1; // Lean forward slightly
  playerGroup.add(body);

  // Head
  const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const headMaterial = new THREE.MeshPhongMaterial({
    color: 0xE0C8A0, // Skin tone
    flatShading: true
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.6;
  head.position.z = -0.1; // Slight forward position due to lean
  playerGroup.add(head);

  // Winter hat
  const hatGeometry = new THREE.ConeGeometry(0.2, 0.3, 8);
  const hatMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B0000, // Dark red winter hat
    flatShading: true
  });
  const hat = new THREE.Mesh(hatGeometry, hatMaterial);
  hat.position.y = 1.8;
  hat.position.z = -0.1;
  playerGroup.add(hat);

  // Arms (in throwing position)
  const armGeometry = new THREE.CylinderGeometry(0.06, 0.04, 0.6, 8);
  const armMaterial = new THREE.MeshPhongMaterial({
    color: 0x2F4F4F,
    flatShading: true
  });

  // Right arm (throwing arm)
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(0.3, 1.2, 0);
  rightArm.rotation.z = -Math.PI * 0.15;
  rightArm.rotation.x = Math.PI * 0.2;
  playerGroup.add(rightArm);

  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-0.3, 1.2, 0);
  leftArm.rotation.z = Math.PI * 0.3;
  leftArm.rotation.x = -Math.PI * 0.1;
  playerGroup.add(leftArm);

  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.8, 8);
  const legMaterial = new THREE.MeshPhongMaterial({
    color: 0x1B1B1B, // Dark pants
    flatShading: true
  });

  // Right leg (forward stance)
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.15, 0.4, 0.2);
  rightLeg.rotation.x = Math.PI * 0.05;
  playerGroup.add(rightLeg);

  // Left leg (back stance)
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.15, 0.4, -0.2);
  leftLeg.rotation.x = -Math.PI * 0.05;
  playerGroup.add(leftLeg);

  // Position the entire player at the tee
  playerGroup.position.set(-10, 0, -0.5);
  playerGroup.rotation.y = Math.PI * 0.2; // Slight angle for throwing stance
  scene.add(playerGroup);

  // Function to create footprints in snow
  function createFootprint(x: number, z: number, angle: number) {
    const footprintGroup = new THREE.Group();
    
    // Create the main footprint impression
    const footGeometry = new THREE.PlaneGeometry(0.15, 0.4);
    const footMaterial = new THREE.MeshPhongMaterial({
      color: 0xE8E8E8, // Slightly darker than snow to show depression
      shininess: 60,
      flatShading: true,
      specular: 0x99CCFF
    });
    
    // Create two parts of the footprint for more realism
    const toePart = new THREE.Mesh(footGeometry, footMaterial);
    toePart.scale.set(1.2, 0.7, 1); // Wider at the toes
    
    const heelPart = new THREE.Mesh(footGeometry, footMaterial);
    heelPart.scale.set(0.8, 0.5, 1); // Narrower at the heel
    heelPart.position.y = -0.15;
    
    footprintGroup.add(toePart);
    footprintGroup.add(heelPart);
    
    // Position and rotate the footprint
    footprintGroup.rotation.x = -Math.PI / 2; // Lay flat on ground
    footprintGroup.rotation.z = angle; // Direction of walking
    footprintGroup.position.set(x, 0.01, z); // Slightly above ground to prevent z-fighting
    
    return footprintGroup;
  }

  // Add footprint patterns
  const footprintPatterns = [
    // Around tee area (starting position)
    ...Array.from({ length: 8 }, (_, i) => ({
      x: -10 + Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
      angle: Math.random() * Math.PI / 4 - Math.PI / 8
    })),
    // Path to basket
    ...Array.from({ length: 6 }, (_, i) => ({
      x: -5 + i * 2.5 + Math.random() * 0.5,
      z: Math.random() * 1 - 0.5,
      angle: Math.PI / 16 * Math.sin(i)
    })),
    // Around basket area
    ...Array.from({ length: 10 }, (_, i) => ({
      x: 10 + Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
      angle: Math.random() * Math.PI * 2
    }))
  ];

  footprintPatterns.forEach(({ x, z, angle }) => {
    scene.add(createFootprint(x, z, angle));
    // Add matching footprint for other foot if it's part of a walking path
    if (Math.random() > 0.3) { // 70% chance for paired footprints
      scene.add(createFootprint(
        x + Math.cos(angle + Math.PI / 2) * 0.3,
        z + Math.sin(angle + Math.PI / 2) * 0.3,
        angle + Math.PI / 8
      ));
    }
  });

  // Function to create winter tree
  function createTree(x: number, z: number) {
    const treeGroup = new THREE.Group();
    
    // Bare trunk with snow
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2 + Math.random(), 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3B2F2F,
      flatShading: true
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Snow-covered branches
    const branchLayers = 4;
    for (let i = 0; i < branchLayers; i++) {
      const layerSize = 1.8 * (1 - i / branchLayers);
      const layerHeight = 1 + i * 0.8;
      
      // Main branch structure
      const branchGeometry = new THREE.ConeGeometry(layerSize * 0.8, 1, 6);
      const branchMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3B2F2F,
        flatShading: true
      });
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      branch.position.y = layerHeight;
      branch.castShadow = true;
      
      // Snow cover on branches
      const snowGeometry = new THREE.ConeGeometry(layerSize, 0.3, 6);
      const snowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFFF,
        shininess: 50,
        flatShading: true,
        specular: 0x99CCFF
      });
      const snow = new THREE.Mesh(snowGeometry, snowMaterial);
      snow.position.y = layerHeight + 0.2;
      snow.castShadow = true;
      
      treeGroup.add(branch);
      treeGroup.add(snow);
    }

    treeGroup.rotation.y = Math.random() * Math.PI * 2;
    treeGroup.position.set(x, 1, z);
    return treeGroup;
  }

  // Add trees in winter arrangement
  const treePositions = [
    [-8, -5], [-7, -4], [-9, -6], // Cluster 1
    [15, 5], [16, 6], [14, 4],    // Cluster 2
    [-5, 8], [-6, 7], [-4, 9],    // Cluster 3
    [18, -3], [17, -4], [19, -2], // Cluster 4
    [-3, -7], [13, 7], [-7, 4]    // Additional scattered trees
  ];
  treePositions.forEach(([x, z]) => {
    scene.add(createTree(x, z));
  });

  // Winter atmosphere
  scene.fog = new THREE.Fog(0xE6EEF5, 20, 60); // Crisp winter fog
  scene.background = new THREE.Color(0xE6EEF5); // Winter sky color

  // Winter lighting
  sunLight.intensity = 1.2; // Brighter winter sun
  sunLight.color.setHex(0xFFFFFF);
  ambientLight.intensity = 0.7;
  ambientLight.color.setHex(0xB0C4DE); // Slight blue tint for snow reflection

  // Add falling snow particles
  const snowCount = 1000;
  const snowGeometry = new THREE.BufferGeometry();
  const snowPositions = new Float32Array(snowCount * 3);
  
  for (let i = 0; i < snowCount * 3; i += 3) {
    snowPositions[i] = Math.random() * 100 - 50;     // x
    snowPositions[i + 1] = Math.random() * 50;       // y
    snowPositions[i + 2] = Math.random() * 100 - 50; // z
  }
  
  snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
  const snowMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });
  
  const snow = new THREE.Points(snowGeometry, snowMaterial);
  scene.add(snow);

  // Improved disc with better geometry and materials
  const discGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
  const discMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFF4500,
    shininess: 100,
    specular: 0x444444
  });
  const disc: THREE.Mesh = new THREE.Mesh(discGeometry, discMaterial);
  disc.castShadow = true;

  // Set initial disc angle
  disc.rotation.x = Math.PI / 6; // Slight upward angle for hyzer
  scene.add(disc);

  // Add "ADG" text written in snow
  const fontLoader = new FontLoader();
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font: Font) => {
    const textGeometry = new TextGeometry('Avalon Disc Golfers', {
      font: font,
      size: 2,
      height: 0.2,
      curveSegments: 32, // Increased for smoother curves
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelSegments: 8,
      depth: 0.4
    } as TextGeometryParameters);

    // Create gradient material
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x2C5282, // Rich blue base color
      metalness: 0.3,
      roughness: 0.7,
      envMapIntensity: 1.0
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
    
    textMesh.position.set(8 - textWidth/2, 6, 2);
    textMesh.rotation.set(0, 0.5, 0);
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;

    // Add subtle glow
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4299E1,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const glowMesh = new THREE.Mesh(textGeometry.clone(), glowMaterial);
    glowMesh.position.copy(textMesh.position);
    glowMesh.rotation.copy(textMesh.rotation);
    glowMesh.scale.multiplyScalar(1.02); // Reduced scale for subtler glow

    scene.add(textMesh);
    scene.add(glowMesh);
  });

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
  rim.position.y = 4.0;
  rim.rotation.x = Math.PI / 2;
  basketGroup.add(rim);

  // Chains with physics
  const chainCount = 12;
  const chainRadius = 0.7;
  const chainLength = 1.2;
  const chainSegments = 12;
  const chains: THREE.Mesh[][] = [];
  const chainPhysics: { velocity: number; angle: number; }[][] = [];

  // Create chain attachment points on rim
  const chainAttachments: THREE.Mesh[] = [];
  for (let i = 0; i < chainCount; i++) {
    const angle = (i / chainCount) * Math.PI * 2;
    const attachGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const attachMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
    const attachment = new THREE.Mesh(attachGeometry, attachMaterial);
    attachment.position.set(
      Math.cos(angle) * chainRadius,
      4.0,
      Math.sin(angle) * chainRadius
    );
    chainAttachments.push(attachment);
    basketGroup.add(attachment);
  }

  for (let i = 0; i < chainCount; i++) {
    const angle = (i / chainCount) * Math.PI * 2;
    const chainArray: THREE.Mesh[] = [];
    const chainPhysicsArray: { velocity: number; angle: number; }[] = [];
    
    // Create chain segments
    for (let j = 0; j < chainSegments; j++) {
      const segmentHeight = chainLength / chainSegments;
      const chainGeometry = new THREE.CylinderGeometry(0.01, 0.01, segmentHeight, 8);
      const chainMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xC0C0C0,
        shininess: 100
      });
      const chainSegment = new THREE.Mesh(chainGeometry, chainMaterial);
      
      // Position each segment with proper attachment to previous segment
      const yOffset = j * segmentHeight;
      chainSegment.position.set(
        Math.cos(angle) * chainRadius,
        4.0 - yOffset - (segmentHeight / 2),
        Math.sin(angle) * chainRadius
      );
      
      // Rotate segment to connect with previous segment
      if (j > 0) {
        const prevSegment = chainArray[j - 1];
        chainSegment.position.y = prevSegment.position.y - segmentHeight;
      }
      
      chainSegment.castShadow = true;
      
      // Store initial position for physics
      chainPhysicsArray.push({
        velocity: 0,
        angle: 0 // Start at rest position
      });
      
      chainArray.push(chainSegment);
      basketGroup.add(chainSegment);
    }
    
    chains.push(chainArray);
    chainPhysics.push(chainPhysicsArray);
  }

  // Basket bottom - adjusted for chain connection
  const basketBottomGeometry = new THREE.CylinderGeometry(0.8, 0.6, 0.4, 32);
  const basketBottomMaterial = new THREE.MeshPhongMaterial({
    color: 0x666666,
    shininess: 30,
    wireframe: true
  });
  const basketBottom = new THREE.Mesh(basketBottomGeometry, basketBottomMaterial);
  basketBottom.position.y = 2.8; // Lowered to match longer chains
  basketGroup.add(basketBottom);

  basketGroup.position.set(10, 0, 0);
  scene.add(basketGroup);

  // Animation variables
  let time: number = 0;
  const initialDiscPosition = new THREE.Vector3(-10, 1.5, 0);
  const targetPosition = new THREE.Vector3(10, 3.7, 0);
  const animationDuration = 2.5;
  const landingDuration = 0.5;
  let isAnimating = true;
  let isLanding = false;
  let landingTime = 0;
  let chainsAnimating = false;
  let chainAnimationTime = 0;
  let discVelocity = new THREE.Vector3();
  let discMadeIt = Math.random() > 0.3; // 70% chance of making the shot

  // Add slight randomness to flight path
  const randomOffset = new THREE.Vector3(
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.3,
    (Math.random() - 0.5) * 0.5
  );

  // Initial camera position behind the disc
  camera.position.set(-12, 2.5, 4);
  camera.lookAt(initialDiscPosition);

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

  // Animation loop with improved physics and camera following
  function animate(): void {
    requestAnimationFrame(animate);

    // Animate snow
    const positions = snow.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.1; // Fall speed
      if (positions[i + 1] < 0) {
        positions[i + 1] = 50; // Reset to top
        positions[i] = Math.random() * 100 - 50;     // New random x
        positions[i + 2] = Math.random() * 100 - 50; // New random z
      }
    }
    snow.geometry.attributes.position.needsUpdate = true;

    if (isAnimating) {
      time += 0.016;
      const progress = Math.min(time / animationDuration, 1);
      
      // Bezier curve for smooth arc with more realistic flight path
      const p0 = initialDiscPosition;
      const p1 = new THREE.Vector3(-2, 5, 0); // Control point for arc
      const p2 = targetPosition.clone().add(randomOffset); // Add randomness to target
      
      // Update disc position with slight randomness
      disc.position.x = Math.pow(1 - progress, 2) * p0.x + 2 * (1 - progress) * progress * p1.x + Math.pow(progress, 2) * p2.x;
      disc.position.y = Math.pow(1 - progress, 2) * p0.y + 2 * (1 - progress) * progress * p1.y + Math.pow(progress, 2) * p2.y;
      disc.position.z = Math.pow(1 - progress, 2) * p0.z + 2 * (1 - progress) * progress * p1.z + Math.pow(progress, 2) * p2.z;

      // Calculate velocity for landing physics
      if (progress > 0.9) {
        const prevPos = new THREE.Vector3(
          Math.pow(1 - (progress - 0.016), 2) * p0.x + 2 * (1 - (progress - 0.016)) * (progress - 0.016) * p1.x + Math.pow(progress - 0.016, 2) * p2.x,
          Math.pow(1 - (progress - 0.016), 2) * p0.y + 2 * (1 - (progress - 0.016)) * (progress - 0.016) * p1.y + Math.pow(progress - 0.016, 2) * p2.y,
          Math.pow(1 - (progress - 0.016), 2) * p0.z + 2 * (1 - (progress - 0.016)) * (progress - 0.016) * p1.z + Math.pow(progress - 0.016, 2) * p2.z
        );
        discVelocity.subVectors(disc.position, prevPos).multiplyScalar(60);
      }

      // Update camera position to follow disc
      const cameraOffset = new THREE.Vector3(-4, 2, 8); // Increased distance and height
      const cameraTargetOffset = new THREE.Vector3(4, 0, 0); // Look further ahead

      camera.position.x = disc.position.x + cameraOffset.x;
      camera.position.y = disc.position.y + cameraOffset.y;
      camera.position.z = disc.position.z + cameraOffset.z;

      const lookAtPoint = new THREE.Vector3(
        disc.position.x + cameraTargetOffset.x,
        disc.position.y + cameraTargetOffset.y,
        disc.position.z + cameraTargetOffset.z
      );
      camera.lookAt(lookAtPoint);

      // Disc rotation
      disc.rotation.y = progress * Math.PI * 8;
      disc.rotation.x = (Math.PI / 6) * (1 - Math.min(progress * 1.5, 1));
      disc.rotation.z = Math.sin(progress * Math.PI * 2) * 0.1;

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
        isLanding = true;
        particleSystem.visible = false;
      }
    }

    // Landing sequence with physics
    if (isLanding) {
      landingTime += 0.016;
      const landingProgress = Math.min(landingTime / landingDuration, 1);
      
      // Apply gravity and velocity
      discVelocity.y -= 9.8 * 0.016; // Gravity
      disc.position.add(discVelocity.clone().multiplyScalar(0.016));
      
      // Check for chain collisions
      const distanceToCenter = new THREE.Vector2(disc.position.x - 10, disc.position.z).length();
      const heightInBasket = disc.position.y - 2.8; // Height above basket bottom
      
      if (distanceToCenter < chainRadius + 0.5 && heightInBasket > 0 && heightInBasket < 1.4) {
        if (discMadeIt) {
          // Successful shot - guide disc into basket
          disc.position.y = Math.max(2.9, disc.position.y);
          discVelocity.multiplyScalar(0.7); // Slow down from chain contact
          discVelocity.y *= 0.5; // Extra vertical damping
          
          // Move disc slightly toward center
          const toCenter = new THREE.Vector2(10 - disc.position.x, -disc.position.z);
          toCenter.normalize().multiplyScalar(0.1);
          disc.position.x += toCenter.x;
          disc.position.z += toCenter.y;
        } else {
          // Missed shot - deflect off chains
          discVelocity.multiplyScalar(-0.3);
          discVelocity.y *= 0.5;
          chainsAnimating = true;
          chainAnimationTime = 0;
        }
      }
      
      // Check for ground/basket bottom collision
      if (disc.position.y < 2.9 && distanceToCenter < 0.8) {
        disc.position.y = 2.9; // Rest in basket
        discVelocity.set(0, 0, 0);
        isLanding = false;
        chainsAnimating = true;
        chainAnimationTime = 0;
      } else if (disc.position.y < 0.1) {
        disc.position.y = 0.1; // Bounce on ground
        discVelocity.y *= -0.3;
        discVelocity.x *= 0.7;
        discVelocity.z *= 0.7;
      }
      
      // Add wobble based on velocity
      disc.rotation.x += discVelocity.y * 0.01;
      disc.rotation.z += (discVelocity.x + discVelocity.z) * 0.01;
      
      // Camera follows disc with smooth transition
      const cameraProgress = Math.min(landingTime / (landingDuration * 3), 1);
      const easeProgress = cameraProgress * cameraProgress * (3 - 2 * cameraProgress);
      
      const flightCameraPos = new THREE.Vector3(
        disc.position.x - 4,
        Math.max(disc.position.y + 2, 4),
        8
      );
      const finalCameraPos = new THREE.Vector3(14, 5, 8);
      camera.position.lerpVectors(flightCameraPos, finalCameraPos, easeProgress);
      
      const flightLookAt = new THREE.Vector3(disc.position.x + 4, disc.position.y, 0);
      const finalLookAt = new THREE.Vector3(10, disc.position.y, 0);
      const currentLookAt = new THREE.Vector3();
      currentLookAt.lerpVectors(flightLookAt, finalLookAt, easeProgress);
      camera.lookAt(currentLookAt);

      // End landing sequence if disc has come to rest
      if (discVelocity.lengthSq() < 0.01 && disc.position.y <= 2.95) {
        isLanding = false;
      }
    }

    // Animate chains with proper attachment
    if (chainsAnimating) {
      chainAnimationTime += 0.016;
      const chainDuration = 2.0;
      
      chains.forEach((chain, chainIndex) => {
        const baseAngle = (chainIndex / chainCount) * Math.PI * 2;
        const impact = Math.sin((baseAngle + Math.PI) * 2) * 0.5;
        
        chain.forEach((segment, segmentIndex) => {
          const physics = chainPhysics[chainIndex][segmentIndex];
          
          // Calculate forces with attachment constraint
          const springForce = -0.3 * physics.angle;
          const dampingForce = -0.2 * physics.velocity;
          const impactForce = impact * Math.exp(-segmentIndex * 0.2) * 
            Math.exp(-chainAnimationTime * 2) * 
            Math.sin(chainAnimationTime * 15 + segmentIndex * 0.5);
          
          // Update physics with position constraints
          physics.velocity += (springForce + dampingForce + impactForce) * 0.016;
          physics.angle += physics.velocity * 0.016;
          
          // Limit chain movement to maintain attachment
          physics.angle = Math.max(Math.min(physics.angle, Math.PI / 4), -Math.PI / 4);
          
          const currentRadius = chainRadius + Math.sin(physics.angle) * 0.2;
          const segmentHeight = chainLength / chainSegments;
          const yOffset = segmentIndex * segmentHeight;
          
          // Position segment with attachment to previous
          if (segmentIndex === 0) {
            // First segment stays attached to rim
            segment.position.x = Math.cos(baseAngle) * chainRadius;
            segment.position.y = 4.0 - (segmentHeight / 2);
            segment.position.z = Math.sin(baseAngle) * chainRadius;
          } else {
            // Other segments follow previous segment
            const prevSegment = chain[segmentIndex - 1];
            segment.position.x = prevSegment.position.x + Math.sin(physics.angle) * 0.1;
            segment.position.y = prevSegment.position.y - segmentHeight;
            segment.position.z = prevSegment.position.z + Math.sin(physics.angle) * 0.1;
          }
          
          // Update segment rotation
          segment.rotation.x = Math.sin(physics.angle) * 0.2;
          segment.rotation.z = Math.cos(physics.angle) * 0.2;
        });
      });
      
      if (chainAnimationTime >= chainDuration) {
        chainsAnimating = false;
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