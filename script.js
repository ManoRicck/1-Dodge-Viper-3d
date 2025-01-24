//Importe a biblioteca THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Para permitir que a câmera se mova pela cena
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Para permitir a importação do arquivo .gltf
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// permitir criar animação na posição da câmera
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";

let canvasform = document.getElementById('dCanvas');
let width = canvasform.offsetWidth;
let height =  canvasform.offsetHeight;

//Crie uma cena Three.JS
const scene = new THREE.Scene();

//crie uma nova câmera com posições e ângulos
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

//Acompanhe a posição do mouse, para que possamos fazer o olho se mover
let mouseX = width / 2;
let mouseY = height / 2;

//Mantenha o objeto 3D em uma variável global para que possamos acessá-lo mais tarde
let object;

//OrbitControls permitem que a câmera se mova pela cena
let controls;

//Instancie um carregador para o arquivo .gltf
const loader = new GLTFLoader();

//Carregue o arquivo
loader.load(
  `./model/dodge_viper.glb`,
  function (gltf) {
    //Se o arquivo estiver carregado, adicione-o à cena
    object = gltf.scene;
    scene.add(object);
  }
);


//Instancie um novo renderizador e defina seu tamanho
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height); 

//Adicione o renderizador ao DOM
document.getElementById("dCanvas").appendChild(renderer.domElement);

//Defina a que distância a câmera estará do modelo 3D
camera.position.set(3, 1, 4);

//Adicione luzes à cena, para que possamos realmente ver o modelo 3D
let ambientLight = new THREE.AmbientLight(0x404040,1);
scene.add(ambientLight);


let light = new THREE.PointLight(0xffd700, 5); // warm sunlight
light.position.set(0, 300, 500);
scene.add(light);

let light2 = new THREE.PointLight(0xffffff, 2); // cool artificial light
light2.position.set(500, 100, 0);
scene.add(light2);

let light3 = new THREE.AmbientLight(0x444444, 1); // soft ambient light
light3.position.set(0, 100, -500);
scene.add(light3);

let light4 = new THREE.DirectionalLight(0xffffff, 3); // directional light
light4.position.set(-500, 300, 500);
scene.add(light4);

//Isso adiciona controles à câmera, para que possamos girar/ampliar com o mouse
controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  TWEEN.update();
}
animate();

//Adicione um ouvinte à janela, para que possamos redimensionar a janela e a câmera
window.addEventListener("resize", function () {
  width = canvasform.offsetWidth;
  height =  canvasform.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

let btnshowmore = document.getElementById('showmore');
let slider = document.querySelector('.slider');

function runCamera(x,y,z) {
  // criar câmera de posição
    const targetPosition = new THREE.Vector3(x, y, z); 
    // tempo da animação
    const duration = 1200;

    const tween = new TWEEN.Tween(camera.position)
        .to(targetPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut) 
        .onUpdate(() => {
            camera.lookAt(scene.position); 
            renderer.render(scene, camera);
        })
        .start();

}
let statusContent = 'contentOne';
btnshowmore.onclick = () => {
    slider.classList.remove('contentOneAction');
    slider.classList.remove('contentTwoAction');
    switch (statusContent) {
        case 'contentOne':
            runCamera(3, 0, 1);
            statusContent = 'contentTwo';
            slider.classList.add('contentTwoAction');
            break;
        case 'contentTwo':
            runCamera(2, 3, 1);
            statusContent = 'fullScreen';
            break;
        case 'fullScreen':
            runCamera(5, 0, 1);
            slider.classList.add('contentOneAction');
            statusContent = 'contentOne';
            break;
    
        default:
            break;
    }
}