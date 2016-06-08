ScanScene = function(windowRef, bgColor) {
  // context
  this.window = windowRef;
  // console.log(this.context);
  // grab the canvas element
  this.container = document.getElementById("canvas-container");
  // get the width and height of the element
  // create all necessary three.js
  // variables to null
  this.OBJLoader = null;
  this.controls = null;
  this.raycaster = null;
  // initialize all variables
  this.init(bgColor);

}

ScanScene.prototype = {

  init: function(bgColor) {
    this.WIDTH = ScanScene.currentResponsiveWidth();
    this.HEIGHT = ScanScene.currentResponsiveHeight();
    ScanScene.scene = new THREE.Scene();
    ScanScene.renderer = new THREE.WebGLRenderer();
    ScanScene.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.container.appendChild(ScanScene.renderer.domElement);
    ScanScene.camera = new THREE.PerspectiveCamera(75, this.WIDTH/this.HEIGHT, 0.1, 1000);
    this.OBJLoader = new OBJLoader();
    this.controls = new THREE.TrackballControls( ScanScene.camera, ScanScene.renderer.domElement );
    this.raycaster = new THREE.Raycaster();
    this.objects = [];

    ScanScene.scene.add( ScanScene.camera );

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    // ScanScene.scene.add(cube);
    ScanScene.renderer.setClearColor( bgColor, 1);
    this.setUpControls();
    this.addLights();
    this.animate();
  },

  setUpControls: function() {
    this.controls.rotateSpeed = 3.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;

    this.controls.noZoom = true;
    this.controls.noPan = true;

    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.3;

    this.controls.keys = [ 65, 83, 68 ];

    this.controls.addEventListener( 'change', this.render );
  },

  addLights: function() {
    // light that follows the camera
    var light1 = new THREE.PointLight( 0xc9c9c9, 1.0, 2500);
    ScanScene.camera.add( light1 );
    // end of light that follows the camera
    // var light2 = new THREE.DirectionalLight( 0xc9c9c9, 1.0);
    // light2.position.set( 0, 0, 10 );
    // ScanScene.scene.add( light2 );
    // var ambLight = new THREE.AmbientLight(0x);
    // ScanScene.scene.add(ambLight);
  },

  addObjectToScene: function(obj) {
    this.objects.push( obj );
    ScanScene.scene.add( obj );
  },

  loadOBJ: function(url, onProgress, onError, onComplete) {
    this.OBJLoader.load(url, function(object, extrema) {
        object.name = "betterScan";
        // console.log(object);
        ScanScene.scene.add( object );
        console.log('max is ' + 2*Math.max.apply(null, extrema));
        ScanScene.camera.position.z = 400;
        ScanScene.camera.position.x = -100;
        ScanScene.camera.position.y = -200;
        onComplete();
    }, onProgress, onError);

  },

  animate: function () {
    // console.log(this.animate);
    requestAnimationFrame( this.animate.bind(this) );
    this.render();
    this.controls.update();
  },

  render: function () {
    ScanScene.renderer.render( ScanScene.scene, ScanScene.camera);
  },

  adjustSize: function() {
    // notify the renderer of the size change

    this.WIDTH = ScanScene.currentResponsiveWidth();
    this.HEIGHT = ScanScene.currentResponsiveHeight();
    ScanScene.renderer.setSize( this.WIDTH, this.HEIGHT );
    // update the camera
    ScanScene.camera.aspect	= this.WIDTH / this.HEIGHT;
    ScanScene.camera.updateProjectionMatrix();
  }

};

ScanScene.currentResponsiveHeight = function() {
  var height;
  var padding = 0;
  var elem1 = document.getElementById("canvas-container");
  var compHeight = window.getComputedStyle(elem1, null).getPropertyValue("height");
  height = Math.floor(Number(compHeight.substring(0,compHeight.length-2)));

  if (window.innerWidth > 768) {
    height = height-padding;
  } else {
    height = height-20;
  }

  return height;
};

ScanScene.currentResponsiveWidth = function() {
  // notify the renderer of the size change
  var width;
  var padding = 0;
  var elem1 = document.getElementById("canvas-container");
  var compWidth = window.getComputedStyle(elem1, null).getPropertyValue("width");
  width = Math.floor(Number(compWidth.substring(0,compWidth.length-2)));

  if (window.innerWidth > 768) {
    width = width-padding;
  } else {
    width = width-20;
  }

  return width;
};
