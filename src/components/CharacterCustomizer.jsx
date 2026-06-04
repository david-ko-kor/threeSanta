// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import '../styles/Customizer.css';

// const CharacterCustomizer = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const characterRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadedModelRef = useRef(null);

//   // 1. 4개 파츠의 역할에 맞게 상태 세팅 (기본값 전부 그레이)
//   const [santaConfig, setSantaConfig] = useState({
//     skin: '#A0A0A0',       // Cube028_1 (피부색)
//     clothes: '#A0A0A0',    // Cube028_2 (옷색깔)
//     beard: '#A0A0A0',      // Cube028_3 (수염부분)
//     eyesBelt: '#A0A0A0' ,   // Cube028_4 ( 벨트)
//     ear: '#A0A0A0'   ,    // Cube028_5 (귀)
//     belt: '#A0A0A0'    // Cube028_6 (벨트)
//   });

//   // ✨ 추가: 테스트용 모자 상태
//   const [selectedTestHat, setSelectedTestHat] = useState('none');
//   const currentTestHatRef = useRef(null);

//   // 공용 6가지 컬러 팔레트 구성
//   const colorPalette = ['#000000','#c8cf43', '#4A90E2', '#FF6B6B', '#50E3C2', '#fbceb1', '#9B51E0','#ffffff'];

//   // ✨ 테스트용 모자 옵션 (간단한 기하학적 모양)
//   const testHatOptions = [
//     { id: 'none', name: '❌ 없음', color: 0xFF0000 },
//     { id: 'cone', name: '🔴 원뿔 모자', color: 0xFF0000 },
//     { id: 'sphere', name: '🔵 구 모자', color: 0x4A90E2 },
//     { id: 'cylinder', name: '🟡 원기둥 모자', color: 0xFFD700 },
//     { id: 'pyramid', name: '🟢 피라미드 모자', color: 0x50E3C2 },
//     { id: 'box', name: '⬜ 박스 모자', color: 0x9B51E0 },
//   ];

//   // ===== THREE.js 씬 초기화 및 GLB 최초 1회 로드 =====
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const width = mountRef.current.clientWidth;
//     const height = mountRef.current.clientHeight;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xe8e8e8);

//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(0, 0.5, 4);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//     scene.add(ambientLight);

//     const character = new THREE.Group();
//     scene.add(character);

//     window.scene = scene;
//     window.THREE = THREE;

//     sceneRef.current = { scene, camera, renderer, character };
//     characterRef.current = character;
//     rendererRef.current = renderer;

//     // 산타 GLB 파일 로드
//     const loader = new GLTFLoader();
//     loader.load(
//       '/models/Santa.glb', 
//       (gltf) => {
//         const model = gltf.scene;

//         model.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//           }
//         });

//         model.scale.set(0.9, 1, 1);
//         model.position.y = -0.5;

//         character.add(model);
//         loadedModelRef.current = model;

//         // 로드 즉시 4단 매핑 규칙 적용
//         updateSantaCharacter(model, santaConfig);
//       },
//       undefined,
//       (error) => console.error('산타 GLB 캐릭터 로드 실패:', error)
//     );

//     // ===== 마우스 드래그 회전 조작 셋팅 =====
//     let isDragging = false;
//     let previousMousePosition = { x: 0, y: 0 };
//     let rotation = { x: 0, y: 0 };

