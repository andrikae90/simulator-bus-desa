import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x87ceeb);
scene.fog=new THREE.Fog(0x87ceeb,80,280);

const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,500);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdff4ff,0x52733d,2.2));
const sun=new THREE.DirectionalLight(0xffffff,2.2);
sun.position.set(-60,100,40);sun.castShadow=true;scene.add(sun);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({color:0x69a84f}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

function box(w,h,d,color,x,y,z){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));
 m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
}
function tree(x,z){
 const trunk=box(1.2,4,1.2,0x70452a,x,2,z);
 const crown=new THREE.Mesh(new THREE.SphereGeometry(4,10,10),new THREE.MeshStandardMaterial({color:0x237a35}));
 crown.position.set(x,6,z);crown.castShadow=true;scene.add(crown);
}
function house(x,z,rot=0){
 const base=box(8,4.5,7,0xe8d1a8,x,2.25,z);base.rotation.y=rot;
 const roof=new THREE.Mesh(new THREE.ConeGeometry(6.3,3.5,4),new THREE.MeshStandardMaterial({color:0x9b3b2e}));
 roof.position.set(x,6.2,z);roof.rotation.y=Math.PI/4+rot;roof.castShadow=true;scene.add(roof);
 box(1.6,2.5,.3,0x56351f,x,1.3,z-3.55);
}
function field(x,z,w,d){
 const f=box(w,.08,d,0x7eb84b,x,.04,z);
 for(let i=-w/2+2;i<w/2;i+=3) box(.12,.25,d-.5,0x4e8e37,x+i,.2,z);
}
for(let z=-240;z<250;z+=18){
 box(14,.12,16,0x5b5b55,0,.08,z);
}
for(let z=-230;z<240;z+=25){
 tree(-18,z+5);tree(18,z-6);
 if(Math.floor((z+230)/25)%2===0){house(-30,z,0);field(34,z,35,20)}
 else {house(29,z,0);field(-34,z,35,20)}
}

// bus - bus-simulator style 3D model
const bus=new THREE.Group();
bus.position.set(0,2.27,35);

const redMat=new THREE.MeshStandardMaterial({color:0xc92f2f,roughness:.58,metalness:.05});
const redDark=new THREE.MeshStandardMaterial({color:0x8f2020,roughness:.62});
const yellowMat=new THREE.MeshStandardMaterial({color:0xf2c62d,roughness:.55});
const blackMat=new THREE.MeshStandardMaterial({color:0x151515,roughness:.82});
const rubberMat=new THREE.MeshStandardMaterial({color:0x111111,roughness:.9});
const chromeMat=new THREE.MeshStandardMaterial({color:0xb8c0c4,metalness:.75,roughness:.25});
const glassMat=new THREE.MeshStandardMaterial({color:0x79b8c7,metalness:.15,roughness:.18,transparent:true,opacity:.82});

function busBox(w,h,d,mat,pos,bevel=.08){
 const g=new THREE.BoxGeometry(w,h,d);
 const m=new THREE.Mesh(g,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;bus.add(m);return m;
}

// Main rounded body
const bodyShape=new THREE.Shape();
bodyShape.moveTo(-2.48,-1.35);
bodyShape.lineTo(2.48,-1.35);
bodyShape.lineTo(2.48,.95);
bodyShape.quadraticCurveTo(2.48,1.48,1.95,1.55);
bodyShape.lineTo(-1.85,1.55);
bodyShape.quadraticCurveTo(-2.38,1.48,-2.48,.92);
bodyShape.closePath();
const bodyGeo=new THREE.ExtrudeGeometry(bodyShape,{depth:8.55,bevelEnabled:true,bevelSegments:3,bevelSize:.11,bevelThickness:.11});
bodyGeo.center();
const body=new THREE.Mesh(bodyGeo,redMat);body.castShadow=true;body.receiveShadow=true;bus.add(body);

// Lower yellow band and black chassis
busBox(5.02,.58,8.65,yellowMat,[0,-1.05,0],.05);
busBox(4.72,.28,8.35,blackMat,[0,-1.43,0],.03);

// Front windshield: correctly placed on the front face
const windshield=new THREE.Mesh(new THREE.PlaneGeometry(4.0,1.25),glassMat);
windshield.position.set(0,.48,-4.34);windshield.rotation.x=0;bus.add(windshield);
// center divider
busBox(.10,1.30,.05,blackMat,[0,.48,-4.39],.01);

// Rear glass
const rearGlass=new THREE.Mesh(new THREE.PlaneGeometry(4.0,1.18),glassMat);
rearGlass.position.set(0,.48,4.34);rearGlass.rotation.y=Math.PI;bus.add(rearGlass);

// Side windows, with front/rear pillars
for(const side of [-1,1]){
  for(const z of [-3.15,-1.05,1.05,3.05]){
    const win=new THREE.Mesh(new THREE.PlaneGeometry(1.62,1.12),glassMat);
    win.position.set(side*2.53,.48,z);
    win.rotation.y=side<0?Math.PI/2:-Math.PI/2;
    bus.add(win);
  }
}

// Front lower panel and grille
busBox(4.45,.62,.16,redDark,[0,-.78,-4.42],.04);
busBox(2.2,.20,.10,blackMat,[0,-.88,-4.53],.02);

// Headlights and tail lights
for(const x of [-1.55,1.55]){
  const head=new THREE.Mesh(new THREE.SphereGeometry(.27,16,10),new THREE.MeshStandardMaterial({color:0xfff1b0,emissive:0xffcc44,emissiveIntensity:.65}));
  head.position.set(x,-.55,-4.57);head.scale.set(1,.75,.35);bus.add(head);
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.22,14,10),new THREE.MeshStandardMaterial({color:0xe31d1d,emissive:0x550000,emissiveIntensity:.5}));
  tail.position.set(x,-.55,4.57);tail.scale.set(1,.8,.35);bus.add(tail);
}

