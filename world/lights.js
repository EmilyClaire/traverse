function mainLights(){
    var dirLight = new THREE.DirectionalLight(0xE6D8AF, .1);
    dirLight.position.set(0, 200, 0);
    scene.add(dirLight);
}

var pointLights;
function pointLights(){
	pointLights=[];
	var emotionToLightColor={'anger':0xA8263F,'joy':0xFDAA43,'fear':0x3B3F78};
	var xCoord;
	var color;
	var emotions=Object.keys(emotionToLightColor);
	for(var i=0; i<emotions.length; i++){
		for(var j=0; j<Object.keys(globalTerrainData.xZones).length; j++){
			xCoord=randomXInEmotion(emotions[i]);
			var color=emotionToLightColor[emotions[i]];
			pointLights.push(singlePointLight(globalTerrainData.xZones[j],Math.random()*200,xCoord,color,color));	
		}		
	}
}


function singlePointLight(x,y,z,lightColor,meshColor){
	  var glowShader = {
	    vertex:
	    `
	    varying vec2 vUv;
	    void main() 
	    {
	      vUv=uv;
	      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	    }
	  
	    `,
	    fragment:
	    `
	    uniform vec3 glowColor;
	    varying float intensity;
	    uniform float time;
	    varying vec2 vUv;
	    void main() 
	    {
	      float tick = time / 200.0;
	      float intensity = (
	              sin(64.0 * vUv.x + tick) +
	              cos(-64.0 * vUv.y + tick)
	            );
	      vec3 glow = glowColor * intensity;
	      gl_FragColor = vec4( glow, 1.0 );
	    }
	    `
	  };
	var geometry = new THREE.SphereGeometry(.6,32,32 );
	var material=new THREE.ShaderMaterial( 
			{
			    uniforms: 
				{ "time": {type: "f", value: 0},
					glowColor: { type: "c", value: new THREE.Color(meshColor) }
			},
				vertexShader:   glowShader.vertex,
				fragmentShader: glowShader.fragment,
				side: THREE.DoubleSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x,y,z);
	scene.add( sphere);

	var point = new THREE.PointLight(lightColor, .8, 150);
	sphere.add(point);

	geometry = new THREE.SphereGeometry(.7,32,32 );

	return sphere;

}



function animatePointLights(){
	for(var i=0; i<pointLights.length; i++){
		pointLights[i].rotation.x+=.01;
		pointLights[i].rotation.y+=.01;
		pointLights[i].rotation.z+=.01;
	}
}