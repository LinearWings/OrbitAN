import * as THREE from "three";

export interface Clock3D {
  group: THREE.Group;
  hourHand: THREE.Mesh;
  minuteHand: THREE.Mesh;
  secondHand: THREE.Mesh;
  pivot: THREE.Group;
}

function createDialFace(): THREE.Mesh {
  // Concave dish — front hemisphere of sphere, slightly pushed inward
  const geometry = new THREE.SphereGeometry(3.0, 80, 64, 0, Math.PI * 2, 0, Math.PI / 2.2);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0A0D14"),
    metalness: 0.85,
    roughness: 0.25,
    emissive: new THREE.Color(0.02, 0.04, 0.08),
  });
  const mesh = new THREE.Mesh(geometry, material);
  // Push slightly back to create concave dish effect
  mesh.position.z = -0.15;
  return mesh;
}

function createTickMarks(): THREE.Group {
  const group = new THREE.Group();

  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const isQuarter = i % 15 === 0;

    const length = isQuarter ? 0.35 : isMajor ? 0.25 : 0.12;
    const thickness = isMajor ? 0.015 : 0.008;
    const r = 2.75;

    const geometry = new THREE.BoxGeometry(thickness, thickness, length);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3B82F6"),
      emissive: isMajor
        ? new THREE.Color(0.15, 0.25, 0.5)
        : new THREE.Color(0.06, 0.1, 0.2),
      metalness: 0.2,
      roughness: 0.6,
    });

    const tick = new THREE.Mesh(geometry, material);
    tick.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    // Rotate to point radial
    tick.rotation.z = angle;
    group.add(tick);
  }

  return group;
}

function createNumeralSprites(): THREE.Group {
  const group = new THREE.Group();
  const numerals = ["12", "3", "6", "9"];
  const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

  for (let i = 0; i < 4; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.font = "600 72px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(numerals[i], 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    const r = 2.35;
    const angle = angles[i];
    sprite.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.1);
    sprite.scale.set(0.55, 0.55, 1);
    sprite.rotation.z = -0.14; // slight inward tilt
    group.add(sprite);
  }

  return group;
}

function createHands(): { hour: THREE.Mesh; minute: THREE.Mesh; second: THREE.Mesh } {
  const handMaterial = (emissiveColor: string, emissiveIntensity: number) =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFFFFF"),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity,
      metalness: 0.6,
      roughness: 0.3,
    });

  // Hour hand
  const hourGeom = new THREE.BoxGeometry(0.06, 1.1, 0.04);
  const hour = new THREE.Mesh(hourGeom, handMaterial("#aaccff", 0.4));
  hour.position.y = 1.1 / 2;
  hour.geometry.translate(0, 1.1 / 2, 0);

  // Minute hand
  const minuteGeom = new THREE.BoxGeometry(0.04, 1.8, 0.03);
  const minute = new THREE.Mesh(minuteGeom, handMaterial("#3B82F6", 0.6));
  minute.position.y = 1.8 / 2;
  minute.geometry.translate(0, 1.8 / 2, 0);

  // Second hand
  const secondGeom = new THREE.BoxGeometry(0.015, 2.1, 0.02);
  const second = new THREE.Mesh(secondGeom, handMaterial("#F59E0B", 0.8));
  second.position.y = 2.1 / 2;
  second.geometry.translate(0, 2.1 / 2, 0);

  return { hour, minute, second };
}

function createCenterCap(): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFFFFF"),
    emissive: new THREE.Color("#FFFFFF"),
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
  });
  const cap = new THREE.Mesh(geometry, material);
  cap.rotation.x = Math.PI / 2;
  return cap;
}

function createGlassCover(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(3.2, 80, 64, 0, Math.PI * 2, 0, Math.PI / 2);
  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0.05,
    metalness: 0,
    clearcoat: 0.4,
    ior: 1.5,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const glass = new THREE.Mesh(geometry, material);
  glass.position.z = 0.1;
  return glass;
}

export function createClockFace(scene: THREE.Scene): Clock3D {
  const group = new THREE.Group();
  const pivot = new THREE.Group();

  const dial = createDialFace();
  const ticks = createTickMarks();
  const numerals = createNumeralSprites();
  const hands = createHands();
  const cap = createCenterCap();

  // Assemble hands into pivot
  pivot.add(hands.hour);
  pivot.add(hands.minute);
  pivot.add(hands.second);

  group.add(dial);
  group.add(ticks);
  group.add(numerals);
  group.add(pivot);
  group.add(cap);

  // Position group so dial face is at origin, facing +Z
  group.position.z = 0.5;

  scene.add(group);

  // Glass cover is separate, slightly in front
  const glass = createGlassCover();
  glass.position.z = 0.5;
  scene.add(glass);
  group.add(glass);

  return {
    group,
    hourHand: hands.hour,
    minuteHand: hands.minute,
    secondHand: hands.second,
    pivot,
  };
}

export function updateClockFace(clock: Clock3D, time: number) {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const secondAngle = ((seconds + ms / 1000) / 60) * Math.PI * 2;
  const minuteAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2;
  const hourAngle = ((hours + minutes / 60) / 12) * Math.PI * 2;

  clock.secondHand.rotation.z = -secondAngle;
  clock.minuteHand.rotation.z = -minuteAngle;
  clock.hourHand.rotation.z = -hourAngle;
}

export function disposeClockFace(clock: Clock3D) {
  clock.group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material?.dispose();
      }
    }
  });
  clock.group.removeFromParent();
}
