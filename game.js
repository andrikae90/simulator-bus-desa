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

function worldBox(w,h,d,color,x,y,z){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color}));
 m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
}
function tree(x,z){
 const trunk=worldBox(1.2,4,1.2,0x70452a,x,2,z);
 const crown=new THREE.Mesh(new THREE.SphereGeometry(4,10,10),new THREE.MeshStandardMaterial({color:0x237a35}));
 crown.position.set(x,6,z);crown.castShadow=true;scene.add(crown);
}
function house(x,z,rot=0){
 const base=worldBox(8,4.5,7,0xe8d1a8,x,2.25,z);base.rotation.y=rot;
 const roof=new THREE.Mesh(new THREE.ConeGeometry(6.3,3.5,4),new THREE.MeshStandardMaterial({color:0x9b3b2e}));
 roof.position.set(x,6.2,z);roof.rotation.y=Math.PI/4+rot;roof.castShadow=true;scene.add(roof);
 worldBox(1.6,2.5,.3,0x56351f,x,1.3,z-3.55);
}
function field(x,z,w,d){
 const f=worldBox(w,.08,d,0x7eb84b,x,.04,z);
 for(let i=-w/2+2;i<w/2;i+=3) worldBox(.12,.25,d-.5,0x4e8e37,x+i,.2,z);
}
for(let z=-240;z<250;z+=18){
 worldBox(14,.12,18,0x5b5b55,0,.08,z);
}
for(let z=-230;z<240;z+=25){
 tree(-18,z+5);tree(18,z-6);
 if(Math.floor((z+230)/25)%2===0){house(-30,z,0);field(34,z,35,20)}
 else {house(29,z,0);field(-34,z,35,20)}
}

// bus - low-poly bus simulator model
const bus=new THREE.Group();
bus.position.set(0,2.10,35);

const red=new THREE.MeshStandardMaterial({color:0xc62828,roughness:.5});
const red2=new THREE.MeshStandardMaterial({color:0x9e1f1f,roughness:.55});
const yellow=new THREE.MeshStandardMaterial({color:0xf3c623,roughness:.5});
const dark=new THREE.MeshStandardMaterial({color:0x111315,roughness:.75});
const glass=new THREE.MeshStandardMaterial({color:0x163b49,roughness:.18,metalness:.2});
const chrome=new THREE.MeshStandardMaterial({color:0xb9c1c5,metalness:.7,roughness:.25});
const white=new THREE.MeshStandardMaterial({color:0xf3f0df,roughness:.3});
const accent=new THREE.MeshStandardMaterial({color:0xffd229,roughness:.38});
const plate=new THREE.MeshStandardMaterial({color:0xf5f5f5,roughness:.55});

function part(geo,mat,x,y,z,rx=0,ry=0,rz=0){
 const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;bus.add(m);return m;
}
function box(w,h,d,mat,x,y,z){return part(new THREE.BoxGeometry(w,h,d),mat,x,y,z)}

// Long lower chassis and rounded upper silhouette
box(5.05,1.05,9.05,red2,0,-.35,0);
box(5.12,.52,9.0,yellow,0,-1.02,0);
box(4.78,.26,8.85,dark,0,-1.34,0);

const upperShape=new THREE.Shape();
upperShape.moveTo(-2.48,-1.05);upperShape.lineTo(2.48,-1.05);
upperShape.lineTo(2.48,.65);upperShape.quadraticCurveTo(2.48,1.55,1.65,1.62);
upperShape.lineTo(-1.55,1.62);upperShape.quadraticCurveTo(-2.48,1.55,-2.48,.65);upperShape.closePath();
const upperGeo=new THREE.ExtrudeGeometry(upperShape,{depth:8.25,bevelEnabled:true,bevelSegments:4,bevelSize:.14,bevelThickness:.12});
upperGeo.center();
part(upperGeo,red,0,.72,0);

// Large rear window, clearly visible from follow camera
box(3.75,1.25,.10,glass,0,.88,4.18);
box(.09,1.18,.13,dark,0,.88,4.25);
// Rear lower grille and bumper
box(3.2,.20,.12,dark,0,-.42,4.22);
box(4.65,.28,.25,dark,0,-1.32,4.55);

