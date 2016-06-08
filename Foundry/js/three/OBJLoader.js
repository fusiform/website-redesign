var geo = new THREE.Geometry();

OBJLoader = function(manager) {

    this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

};



OBJLoader.prototype = {

    constructor: OBJLoader,

    load: function(url, onLoad, onProgress, onError) {

        var scope = this;

        var loader = new THREE.XHRLoader(scope.manager);
        loader.load(url, function(text) {
            // console.log("done loading");
            scope.parse(text, onLoad);

        }, onProgress, onError);

    },



    parse: function(text, callback) {

        var container = new THREE.Object3D();



        //stores colors of vertices
        var vcolors = [];

        // v float float float float float float

        var vertex_pattern1 = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

        // v float float float

        var vertex_pattern2 = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

        // vn float float float

        var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

        // f vertex//normal vertex//normal vertex//normal ...

        var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))/;
        var face_pattern5 = /f( +(-?\d+))( +(-?\d+))( +(-?\d+))/;

        var lines = text.split('\n');
        //alert(lines.length);
        var min_x;
        var max_x;
        var min_y;
        var max_y;
        var min_z;
        var max_z;

        for (var i = 0; i < lines.length; i++) {

            var line = lines[i];
            line = line.trim();

            var result;
            if (line.length === 0 || line.charAt(0) === '#') {

                continue;

            } else if ((result = vertex_pattern1.exec(line)) !== null) {

                var x = parseFloat(result[1]);
                var y = parseFloat(result[2]);
                var z = parseFloat(result[3]);
                geo.vertices.push(new THREE.Vector3(x, y, z));
                var color = new THREE.Color(parseFloat(result[4]), parseFloat(result[5]), parseFloat(result[6]));
                vcolors.push(color);
				if (min_x !== undefined && max_x !== undefined) {
                    if (x < min_x) {
                        min_x = x;
                    } else if (x > max_x) {
                        max_x = x;
                    }
                } else {
                    min_x = x
                    max_x = x
                }
                if (min_y !== undefined && max_y !== undefined) {
                    if (y < min_y) {
                        min_y = y;
                    } else if (y > max_y) {
                        max_y = y;
                    }
                } else {
                    min_y = y
                    max_y = y
                }
                if (min_z !== undefined && max_z !== undefined) {
                    if (z < min_z) {
                        min_z = z;
                    } else if (z > max_z) {
                        max_z = z;
                    }
                } else {
                    min_z = z
                    max_z = z
                }

            } else if ((result = vertex_pattern2.exec(line)) !== null) {
                var x = parseFloat(result[1]);
                var y = parseFloat(result[2]);
                var z = parseFloat(result[3]);
                geo.vertices.push(new THREE.Vector3(x, y, z));

                if (min_x !== undefined && max_x !== undefined) {
                    if (x < min_x) {
                        min_x = x;
                    } else if (x > max_x) {
                        max_x = x;
                    }
                } else {
                    min_x = x
                    max_x = x
                }
                if (min_y !== undefined && max_y !== undefined) {
                    if (y < min_y) {
                        min_y = y;
                    } else if (y > max_y) {
                        max_y = y;
                    }
                } else {
                    min_y = y
                    max_y = y
                }
                if (min_z !== undefined && max_z !== undefined) {
                    if (z < min_z) {
                        min_z = z;
                    } else if (z > max_z) {
                        max_z = z;
                    }
                } else {
                    min_z = z
                    max_z = z
                }

            } else if ((result = normal_pattern.exec(line)) !== null) {

                //do nothing

            } else if ((result = face_pattern4.exec(line)) !== null) {
                var fa = new THREE.Face3(parseFloat(result[2]) - 1, parseFloat(result[5]) - 1,
                    parseFloat(result[8]) - 1);
                fa.vertexColors[0] = vcolors[parseFloat(result[2]) - 1];
                fa.vertexColors[1] = vcolors[parseFloat(result[5]) - 1];
                fa.vertexColors[2] = vcolors[parseFloat(result[8]) - 1];

                geo.faces.push(fa);


            } else if ((result = face_pattern5.exec(line)) !== null) {
                var fa = new THREE.Face3(parseFloat(result[1]) - 1, parseFloat(result[3]) - 1,parseFloat(result[5]) - 1);
                geo.faces.push(fa);


            } else {

            }

        }
        // console.log(geo.faces.length);
        geo.computeFaceNormals();

        // Using this material is important.
        var mat = new THREE.MeshPhongMaterial({
            vertexColors: THREE.VertexColors
        });

        var mesh = new THREE.Mesh(geo, mat);
        container.add(mesh);

        // console.timeEnd('OBJLoader');

        callback( container, [min_x, max_x, min_y, max_y, min_z, max_z]);

    }

};