//     const onMouseDown = (e) => {
//       isDragging = true;
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const onMouseMove = (e) => {
//       if (!isDragging) return;
//       const deltaX = e.clientX - previousMousePosition.x;
//       const deltaY = e.clientY - previousMousePosition.y;

//       rotation.y += deltaX * 0.007;
//       rotation.x += deltaY * 0.007;
//       rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotation.x));

//       character.rotation.x = rotation.x;
//       character.rotation.y = rotation.y;

//       previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const stopDragging = () => { isDragging = false; };

//     renderer.domElement.addEventListener('mousedown', onMouseDown);
//     renderer.domElement.addEventListener('mousemove', onMouseMove);
//     renderer.domElement.addEventListener('mouseup', stopDragging);
//     renderer.domElement.addEventListener('mouseleave', stopDragging);

//     const onWheel = (e) => {
//       e.preventDefault();
//       camera.position.z += e.deltaY * 0.005;
//       camera.position.z = Math.max(1.5, Math.min(6, camera.position.z));
//     };
//     renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     const handleResize = () => {
//       const newWidth = mountRef.current?.clientWidth || width;
//       const newHeight = mountRef.current?.clientHeight || height;
//       camera.aspect = newWidth / newWidth;
//       camera.updateProjectionMatrix();
//       renderer.setSize(newWidth, newHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       renderer.dispose();
//       if (mountRef.current?.contains(renderer.domElement)) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   // ===== 🎨 2. [4단 파츠 분기] 1번 피부, 2번 옷, 3번 수염, 4번 눈/벨트 정밀 도색 =====
//   const updateSantaCharacter = (model, config) => {
//     if (!model) return;

//     model.traverse((child) => {
//       if (child.isMesh) {
        
//         // 🎯 1번 파츠: 피부색 (Cube028_1)
//         if (child.name === 'Cube028_1') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.skin),
//             roughness: 0.4,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;
//         }
        
//         // 🎯 2번 파츠: 옷색깔 (Cube028_2)
//         else if (child.name === 'Cube028_2') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.clothes),
//             roughness: 0.6,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;
//         }

//         // 🎯 3번 파츠: 수염부분 (Cube028_3)
//         else if (child.name === 'Cube028_3') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.beard),
//             roughness: 0.8,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;
//         }

//         // 🎯 4번 파츠: 눈 및 벨트 (Cube028_4)
//         else if (child.name === 'Cube028_4') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.eyesBelt),
//             roughness: 0.3,
//             metalness: 0.1
//           });
//           child.material.needsUpdate = true;
//         }
//         // 🎯 5번 파츠: 귀 (Cube028)
//         else if (child.name === 'Cube028') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.ear),
//             roughness: 0.4,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;  
//         }
//         else if (child.name === 'Cube028_5') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.belt),
//             roughness: 0.4,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;  
//         }
//       }
//     });
//   };

//   // ===== ✨ 테스트용 모자 생성 함수 =====
//   const createTestHat = (hatType) => {
//     let geometry;

//     switch (hatType) {
//       case 'cone':
//         // 원뿔 모자
//         geometry = new THREE.ConeGeometry(0.35, 0.8, 32);
//         break;
//       case 'sphere':
//         // 구 모자
//         geometry = new THREE.SphereGeometry(0.35, 32, 32);
//         break;
//       case 'cylinder':
//         // 원기둥 모자
//         geometry = new THREE.CylinderGeometry(0.3, 0.35, 0.6, 32);
//         break;
//       case 'pyramid':
//         // 피라미드 모자
//         const vertices = new Float32Array([
//           0, 0.8, 0,      // 0: 꼭짓점
//           -0.4, 0, -0.4,  // 1
//           0.4, 0, -0.4,   // 2
//           0.4, 0, 0.4,    // 3
//           -0.4, 0, 0.4,   // 4
//         ]);
//         const indices = [
//           0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,
//           1, 2, 3, 1, 3, 4
//         ];
//         geometry = new THREE.BufferGeometry();
//         geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
//         geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
//         geometry.computeVertexNormals();
//         break;
//       case 'box':
//         // 박스 모자
//         geometry = new THREE.BoxGeometry(0.4, 0.5, 0.4);
//         break;
//       default:
//         return null;
//     }

//     const hatOption = testHatOptions.find(h => h.id === hatType);
//     const material = new THREE.MeshStandardMaterial({
//       color: hatOption.color,
//       roughness: 0.6,
//       metalness: 0.1
//     });

//     const mesh = new THREE.Mesh(geometry, material);
//     const group = new THREE.Group();
//     group.add(mesh);

//     return group;
//   };

//   // ===== ✨ 테스트 모자 교체 함수 =====
//   const changeTestHat = (hatId) => {
//     const character = characterRef.current;
//     if (!character) return;

//     // 1️⃣ 기존 테스트 모자 제거
//     if (currentTestHatRef.current) {
//       character.remove(currentTestHatRef.current);
//       currentTestHatRef.current = null;
//     }

//     // 2️⃣ '없음' 선택했으면 종료
//     if (hatId === 'none') {
//       console.log('테스트 모자 제거됨');
//       return;
//     }

//     // 3️⃣ 테스트 모자 생성
//     const newHat = createTestHat(hatId);
//     if (!newHat) return;

//     // 4️⃣ 위치 조정 (머리 위)
//     newHat.position.set(0, 1.3, 0);
//     newHat.scale.set(1, 1, 1);

//     // 5️⃣ 추가
//     character.add(newHat);
//     currentTestHatRef.current = newHat;

//     const hatName = testHatOptions.find(h => h.id === hatId)?.name;
//     console.log(`✅ 테스트 모자 착용: ${hatName}`);
//   };

//   // 테스트 모자 선택 변경 감지
//   useEffect(() => {
//     changeTestHat(selectedTestHat);
//   }, [selectedTestHat]);

//   // 상태 변경 시 자동으로 3D 뷰어 동기화
//   useEffect(() => {
//     updateSantaCharacter(loadedModelRef.current, santaConfig);
//   }, [santaConfig]);

//   // 색상 변경 공용 핸들러
//   const handlePartColorChange = (partKey, color) => {
//     setSantaConfig(prev => ({
//       ...prev,
//       [partKey]: color
//     }));
//   };

//   return (
//     <div className="customizer">
//       {/* 3D 그래픽 뷰어 */}
//       <div ref={mountRef} className="viewer" />
      
//       {/* 우측 상하 독립 편집 패널 (4단 구성에 맞춰 스크롤 영역 최적화) */}
//       <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '100vh' }}>
//         <h2>🎅 산타 커스터마이저</h2>

//         {/* ===== ✨ 테스트 모자 섹션 (새로 추가) ===== */}
//         <div className="control-section" style={{ backgroundColor: '#f9f3ff', padding: '12px', borderRadius: '8px', border: '2px solid #d4a5ff' }}>
//           <h3 style={{ margin: '0 0 5px 0', color: '#6b21a8' }}>🧪 테스트 모자 (Blender 없이 테스트)</h3>
//           <p style={{ fontSize: '12px', color: '#999', margin: '0 0 12px 0' }}>
//             간단한 3D 모양으로 테스트할 수 있습니다
//           </p>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//             {testHatOptions.map(hat => (
//               <button
//                 key={hat.id}
//                 onClick={() => setSelectedTestHat(hat.id)}
//                 style={{
//                   padding: '8px 12px',
//                   backgroundColor: selectedTestHat === hat.id ? '#6b21a8' : '#f3e8ff',
//                   color: selectedTestHat === hat.id ? 'white' : '#333',
//                   border: selectedTestHat === hat.id ? '2px solid #6b21a8' : '1px solid #ddd',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   fontSize: '12px',
//                   fontWeight: '500',
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 {hat.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0' }} />

//         {/* 👤 SECTION 1: 피부색 설정 (Cube028_1) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👤 피부색 설정 (Cube028_1)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.skin}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`skin-${color}`}
//                 className={santaConfig.skin === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('skin', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 🧥 SECTION 2: 옷색깔 설정 (Cube028_2) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>🧥 옷색깔 설정 (Cube028_2)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.clothes}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`clothes-${color}`}
//                 className={santaConfig.clothes === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('clothes', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 🧔 SECTION 3: 수염부분 설정 (Cube028_3) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>🧔 수염부분 설정 (Cube028_3)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.beard}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`beard-${color}`}
//                 className={santaConfig.beard === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('beard', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 👁️ SECTION 4: 눈 및 벨트 설정 (Cube028_4) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ 눈 및 벨트 설정 (Cube028_4)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.eyesBelt}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.eyesBelt === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('eyesBelt', color)}
//               />
//             ))}
//           </div>
//         </div>
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ 귀(Cube028)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.ear}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`ear-${color}`}
//                 className={santaConfig.ear === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('ear', color)}
//               />
//             ))}
//           </div>
//         </div>
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ belt(Cube028_5)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.belt}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`belt-${color}`}
//                 className={santaConfig.belt === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('belt', color)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CharacterCustomizer;


// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import '../styles/Customizer.css';

// const CharacterCustomizer = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const characterRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadedModelRef = useRef(null);

//   // 1. 4개 파츠의 역할에 맞게 상태 세팅 (기본값 전부 그레이)
//   const [santaConfig, setSantaConfig] = useState({
//     skin: '#A0A0A0',       // Cube028_1 (피부색)
//     clothes: '#A0A0A0',    // Cube028_2 (옷색깔)
//     beard: '#A0A0A0',      // Cube028_3 (수염부분)
//     eyesBelt: '#A0A0A0' ,   // Cube028_4 ( 벨트)
//     ear: '#A0A0A0'   ,    // Cube028_5 (귀)
//     belt: '#A0A0A0'    // Cube028_6 (벨트)
//   });

//   // 공용 6가지 컬러 팔레트 구성
//   const colorPalette = ['#000000','#c8cf43', '#4A90E2', '#FF6B6B', '#50E3C2', '#fbceb1', '#9B51E0','#ffffff'];

//   // ===== THREE.js 씬 초기화 및 GLB 최초 1회 로드 =====
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const width = mountRef.current.clientWidth;
//     const height = mountRef.current.clientHeight;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xe8e8e8);

//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(0, 0.5, 4);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//     scene.add(ambientLight);

//     const character = new THREE.Group();
//     scene.add(character);

