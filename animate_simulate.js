var difhold = [];
var nowpos = new THREE.Vector3();
var move_direction = new THREE.Vector2();//nowpos-lastpos vector
var target_direction = new THREE.Vector2();//hexpos-nowpos vector
var md_hd_dot;
var dotsum;
var need_balance_ring = 0; // last objring;

function animate_Adv_balance2(){
	var check = 1;
	var check2 = 1;
	var ring = [];
	//find the object's one ring's amount and vID
 	for(var i = 0; i<sumhold.length; i++){
		hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[sumhold[i]].x,mesh.geometry.vertices[sumhold[i]].y));
		ring = hex_ring(hex,1);
		for(var j = 0; j<6; j++){
			var save = hex_to_pixel(layout, ring[j]);
			raycaster = new THREE.Raycaster(new THREE.Vector3(save.x, save.y, -30), new THREE.Vector3(0, 0, 1));
			intersects = raycaster.intersectObjects(pickables);
			if(intersects.length ===0){
				vID = hashHexVertex(ring[j].q,ring[j].r);
				for(var l = 0; l<sumhold.length; l++){
					if(vID === sumhold[l]){
						check2 = 0;
						break;
					}
				}
				check=1;
				for(var k = 0; k<objring_first.length; k++){
					if(vID===objring_first[k]){
						check=0;
						break;
					}
				}				
				if(check===1){
					objring_first.push(vID);
				}			
			}
		}
	}
	//console.log(objring_first.length);
	//end (find the object's one ring's amount and vID)
	
	//make distribution scale to 0~0.5
	ring_distance = [];
	var ring_distribution = [];	
	var save_distance;
	var sum_distance = 0;
	var holdpos = new THREE.Vector2();
	var ringpos = new THREE.Vector2();
	var mindis;
	for(i = 0; i<objring_first.length; i++){
		ringpos.x = mesh.geometry.vertices[objring_first[i]].x;
		ringpos.y = mesh.geometry.vertices[objring_first[i]].y;		
		for(j = 0; j<sumhold.length; j++){
			holdpos.x = mesh.geometry.vertices[sumhold[j]].x;
			holdpos.y = mesh.geometry.vertices[sumhold[j]].y;
			save_distance = ringpos.distanceTo(holdpos);
			if(save_distance<5){
				sum_distance += -mesh.geometry.vertices[sumhold[j]].z/save_distance;
			}
			//sum_distance += save_distance/mesh.geometry.vertices[sumhold[j]].z;
			//console.log(save_distance);
		}
		//console.log(i);
		//console.log(sum_distance);
		ring_distance[i] = sum_distance;
		//console.log(i);
		//console.log(sum_distance);
		sum_distance = 0;
	}
	//console.log("1/slopemax:"+1/slopemax);
	mindis = ring_distance[0];
	for(i = 0; i<ring_distance.length; i++){
		if(ring_distance[i]>mindis){
			mindis = ring_distance[i];
		}
	}
	//console.log(mindis);
	
	while(mindis > slopemax){
		for(j = 0; j<ring_distance.length; j++){
			ring_distance[j] /= 2;
		}
		mindis /= 2;
	}
	/*
	for(i = 0; i<ring_distance.length; i++){
		console.log(i);
		console.log(ring_distance[i]);
	}	*/	
	//end (make distribution scale to 0~0.5)
	
	
	//Adv_balance
	remain = -sum;
	var loop = 0;
	var counter=0;
	var check_vID;
	//console.log("in");
	//console.log(remain);
	nowpos.copy(torus.position);
	
	move_direction.x = nowpos.x-lastpos.x;
	move_direction.y = nowpos.y-lastpos.y;	
	
	while(1===1){
		loop++;
		//console.log("inloop");
		//console.log("objlen:"+objring.length);
		//console.log("sumhold:"+sumhold.length);
		for(i = 0; i<sumhold.length; i++){
			//console.log(i);
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[sumhold[i]].x,mesh.geometry.vertices[sumhold[i]].y));
			ring = hex_ring(hex,1);
			for(j = 0; j<6; j++){
				save = hex_to_pixel(layout, ring[j]);
				raycaster = new THREE.Raycaster(new THREE.Vector3(save.x, save.y, -30), new THREE.Vector3(0, 0, 1));
				intersects = raycaster.intersectObjects(pickables);
				check2 = 1;
				if(intersects.length !=0){
					raydis = intersects[0].point.clone();
				}
				check_vID = hashHexVertex(ring[j].q,ring[j].r);
					if(intersects.length ===0 || raydis.z>mesh.geometry.vertices[check_vID].z){
						//console.log("111");
						vID = hashHexVertex(ring[j].q,ring[j].r);
						for(l = 0; l<sumhold.length; l++){
							if(vID === sumhold[l]){
								check2 = 0;
								break;
							}
						}
						check=1;
						for(k = 0; k<objring.length; k++){
							if(vID===objring[k]){
								check=0;
								break;
							}
						}
						if(check===1){
							target_direction.x = mesh.geometry.vertices[vID].x - nowpos.x;
							target_direction.y = mesh.geometry.vertices[vID].y - nowpos.y;
							//console.log("move_direction: "+ move_direction.x+","+move_direction.y);
							//console.log("target: "+ target_direction.x+","+target_direction.y);
							md_hd_dot = target_direction.dot(move_direction);
							//console.log("dot:"+md_hd_dot);
							if(md_hd_dot>=0){
								dotsum += md_hd_dot;
								objring.push(vID);
							}
						}
					}
			}
		}
		
		if(objring.length === 0){
			break;
		}
		//console.log("len:"+objring.length);
		var in_first_ring = 0;
		var savei;
		for(var z = 0; z<objring.length; z++){
			for(i = 0;i < objring_first.length; i++){
				if(objring[z]===objring_first[i]){
					savei = i;
					in_first_ring = 1;
					break;
				}
			}
			if(in_first_ring === 1){
				mesh.geometry.vertices[objring[z]].z += ring_distance[savei];
				remain -= ring_distance[savei];
			}
			if(in_first_ring ===0){
				mesh.geometry.vertices[objring[z]].z += slopemax;
				remain -= slopemax;
			}
		}
		if(remain <= objring.length){
			//console.log("out");
			break;
		}
		for(i = 0; i < objring.length; i++){
			sumhold.push(objring[i]);
		}
		objring = [];	
		
	}
		
}


