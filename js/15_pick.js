import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";

class Particle{
    constructor(scene, geometry, material, x, y){
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        mesh.wrapper = this;
        this.awakenTime = undefined;
        this._mesh = mesh;
    }

    awake(time){
        if(!this.awakenTime){
            this.awakenTime = time;
        }
    }

    update(time){
        if(this.awakenTime){
            const period = 12.0;
            const t = time - this.awakenTime;
            if(t >= period) this.awakenTime = undefined;

            this._mesh.rotation.x = THREE.MathUtils.lerp(0, Math.PI*2*period, t/period);
            let h_s, l;
            if(t < period/2){
                h_s = THREE.MathUtils.lerp(0.0, 1.0, t/(period/2));
                l = THREE.MathUtils.lerp(0.1, 1.0, t/(period/2));
            }else{
                h_s = THREE.MathUtils.lerp(1.0, 0.0, t/(period/2.0) - 1);
                l = THREE.MathUtils.lerp(1.0, 0.1, t/(period/2.0) - 1);
            }

            this._mesh.material.color.setHSL(h_s, h_s, l);
        }
    }
}

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
        this._setPicking();

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
        camera.position.z = 40;
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 0.1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _setPicking(){
        const raycaster = new THREE.Raycaster();
        raycaster.cursorNormalizedPosition = undefined;
        this._divContainer.addEventListener("mousemove", this._onMouseMove.bind(this));
        this._raycaster = raycaster;
    }

    _onMouseMove(event){
        const width  = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        const x = (event.offsetX / width)*2  - 1;
        const y = -(event.offsetY / height)*2 + 1;

        this._raycaster.cursorNormalizedPosition = {x,y};
    }

    _setModle() {
        const geometry = new THREE.BoxGeometry();
        for (let index_x = -20; index_x <= 20; index_x+=1.1) {
            for (let index_y = -20; index_y <= 20; index_y+=1.1) {
                const color = new THREE.Color();
                color.setHSL(0, 0, 0.1);
                const material = new THREE.MeshStandardMaterial({
                    color
                });
                new Particle(this._scene, geometry, material, index_x, index_y);
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

    update(time) {
        time *= 0.001; // second unit

        if(this._raycaster && this._raycaster.cursorNormalizedPosition) { 
            this._raycaster.setFromCamera(this._raycaster.cursorNormalizedPosition, this._camera);
            const targets = this._raycaster.intersectObjects(this._scene.children);
            if(targets.length > 0) {
                const mesh = targets[0].object;
                const particle = mesh.wrapper;
                particle.awake(time); 
            }
        }

        this._scene.traverse((obj3d) => {
            if(obj3d instanceof THREE.Mesh) {
                obj3d.wrapper.update(time);
            }
        });
    }
}

window.onload = function() {
    new App();
}