//     window.scene = scene;
//     window.THREE = THREE;

//     sceneRef.current = { scene, camera, renderer, character };
//     characterRef.current = character;
//     rendererRef.current = renderer;

//     // 산타 GLB 파일 로드
//     const loader = new GLTFLoader();
//     loader.load(
//       '/models/Santa.glb', 
//       (gltf) => {
//         const model = gltf.scene;

//         model.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//           }
//         });

//         model.scale.set(0.9, 1, 1);
//         model.position.y = -0.5;

//         character.add(model);
//         loadedModelRef.current = model;

//         // 로드 즉시 4단 매핑 규칙 적용
//         updateSantaCharacter(model, santaConfig);
//       },
//       undefined,
//       (error) => console.error('산타 GLB 캐릭터 로드 실패:', error)
//     );

//     // ===== 마우스 드래그 회전 조작 셋팅 =====
//     let isDragging = false;
//     let previousMousePosition = { x: 0, y: 0 };
//     let rotation = { x: 0, y: 0 };

//     const onMouseDown = (e) => {
//       isDragging = true;
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const onMouseMove = (e) => {
//       if (!isDragging) return;
//       const deltaX = e.clientX - previousMousePosition.x;
//       const deltaY = e.clientY - previousMousePosition.y;

//       rotation.y += deltaX * 0.007;
//       rotation.x += deltaY * 0.007;
//       rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotation.x));

//       character.rotation.x = rotation.x;
//       character.rotation.y = rotation.y;

//       previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const stopDragging = () => { isDragging = false; };

//     renderer.domElement.addEventListener('mousedown', onMouseDown);
//     renderer.domElement.addEventListener('mousemove', onMouseMove);
//     renderer.domElement.addEventListener('mouseup', stopDragging);
//     renderer.domElement.addEventListener('mouseleave', stopDragging);

//     const onWheel = (e) => {
//       e.preventDefault();
//       camera.position.z += e.deltaY * 0.005;
//       camera.position.z = Math.max(1.5, Math.min(6, camera.position.z));
//     };
//     renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     const handleResize = () => {
//       const newWidth = mountRef.current?.clientWidth || width;
//       const newHeight = mountRef.current?.clientHeight || height;
//       camera.aspect = newWidth / newWidth;
//       camera.updateProjectionMatrix();
//       renderer.setSize(newWidth, newHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       renderer.dispose();
//       if (mountRef.current?.contains(renderer.domElement)) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   // ===== 🎨 2. [4단 파츠 분기] 1번 피부, 2번 옷, 3번 수염, 4번 눈/벨트 정밀 도색 =====
//   const updateSantaCharacter = (model, config) => {
//     if (!model) return;

//     model.traverse((child) => {
//       if (child.isMesh) {
        
//         // 🎯 1번 파츠: 피부색 (Cube028_1)
//         if (child.name === 'Cube028_1') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.skin),
//             roughness: 0.4,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;
//         }
        
//         // 🎯 2번 파츠: 옷색깔 (Cube028_2)
//         else if (child.name === 'Cube028_2') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.clothes),
//             roughness: 0.6,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;
//         }

//         // 🎯 3번 파츠: 수염부분 (Cube028_3)
//         else if (child.name === 'Cube028_3') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.beard),
//             roughness: 0.8,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;
//         }

//         // 🎯 4번 파츠: 눈 및 벨트 (Cube028_4) ✨새로 추가됨!
//         else if (child.name === 'Cube028_4') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.eyesBelt),
//             roughness: 0.3, // 눈과 가죽 벨트이므로 약간 반짝이게 선명도 올림
//             metalness: 0.1
//           });
//           child.material.needsUpdate = true;
//         }
//           // 🎯 5번 파츠: 귀 (Cube028_5) - 피부색과 동일하게 매핑
//         else if (child.name === 'Cube028') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.ear),
//             roughness: 0.4,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;  
//       }
//        else if (child.name === 'Cube028_5') {
//           child.material = new THREE.MeshStandardMaterial({
//             color: new THREE.Color(config.belt),
//             roughness: 0.4,
//             metalness: 0.0
//           });
//           child.material.needsUpdate = true;  
//       }
//     }
//     });
//   };

//   // 상태 변경 시 자동으로 3D 뷰어 동기화
//   useEffect(() => {
//     updateSantaCharacter(loadedModelRef.current, santaConfig);
//   }, [santaConfig]);

//   // 색상 변경 공용 핸들러
//   const handlePartColorChange = (partKey, color) => {
//     setSantaConfig(prev => ({
//       ...prev,
//       [partKey]: color
//     }));
//   };

//   return (
//     <div className="customizer">
//       {/* 3D 그래픽 뷰어 */}
//       <div ref={mountRef} className="viewer" />
      
//       {/* 우측 상하 독립 편집 패널 (4단 구성에 맞춰 스크롤 영역 최적화) */}
//       <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '100vh' }}>
//         <h2>🎅 산타 커스터마이저</h2>
        
//         <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0' }} />

//         {/* 👤 SECTION 1: 피부색 설정 (Cube028_1) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👤 피부색 설정 (Cube028_1)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.skin}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`skin-${color}`}
//                 className={santaConfig.skin === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('skin', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 🧥 SECTION 2: 옷색깔 설정 (Cube028_2) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>🧥 옷색깔 설정 (Cube028_2)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.clothes}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`clothes-${color}`}
//                 className={santaConfig.clothes === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('clothes', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 🧔 SECTION 3: 수염부분 설정 (Cube028_3) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>🧔 수염부분 설정 (Cube028_3)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.beard}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`beard-${color}`}
//                 className={santaConfig.beard === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('beard', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 👁️ SECTION 4: 눈 및 벨트 설정 (Cube028_4) ✨새로 추가됨! */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ 눈 및 벨트 설정 (Cube028_4)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.eyesBelt}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.eyesBelt === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('eyesBelt', color)}
//               />
//             ))}
//           </div>
//         </div>
//           <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ 귀(Cube028)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.ear}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.ear === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('ear', color)}
//               />
//             ))}
//           </div>
//         </div>
//          <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️belt(Cube028_5)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.belt}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.belt === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('belt', color)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CharacterCustomizer; 


// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import '../styles/Customizer.css';

// const CharacterCustomizer = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const characterRef = useRef(null);
//   const rendererRef = useRef(null);
//   const loadedModelRef = useRef(null);
//   const currentHatRef = useRef(null); // 모자 객체 보관용

//   const [santaConfig, setSantaConfig] = useState({
//     skin: '#A0A0A0',
//     clothes: '#A0A0A0',
//     beard: '#A0A0A0',
//     eyesBelt: '#A0A0A0',
//     ear: '#A0A0A0',
//     belt: '#A0A0A0'
//   });

//   const [hasHat, setHasHat] = useState(false);
//   const colorPalette = ['#000000', '#c8cf43', '#4A90E2', '#FF6B6B', '#50E3C2', '#fbceb1', '#9B51E0', '#ffffff'];

//   // ===== 🎩 모자 토글 기능 =====
//   const toggleHat = () => {
//     const character = characterRef.current;
//     if (!character) return;

//     if (hasHat) {
//       if (currentHatRef.current) {
//         character.remove(currentHatRef.current);
//         currentHatRef.current = null;
//       }
//       setHasHat(false);
//     } else {
//       const loader = new GLTFLoader();
//       loader.load('/models/hat_01.glb', (gltf) => {
//         const hat = gltf.scene;
//         // 위치와 크기 조정 (모델에 따라 조절 필요)
//         hat.position.set(0, 0.8, 0);
//         hat.scale.set(1, 1, 1);
        
//         character.add(hat);
//         currentHatRef.current = hat;
//         setHasHat(true);
//       });
//     }
//   };

//   // ===== THREE.js 씬 초기화 =====
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const width = mountRef.current.clientWidth;
//     const height = mountRef.current.clientHeight;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xe8e8e8);

//     const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//     camera.position.set(0, 0.5, 4);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.shadowMap.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//     scene.add(ambientLight);

//     const character = new THREE.Group();
//     scene.add(character);

//     sceneRef.current = { scene, camera, renderer, character };
//     characterRef.current = character;
//     rendererRef.current = renderer;

//     const loader = new GLTFLoader();
//     loader.load('/models/Santa.glb', (gltf) => {
//       const model = gltf.scene;
//       model.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });
//       model.scale.set(0.9, 1, 1);
//       model.position.y = -0.5;
//       character.add(model);
//       loadedModelRef.current = model;
//       updateSantaCharacter(model, santaConfig);
//     });

//     // ... (마우스 드래그 및 휠 이벤트 로직은 그대로 유지) ...
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => renderer.dispose();
//   }, []);

//   const updateSantaCharacter = (model, config) => {
//     if (!model) return;
//     model.traverse((child) => {
//       if (child.isMesh) {
//         if (child.name === 'Cube028_1') child.material = new THREE.MeshStandardMaterial({ color: config.skin });
//         else if (child.name === 'Cube028_2') child.material = new THREE.MeshStandardMaterial({ color: config.clothes });
//         else if (child.name === 'Cube028_3') child.material = new THREE.MeshStandardMaterial({ color: config.beard });
//         else if (child.name === 'Cube028_4') child.material = new THREE.MeshStandardMaterial({ color: config.eyesBelt });
//         else if (child.name === 'Cube028_5') child.material = new THREE.MeshStandardMaterial({ color: config.belt });
//         else if (child.name === 'Cube028') child.material = new THREE.MeshStandardMaterial({ color: config.ear });
//       }
//     });
//   };

//   useEffect(() => {
//     updateSantaCharacter(loadedModelRef.current, santaConfig);
//   }, [santaConfig]);

//   const handlePartColorChange = (partKey, color) => {
//     setSantaConfig(prev => ({ ...prev, [partKey]: color }));
//   };

//   return (
//     <div className="customizer">
//       <div ref={mountRef} className="viewer" />
//       <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '100vh' }}>
//         <h2>🎅 산타 커스터마이저</h2>
        
//         {/* 모자 컨트롤 추가 */}
//         <div className="control-section">
//           <h3>🎩 모자 설정</h3>
//           <button onClick={toggleHat} style={{ padding: '10px', width: '100%' }}>
//             {hasHat ? '모자 벗기' : '모자 쓰기'}
//           </button>
//         </div>


//                 {/* 👤 SECTION 1: 피부색 설정 (Cube028_1) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👤 피부색 설정 (Cube028_1)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.skin}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`skin-${color}`}
//                 className={santaConfig.skin === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('skin', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 🧥 SECTION 2: 옷색깔 설정 (Cube028_2) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>🧥 옷색깔 설정 (Cube028_2)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.clothes}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`clothes-${color}`}
//                 className={santaConfig.clothes === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('clothes', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 🧔 SECTION 3: 수염부분 설정 (Cube028_3) */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>🧔 수염부분 설정 (Cube028_3)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.beard}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`beard-${color}`}
//                 className={santaConfig.beard === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('beard', color)}
//               />
//             ))}
//           </div>
//         </div>

//         <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

//         {/* 👁️ SECTION 4: 눈 및 벨트 설정 (Cube028_4) ✨새로 추가됨! */}
//         <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ 눈 및 벨트 설정 (Cube028_4)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.eyesBelt}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.eyesBelt === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('eyesBelt', color)}
//               />
//             ))}
//           </div>
//         </div>
//           <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️ 귀(Cube028)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.ear}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.ear === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('ear', color)}
//               />
//             ))}
//           </div>
//         </div>
//          <div className="control-section">
//           <h3 style={{ margin: '0 0 5px 0' }}>👁️belt(Cube028_5)</h3>
//           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
//             색상 코드: <strong>{santaConfig.belt}</strong>
//           </p>
//           <div className="color-palette">
//             {colorPalette.map(color => (
//               <div
//                 key={`eyesBelt-${color}`}
//                 className={santaConfig.belt === color ? 'color-btn active' : 'color-btn'}
//                 style={{ backgroundColor: color }}
//                 onClick={() => handlePartColorChange('belt', color)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default CharacterCustomizer;

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import '../styles/Customizer.css';

const CharacterCustomizer = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const characterRef = useRef(null);
  const rendererRef = useRef(null);
  const loadedModelRef = useRef(null);
  const currentHatRef = useRef(null); // 모자 객체 저장용
  const mixerRef = useRef(null);
  const clock = useRef(new THREE.Clock());
  const [santaConfig, setSantaConfig] = useState({
    skin: '#A0A0A0', clothes: '#A0A0A0', beard: '#A0A0A0',
    eyesBelt: '#A0A0A0', ear: '#A0A0A0', belt: '#A0A0A0'
  });
const [isDancing, setIsDancing] = useState(false);
  const [hasHat, setHasHat] = useState(false);
  const colorPalette = ['#000000', '#c8cf43', '#4A90E2', '#FF6B6B', '#50E3C2', '#fbceb1', '#9B51E0', '#ffffff'];
const toggleDance = () => {
  if (!mixerRef.current || !loadedModelRef.current) return;

  // gltf.animations 배열에서 첫 번째 동작 가져오기
  const clips = loadedModelRef.current.animations;
  if (!clips || clips.length === 0) return;

  if (isDancing) {
    mixerRef.current.stopAllAction();
    setIsDancing(false);
  } else {
    const action = mixerRef.current.clipAction(clips[0]);
    action.reset();
    action.play();
    setIsDancing(true);
  }
};
  // ===== 🎩 모자 토글 함수 =====
  const toggleHat = () => {
    const character = characterRef.current;
    if (!character) return;

    if (hasHat) {
      if (currentHatRef.current) {
        character.remove(currentHatRef.current);
        currentHatRef.current = null;
      }
      setHasHat(false);
    } else {
      const loader = new GLTFLoader();
      loader.load('models/hat_01.glb', (gltf) => {
        const hat = gltf.scene;
        hat.position.set(0, 0.5, 0); // 위치 조정
        hat.scale.set(2, 1.8, 2.5); // 크기 조정 (필요시 조절)
        character.add(hat);
        currentHatRef.current = hat;
        setHasHat(true);
      });
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e8e8);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight, new THREE.AmbientLight(0xffffff, 0.7));

    const character = new THREE.Group();
    scene.add(character);
    characterRef.current = character;

    // 산타 로드
    const loader = new GLTFLoader();
    // loader.load('models/Santa.glb', (gltf) => {
    //   const model = gltf.scene;
    //   model.scale.set(0.9, 1, 1);
    //   model.position.y = -0.5;
    //   character.add(model);
    //   loadedModelRef.current = model;
    //   updateSantaCharacter(model, santaConfig);
    // });
     loader.load(
      'models/Santa.glb', 
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        model.scale.set(0.9, 1, 1);
        model.position.y = -0.5;

        character.add(model);
        loadedModelRef.current = model;

        // 로드 즉시 4단 매핑 규칙 적용 
        updateSantaCharacter(model, santaConfig);
      },
      undefined,
      (error) => console.error('산타 GLB 캐릭터 로드 실패:', error)
    );
