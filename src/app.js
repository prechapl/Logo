import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let renderer, camera, controls, scene, cubeOne, cubeTwo, cubeThree;

class App extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.lighting();
    this.addObjects();
    this.animate();
  }

  sceneSetup = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    controls = new OrbitControls(camera, this.el);
    controls.enableZoom = true;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    this.mount.appendChild(renderer.domElement);
    window.addEventListener("resize", this.handleWindowResize);
  };

  lighting = () => {
    // const light = new THREE.DirectionalLight(0xffffff, 3.0);
    // move the light back and up a bit
    // light.position.set(5, 5, 5);
    // scene.add(light);

    // const hemiLight = new THREE.HemisphereLight(0xfdfde1, 0x030310, 3);
    // scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sphere = new THREE.SphereBufferGeometry(0.5, 16, 8);

    //Green
    const pointLight = new THREE.PointLight(0x1bc236, 1);
    pointLight.position.x = 800;
    pointLight.position.z = 300;
    pointLight.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x1bc236 }))
    );
    scene.add(pointLight);

    //Red
    const pointLight2 = new THREE.PointLight(0xfb3f3f, 1);
    pointLight2.position.x = -800;
    pointLight2.position.z = 300;
    pointLight2.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xfb3f3f }))
    );
    scene.add(pointLight2);

    //Blue
    const pointLight3 = new THREE.PointLight(0x0000ff, 1);
    pointLight3.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0000ff }))
    );
    pointLight3.position.y = 800;
    pointLight3.position.z = 300;
    scene.add(pointLight3);

    //Cyan
    const pointLight4 = new THREE.PointLight(0x00f6ff, 1);
    pointLight4.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x00f6ff }))
    );
    pointLight4.position.y = -800;
    pointLight4.position.z = 300;
    scene.add(pointLight4);
  };

  addObjects = () => {
    const geometryOne = new THREE.BoxBufferGeometry(1, 1, 1);
    const materialOne = new THREE.MeshStandardMaterial({
      color: 0xababab,
      metalness: 0.5,
      roughness: 0.8
    });

    const materialTwo = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.8
    });

    const texture = new THREE.TextureLoader().load("textures/crate.gif");
    const materialThree = new THREE.MeshStandardMaterial({
      map: texture
    });

    cubeOne = new THREE.Mesh(geometryOne, materialOne);
    cubeTwo = new THREE.Mesh(geometryOne, materialTwo);
    cubeTwo.position.x = 1.5;
    cubeThree = new THREE.Mesh(geometryOne, materialThree);
    cubeThree.position.x = -1.5;

    scene.add(cubeOne);
    scene.add(cubeTwo);
    scene.add(cubeThree);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    cubeOne.rotation.x += 0.01;
    cubeOne.rotation.y += 0.01;
    cubeTwo.rotation.x += 0.01;
    cubeTwo.rotation.y += 0.01;
    cubeThree.rotation.x += 0.01;
    cubeThree.rotation.y += 0.01;

    // console.log(renderer.info.render.calls); //add right above the render call
    renderer.render(scene, camera);
  };

  handleWindowResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    controls.dispose();
  }

  render() {
    return <div ref={el => (this.mount = el)} />;
  }
}

export default App;
