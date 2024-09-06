import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { FBXLoader } from "../core/jsm/loaders/FBXLoader.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;
        
        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
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

    _zoomFit(object3D, camera, viewMode, bFront){
        const box = new THREE.Box3().setFromObject(object3D);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());
        
        let offerX = 0, offerY = 0, offerZ = 0;
        viewMode === "x" ? offerX = 1 : 
                    (viewMode==="Y") ? offerY = 1 : offerZ = 1;
        if(!bFront){
            offerX *= -1;
            offerY *= -1;
            offerZ *= -1;
        }
        camera.position.set(
            centerBox.x + offerX,
            centerBox.y + offerY,
            centerBox.z + offerZ
        );

        const halfSizeModel = sizeBox/2;
        const halfFov = THREE.MathUtils.degToRad(camera.fov/2);
        const distance = halfSizeModel / Math.tan(halfFov);
        const direction = (new THREE.Vector3()).subVectors(camera.position, centerBox).normalize();
        const position = direction.multiplyScalar(distance).add(centerBox);

        camera.position.copy(position);
        camera.near = sizeBox/100;
        camera.far  = sizeBox*100;
        camera.updateProjectionMatrix();
        camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
        this._controls.target.set(centerBox.x, centerBox.y, centerBox.z);
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
        camera.position.z = 2;
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setModel() {
        this._clock = new THREE.Clock();

        const loader = new FBXLoader();
        loader.load("../data/FBX/Capoeira.fbx", object => {
            this._mixer = new THREE.AnimationMixer(object);
            const action = this._mixer.clipAction(object.animations[0]);
            action.play();

            this._scene.add(object);
            this._zoomFit(object, this._camera, "z", true);

            this._clock = new THREE.Clock();
        });
    }
///////////////////////////////////////////////////////////
    _setControls() {
        this._controls = new OrbitControls(this._camera, this._divContainer)
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
        
        const delta = this._clock.getDelta();
        if(this._mixer) this._mixer.update(delta);
    }
}

window.onload = function() {
    new App();
}