//   loader.load('/models/hiphop.glb', (gltf) => {
//   const model = gltf.scene;
//   model.scale.set(0.9, 1, 1);
//   model.position.y = -0.5;
//   character.add(model);
  
//   // ✅ 1. 모델 전체를 저장 (애니메이션 데이터를 위해 필수!)
//   loadedModelRef.current = gltf; 

//   // ✅ 2. 애니메이션 믹서 생성
//   const mixer = new THREE.AnimationMixer(model);
//   mixerRef.current = mixer;

//   // ✅ 3. 모자를 머리 뼈에 붙이기 (이름 확인!)
//   model.traverse((node) => {
//     // 씬 정보에서 확인된 이름은 'mixamorigHead' (콜론 없음)입니다.
//     if (node.isBone && node.name === 'mixamorigHead') { 
//       if (currentHatRef.current) {
//         node.add(currentHatRef.current);
//         currentHatRef.current.position.set(0, 0.15, 0);
//       }
//     }
//   });
// });

// const animate = () => {
//     requestAnimationFrame(animate);
    
//     // 애니메이션 믹서 업데이트
//     const delta = clock.current.getDelta();
//     if (mixerRef.current) mixerRef.current.update(delta);
    
//     renderer.render(scene, camera);
//   };
//   animate(); 
// const animate = () => {
//   requestAnimationFrame(animate);
  
