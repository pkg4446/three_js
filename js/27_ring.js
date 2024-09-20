import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js"
import { RGBELoader } from "../core/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "../core/jsm/loaders/GLTFLoader.js"

class App {
    constructor() {
        this._setupThreeJs();
        this._setupCamera();
        this._setupLight();
        this._setupControls();
        this._setupEvents();  
        this._setupModel();     
        this._setupUI(); 
    }

    _setupUI() {
        const domRingColors = document.querySelector(".ring-colors");
        const domDiamondColors = document.querySelector(".diamond-colors");

        const ringColors = ["#D4AF37", "#8A8D8F", "#E6C7C2" ];
        const diamondColors =  [ "#6ab04c", "#ffffff", "#eb4d4b", "#f0932b", "#130f40", "#111111" ];

        const cntRingColors = ringColors.length;
        for(let i=0; i<cntRingColors; i++) {
            const dom = document.createElement("div");
            domRingColors.appendChild(dom);
            const color = ringColors[i];
            dom.style.backgroundColor = color;
            dom.setAttribute("color", color);

            dom.addEventListener("click", (event) => {
                const color = event.target.getAttribute("color");
                this._object.traverse(child => {
                    if(child instanceof THREE.Mesh) {
                        if(!child.name.startsWith("GEM")) {
                            //child.material.color = new THREE.Color(color);

                            const materialColor = child.material.color;
                            const newColor = new THREE.Color(color);
                            gsap.to(materialColor, { duration: 2, r: newColor.r, g: newColor.g, b: newColor.b });
                        }
                    }
                });
            });
        }

        const cntDiamondColors = diamondColors.length;
        for(let i=0; i<cntDiamondColors; i++) {
            const dom = document.createElement("div");
            domDiamondColors.appendChild(dom);
            const color = diamondColors[i];
            dom.style.backgroundColor = color;
            dom.setAttribute("color", color);

            dom.addEventListener("click", (event) => {
                const color = event.target.getAttribute("color");
                this._object.traverse(child => {
                    if(child instanceof THREE.Mesh) {
                        if(child.name.startsWith("GEM")) {
                            //child.material.color = new THREE.Color(color);

                            const materialColor = child.material.color;
                            const newColor = new THREE.Color(color);
                            gsap.to(materialColor, { r: newColor.r, g: newColor.g, b: newColor.b });                            
                        }
                    }
                });
            });
        }
    }

    _setupThreeJs() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMappingExposure = 2.5;

        const scene = new THREE.Scene();
        this._scene = scene;
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            70, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            10
        );

        camera.position.set(-0.3, 0.25, -0.5);
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 0.5;
        const lights = [];

        for(let i=0; i<4; i++) {
            const spotLight = new THREE.SpotLight(color, intensity);
            lights.push(spotLight);
            this._scene.add(spotLight);
        }

        this._lights = lights;
    }

    _setupModel() {
        new RGBELoader()
            .setPath("../data/HDR/")
            .load("brown_photostudio_02_4k.hdr", texture => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this._scene.background = texture;
                this._scene.environment = texture;
                this._scene.backgroundBlurriness = 0.5;

                const goldMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color("#D4AF37"),
                    envMap: texture,
                    envMapIntensity: 1,
                    metalness: 1,
                    roughness: 0.15
                });

                const gemMaterial = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color("#6AB04C"),
                    metalness: 0.5,
                    roughness: 0,
                    opacity: 0.8,
                    side: THREE.DoubleSide,
                    transparent: true,
                    transmission: 0.5,
                    ior: 2.4,
                    thickness: 0.3
                });

                const loader = new GLTFLoader();
                loader.load("../data/GLB/ring.glb", gltf => {
                    const object = gltf.scene;
                    object.scale.set(0.3, 0.3, 0.3);
                    this._scene.add(object);
                    this._object = object;

                    object.traverse(child => {
                        if(child instanceof THREE.Mesh) {
                            if(child.name.startsWith("GEM")) {
                                child.material = gemMaterial;
                            } else {
                                child.material = goldMaterial;
                            }
                        }
                    });
                });
            });
    }

    _setupControls() {
        this._orbitControls = new OrbitControls(this._camera, this._divContainer);

        this._orbitControls.enableDamping = true;
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

        const time = this._clock.oldTime * 0.0005;

        if(this._lights) {
            const r = 3;
            const cntLights = this._lights.length;
            const gap = THREE.MathUtils.degToRad(360 / cntLights);
            for(let i=0; i<cntLights; i++) {
                const light = this._lights[i];
                light.position.set(
                    gap*i,
                    Math.cos(time+gap*i)*r,
                    Math.sin(time+gap*i)*r
                );
            }
        }

        if(this._object) this._object.rotation.z = time;
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