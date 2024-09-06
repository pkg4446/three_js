import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";

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
        //this._setModel();
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
            1000
        );
        camera.position.z = 80;
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1.5;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setBackground(){
        /*
        this._scene.background = new THREE.Color(0xffffff);
        //this._scene.fog = new THREE.Fog(0xffffff, 0, 150);
        this._scene.fog = new THREE.FogExp2(0xffffff, 0.02);
        */
        /*
        const loader = new THREE.TextureLoader();
        loader.load("../data/img/earth.jpg", texture => {
            this._scene.background = texture;
            this._setModel();
        });
        */
        /*
        const loader = new THREE.CubeTextureLoader();
        loader.load([
            "../data/img/cube/posx.jpg",
            "../data/img/cube/negx.jpg",
            "../data/img/cube/posy.jpg",
            "../data/img/cube/negy.jpg",
            "../data/img/cube/posz.jpg",
            "../data/img/cube/negz.jpg",
        ], cubeTexture => {
            this._scene.background = cubeTexture;
            this._setModel();
        });
        */
        const loader = new THREE.TextureLoader();
        loader.load("../data/img/puresky.jpg", texture => {
            const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
            renderTarget.fromEquirectangularTexture(this._renderer, texture);
            this._scene.background = renderTarget.texture;
            this._setModel();
        });
    }

    _setModel() {
        const pmremG    = new THREE.PMREMGenerator(this._renderer);
        const renderTarget = pmremG.fromEquirectangular(this._scene.background);
        //const renderTarget = pmremG.fromCubemap(this._scene.background);

        const geometry  = new THREE.SphereGeometry();
        const material1 = new THREE.MeshStandardMaterial({
            color: 0x2ecc71,
            roughness : 0.1,
            metalness : 0.9,
            envMap: renderTarget.texture
        });
        const material2 = new THREE.MeshStandardMaterial({
            color: 0xe74c3c,
            roughness : 0.1,
            metalness : 0.9
        });

        const rangeMin = -20.0, rangeMax = 20.0;
        const gap = 10.0;
        let flag  = true;

        for (let index_x = rangeMin; index_x <= rangeMax; index_x += gap) {
            for (let index_y = rangeMin; index_y <= rangeMax; index_y += gap) {
                for (let index_z = rangeMin*10; index_z <= rangeMax; index_z += gap) {
                    flag = !flag;

                    const mesh = new THREE.Mesh(geometry, flag? material1: material2);
                    mesh.position.set(index_x, index_y, index_z);

                    this._scene.add(mesh);
                }
            }
        }
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
        //this._cube.rotation.x = time;
        //this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}