//   // 1. 애니메이션 믹서 업데이트 (춤추기)
//   const delta = clock.current.getDelta();
//   if (mixerRef.current) mixerRef.current.update(delta);
  
//   // 2. 렌더링
//   renderer.render(scene, camera);
// };

// 루프 실행
// animate();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotation.y += deltaX * 0.007;
      rotation.x += deltaY * 0.007;
      rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotation.x));

      character.rotation.x = rotation.x;
      character.rotation.y = rotation.y;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const stopDragging = () => { isDragging = false; };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', stopDragging);
    renderer.domElement.addEventListener('mouseleave', stopDragging);

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.005;
      camera.position.z = Math.max(1.5, Math.min(6, camera.position.z));
    };
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = mountRef.current?.clientWidth || width;
      const newHeight = mountRef.current?.clientHeight || height;
      camera.aspect = newWidth / newWidth;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  const updateSantaCharacter = (model, config) => {
    if (!model) return;
    model.traverse((child) => {
      if (child.isMesh) {
        const colors = { 'Cube028_1': config.skin, 'Cube028_2': config.clothes, 'Cube028_3': config.beard, 'Cube028_4': config.eyesBelt, 'Cube028': config.ear, 'Cube028_5': config.belt };
        if (colors[child.name]) child.material = new THREE.MeshStandardMaterial({ color: colors[child.name] });
      }
    });
  };

  useEffect(() => { updateSantaCharacter(loadedModelRef.current, santaConfig); }, [santaConfig]);
    const handlePartColorChange = (partKey, color) => {
    setSantaConfig(prev => ({
      ...prev,
      [partKey]: color
    }));
  };

  return (
    <div className="customizer">
      <div ref={mountRef} className="viewer" />
      <div className="controls">
        <h2>🎅 산타 커스터마이저</h2>
        {/* 모자 버튼 */}
        <button onClick={toggleHat} style={{ marginBottom: '20px', padding: '10px' }}>
          {hasHat ? '모자 벗기' : '모자 쓰기'}
        </button>
        <button onClick={toggleDance} style={{ backgroundColor: isDancing ? '#FF6B6B' : '#50E3C2' }}>
    {isDancing ? '춤 멈추기' : '힙합 댄스 시작!'}
  </button>
                      {/* 👤 SECTION 1: 피부색 설정 (Cube028_1) */}
         <div className="control-section">
          <h3 style={{ margin: '0 0 5px 0' }}>👤 피부색 설정 (Cube028_1)</h3>
           <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
            색상 코드: <strong>{santaConfig.skin}</strong>
          </p>
          <div className="color-palette">
             {colorPalette.map(color => (
              <div
                key={`skin-${color}`}
                className={santaConfig.skin === color ? 'color-btn active' : 'color-btn'}
                style={{ backgroundColor: color }}
                onClick={() => handlePartColorChange('skin', color)}
              />
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

        {/* 🧥 SECTION 2: 옷색깔 설정 (Cube028_2) */}
        <div className="control-section">
          <h3 style={{ margin: '0 0 5px 0' }}>🧥 옷색깔 설정 (Cube028_2)</h3>
          <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
            색상 코드: <strong>{santaConfig.clothes}</strong>
          </p>
          <div className="color-palette">
            {colorPalette.map(color => (
              <div
                key={`clothes-${color}`}
                className={santaConfig.clothes === color ? 'color-btn active' : 'color-btn'}
                style={{ backgroundColor: color }}
                onClick={() => handlePartColorChange('clothes', color)}
              />
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

        {/* 🧔 SECTION 3: 수염부분 설정 (Cube028_3) */}
        <div className="control-section">
          <h3 style={{ margin: '0 0 5px 0' }}>🧔 수염부분 설정 (Cube028_3)</h3>
          <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
            색상 코드: <strong>{santaConfig.beard}</strong>
          </p>
          <div className="color-palette">
            {colorPalette.map(color => (
              <div
                key={`beard-${color}`}
                className={santaConfig.beard === color ? 'color-btn active' : 'color-btn'}
                style={{ backgroundColor: color }}
                onClick={() => handlePartColorChange('beard', color)}
              />
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0' }} />

        {/* 👁️ SECTION 4: 눈 및 벨트 설정 (Cube028_4) ✨새로 추가됨! */}
        <div className="control-section">
          <h3 style={{ margin: '0 0 5px 0' }}>👁️ 눈 및 벨트 설정 (Cube028_4)</h3>
          <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
            색상 코드: <strong>{santaConfig.eyesBelt}</strong>
          </p>
          <div className="color-palette">
            {colorPalette.map(color => (
              <div
                key={`eyesBelt-${color}`}
                className={santaConfig.eyesBelt === color ? 'color-btn active' : 'color-btn'}
                style={{ backgroundColor: color }}
                onClick={() => handlePartColorChange('eyesBelt', color)}
              />
            ))}
          </div>
        </div>
          <div className="control-section">
          <h3 style={{ margin: '0 0 5px 0' }}>👁️ 귀(Cube028)</h3>
          <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
            색상 코드: <strong>{santaConfig.ear}</strong>
          </p>
          <div className="color-palette">
            {colorPalette.map(color => (
              <div
                key={`eyesBelt-${color}`}
                className={santaConfig.ear === color ? 'color-btn active' : 'color-btn'}
                style={{ backgroundColor: color }}
                onClick={() => handlePartColorChange('ear', color)}
              />
            ))}
          </div>
        </div>
         <div className="control-section">
          <h3 style={{ margin: '0 0 5px 0' }}>👁️belt(Cube028_5)</h3>
          <p style={{ fontSize: '11px', color: '#777', margin: '0 0 10px 0' }}>
            색상 코드: <strong>{santaConfig.belt}</strong>
          </p>
          <div className="color-palette">
            {colorPalette.map(color => (
              <div
                key={`eyesBelt-${color}`}
                className={santaConfig.belt === color ? 'color-btn active' : 'color-btn'}
                style={{ backgroundColor: color }}
                onClick={() => handlePartColorChange('belt', color)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomizer;