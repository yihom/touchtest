var animate_ring_amount = [];//�x�s�C��ring���ƶq�C
var animate_ring_save = [];//�x�s�C��ring����m�C
var animate_find_number = 0;//�j�M�ĴX��ring�C
var animate_BoundingVertices = [];

var save_ring_amount = [];
var save_ring_save = [];
var save_BoundingVertices = [];

var need_balance_ring = 0; // last objring;
var undir = [];
function animate_FindRings(fobj){
	var ring = [];
	var repeat;
	var repeat1;
	var repeat2;
	var check;

	save_BoundingVertices = [];
	NewRing = [];
	for(j = 0; j <sumhold.length; j++){
		hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[sumhold[j]].x,mesh.geometry.vertices[sumhold[j]].y));
		ring = hex_ring(hex,1);
		for(k = 0; k < 6; k++){
			var save = hex_to_pixel(layout, ring[k]);
			raycaster = new THREE.Raycaster(new THREE.Vector3(save.x, save.y, -30), new THREE.Vector3(0, 0, 1));
			intersects = raycaster.intersectObjects(pickables);
			repeat = false;
			repeat1 = false;
			repeat2 = false;
			if(intersects.length !=0){//�p�G�������쪫��A�˴����׬O�_�C��F���C
				vID = hashHexVertex(ring[k].q,ring[k].r);
				raydis = intersects[0].point.clone();
				if(raydis.z>mesh.geometry.vertices[vID].z){
					if(animate_find_number==0){
						for(check = 0; check < NewRing.length; check++){//�ˬd�O�_���w�g�x�s�L����m�C
							if(NewRing[check]===vID){
								repeat = true;
								break;
							}
						}
						for(check = 0; check < sumhold.length; check++){//�ˬd�O�_�����ˬd��m�C
							if(sumhold[check]===vID){
								repeat1 = true;
								break;
							}
						}
						for(check = 0; check < undir.length; check++){
							if(undir[check]===vID){
								repeat2 = true;
								break;
							}							
						}
						if(repeat === false && repeat1 === false && repeat2 === false){//�S�����Ƥ~�x�s�C
							save_BoundingVertices.push(vID);
							NewRing.push(vID);
						}
					}
					if(animate_find_number!=0){
						for(check = 0; check < NewRing.length; check++){//�ˬd�O�_���w�g�x�s�L����m�C
							if(NewRing[check]===vID){
								repeat = true;
								break;
							}
						}
						for(check = 0; check < sumhold.length; check++){//�ˬd�O�_�����ˬd��m�C
							if(sumhold[check]===vID){
								repeat1 = true;
								break;
							}
						}
						for(check = 0; check < undir.length; check++){
							if(undir[check]===vID){
								repeat2 = true;
								break;
							}							
						}						
						if(repeat === false && repeat1 === false && repeat2 === false){//�S�����Ƥ~�x�s�C
							NewRing.push(vID);
						}
					}
						
				}
					
			}
				
				
			if(intersects.length ==0){//�p�G�S�����쪫��A�x�s��m�C
				vID = hashHexVertex(ring[k].q,ring[k].r);
				if(animate_find_number==0){
					for(check = 0; check < NewRing.length; check++){//�ˬd�O�_���w�g�x�s�L����m�C
						if(NewRing[check]===vID){
							repeat = true;
							break;
						}
					}
					for(check = 0; check < sumhold.length; check++){//�ˬd�O�_�����ˬd��m�C
						if(sumhold[check]===vID){
							repeat1 = true;
							break;
						}
					}
					for(check = 0; check < undir.length; check++){
						if(undir[check]===vID){
							repeat2 = true;
							break;
						}							
					}					
					if(repeat === false && repeat1 === false && repeat2 === false){//�S�����Ƥ~�x�s�C
						save_BoundingVertices.push(vID);
						NewRing.push(vID);
					}
				}
				if(animate_find_number!=0){
					for(check = 0; check < NewRing.length; check++){//�ˬd�O�_���w�g�x�s�L����m�C
						if(NewRing[check]===vID){
							repeat = true;
							break;
						}
					}
					for(check = 0; check < sumhold.length; check++){//�ˬd�O�_�����ˬd��m�C
						if(sumhold[check]===vID){
							repeat1 = true;
							break;
						}
					}
					for(check = 0; check < undir.length; check++){
						if(undir[check]===vID){
							repeat2 = true;
							break;
						}							
					}					
					if(repeat === false && repeat1 === false && repeat2 === false){//�S�����Ƥ~�x�s�C
						NewRing.push(vID);
					}
				}

			}
				
		}
	}
	save_ring_amount.push(NewRing.length);//�x�s�C��ring���ƶq�C
	//console.log(save_ring_amount[animate_find_number]);
	
	animate_ring_save[animate_find_number] = new Array();
	
	
	
	if(animate_find_number == 0){
		Find_Normal(fobj);
		//console.log("123");
		//console.log("11:"+animate_BoundingVertices.length);
		for(l = 0; l < animate_BoundingVertices.length; l++){
			//console.log("11:"+animate_BoundingVertices.length);
			sumhold.push(animate_BoundingVertices[l]);
			//console.log("1:"+NewRing[l]);
			animate_ring_save[animate_find_number][l]= NewRing[l];//�x�s�C��ring����m�C
			//fobj.ring_save.push(NewRing[l]);
			//console.log("2:"+save_ring_save[animate_find_number][l]);		
		}
	}	

	if(animate_find_number != 0){
		console.log("f:"+animate_find_number+"    n:"+NewRing.length);
		for(l = 0; l < NewRing.length; l++){
			sumhold.push(NewRing[l]);
			//console.log("1:"+NewRing[l]);
			animate_ring_save[animate_find_number][l]= NewRing[l];//�x�s�C��ring����m�C
			//fobj.ring_save.push(NewRing[l]);
			//console.log("2:"+save_ring_save[animate_find_number][l]);
		}
	}
		
	animate_balance();
/*
	if(vertical_move === false){
		animate_dir_dis();//��X�P��|��V�ۦP�����t��m�C
		
		animate_balance();
	}*/
}

var vertical_move = false;//�˴��O�_����������
var newpos = new THREE.Vector2();//�s����m�C
var move_direction = new THREE.Vector2();//���ʪ���V�C

function Find_Normal(fobj){
	//console.log("find normal");
	var hit = [];
	var hit_avg = new THREE.Vector2(0, 0);
	var hit_normal = new THREE.Vector2();
	var Bounding_Vertices_normal = [];
	var nor_dir_dot;
	//console.log(save_BoundingVertices.length);
	for(j = 0; j <save_BoundingVertices.length; j++){
		hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[save_BoundingVertices[j]].x,mesh.geometry.vertices[save_BoundingVertices[j]].y));
		ring = hex_ring(hex,1);	
		for(k = 0; k < 6; k++){
			var save = hex_to_pixel(layout, ring[k]);
			raycaster = new THREE.Raycaster(new THREE.Vector3(save.x, save.y, -30), new THREE.Vector3(0, 0, 1));
			intersects = raycaster.intersectObjects(pickables);	
			if(intersects.length !=0){//�p�G�������쪫��
				vID = hashHexVertex(ring[k].q,ring[k].r);	
				hit.push(vID);
			}
		}
		for(i = 0; i < hit.length; i++){//��in����������
			hit_avg.x += mesh.geometry.vertices[hit[i]].x;
			hit_avg.y += mesh.geometry.vertices[hit[i]].y;
		}
		hit_avg.x /= hit.length;
		hit_avg.y /= hit.length;
		//console.log(hit_avg);
		//�������Xnormal
		hit_normal.x = mesh.geometry.vertices[save_BoundingVertices[j]].x - hit_avg.x;
		hit_normal.y = mesh.geometry.vertices[save_BoundingVertices[j]].y - hit_avg.y;
		//hit_normal.x = hit_avg.x - mesh.geometry.vertices[save_BoundingVertices[j]].x;
		//hit_normal.y = hit_avg.y - mesh.geometry.vertices[save_BoundingVertices[j]].y;		
		
		Bounding_Vertices_normal.push(new THREE.Vector2(hit_normal.x, hit_normal.y));
		//console.log(Bounding_Vertices_normal[j]);
		hit_avg = new THREE.Vector2(0, 0);
	}
	//console.log(Bounding_Vertices_normal);
	//console.log(Bounding_Vertices_normal);
	newpos.x = obj1.obj.position.x;//�s����m�C
	newpos.y = obj1.obj.position.y;
	//console.log(fobj.lastpos);
	//console.log(newpos);
	move_direction.x = newpos.x - fobj.lastpos.x;//���ʤ�V�C
	move_direction.y = newpos.y - fobj.lastpos.y;	
	//console.log(move_direction);
	
	/*��������
	if(move_direction.x === 0 && move_direction.y === 0){//�T�{�O�_������
		vertical_move = true;
	}	*/
	//console.log("14:"+Bounding_Vertices_normal.length);
	for(i = 0; i < Bounding_Vertices_normal.length; i++){
		//console.log(Bounding_Vertices_normal[i]);
		nor_dir_dot = move_direction.dot(Bounding_Vertices_normal[i]);
		//console.log(move_direction);
		if(move_direction.dot(Bounding_Vertices_normal[i]) > -2){//-2 or 0??  -2������
			animate_BoundingVertices.push(save_BoundingVertices[i]);
			//console.log(animate_BoundingVertices);
		}
	}
	//console.log("15:"+animate_BoundingVertices.length);
	
	
	for(i = 0; i < save_BoundingVertices.length; i++){
		for(j = 0; j < Bounding_Vertices_normal.length; j++){
			if(save_BoundingVertices[i] == Bounding_Vertices_normal[j]){
				break;
			}
			else if(j == Bounding_Vertices_normal.length-1){
				undir.push(save_BoundingVertices);
			}
		}
	}
	
	/*
	for(i = 0; i < animate_BoundingVertices.length; i++){
		mesh.geometry.vertices[animate_BoundingVertices[i]].z = 1;
	}*/
	
	
}



