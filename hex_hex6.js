var size = 0.5;
var columns = 45, rows = 45;
var layout = Layout(layout_pointy, Point(size, size), Point(-21, -21));
var offset = Math.floor ((rows-1)/2);
// hash (q,r)--> (q',r) --> vIDs (q',r)
function hashHexVertex (q,r) {
    var serial = r * (columns+offset) + (q+offset);
    return vIDs[serial];
}

function initHex() {
    var geometry = new THREE.Geometry();
    var verts = geometry.vertices; // ptr assignment
    var i, j, p;

    var vID = 0;
	var nskip;
    
    // assign all vIDs to -1
    for (j = 0; j < rows; j++)
        for (i = 0; i < columns+offset; i++)
            vIDs.push (-1);
    
    for (j = 0; j < rows; j++) {  // r: [0, rows-1]
        nskip = 0;  // for every row...
        vertsInThisRow = 0;
        for (i = 0; i < columns+offset; i++) {  // q': [0, columns+offset-1]
        // for (i = -offset; i < columns; i++) {
            
            // for every row: skip first hex's if necessary
            if (nskip < offset - Math.floor (j/2)) {
                ++nskip;
            	continue;
            }

            // trailing skip
            if (vertsInThisRow == columns) continue;  // vertices already built; start skip
            
            var xy = hex_to_pixel(layout, Hex(i-offset, j, - (i-offset) - j));

            p = new THREE.Vector3(xy.x, xy.y, 0);
            verts.push(p); 
            vIDs [i+(columns+offset)*j] = vID;
            ++vID;
            ++vertsInThisRow;
        }
    }

    //console.log(vIDs);

    var faces = geometry.faces;

    // looping [q,r]
    for (j = 1; j < rows; j++) {  
        for (i = -offset; i < columns - 1; i++) {
            vidA = hashHexVertex (i, j);
            vidB = hashHexVertex (i+1, j);
            vidC = hashHexVertex (i+1, j-1);
            vidD = hashHexVertex (i, j-1);
            
            if (vidA != -1 && vidC != -1 && vidB != -1)
	            faces.push(new THREE.Face3(vidA, vidC, vidB));
            if (vidA != -1 && vidD != -1 && vidC != -1)
	            faces.push(new THREE.Face3(vidA, vidD, vidC));
        }
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var material = new THREE.MeshLambertMaterial({
        wireframe: true,
        color: 0xff1234,
        side: THREE.DoubleSide
    });
    
    var noiseMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            lightPos: {
                type: 'v3',
                value: new THREE.Vector3(-50,- 50, 110)
            },
			opacity: {type: 'f',value: 1}
        },
        vertexShader: document.getElementById('myVertexShader').textContent,
        fragmentShader: document.getElementById('myFragmentShader').textContent,
		
    });

  var shaderMaterial = new THREE.ShaderMaterial ({   
        side: THREE.DoubleSide,
        uniforms: {
            lightPos: {
                type: 'v3',
                value: new THREE.Vector3(50,-30, 110)
            }
        },  
  uniforms: THREE.UniformsUtils.merge([
     THREE.UniformsLib['shadowmap'],{
	 lightPos: {type: 'v3',value: new THREE.Vector3(50,50, 50)}}
    ]),
    
  	vertexShader: [
    THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
    "uniform vec3 lightPos;",
    //"varying vec4 wPos;",
	"varying vec4 worldPosition;",
    "varying float diffuse;",
    "void main() {",
        "vec4 eyepos = modelViewMatrix * vec4(position, 1.0);",
        "vec4 eyeLightPos = viewMatrix * vec4(lightPos, 1.0);",
        "vec3 ll = normalize(eyeLightPos.xyz - eyepos.xyz);",
        "vec3 eyenorm = normalize(normalMatrix * normal);",
        "diffuse = abs(dot(eyenorm, ll));",
       // "wPos = modelMatrix * vec4(position, 1.0);",
		"worldPosition = modelMatrix * vec4(position, 1.0);",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    THREE.ShaderChunk[ "shadowmap_vertex" ],
    "}",
    ].join('\n'),    
    fragmentShader: [
      THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
    "vec3 mod289(vec3 x) {",
        "return x - floor(x * (1.0 / 289.0)) * 289.0;",
    "}",

    "vec4 mod289(vec4 x) {",
        "return x - floor(x * (1.0 / 289.0)) * 289.0;",
    "}",

    "vec4 permute(vec4 x) {",
        "return mod289(((x * 34.0) + 1.0) * x);",
    "}",

    "vec4 taylorInvSqrt(vec4 r) {",
        "return 1.79284291400159 - 0.85373472095314 * r;",
    "}",

    "float snoise(vec3 v) {",
        "const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);",
        "const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);",

        "vec3 i = floor(v + dot(v, C.yyy));",
        "vec3 x0 = v - i + dot(i, C.xxx);",

        "vec3 g = step(x0.yzx, x0.xyz);",
        "vec3 l = 1.0 - g;",
        "vec3 i1 = min(g.xyz, l.zxy);",
        "vec3 i2 = max(g.xyz, l.zxy);",

        "vec3 x1 = x0 - i1 + C.xxx;",
        "vec3 x2 = x0 - i2 + C.yyy;",
        "vec3 x3 = x0 - D.yyy;",

        "i = mod289(i);",
        "vec4 p = permute(permute(permute(",
        "i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));",

        "float n_ = 0.142857142857;",
        "vec3 ns = n_ * D.wyz - D.xzx;",

        "vec4 j = p - 49.0 * floor(p * ns.z * ns.z);",

        "vec4 x_ = floor(j * ns.z);",
        "vec4 y_ = floor(j - 7.0 * x_);",

        "vec4 x = x_ * ns.x + ns.yyyy;",
        "vec4 y = y_ * ns.x + ns.yyyy;",
        "vec4 h = 1.0 - abs(x) - abs(y);",

        "vec4 b0 = vec4(x.xy, y.xy);",
        "vec4 b1 = vec4(x.zw, y.zw);",

        "vec4 s0 = floor(b0) * 2.0 + 1.0;",
        "vec4 s1 = floor(b1) * 2.0 + 1.0;",
        "vec4 sh = -step(h, vec4(0.0));",

        "vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;",
        "vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;",

        "vec3 p0 = vec3(a0.xy, h.x);",
        "vec3 p1 = vec3(a0.zw, h.y);",
        "vec3 p2 = vec3(a1.xy, h.z);",
        "vec3 p3 = vec3(a1.zw, h.w);",

        "vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));",
        "p0 *= norm.x;",
        "p1 *= norm.y;",
        "p2 *= norm.z;",
        "p3 *= norm.w;",

        "vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);",
        "m = m * m;",
        "return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),",
        "dot(p2, x2), dot(p3, x3)));",
    "}",
	
    "varying vec4 worldPosition;",
    "varying float diffuse;",

    "float surface3(vec3 coord) {",
        "float height = 0.0;",
        "height += abs(snoise(coord)) * 1.0;",
        "height += abs(snoise(coord * 2.0)) * 0.5;",
        "height += abs(snoise(coord * 4.0)) * 0.25;",
        "height += abs(snoise(coord * 8.0)) * 0.125;",
        "return height;",
    "}",
	
    "void main(void) {",
        "float scale = 8.;",
        "vec3 coord = scale * vec3(worldPosition.x, worldPosition.y, worldPosition.z);",
        "float r = surface3(coord);",
        "r *= diffuse;",
        "gl_FragColor = vec4(r, r, r, 1.0);",
      THREE.ShaderChunk[ "shadowmap_fragment" ],
      "}",
    ].join('\n'), 
});	
	
	noiseMaterial.transparent = true;
    mesh = new THREE.Mesh(geometry, shaderMaterial);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
    scene.add(mesh);
}

// draw a six-sided polyline (of size one)
function initUnitHexMesh() {
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    var geometry = new THREE.Geometry();
    for (var i = 0, theta = Math.PI / 2; i < 7; i++, theta += Math.PI / 3) {
        var p = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
        geometry.vertices.push(p);
    }
    var line = new THREE.Line(geometry, material);
    return line;
}