import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "../core/jsm/geometries/TeapotGeometry.js";

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
        this._setBackground();
        this._setModle();
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
        camera.position.set(0, 4, 5);
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setBackground(){
        const loader = new THREE.TextureLoader();
        loader.load("../data/img/puresky.jpg", texture => {
            const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
            renderTarget.fromEquirectangularTexture(this._renderer, texture);
            this._scene.background = renderTarget.texture;
        });
    }

    _setModle() {
        const teapotRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
                format: THREE.RGBFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter
        });
        //teapotRenderTarget._pmremGen = new THREE.PMREMGenerator(this._renderer);
        const teapotCamera   = new THREE.CubeCamera(0.01, 10, teapotRenderTarget);
        const teapotGeometry = new TeapotGeometry(0.7, 24);
        const teapotMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.05,
            ior: 2.5,
            thickness: 0.2,
            transmission: 1,
            side: THREE.DoubleSide,
            envMap: teapotRenderTarget.texture,
            envMapIntensity: 1
        });
        const teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
        teapot.add(teapotCamera);
        this._scene.add(teapot);
        this._teapot = teapot;

        const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 32);
        const cylinderMaterial = new THREE.MeshNormalMaterial();
        const cylinderPivot    = new THREE.Object3D();
        for (let degree = 0; degree <= 360; degree+=30) {
           const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
           const radian   = THREE.MathUtils.degToRad(degree);
           cylinder.position.set(2*Math.sin(radian), 0, 2*Math.cos(radian));
           cylinderPivot.add(cylinder);
        }
        this._scene.add(cylinderPivot);
        this._cylinderPivot = cylinderPivot;
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
        if(this._cylinderPivot){
            this._cylinderPivot.rotation.y = Math.sin(time/2);
        }
        if(this._teapot){
            this._teapot.visible = false;
            const teapotCamera = this._teapot.children[0];
            teapotCamera.update(this._renderer, this._scene);
            /*
            const renderTarget = teapotCamera.renderTarget._pmremGen.fromCubemap(teapotCamera.renderTarget.texture);
            this._teapot.material.envMap = renderTarget.texture;
            this._teapot.material.needsUpdate = true;
            */
            this._teapot.visible = true;
        }
    }
}

window.onload = function() {
    new App();
}