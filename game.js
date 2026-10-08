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

// bus - detailed lightweight model
const bus=new THREE.Group();
bus.position.set(0,2.58,35);

// Main body: extruded side profile with a slightly sloped front and rounded/beveled edges
const bodyShape=new THREE.Shape();
bodyShape.moveTo(-2.5,-1.45);
bodyShape.lineTo(2.5,-1.45);
bodyShape.lineTo(2.5,1.05);
bodyShape.lineTo(2.15,1.55);
bodyShape.lineTo(-1.95,1.55);
bodyShape.lineTo(-2.5,1.15);
bodyShape.closePath();
const bodyGeo=new THREE.ExtrudeGeometry(bodyShape,{depth:8.6,bevelEnabled:true,bevelSegments:2,bevelSize:.12,bevelThickness:.12});
bodyGeo.center();
const body=new THREE.Mesh(bodyGeo,new THREE.MeshStandardMaterial({color:0xd83a32,roughness:.62}));
body.castShadow=true;body.receiveShadow=true;bus.add(body);

// Yellow lower skirt
const skirt=new THREE.Mesh(new THREE.BoxGeometry(5.0,.72,8.8),new THREE.MeshStandardMaterial({color:0xf0c72e,roughness:.6}));
skirt.position.y=-1.15;skirt.castShadow=true;bus.add(skirt);

// Windows, front and rear glass
const glassMat=new THREE.MeshStandardMaterial({color:0x9edcf0,metalness:.1,roughness:.2});
const frontGlass=new THREE.Mesh(new THREE.PlaneGeometry(3.8,1.25),glassMat);
frontGlass.position.set(-2.05,.45,-4.36);frontGlass.rotation.y=-Math.PI/2;frontGlass.rotation.z=.12;bus.add(frontGlass);
const rearGlass=new THREE.Mesh(new THREE.PlaneGeometry(3.8,1.25),glassMat);
rearGlass.position.set(2.05,.45,4.36);rearGlass.rotation.y=Math.PI/2;bus.add(rearGlass);

// Side windows
for(const z of [-3.05,-1.05,1.05,3.05]){
  for(const x of [-2.53,2.53]){
    const win=new THREE.Mesh(new THREE.PlaneGeometry(1.55,1.12),glassMat);
    win.position.set(x,.48,z);
    win.rotation.y=x<0?-Math.PI/2:Math.PI/2;
    bus.add(win);
  }
}

// Wheels: true cylinders, axis across the vehicle width
const tireMat=new THREE.MeshStandardMaterial({color:0x171717,roughness:.85});
const rimMat=new THREE.MeshStandardMaterial({color:0xbfc5c9,metalness:.65,roughness:.3});
for(const x of [-2.62,2.62]) for(const z of [-2.65,2.65]){
  const tire=new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,.42,24),tireMat);
  tire.rotation.z=Math.PI/2;
  tire.position.set(x,-1.72,z);
  tire.castShadow=true;bus.add(tire);
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.45,20),rimMat);
  rim.rotation.z=Math.PI/2;
  rim.position.set(x,-1.72,z);
  rim.castShadow=true;bus.add(rim);
}

// Bumpers, headlights, tail lights
const bumperMat=new THREE.MeshStandardMaterial({color:0x242424,roughness:.55});
const bumperFront=new THREE.Mesh(new THREE.BoxGeometry(4.7,.35,.25),bumperMat);
bumperFront.position.set(0,-1.35,-4.55);bus.add(bumperFront);
const bumperRear=bumperFront.clone();bumperRear.position.z=4.55;bus.add(bumperRear);
const lampMat=new THREE.MeshStandardMaterial({color:0xfff3c4,emissive:0x554400,emissiveIntensity:.45});
for(const x of [-1.55,1.55]){
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(.24,12,8),lampMat);
  lamp.position.set(x,-.55,-4.58);bus.add(lamp);
  const tail=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),new THREE.MeshStandardMaterial({color:0xff2020,emissive:0x440000,emissiveIntensity:.35}));
  tail.position.set(x,-.55,4.58);bus.add(tail);
}

// Mirrors
const mirrorMat=new THREE.MeshStandardMaterial({color:0x202020,roughness:.5});
for(const x of [-2.85,2.85]){
  const arm=new THREE.Mesh(new THREE.BoxGeometry(.16,.16,.7),mirrorMat);
  arm.position.set(x,.7,x<0?-4.0:4.0);arm.rotation.y=x<0?.18:-.18;bus.add(arm);
  const mirror=new THREE.Mesh(new THREE.SphereGeometry(.18,10,8),mirrorMat);
  mirror.position.set(x,.9,x<0?-4.3:4.3);bus.add(mirror);
}

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
 const target=new THREE.Vector3(bus.position.x,5,bus.position.z+13).add(new THREE.Vector3(0,0,0));
 camera.position.lerp(target,0.08);
 camera.lookAt(bus.position.x,2,bus.position.z-10);
 speedText.textContent=Math.round(speed*120)+' km/jam';
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