var animate_Vertices_Distribution = [];//bounding vertices�����t�q�C
var animate_Ring_Distribution = [];
var animate_Distribution_Sum = 0;
var animate_D_max = 0;//�̤j���t�ȡC
var animate_D_min = 0;//�̤p���t�ȡC
var animate_Distribution_Percent;//�h�ֱƨF�q���ʤ���A����angle of repose�C
var animate_less;
var animate_ring_dis_save = [];//�����C��ring���̲��`���t�q�C
var animate_bv_dis_save = 0;//����bounding vertices�@���Ҥ��t���`�q�C
var animate_need_findring = false;
var animate_need_more = false;
function animate_balance (){
	console.log("an_run");
	if(animate_find_number==0){
		var VertexDis = new THREE.Vector2();//�U���I��Ubounding vertices���Z���C
		var vertex = new THREE.Vector2();
		var downpoint = new THREE.Vector2();
		//console.log(animate_BoundingVertices.length);
		for(var i = 0; i < animate_BoundingVertices.length; i++){
			animate_Vertices_Distribution[i]=0;
		}
		//console.log(hold.length);
		//console.log(animate_BoundingVertices.length);
		for(i = 0; i < hold.length; i++){
			downpoint.x = mesh.geometry.vertices[hold[i]].x;
			downpoint.y = mesh.geometry.vertices[hold[i]].y;
			for(j = 0; j<animate_BoundingVertices.length; j++){
				vertex.x = mesh.geometry.vertices[animate_BoundingVertices[j]].x;
				vertex.y = mesh.geometry.vertices[animate_BoundingVertices[j]].y;
				
				VertexDis = downpoint.distanceTo(vertex);//��X���I�Z���C
				//console.log(VertexDis);
				animate_Vertices_Distribution[j] += 1/VertexDis;//�[�Ϥ�C
			}
		}
		animate_D_max=animate_Vertices_Distribution[0];
		animate_D_min=animate_Vertices_Distribution[0];
		for(i = 0; i < animate_Vertices_Distribution.length; i++){//�Ҧ����t�Z���[�`�C
			if(animate_Vertices_Distribution[i]<animate_D_min){//��X�̤p���t�ȡC
				animate_D_min=animate_Vertices_Distribution[i];
			}
			if(animate_Vertices_Distribution[i]>animate_D_max){//��X�̤j���t�ȡC
				animate_D_max=animate_Vertices_Distribution[i];
			}
		}
		//console.log("animate_D_min:"+animate_D_min);
		//console.log("animate_D_max:"+animate_D_max);
		//console.log(-sum*animate_D_max/animate_Distribution_Sum);
		
		for(i = 0; i < animate_Vertices_Distribution.length; i++){//�N���t��ҽլ�1~2�C
			animate_Vertices_Distribution[i] = animate_Vertices_Distribution[i]/animate_D_max +1;
			animate_Distribution_Sum += animate_Vertices_Distribution[i];
			//console.log(animate_Vertices_Distribution[i]);
		}
		//console.log(-sum);
		//console.log(-sum*animate_D_max/animate_Distribution_Sum);
		animate_Distribution_Percent = 33.5/-sum; //�h�ֱƨF�q���ʤ��񵥩�angle of repose�C
		/*
		����j�p???<1�N=1???�ݴ��աC
		*/
		//console.log(animate_Distribution_Percent);
		var BV_check=0;
		
		for(i = 0; i < animate_BoundingVertices.length; i++){//�պ�O�_���t��bounding vertices�O�_�ŦXangle of repose�C
			BV_check += -sum*animate_Distribution_Percent/100*animate_Vertices_Distribution[i];
		}
		animate_less = -sum;
		//console.log(-sum);
		//console.log("start animate_less:"+animate_less);
		if(BV_check >= -sum){//�ŦX�h�������t�C
			console.log("just need bounding vertices");
			for(i = 0; i < animate_BoundingVertices.length; i++){
				mesh.geometry.vertices[animate_BoundingVertices[i]].z += -sum*animate_Vertices_Distribution[i]/animate_Distribution_Sum;
			}
			animate_need_more = false;
			//Bas_balance2();
		}
		else{//���ŦX�h����bounding vertices�����t�q�C
			console.log("need more");
			animate_ring_dis_save[animate_find_number] = new Array();
			for(i = 0; i < animate_BoundingVertices.length; i++){
				animate_ring_dis_save[animate_find_number][i] = -sum*animate_Distribution_Percent/100*animate_Vertices_Distribution[i];
				animate_less -= animate_ring_dis_save[animate_find_number][i];
				animate_bv_dis_save += animate_ring_dis_save[animate_find_number][i];
				//console.log(animate_ring_dis_save[animate_find_number][i]);
			}
			//console.log(animate_bv_dis_save);
			//console.log("less0:"+animate_less);
			animate_need_findring = true;
			animate_need_more = true;
		}		
	}
	/*console.log("ring:"+animate_ring_dis_save.length);
	for(i = 0; i < animate_ring_dis_save.length; i++){
		console.log("i:"+i);
		for(j = 0; j < animate_ring_dis_save[i].length; j++){
			console.log("i:"+i+", j:"+j+" = "+animate_ring_dis_save[i][j]);
		}
	}*/
	
	/*
	for(i = 0; i < animate_ring_save[0].length; i++){
		mesh.geometry.vertices[animate_ring_save[0][i]].z+=animate_ring_dis_save[0][i];
	}*/
	
	
	else{
		//console.log("animate_find_number:"+animate_find_number);
		//console.log("animate_ring_dis_save:"+animate_ring_dis_save.length);
		for(i = 0; i < animate_ring_save.length; i++){//�A�����t���w���t�L���h�ơA���ˬd�O�_�j���`�ƨF�q�C
		//console.log("i:"+i);
			if(i == 0){
				if(animate_less-animate_bv_dis_save<0){//�p�Ѿl�q�������t��bounding vertices�A���X�j��C
					//console.log("break1");
					animate_need_findring = false;
				}
				else{
					for(l = 0; l < animate_ring_save[i].length; l++){
						animate_less -= animate_ring_dis_save[i][l] / (animate_find_number);//��X�Ѿl�q�C
						animate_ring_dis_save[i][l] = animate_ring_dis_save[i][l] / (animate_find_number) * (animate_find_number+1);
					}
					//console.log(animate_bv_dis_save);
					//console.log("less1:"+animate_less);
				}
			}
			else if(i != animate_find_number){
				if(animate_less - animate_ring_save[i].length * (-sum) * animate_Distribution_Percent/100 < 0){//�p�Ѿl�q�������t����i_ring�A���X�j��C
					//console.log("break2");
					animate_need_findring = false;
				}
				else{
					//console.log(animate_ring_save[i].length);
					for(l = 0; l < animate_ring_save[i].length; l++){
						//animate_less -= animate_ring_dis_save[i][l] / (animate_find_number-1);//��X�Ѿl�q�C
						//console.log("2:"+animate_ring_dis_save[i][l]);
						animate_less -= animate_ring_dis_save[i][l] / animate_find_number;
						animate_ring_dis_save[i][l] = animate_ring_dis_save[i][l] / (animate_find_number) * (animate_find_number+1);
					}
					//animate_less -= animate_ring_save[i].length * (-sum) * animate_Distribution_Percent/100
					//console.log(animate_ring_save[i].length * (-sum) * animate_Distribution_Percent/100);
					//console.log("less2:"+animate_less);
				}
			}
			else if(i == animate_find_number && i != 0){
				if(animate_less - animate_ring_save[i].length * (-sum) * animate_Distribution_Percent/100 < 0){
					//console.log("break3");
					animate_need_findring = false;
				}
				else{
					animate_ring_dis_save[animate_find_number] = new Array();
					for(j = 0; j < animate_ring_save[i].length; j++){//���t�ΰO���C
						animate_ring_dis_save[i][j] = (-sum) * animate_Distribution_Percent/100;//�����s���t�h�����t�q�C
						animate_less -= (-sum) * animate_Distribution_Percent/100;//��X�Ѿl�q�C					
						//console.log((-sum) * animate_Distribution_Percent/100);
					}
					//console.log("less3:"+animate_less);
					animate_need_findring = true;
				}
			}

		}
	}
	
	if(animate_need_findring === true){
		animate_find_number++;
		animate_FindRings();//��U�@��ring�C
	}
	
	
}




function animate_balance_final(){
	if(animate_need_more === true){
		for(var i = 0; i < animate_ring_dis_save[0].length; i++){//�Ѿl�q���t��bv�C
			//animate_ring_dis_save[0][i] += animate_less*animate_Distribution_Percent/100*animate_Vertices_Distribution[i];
			animate_ring_dis_save[0][i] += animate_less/animate_ring_dis_save[0].length;
		}
		//console.log(animate_ring_dis_save.length);
		for(i = 0; i < animate_ring_dis_save.length; i++){//��B���t�C
			for(var j = 0; j < animate_ring_dis_save[i].length; j++){
				mesh.geometry.vertices[animate_ring_save[i][j]].z += animate_ring_dis_save[i][j];
			}
		}	
	}
	//�k�s�C
	animate_ring_dis_save = [];
	animate_ring_amount = [];//�x�s�C��ring���ƶq�C
	animate_ring_save = [];//�x�s�C��ring����m�C
	animate_find_number = 0;//�j�M�ĴX��ring�C	
}