// Bumpers
busBox(4.65,.30,.28,blackMat,[0,-1.30,-4.58],.05);
busBox(4.65,.30,.28,blackMat,[0,-1.30,4.58],.05);

// Wheels with real tires + rims + hubs
for(const x of [-2.58,2.58]) for(const z of [-2.65,2.65]){
  const tire=new THREE.Mesh(new THREE.CylinderGeometry(.84,.84,.48,32),rubberMat);
  tire.rotation.z=Math.PI/2;tire.position.set(x,-1.45,z);tire.castShadow=true;bus.add(tire);
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(.47,.47,.51,24),chromeMat);
  rim.rotation.z=Math.PI/2;rim.position.set(x,-1.45,z);rim.castShadow=true;bus.add(rim);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.54,16),blackMat);
  hub.rotation.z=Math.PI/2;hub.position.set(x,-1.45,z);bus.add(hub);
}

// Wheel arches, visually connecting body to tires
for(const z of [-2.65,2.65]){
  const arch=new THREE.Mesh(new THREE.TorusGeometry(.91,.11,8,24,Math.PI),redDark);
  arch.rotation.set(Math.PI/2,0,0);arch.position.set(0,-.67,z);bus.add(arch);
}

// Doors with windows
for(const z of [-3.45,3.35]){
  busBox(1.05,1.85,.045,redDark,[2.50,.0,z],.02);
  const doorGlass=new THREE.Mesh(new THREE.PlaneGeometry(.72,.82),glassMat);
  doorGlass.position.set(2.53,.62,z);doorGlass.rotation.y=-Math.PI/2;bus.add(doorGlass);
  busBox(.10,.10,.10,chromeMat,[2.60,-.15,z],.01);
}

// Mirrors and arms at the front
for(const x of [-2.78,2.78]){
  const arm=busBox(.12,.12,.65,blackMat,[x,.72,-4.12],.03);
  arm.rotation.y=x<0?.18:-.18;
  const mirror=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8),blackMat);
  mirror.position.set(x,.92,-4.35);mirror.scale.set(.75,1,.45);bus.add(mirror);
}

// Roof cap and destination/sign panel
busBox(4.72,.18,8.25,redDark,[0,1.58,0],.04);
busBox(2.9,.38,.12,blackMat,[0,1.18,-4.48],.02);

scene.add(bus);

let speed=0,steer=0,gas=false,brake=false,left=false,right=false;
const maxSpeed=.75;
function bind(id,set){const b=document.getElementById(id);['pointerdown','touchstart'].forEach(e=>b.addEventListener(e,ev=>{ev.preventDefault();set(true)}));['pointerup','pointercancel','pointerleave','touchend'].forEach(e=>b.addEventListener(e,ev=>{ev.preventDefault();set(false)}))}
bind('gas',v=>gas=v);bind('brake',v=>brake=v);bind('left',v=>left=v);bind('right',v=>right=v);
addEventListener('keydown',e=>{if(e.key==='ArrowUp')gas=true;if(e.key==='ArrowDown')brake=true;if(e.key==='ArrowLeft')left=true;if(e.key==='ArrowRight')right=true});
addEventListener('keyup',e=>{if(e.key==='ArrowUp')gas=false;if(e.key==='ArrowDown')brake=false;if(e.key==='ArrowLeft')left=false;if(e.key==='ArrowRight')right=false});

const speedText=document.getElementById('speed');
function animate(){
 requestAnimationFrame(animate);
 if(gas)speed=Math.min(maxSpeed,speed+.012);else speed*=.985;
 if(brake)speed*=.94;
 const targetSteer=(right?1:0)-(left?1:0);
 steer+=(targetSteer-steer)*.12;
 bus.rotation.y-=steer*speed*.055;
 const dir=new THREE.Vector3(0,0,-1).applyQuaternion(bus.quaternion);
 bus.position.addScaledVector(dir,speed);
 // keep bus near the road
 bus.position.x=THREE.MathUtils.clamp(bus.position.x,-5,5);
 const target=new THREE.Vector3(bus.position.x,6.5,bus.position.z+18);
 camera.position.lerp(target,0.08);
 camera.lookAt(bus.position.x,1.2,bus.position.z-5);
 speedText.textContent=Math.round(speed*120)+' km/jam';
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