function animate_Adv_balance(){
	var nu = [];
	var check = 1;
	var check2 = 1; 
	var ring = [];
	remain = -sum;
	var loop = 0;
	var counter=0;	
	var check_reduce = 0;
	nowpos.copy(torus.position);
	
	move_direction.x = nowpos.x-lastpos.x;
	move_direction.y = nowpos.y-lastpos.y;
	//console.log("in adv remain(-sum):"+remain);	
	//console.log("sumhold:"+sumhold.length);
	while(1===1){
		loop++;
		for(var i = 0; i<sumhold.length; i++){
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[sumhold[i]].x,mesh.geometry.vertices[sumhold[i]].y));
			ring = hex_ring(hex,1);
			for(var j = 0; j<6; j++){
				var save = hex_to_pixel(layout, ring[j]);
				raycaster = new THREE.Raycaster(new THREE.Vector3(save.x, save.y, -30), new THREE.Vector3(0, 0, 1));
				intersects = raycaster.intersectObjects(pickables);
				check2 = 1;
					if(intersects.length ===0){
						vID = hashHexVertex(ring[j].q,ring[j].r);
						for(var l = 0; l<sumhold.length; l++){
							if(vID === sumhold[l]){
								check2 = 0;
								break;
							}
						}
						check=1;
						/*if(check2===0){
							check = 0;
						}*/
						if(loop!=1){
							for(var k = 0; k<objring.length; k++){
								if(vID===objring[k]){
									check=0;
									break;
								}
							}
						}
						if(check===1){
							target_direction.x = mesh.geometry.vertices[vID].x - nowpos.x;
							target_direction.y = mesh.geometry.vertices[vID].y - nowpos.y;
							//console.log("move_direction: "+ move_direction.x+","+move_direction.y);
							//console.log("target: "+ target_direction.x+","+target_direction.y);
							md_hd_dot = target_direction.dot(move_direction);
							//console.log("dot:"+md_hd_dot);
							if(md_hd_dot>=0){
								dotsum += md_hd_dot;
								objring.push(vID);
								if(loop===1){
									objring_first.push(vID);
								}
							}
						}
					}
			}
		}	
		
		if(objring.length === 0){
			break;
		}
		
		
		if(remain > objring.length){
			remain -= objring.length*slopemax;
			//console.log("reduce :"+objring.length*slopemax);
			//console.log("reduce remain:"+remain);
			check_reduce = 1;
		}
		if(check_reduce === 1){
			for(var z = 0; z<objring.length; z++){
				mesh.geometry.vertices[objring[z]].z += slopemax; 
			}
		}
		check_reduce = 0;
		if(remain <= objring.length){
			break;
		}
		for(i = 0; i < objring.length; i++){
			sumhold.push(objring[i]);
		}
		objring = [];
		dotsum = 0;
	}

}
function animate_Bas_balance2(){
	var finish = false;
	var heigher = [];//較高的位置
	var lower = [];//較矮的位置	
	var heigh = [];//相差高度	
	var loop = 0;
	var save;
	var check = true;
	var check2 = true;
	var SvID;
	var ring = [];
	var number = 0;
	var sumdis = 0;
	//console.log(remain/objring_first.length);
	
	for(var i = 0; i<ring_distance.length; i++){
		sumdis += ring_distance[i];
	}
	
	for(i = 0; i<objring_first.length; i++){
		mesh.geometry.vertices[objring_first[i]].z += remain*ring_distance[i]/sumdis;
	}
	
	while(finish === false){
		loop++;
		for(i = 0; i<objring.length; i++){
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[objring[i]].x,mesh.geometry.vertices[objring[i]].y));
			vID = hashHexVertex(hex.q,hex.r);
			SvID = vID;
			ring = hex_ring(hex,1);
			for(var j = 0; j<6; j++){
				vID = hashHexVertex(ring[j].q,ring[j].r);
				check = true;
				check2 = true;
				if(mesh.geometry.vertices[objring[i]].z - mesh.geometry.vertices[vID].z > 0.335){
					for(var k = 0; k < hold.length; k++){
						if(vID===hold[k]){
							check = false;
							break;
						}
					}
					if(check === true){
						for(k = 0; k<lower.length; k++){
							if(vID===lower[k]){
								check2 = false;
							}
						}
						if(check2 === true){
							//console.log("true");
							lower.push(vID);
							heigher.push(SvID);
							heigh.push(mesh.geometry.vertices[SvID].z-mesh.geometry.vertices[vID].z);	
						}						
					}		
				}
			}
		}

		if(heigher[0]===undefined){
			finish = true;
			break;
		}
		
		for(i = 0; i<heigh.length; i++){
			for(j = 0; j<heigh.length-1; j++){
				if(heigh[j]>heigh[j+1]){
					save = heigh[j];
					heigh[j]=heigh[j+1];
					heigh[j+1]=save;
					
					save = heigher[j];
					heigher[j]=heigher[j+1];
					heigher[j+1]=save;				
					
					save = lower[j];
					lower[j]=lower[j+1];
					lower[j+1]=save;
				}
			}
		}
		
		for(i = 0; i<heigh.length; i++){
			while(mesh.geometry.vertices[heigher[i]].z-mesh.geometry.vertices[lower[i]].z>0.335){
				mesh.geometry.vertices[heigher[i]].z-=0.2;
				mesh.geometry.vertices[lower[i]].z+=0.2;
				heigh[i]-=0.4;
				number++;				
			}
		}
		for(i = 0; i<lower.length; i++){
			objring.push(lower[i]);
		}
		heigher = [];
		lower = [];
		heigh = [];
	}
	need_balance_ring += loop;		
}
function animate_Bas_balance(){
	var finish = false;
	var heigher = [];//較高的位置
	var lower = [];//較矮的位置	
	var heigh = [];//相差高度	
	var counter = 0;
	var save;
	var check = true;
	var check2 = true;
	var SvID;
	var ring = [];
	var number = 0;
	//console.log("in bas remain"+remain);
	for(var i = 0; i<objring_first.length; i++){
		mesh.geometry.vertices[objring_first[i]].z += remain/objring_first.length;
	}
	
	while(finish === false){
		for(i = 0; i<objring.length; i++){
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[objring[i]].x,mesh.geometry.vertices[objring[i]].y));
			vID = hashHexVertex(hex.q,hex.r);
			SvID = vID;
			ring = hex_ring(hex,1);
			for(var j = 0; j<6; j++){
				vID = hashHexVertex(ring[j].q,ring[j].r);
				check = true;
				check2 = true;
				if(mesh.geometry.vertices[objring[i]].z - mesh.geometry.vertices[vID].z > 1){
					for(var k = 0; k < hold.length; k++){
						if(vID===hold[k]){
							check = false;
							break;
						}
					}
					if(check === true){
						for(k = 0; k<lower.length; k++){
							if(vID===lower[k]){
								check2 = false;
							}
						}
						if(check2 === true){
							lower.push(vID);
							heigher.push(SvID);
							heigh.push(mesh.geometry.vertices[SvID].z-mesh.geometry.vertices[vID].z);	
						}						
					}		
				}
			}
		}
		
		if(heigher[0]===undefined){
			finish = true;
			break;
		}
		
		for(i = 0; i<heigh.length; i++){
			for(j = 0; j<heigh.length-1; j++){
				if(heigh[j]>heigh[j+1]){
					save = heigh[j];
					heigh[j]=heigh[j+1];
					heigh[j+1]=save;
					
					save = heigher[j];
					heigher[j]=heigher[j+1];
					heigher[j+1]=save;				
					
					save = lower[j];
					lower[j]=lower[j+1];
					lower[j+1]=save;
				}
			}
		}

		for(i = 0; i<heigh.length; i++){
			while(mesh.geometry.vertices[heigher[i]].z-mesh.geometry.vertices[lower[i]].z>slopemax){
				mesh.geometry.vertices[heigher[i]].z-=0.2;
				mesh.geometry.vertices[lower[i]].z+=0.2;
				heigh[i]-=0.4;
				number++;				
			}
		}
		for(i = 0; i<lower.length; i++){
			objring.push(lower[i]);
		}
		heigher = [];
		lower = [];
		heigh = [];
	}
	need_balance_ring += loop;
}

