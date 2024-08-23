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
        camera.position.z = 10;
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }
/*
    _setModle() {
        const vertices = [];
        for (let index = 0; index < 10000; index++) {
            const axis_x = THREE.MathUtils.randFloatSpread(5);
            const axis_y = THREE.MathUtils.randFloatSpread(5);
            const axis_z = THREE.MathUtils.randFloatSpread(5);
            vertices.push(new THREE.Vector3(axis_x,axis_y,axis_z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const sprite   = new THREE.TextureLoader().load("../core/textures/sprites/disc.png");
        const material = new THREE.PointsMaterial({
            map:   sprite,
            alphaTest: 0.5,
            color: 0xff0000,
            size:  0.1,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        this._scene.add(points);
    }
*/
/*
    _setModle() {
        const vertices = [
            new THREE.Vector3(-1,1,0),
            new THREE.Vector3(1,1,0),
            new THREE.Vector3(-1,-1,0),
            new THREE.Vector3(1,-1,0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const material = new THREE.LineBasicMaterial({color:0xffffff});

        //const line = new THREE.Line(geometry, material);
        //const line = new THREE.LineSegments(geometry, material);
        const line = new THREE.LineLoop(geometry, material);
        this._scene.add(line);
    }
*/
    _setModle() {
        const vertices = [
            new THREE.Vector3(-1,1,0),
            new THREE.Vector3(1,1,0),
            new THREE.Vector3(-1,-1,0),
            new THREE.Vector3(1,-1,0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const material = new THREE.LineDashedMaterial({
            color:0xffffff,
            dashSize: 0.2,
            gapSize:  0.1,
            scale:    1
        });
        
        const line = new THREE.LineLoop(geometry, material);
        line.computeLineDistances();
        this._scene.add(line);
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