// Rear destination display, tail lamps, grille and license plate
box(2.25,.38,.10,dark,0,1.58,4.20);
box(1.95,.20,.04,accent,0,1.60,4.27);
box(2.65,.42,.08,red2,0,-.90,4.25);
for(const x of [-1.85,1.85]){
 box(.48,.52,.12,red2,x,-.70,4.27);
 box(.30,.18,.06,white,x,-.60,4.35);
 box(.30,.18,.06,new THREE.MeshStandardMaterial({color:0xff2929,emissive:0x660000}),x,-.82,4.35);
}
box(.92,.30,.05,plate,0,-1.12,4.36);
box(.16,.08,.03,dark,0,-1.12,4.40);

// Re-add windows on top of the side strip so they remain visible
for(const side of [-1,1]) for(const z of [-3.05,-1.02,1.02,3.05]){
  const w=part(new THREE.BoxGeometry(.08,1.18,1.62),glass,side*2.66,.78,z);
}

// Clean side livery stripes running along the passenger body
for(const side of [-1,1]){
 box(.055,.16,7.55,accent,side*2.57,-.25,0);
 box(.06,.055,7.70,white,side*2.585,-.43,0);
 // small dark window pillars make each window read as a separate pane
 for(const z of [-2.03,0,2.03]){
  box(.07,1.20,.09,red2,side*2.69,.78,z);
 }
}

// Front windshield and lower front face
box(3.85,1.30,.10,glass,0,.78,-4.18);
box(.10,1.30,.13,dark,0,.78,-4.25);
box(4.45,.72,.20,red2,0,-.25,-4.22);
box(2.55,.18,.12,dark,0,-.55,-4.34);

// Front/rear lights
for(const x of [-1.55,1.55]){
 part(new THREE.SphereGeometry(.25,18,12),white,x,-.25,-4.38,0,0,0);
 part(new THREE.SphereGeometry(.20,16,10),new THREE.MeshStandardMaterial({color:0xe52222,emissive:0x550000,emissiveIntensity:.4}),x,-.25,4.38);
}

// Wheels, hubs and mudguards
for(const x of [-2.62,2.62]) for(const z of [-2.75,2.75]){
 const tire=part(new THREE.CylinderGeometry(.78,.78,.46,32),dark,x,-1.18,z,0,0,Math.PI/2);
 part(new THREE.CylinderGeometry(.43,.43,.49,24),chrome,x,-1.18,z,0,0,Math.PI/2);
 part(new THREE.CylinderGeometry(.14,.14,.52,16),dark,x,-1.18,z,0,0,Math.PI/2);
}
// simple fender strips above wheels
for(const z of [-2.75,2.75]) part(new THREE.TorusGeometry(.82,.10,8,28,Math.PI),red2,0,-.42,z,Math.PI/2,0,0);

// Doors on passenger side and driver side
for(const side of [-1,1]){
 for(const z of [-3.15,3.15]){
  box(.08,1.75,.95,red2,side*2.66,.05,z);
  box(.10,.75,.72,glass,side*2.72,.67,z);
  box(.12,.08,.08,chrome,side*2.78,-.05,z);
 }
}

// Mirrors, arms and roof cap
for(const x of [-2.82,2.82]){
 box(.12,.12,.62,dark,x,.92,-4.0);
 part(new THREE.SphereGeometry(.20,14,10),dark,x,1.08,-4.30,0,0,0);
}
box(4.72,.18,8.05,red2,0,2.30,0);
box(2.5,.34,.10,dark,0,1.42,-4.25);

// Front destination board, grille and mirrors with visible mirror glass
box(2.10,.34,.08,dark,0,1.62,-4.20);
box(1.75,.12,.035,accent,0,1.62,-4.25);
box(1.65,.32,.07,dark,0,-.83,-4.30);
for(let i=0;i<7;i++) box(.055,.22,.025,chrome,-.52+i*.17,-.83,-4.35);
for(const x of [-2.94,2.94]){
 part(new THREE.BoxGeometry(.08,.24,.32),glass,x,1.08,-4.36);
}

// Small roof air-conditioning unit for a coach-bus silhouette
box(1.45,.24,1.25,dark,0,2.48,.45);
box(1.18,.08,.95,chrome,0,2.63,.45);

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
 bus.position.x=THREE.MathUtils.clamp(bus.position.x,-4.4,4.4);
 const target=new THREE.Vector3(bus.position.x,6.5,bus.position.z+18);
 camera.position.lerp(target,0.08);
 camera.lookAt(bus.position.x,1.2,bus.position.z-5);
 speedText.textContent=Math.round(speed*120)+' km/jam';
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
