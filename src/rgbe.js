import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker.js";
let cubeGenerator, renderer, scene;

class Rgbe extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.animate();
    this.lighting();
  }

  sceneSetup = () => {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.25,
      20
    );
    this.camera.position.z = 7;

    scene = new THREE.Scene();
    // load HDR, then Models
    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath("textures/")
      .load("hdrvfx_chanc_1_n1_v3_3k_Env.hdr", function(texture) {
        cubeGenerator = new EquirectangularToCubeGenerator(texture, {
          resolution: 5000
        });

        cubeGenerator.update(renderer);

        const pmremGenerator = new PMREMGenerator(
          cubeGenerator.renderTarget.texture
        );
        pmremGenerator.update(renderer);
        const pmremCubeUVPacker = new PMREMCubeUVPacker(
          pmremGenerator.cubeLods
        );
        pmremCubeUVPacker.update(renderer);

        const envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

        // Models
        const Type = new GLTFLoader().setPath("/models/");
        Type.load("AppAge-3D.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                envMap: envMap,
                // envMapIntensity: -1,
                color: 0x000000,
                metalness: 1,
                roughness: 0.2
              });
            }
          });
          scene.add(gltf.scene);
        });

        const Icon = new GLTFLoader().setPath("/models/");
        Icon.load("AppAge-Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                envMap: envMap,
                // envMapIntensity: 1.5,
                // emissive: 0xfff000,
                // emissiveIntensity: 0.2,
                color: 0xfddf73,
                metalness: 1,
                roughness: 0.2
              });
            }
          });
          scene.add(gltf.scene);
        });
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();

        // ** toggle background - solid color or hdr image background

        // scene.background = cubeGenerator.renderTarget;
        scene.background = new THREE.Color(0x000000);
      });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    this.container.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.target.set(0, -0.2, -0.2);
    this.controls.update();
    window.addEventListener("resize", this.onWindowResize, false);
  };

  lighting = () => {
    // Blue back
    RectAreaLightUniformsLib.init();
    this.rectLight1 = new THREE.RectAreaLight(0x0030ff, 1, 5, 50);
    this.rectLight1.position.set(0, 0, -10);
    this.rectLight1.lookAt(0, 0, 0);
    scene.add(this.rectLight1);

    // Blue 2
    this.rectLight2 = new THREE.RectAreaLight(0x0030ff, 1, 5, 50);
    this.rectLight2.position.x = -9;
    this.rectLight2.position.z = 3;
    this.rectLight2.lookAt(0, 0, 0);
    scene.add(this.rectLight2);

    // Red
    this.rectLight3 = new THREE.RectAreaLight(0xfb3f3f, 1, 5, 50);
    this.rectLight3.position.x = 8;
    this.rectLight3.position.z = 3;
    this.rectLight3.lookAt(0, 0, 0);
    scene.add(this.rectLight3);

    // Green
    this.rectLight4 = new THREE.RectAreaLight(0x18ff00, 1, 5, 50);
    this.rectLight4.position.x = -8;
    this.rectLight4.position.z = -6;
    this.rectLight4.lookAt(0, 0, 0);
    scene.add(this.rectLight4);

    //Green 2
    this.rectLight5 = new THREE.RectAreaLight(0x18ff00, 1, 10, 50);
    this.rectLight5.position.set(0, 0, 10);
    this.rectLight5.lookAt(0, 0, 0);
    scene.add(this.rectLight5);

    // Red 2
    this.rectLight6 = new THREE.RectAreaLight(0xfb3f3f, 1, 15, 50);
    this.rectLight6.position.x = -10;
    this.rectLight6.position.z = 10;
    this.rectLight6.lookAt(0, 0, 0);
    scene.add(this.rectLight6);
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.Icon && this.Type) {
      this.Icon.rotation.y += 0.005;
      this.Type.rotation.y += 0.005;
    }
    renderer.render(scene, this.camera);
  };

  render() {
    return <div ref={el => (this.mount = el)} />;
  }
}

export default Rgbe;
