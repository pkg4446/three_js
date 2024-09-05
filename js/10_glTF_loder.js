import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../core/jsm/loaders/GLTFLoader.js"

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
        this._setModle();
        this._setControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _zoomFit(object3D, camera){
        //모델의 경계 박스
        const box = new THREE.Box3().setFromObject(object3D);
        //모델의 경계 박스 대각 길이
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        //모델의 경계 박스 중심 위치
        const centerBox = box.getCenter(new THREE.Vector3());
        //모델의 크기 절반값
        const halfSizeModel = sizeBox/2;
        //카메라의 fov의 절반값
        const halfFov = THREE.MathUtils.degToRad(camera.fov/2);
        //모델을 화면에 꽉 채우기 위한 적당한 거리
        const distance = halfSizeModel / Math.tan(halfFov);
        //모델 중심에서 카메라 위치로 향하는 방향 단위 벡터 계산
        const direction = (new THREE.Vector3()).subVectors(camera.position, centerBox).normalize();
        //"단위 방향 벡터" 방향으로 모델 중심 위치에서 거리에 대한 위치
        const position = direction.multiplyScalar(distance).add(centerBox);
        camera.position.copy(position);
        //모델의 크기에 맞춰 카메라의 near, far 값을 대략적으로 조정
        camera.near = sizeBox/100;
        camera.far  = sizeBox*100;
        //카메라 기본 속성 변경에 따른 투영행렬 업데이트
        camera.updateProjectionMatrix();
        //카메라가 모델의 중심을 바라보도록 함
        camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
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
        camera.position.z = 1;
        this._camera = camera;

        this._scene.add(this._camera);
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        //this._scene.add(light);
        this._camera.add(light);
    }

    _setModle() {
        const gltfLoader = new GLTFLoader();
        const url = "../data/GLTF/adamHead.gltf";
        gltfLoader.load(
            url,
            (gltf) => {
                const root = gltf.scene;
                this._scene.add(root);
                this._zoomFit(root, this._camera);
            }
        );
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
    }
}

window.onload = function() {
    new App();
}