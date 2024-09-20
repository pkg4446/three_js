import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../core/jsm/loaders/GLTFLoader.js"

class App {
    constructor() {
        this._setupThreeJs();
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupEvents();        
    }

    _setupThreeJs() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            60, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.set(30, 5, 0);
        this._camera = camera;
    }

    _setupLight() {
        const spotLight = new THREE.SpotLight(0xffffff, 9999);
        spotLight.position.set(25, 40, 25);
        spotLight.angle = Math.PI / 8;
        spotLight.penumbra = 1;
        spotLight.decay = 2;
        spotLight.distance = 100;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 4096;
        spotLight.shadow.mapSize.height = 4096;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.bias = -0.0005;

        // window.onclick = () => {
        //     const video = document.getElementById("video");
        //     if(video.paused) {
        //         video.play();
        //         const texture = new THREE.VideoTexture(video);
        //         spotLight.map = texture;
        //     }
        // }

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("../core/textures/disturb.jpg");
        spotLight.map = texture;

        this._scene.add(spotLight);
        this._spotLight = spotLight;

        const helper = new THREE.SpotLightHelper(spotLight);
        this._scene.add(helper);
    }

    _setupModel() {
        new GLTFLoader().load("../data/GLB/hl._maria.glb", (gltf) => {
            const model = gltf.scene;

            model.scale.set(10, 10, 10);
            model.rotation.y = Math.PI / 2;
            this._scene.add(model);
        });

        const floor = new THREE.Mesh(
            new THREE.CircleGeometry(50, 64),
            new THREE.MeshPhongMaterial({color: 0x454545})
        );
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;
        this._scene.add(floor);

    }

    _setupControls() {
        this._orbitControls = new OrbitControls(this._camera, this._divContainer);
        this._orbitControls.target.set(0, 10, 0);
    }

    _setupEvents() {
        window.onresize = this.resize.bind(this);
        this.resize();

        this._clock = new THREE.Clock();
        requestAnimationFrame(this.render.bind(this));
    }

    update() {
        const delta = this._clock.getDelta();
        this._orbitControls.update();

        const time = this._clock.oldTime / 5000;
        this._spotLight.position.x = Math.cos(time) * 5;
        this._spotLight.position.z = Math.sin(time) * 5;
    }

    render() {
        this._renderer.render(this._scene, this._camera);   
        this.update();

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}