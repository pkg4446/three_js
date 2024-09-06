import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "../core/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "../core/jsm/helpers/RectAreaLightHelper.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;
        
        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setCamera();
        this._setLight();
        this._setModel();
        this._setControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setCamera() {
        const width  = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.1,
            100
        );
        //camera.position.z = 2;
        camera.position.set(7,7,0);
        camera.lookAt(0,0,0);

        this._camera = camera;
    }

    _setLight() {
        const auxLight = new THREE.DirectionalLight(0xffffff, 0.5);
        auxLight.position.set(0, 5, 0);
        auxLight.target.position.set(0, 0, 0);
        this._scene.add(auxLight.target);
        this._scene.add(auxLight);

        /*
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 5, 0);
        light.target.position.set(0, 0, 0);
        this._scene.add(light.target);
        light.shadow.camera.top    = light.shadow.camera.right = 6;
        light.shadow.camera.bottom = light.shadow.camera.left  = -6;
        */
        /*
        const light = new THREE.PointLight(0xffffff, 2);
        light.position.set(0, 5, 0);
        */
        const light = new THREE.SpotLight(0xffffff, 30);
        light.position.set(0, 5, 0);
        light.target.position.set(0,0,0);
        light.angle = THREE.MathUtils.degToRad(50);
        light.penumbra = 1;
        this._scene.add(light.target);

        light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
        light.shadow.radius = 1;

        const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        this._scene.add(cameraHelper);

        this._scene.add(light);
        this._light = light;
        light.castShadow = true;
    }

    _setModel() {
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = THREE.MathUtils.degToRad(-90);
        ground.receiveShadow = true;
        this._scene.add(ground);

        //const boigSphereGeometry = new THREE.SphereGeometry(1.5, 5, 64, 0, Math.PI);
        const boigSphereGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64, 2, 3);
        const boigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2
        });

        const bigSphere = new THREE.Mesh(boigSphereGeometry, boigSphereMaterial);
        //bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
        bigSphere.position.y = 1.6;
        bigSphere.receiveShadow = true;
        bigSphere.castShadow    = true;
        this._scene.add(bigSphere);

        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0.5,
            metalness: 0.9
        });

        for(let index=0; index<8; index++){
            const torusPivot = new THREE.Object3D();
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * index);
            torus.position.set(3, 0.5, 0);
            torusPivot.add(torus);
            torus.receiveShadow = true;
            torus.castShadow    = true;
            this._scene.add(torusPivot);
        }

        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#e74c3c",
            roughness: 0.2,
            metalness: 0.5
        });

        const smallSpherePivot = new THREE.Object3D();
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot";
        smallSphere.position.set(3, 0.5, 0);
        smallSphere.receiveShadow = true;
        smallSphere.castShadow    = true;
        this._scene.add(smallSpherePivot);
        
    }
///////////////////////////////////////////////////////////
    _setControls() {
        new OrbitControls(this._camera, this._divContainer)
    }

    resize() {
        const width  = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; // second unitc

        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
        if(smallSpherePivot) {
            smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time*50);
            
            if(this._light.target){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition (this._light.target.position);
                if(this._lightHelper) this._lightHelper.update();
            }

            if(this._light instanceof THREE.PointLight){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition (this._light.position);
            }
        }
    }
}

window.onload = function() {
    new App();
}