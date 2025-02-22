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
    
    // Calculate distance from tee box center
    const distanceFromTee = Math.sqrt(Math.pow(x + 10, 2) + Math.pow(z, 2));
    
    // Create a shoveled path from tee to basket
    const pathWidth = 4; // Width of the shoveled path
    const distanceFromPath = Math.abs(z); // Distance from the center line
    const isOnPath = distanceFromPath < pathWidth / 2 && x >= -12 && x <= 12;
    
    // Create a wider cleared area around tee box
    const teeBoxRadius = 3;
    const isNearTee = distanceFromTee < teeBoxRadius;

    if (isOnPath || isNearTee) {
      // Shoveled area - flat with slight texture
      vertices[i + 1] = Math.random() * 0.05; // Just a tiny bit of variation for texture
    } else {
      // Regular snow-covered terrain
      vertices[i + 1] = 
        Math.sin(x * 0.2) * 2 + 
        Math.cos(z * 0.3) * 2 +
        Math.sin((x + z) * 0.5) * 1.5 +
        (Math.random() * 0.3); // Subtle snow drifts
    }
    
    // Flatten area around the basket
    if (Math.abs(x - 10) < 3 && Math.abs(z) < 3) {
      vertices[i + 1] *= 0.1;
    }
  }
  groundGeometry.computeVertexNormals();

  // Create two-tone snow material
  const groundMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFFFFFF,
    shininess: 70,
    flatShading: true,
    specular: 0x99CCFF,
    vertexColors: true
  });

  // Add vertex colors to show packed snow vs fresh snow
  const colors = [];
  const positions = groundGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 2];
    
    // Calculate distances again for coloring
    const distanceFromTee = Math.sqrt(Math.pow(x + 10, 2) + Math.pow(z, 2));
    const distanceFromPath = Math.abs(z);
    const isOnPath = distanceFromPath < 2 && x >= -12 && x <= 12;
    const isNearTee = distanceFromTee < 3;

    if (isOnPath || isNearTee) {
      // Packed snow color (slightly darker/grayer)
      colors.push(0.9, 0.9, 0.95); // RGB for packed snow
    } else {
      // Fresh snow color (pure white)
      colors.push(1, 1, 1); // RGB for fresh snow
    }
  }

  groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const ground: THREE.Mesh = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create tee box
  const teeBoxGroup = new THREE.Group();
  
  // Tee pad base with turf-like appearance
  const teePadGeometry = new THREE.BoxGeometry(2, 0.1, 3);
  const teePadMaterial = new THREE.MeshPhongMaterial({
    color: 0x3B7A57, // Forest green
    shininess: 5, // Less shiny for a matte turf look
    flatShading: true
  });

  // Create turf texture pattern
  const turfTextureCanvas = document.createElement('canvas');
  turfTextureCanvas.width = 128;
  turfTextureCanvas.height = 128;
  const turfCtx = turfTextureCanvas.getContext('2d');
  if (turfCtx) {
    turfCtx.fillStyle = '#3B7A57';
    turfCtx.fillRect(0, 0, 128, 128);
    
    // Add grass-like pattern
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const length = 2 + Math.random() * 3;
      const angle = Math.random() * Math.PI;
      
      turfCtx.strokeStyle = i % 2 === 0 ? '#2E5E41' : '#4A8B68';
      turfCtx.beginPath();
      turfCtx.moveTo(x, y);
      turfCtx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      turfCtx.stroke();
    }
  }
  teePadMaterial.map = new THREE.CanvasTexture(turfTextureCanvas);
  teePadMaterial.map.repeat.set(2, 3);
  teePadMaterial.map.wrapS = THREE.RepeatWrapping;
  teePadMaterial.map.wrapT = THREE.RepeatWrapping;

  const teePad = new THREE.Mesh(teePadGeometry, teePadMaterial);
  teePad.position.set(-10, 0.05, 0);
  teePad.receiveShadow = true;
  teePad.castShadow = true;
  teeBoxGroup.add(teePad);

  // Function to create a bunny
  function createBunny() {
    const bunnyGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(0.2, 12, 12);
    const bunnyMaterial = new THREE.MeshPhongMaterial({
      color: 0xE0E0E0,
      shininess: 10,
      flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, bunnyMaterial);
    bunnyGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 12, 12);
    const head = new THREE.Mesh(headGeometry, bunnyMaterial);
    head.position.set(0.15, 0.1, 0);
    bunnyGroup.add(head);
    
    // Ears
    const earGeometry = new THREE.ConeGeometry(0.05, 0.2, 8);
    const ear1 = new THREE.Mesh(earGeometry, bunnyMaterial);
    ear1.position.set(0.2, 0.25, 0.05);
    ear1.rotation.z = -Math.PI / 6;
    bunnyGroup.add(ear1);
    
    const ear2 = new THREE.Mesh(earGeometry, bunnyMaterial);
    ear2.position.set(0.2, 0.25, -0.05);
    ear2.rotation.z = -Math.PI / 6;
    bunnyGroup.add(ear2);
    
    // Tail
    const tailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const tail = new THREE.Mesh(tailGeometry, bunnyMaterial);
    tail.position.set(-0.2, 0, 0);
    bunnyGroup.add(tail);

    bunnyGroup.scale.set(0.5, 0.5, 0.5);
    return bunnyGroup;
  }

  // Function to create a moose
  function createMoose() {
    const mooseGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
    const mooseMaterial = new THREE.MeshPhongMaterial({
      color: 0x4A3728,
      shininess: 10,
      flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, mooseMaterial);
    body.rotation.z = Math.PI / 2;
    mooseGroup.add(body);
    
    // Head
    const headGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.6, 8);
    const head = new THREE.Mesh(headGeometry, mooseMaterial);
    head.position.set(0.8, 0.3, 0);
    head.rotation.z = -Math.PI / 6;
    mooseGroup.add(head);
    
    // Antlers
    const antlerMaterial = new THREE.MeshPhongMaterial({
      color: 0x5C4033,
      flatShading: true
    });
    
    function createAntler(isRight: boolean) {
      const antlerGroup = new THREE.Group();
      const mainBeam = new THREE.CylinderGeometry(0.05, 0.03, 0.8, 6);
      const beam = new THREE.Mesh(mainBeam, antlerMaterial);
      beam.rotation.z = Math.PI / 3;
      antlerGroup.add(beam);
      
      // Add prongs
      for (let i = 0; i < 3; i++) {
        const prongGeo = new THREE.CylinderGeometry(0.02, 0.01, 0.3, 4);
        const prong = new THREE.Mesh(prongGeo, antlerMaterial);
        prong.position.set(0.2 + i * 0.2, 0.2 + i * 0.1, 0);
        prong.rotation.z = Math.PI / 4;
        antlerGroup.add(prong);
      }
      
      antlerGroup.position.set(0.8, 0.6, isRight ? 0.2 : -0.2);
      return antlerGroup;
    }
    
    mooseGroup.add(createAntler(true));
    mooseGroup.add(createAntler(false));
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.05, 0.8, 6);
    const legs = [[-0.3, -0.4], [-0.3, 0.4], [0.3, -0.4], [0.3, 0.4]];
    legs.forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeometry, mooseMaterial);
      leg.position.set(x, -0.4, z);
      mooseGroup.add(leg);
    });

    mooseGroup.scale.set(0.8, 0.8, 0.8);
    return mooseGroup;
  }

  // Create player figure
  const playerGroup = new THREE.Group();

  // Body - made wider and more natural looking
  const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.0, 8);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x2F4F4F, // Dark winter jacket color
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.8;
  body.rotation.x = -Math.PI * 0.05; // Reduced lean forward
  playerGroup.add(body);

  // Add a jacket zipper detail
  const zipperGeometry = new THREE.BoxGeometry(0.02, 0.8, 0.1);
  const zipperMaterial = new THREE.MeshPhongMaterial({
    color: 0x696969,
    flatShading: true
  });
  const zipper = new THREE.Mesh(zipperGeometry, zipperMaterial);
  zipper.position.set(0, 0.8, 0.25);
  body.add(zipper);

  // Head - made more oval and natural
  const headGeometry = new THREE.SphereGeometry(0.15, 12, 12);
  const headMaterial = new THREE.MeshPhongMaterial({
    color: 0xE0C8A0, // Warmer skin tone
    flatShading: true
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.5;
  head.position.z = -0.05; // Reduced forward position
  head.scale.set(1, 1.1, 1); // Slightly oval shape
  playerGroup.add(head);

  // Add simple face features
  const faceGroup = new THREE.Group();
  
  // Eyes
  const eyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const eyeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    flatShading: true
  });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.05, 0.02, 0.12);
  const rightEye = leftEye.clone();
  rightEye.position.set(0.05, 0.02, 0.12);
  faceGroup.add(leftEye);
  faceGroup.add(rightEye);

  // Simple smile
  const smileGeometry = new THREE.TorusGeometry(0.05, 0.01, 8, 8, Math.PI);
  const smileMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    flatShading: true
  });
  const smile = new THREE.Mesh(smileGeometry, smileMaterial);
  smile.position.set(0, -0.02, 0.12);
  smile.rotation.x = Math.PI / 2;
  faceGroup.add(smile);

  head.add(faceGroup);

  // Winter hat - made more stylish
  const hatGroup = new THREE.Group();
  const hatBaseGeometry = new THREE.CylinderGeometry(0.17, 0.17, 0.15, 8);
  const hatTopGeometry = new THREE.SphereGeometry(0.17, 8, 8);
  const hatMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B0000, // Dark red winter hat
    flatShading: true
  });
  
  const hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
  const hatTop = new THREE.Mesh(hatTopGeometry, hatMaterial);
  hatTop.position.y = 0.1;
  hatGroup.add(hatBase);
  hatGroup.add(hatTop);

  // Add hat pom-pom
  const pomPomGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const pomPomMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    flatShading: true
  });
  const pomPom = new THREE.Mesh(pomPomGeometry, pomPomMaterial);
  pomPom.position.y = 0.25;
  hatGroup.add(pomPom);

  hatGroup.position.set(0, 1.7, -0.05);
  playerGroup.add(hatGroup);

  // Arms - made more natural with shoulders
  const armGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.6, 8);
  const armMaterial = new THREE.MeshPhongMaterial({
    color: 0x2F4F4F,
    flatShading: true
  });

  // Right arm (throwing arm) with better positioning
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(0.35, 1.2, 0);
  rightArm.rotation.z = -Math.PI * 0.15;
  rightArm.rotation.x = Math.PI * 0.2;
  playerGroup.add(rightArm);

  // Left arm with better positioning
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-0.35, 1.2, 0);
  leftArm.rotation.z = Math.PI * 0.3;
  leftArm.rotation.x = -Math.PI * 0.1;
  playerGroup.add(leftArm);

  // Legs - made more natural with better stance
  const legGeometry = new THREE.CylinderGeometry(0.09, 0.07, 0.8, 8);
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

  // Create canvas for disc texture
  const discTextureCanvas = document.createElement('canvas');
  discTextureCanvas.width = 512;
  discTextureCanvas.height = 512;
  const discCtx = discTextureCanvas.getContext('2d');

  // Function to create disc texture with logo and color
  function createDiscTexture(color: string) {
    if (discCtx) {
      // Clear canvas
      discCtx.clearRect(0, 0, 512, 512);
      
      // Fill background with disc color
      discCtx.fillStyle = color;
      discCtx.fillRect(0, 0, 512, 512);
      
      // Add logo
      discCtx.save();
      discCtx.translate(256, 256);
      discCtx.fillStyle = 'white';
      discCtx.font = 'bold 72px Arial';
      discCtx.textAlign = 'center';
      discCtx.textBaseline = 'middle';
      discCtx.fillText('ADG', 0, 0);
      
      // Add flight numbers
      discCtx.font = '36px Arial';
      discCtx.fillText('7 | 5 | -1 | 2', 0, 60);
      discCtx.restore();
    }
    return new THREE.CanvasTexture(discTextureCanvas);
  }

  // Array of disc colors
  const discColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEEAD', // Yellow
    '#D4A5A5', // Pink
    '#9B59B6'  // Purple
  ];

  let currentDiscTexture: THREE.CanvasTexture;
  let currentDiscColor = discColors[0];

  // Create initial disc texture
  currentDiscTexture = createDiscTexture(currentDiscColor);

  const discMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    map: currentDiscTexture,
    color: 0xFFFFFF,
    shininess: 30,
    transparent: true,
    opacity: 0.9
  });

  const disc: THREE.Mesh = new THREE.Mesh(discGeometry, discMaterial);
  disc.castShadow = true;

  // Set initial disc angle
  disc.rotation.x = Math.PI / 6; // Slight upward angle for hyzer
  scene.add(disc);

  // Add "ADG" text written in snow
  const fontLoader = new FontLoader();
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font: Font) => {
    const textGeometry = new TextGeometry('ADG', {
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
  const chainLength = 1.4; // Increased length for more slack
  const chainSegments = 12;
  const chains: THREE.Mesh[][] = [];
  const chainPhysics: { velocity: number; angle: number; }[][] = [];

  // Create chain segments with initial slack
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
      
      // Calculate position with natural curve
      const progress = j / (chainSegments - 1);
      const slack = Math.sin(progress * Math.PI) * 0.2; // Add natural curve
      const targetRadius = chainRadius * (1 - Math.pow(progress, 1.5)); // More gradual curve toward pole
      
      // Position with slack
      const yOffset = j * segmentHeight;
      chainSegment.position.set(
        Math.cos(angle) * (targetRadius + slack),
        4.0 - yOffset - (segmentHeight / 2),
        Math.sin(angle) * (targetRadius + slack)
      );
      
      chainSegment.castShadow = true;
      
      // Store initial physics state with some random variation
      chainPhysicsArray.push({
        velocity: 0,
        angle: (Math.random() - 0.5) * 0.1 // Small random initial angle
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

  // Add flight path indicator
  const flightPathPoints = [];
  const flightPathCurve = new THREE.CubicBezierCurve3(
    initialDiscPosition,
    new THREE.Vector3(-2, 5, 0),
    new THREE.Vector3(5, 5, 0),
    targetPosition
  );
  for (let t = 0; t <= 1; t += 0.01) {
    flightPathPoints.push(flightPathCurve.getPoint(t));
  }
  const flightPathGeometry = new THREE.BufferGeometry().setFromPoints(flightPathPoints);
  const flightPathMaterial = new THREE.LineBasicMaterial({
    color: 0x4299E1,
    transparent: true,
    opacity: 0.3,
    linewidth: 1
  });
  const flightPath = new THREE.Line(flightPathGeometry, flightPathMaterial);
  scene.add(flightPath);

  // Add mandatory passage (mando)
  const mandoGroup = new THREE.Group();
  const mandoPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
  const mandoPoleMaterial = new THREE.MeshPhongMaterial({
    color: 0x4B2F1D,
    flatShading: true
  });
  const mandoPole = new THREE.Mesh(mandoPoleGeometry, mandoPoleMaterial);
  mandoPole.position.y = 1.5;
  mandoGroup.add(mandoPole);

  // Add mando arrow
  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(0, 0);
  arrowShape.lineTo(0.5, -0.25);
  arrowShape.lineTo(0.5, -0.1);
  arrowShape.lineTo(1.0, -0.1);
  arrowShape.lineTo(1.0, 0.1);
  arrowShape.lineTo(0.5, 0.1);
  arrowShape.lineTo(0.5, 0.25);
  arrowShape.lineTo(0, 0);

  const arrowGeometry = new THREE.ShapeGeometry(arrowShape);
  const arrowMaterial = new THREE.MeshPhongMaterial({
    color: 0xFF4500,
    side: THREE.DoubleSide
  });
  const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
  arrow.position.set(-0.5, 2.5, 0);
  arrow.scale.set(0.5, 0.5, 0.5);
  mandoGroup.add(arrow);

  mandoGroup.position.set(-5, 0, 2);
  scene.add(mandoGroup);

  // Add a single moose to the scene
  const moose = createMoose();
  // Position the moose away from the player (player is at -10, 0, -0.5)
  // Place moose in a random position in the back half of the course
  const mooseX = Math.random() * 15 + 5; // Random position between x=5 and x=20
  const mooseZ = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10 + 5); // Random position at least 5 units away in z
  moose.position.set(mooseX, 0.4, mooseZ);
  // Rotate moose to face a random direction
  moose.rotation.y = Math.random() * Math.PI * 2;
  scene.add(moose);

  // Add mouse interaction variables
  let mouseX = 0;
  let mouseY = 0;
  let targetCameraAngle = 0;
  let currentCameraAngle = 0;
  let isAnimationComplete = false;

  // Add mouse move handler
  const handleMouseMove = (event: MouseEvent): void => {
    if (!isAnimationComplete) return;
    
    // Calculate normalized mouse position (-1 to 1)
    const rect = container.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouseY = ((event.clientY - rect.top) / container.clientHeight) * 2 - 1;
    
    // Map mouse X position to camera angle around basket
    targetCameraAngle = mouseX * Math.PI * 0.5; // +/- 90 degrees
  };
  container.addEventListener('mousemove', handleMouseMove);

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

      // Prevent intersection with pole by adjusting z position if too close to center
      const distanceToCenter = new THREE.Vector2(disc.position.x - 10, disc.position.z).length();
      if (distanceToCenter < 0.3 && disc.position.y > 2.8) { // If too close to pole
        // Push the disc to either side based on its current trajectory
        disc.position.z += disc.position.z >= 0 ? 0.3 : -0.3;
      }

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

      // Update flight path visibility
      flightPath.material.opacity = Math.max(0, 0.3 - progress * 0.5);
      
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
      
      // Check for chain collisions and basket boundaries
      const distanceToCenter = new THREE.Vector2(disc.position.x - 10, disc.position.z).length();
      const heightInBasket = disc.position.y - 2.8;
      
      // Keep disc within basket boundaries
      const basketTopRadius = 0.8;
      const basketBottomRadius = 0.6;
      const discRadius = 0.5;
      const maxAllowedRadius = basketBottomRadius - discRadius * 0.8; // Slightly less than disc radius to prevent overhang
      
      if (distanceToCenter > maxAllowedRadius && heightInBasket < 1.2) {
        // Calculate angle to basket center
        const angle = Math.atan2(disc.position.z, disc.position.x - 10);
        
        // Push disc back inside basket bounds
        disc.position.x = 10 + Math.cos(angle) * maxAllowedRadius;
        disc.position.z = Math.sin(angle) * maxAllowedRadius;
        
        // Dampen velocity to prevent bouncing
        discVelocity.multiplyScalar(0.5);
      }
      
      // Prevent intersection with pole
      if (distanceToCenter < 0.3 && heightInBasket > 0) {
        // Push the disc away from the pole
        const angle = Math.atan2(disc.position.z, disc.position.x - 10);
        disc.position.x = 10 + Math.cos(angle) * 0.3;
        disc.position.z = Math.sin(angle) * 0.3;
        
        // Calculate reflection manually
        const normal = new THREE.Vector2(Math.cos(angle), Math.sin(angle));
        const velocity2D = new THREE.Vector2(discVelocity.x, discVelocity.z);
        
        // Manual reflection calculation: v - 2(v·n)n
        const dot = velocity2D.dot(normal);
        const reflection = velocity2D.clone().sub(normal.multiplyScalar(2 * dot));
        reflection.multiplyScalar(0.5); // Add energy loss
        
        discVelocity.x = reflection.x;
        discVelocity.z = reflection.y;
      }
      
      // Chain collision handling
      if (distanceToCenter < chainRadius + 0.5 && heightInBasket > 0 && heightInBasket < 1.4) {
        if (discMadeIt) {
          // Successful shot - guide disc into basket
          disc.position.y = Math.max(2.9, disc.position.y);
          discVelocity.multiplyScalar(0.7); // Slow down from chain contact
          discVelocity.y *= 0.5; // Extra vertical damping
          
          // Guide disc toward center more strongly
          const toCenter = new THREE.Vector2(10 - disc.position.x, -disc.position.z);
          toCenter.normalize().multiplyScalar(0.2); // Increased centering force
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
      
      // Check for ground/basket bottom collision with improved settling
      if (disc.position.y < 2.9 && distanceToCenter < maxAllowedRadius) {
        disc.position.y = 2.9; // Rest in basket
        
        // Gradually move disc toward basket center when settling
        const toCenter = new THREE.Vector2(10 - disc.position.x, -disc.position.z);
        if (toCenter.length() > 0.1) { // Only center if not already very close
          toCenter.normalize().multiplyScalar(0.1);
          disc.position.x += toCenter.x;
          disc.position.z += toCenter.y;
        } else {
          discVelocity.set(0, 0, 0);
          isLanding = false;
          chainsAnimating = true;
          chainAnimationTime = 0;
        }
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
          const progress = segmentIndex / (chainSegments - 1);
          
          // Softer spring forces for more natural movement
          const springForce = -0.15 * physics.angle; // Reduced spring force
          const dampingForce = -0.1 * physics.velocity; // Reduced damping
          const impactForce = impact * Math.exp(-segmentIndex * 0.15) * 
            Math.exp(-chainAnimationTime * 1.5) * 
            Math.sin(chainAnimationTime * 12 + segmentIndex * 0.4);
          
          // Add slight constant motion for chain sway
          const swayForce = Math.sin(Date.now() * 0.001 + chainIndex * 0.5) * 0.0001;
          
          physics.velocity += (springForce + dampingForce + impactForce + swayForce) * 0.016;
          physics.angle += physics.velocity * 0.016;
          
          // Allow more movement range
          const maxAngle = Math.PI / 3 * (1 - progress * 0.6); // Increased range of motion
          physics.angle = Math.max(Math.min(physics.angle, maxAngle), -maxAngle);
          
          const targetRadius = chainRadius * (1 - Math.pow(progress, 1.5));
          const slack = Math.sin(progress * Math.PI) * 0.2;
          const currentRadius = targetRadius + slack + Math.sin(physics.angle) * 0.3;
          
          if (segmentIndex === 0) {
            // First segment stays attached to rim
            segment.position.x = Math.cos(baseAngle) * chainRadius;
            segment.position.y = 4.0 - (chainLength / chainSegments / 2);
            segment.position.z = Math.sin(baseAngle) * chainRadius;
          } else {
            const prevSegment = chain[segmentIndex - 1];
            const poleInfluence = Math.pow(progress, 1.2) * 0.7; // More gradual pole influence
            
            // Add some natural droop
            const droopFactor = Math.sin(progress * Math.PI) * 0.1;
            
            segment.position.x = prevSegment.position.x * (1 - poleInfluence) + droopFactor * Math.cos(baseAngle);
            segment.position.y = prevSegment.position.y - (chainLength / chainSegments) * (1 + droopFactor);
            segment.position.z = prevSegment.position.z * (1 - poleInfluence) + droopFactor * Math.sin(baseAngle);
            
            // More natural chain segment rotation
            const towardsPole = Math.atan2(segment.position.z, segment.position.x);
            segment.rotation.x = Math.sin(physics.angle) * 0.3 * (1 - progress);
            segment.rotation.z = Math.cos(physics.angle) * 0.3 * (1 - progress);
            segment.rotation.y = towardsPole + Math.PI / 2;
          }
        });
      });
      
      if (chainAnimationTime >= chainDuration) {
        chainsAnimating = false;
      }
    }

    // After landing sequence is complete
    if (!isAnimating && !isLanding) {
      isAnimationComplete = true;
      
      // Smoothly interpolate camera angle
      currentCameraAngle += (targetCameraAngle - currentCameraAngle) * 0.05;
      
      // Calculate camera position based on angle
      const cameraDistance = 8;
      const cameraHeight = 5 - mouseY * 2; // Adjust height based on mouse Y
      camera.position.x = 10 + Math.cos(currentCameraAngle) * cameraDistance;
      camera.position.z = Math.sin(currentCameraAngle) * cameraDistance;
      camera.position.y = cameraHeight;
      
      // Always look at the basket
      camera.lookAt(new THREE.Vector3(10, 2.8, 0));
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
    container.removeEventListener('mousemove', handleMouseMove);
    renderer.dispose();
  };
}