function last_balance(){	
	//need_balance = lastpos_sumhold
	var next_balance = []; //if next_balance is not undefined, to next;
	//hex = pixel_to_hex(layout, Point(lastpos.x, lastpos.y));
	var heigher = [];//較高的位置
	var lower = [];//較矮的位置	
	var heigh = [];//相差高度
	var finish = false;
	var save;
	var check = true;
	var check2 = true;
	var SvID;
	var ring2_vID;
	var ring = [];
	var ring2 = [];
	var number = 0;
	var hring = 0;
/*
	console.log("in last balance lastpos: "+lastpos.x+","+lastpos.y);
	while(finish === false){
		finish = true;
		for(var k = 0; k < need_balance_ring; k++){
			//hring++;
			hex = pixel_to_hex(layout, Point(lastpos.x, lastpos.y));
			vID = hashHexVertex(hex.q,hex.r);
			//mesh.geometry.vertices[vID].z = 50;
			SvID = vID;
			ring = hex_ring(hex,k);
			for(var i = 0; i< 6*k ;i++){
				if(i === 0){
					vID = hashHexVertex(ring[i].q,ring[i].r);
					if(vID>=0){
						if(mesh.geometry.vertices[vID].z>mesh.geometry.vertices[SvID].z){
							finish = false;
							heigher.push(vID);
							lower.push(SvID);
							heigh.push(mesh.geometry.vertices[vID].z-mesh.geometry.vertices[SvID].z);
						}
						else if(mesh.geometry.vertices[SvID].z>mesh.geometry.vertices[vID].z){
							finish = false;
							heigher.push(SvID);
							lower.push(vID);
							heigh.push(mesh.geometry.vertices[SvID].z-mesh.geometry.vertices[vID].z);					
						}
					}
				}
				else if(hring > 0){
					SvID = hashHexVertex(ring[i].q,ring[i].r);
					ring2 = hex_ring(ring[i],hring);
					for(var j = 0; j < 6; j++){
						vID = hashHexVertex(ring2[j].q,ring2[j].r);
						if(vID>=0){
							if(mesh.geometry.vertices[vID].z>mesh.geometry.vertices[SvID].z){
								finish = false;
								heigher.push(vID);
								lower.push(SvID);
								heigh.push(mesh.geometry.vertices[vID].z-mesh.geometry.vertices[SvID].z);
							}
							else if(mesh.geometry.vertices[SvID].z>mesh.geometry.vertices[vID].z){
								finish = false;
								heigher.push(SvID);
								lower.push(vID);
								heigh.push(mesh.geometry.vertices[SvID].z-mesh.geometry.vertices[vID].z);					
							}
						}
					}
				}
			}
			
			for(i = 0; i<heigh.length; i++){
				for(j = 0; j<heigh.length-1; j++){
					if(heigh[j]>heigh[j+1]){
						save = heigh[j];
						heigh[j]=heigh[j+1];
						heigh[j+1]=save;
						
						save = heigher[j];
						heigher[j]=heigher[j+1];
						heigher[j+1]=save;				
						
						save = lower[j];
						lower[j]=lower[j+1];
						lower[j+1]=save;
					}
				}
			}		
			for(i = 0; i<heigh.length; i++){
				while(mesh.geometry.vertices[heigher[i]].z-mesh.geometry.vertices[lower[i]].z>slopemax){
					mesh.geometry.vertices[heigher[i]].z-=0.2;
					mesh.geometry.vertices[lower[i]].z+=0.2;
					heigh[i]-=0.4;
					number++;
					//console.log(number);				
				}
			}
			heigher = [];
			lower = [];
			heigh = [];
		}
	}
*/	
	

	while(finish === false){

		for(var i = 0; i < need_balance.length; i++){
			//console.log(i);
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[need_balance[i]].x,mesh.geometry.vertices[need_balance[i]].y));
			vID = hashHexVertex(hex.q,hex.r);
			SvID = vID;
			ring = hex_ring(hex,1);
			for(var j = 0; j<6; j++){
				vID = hashHexVertex(ring[j].q,ring[j].r);
				check = true;
				check2 = true;
				if(mesh.geometry.vertices[need_balance[i]].z - mesh.geometry.vertices[vID].z > 1){
					for(var k = 0; k < hold.length; k++){
						if(vID===hold[k]){
							check = false;
							break;
						}
					}
					if(check === true){
						for(k = 0; k<lower.length; k++){
							if(vID===lower[k]){
								check2 = false;
							}
						}
						if(check2 === true){
							lower.push(vID);
							heigher.push(SvID);
							heigh.push(mesh.geometry.vertices[SvID].z-mesh.geometry.vertices[vID].z);	
						}						
					}		
				}
			}

		}
		if(heigher[0]===undefined){
			finish = true;
			break;
		}
		
		for(i = 0; i<heigh.length; i++){
			for(j = 0; j<heigh.length-1; j++){
				if(heigh[j]>heigh[j+1]){
					save = heigh[j];
					heigh[j]=heigh[j+1];
					heigh[j+1]=save;
					
					save = heigher[j];
					heigher[j]=heigher[j+1];
					heigher[j+1]=save;				
					
					save = lower[j];
					lower[j]=lower[j+1];
					lower[j+1]=save;
				}
			}
		}
		
		for(i = 0; i<heigh.length; i++){
			while(mesh.geometry.vertices[heigher[i]].z-mesh.geometry.vertices[lower[i]].z>slopemax){
				mesh.geometry.vertices[heigher[i]].z-=0.2;
				mesh.geometry.vertices[lower[i]].z+=0.2;
				heigh[i]-=0.4;
				number++;
				//console.log(number);				
			}
		}
		for(i = 0; i<lower.length; i++){
			objring.push(lower[i]);
		}
		heigher = [];
		lower = [];
		heigh = [];
		
	}


	
}






