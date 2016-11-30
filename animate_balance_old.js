


var animate_ring_amount = [];//儲存每個ring的數量。
var animate_ring_save = [];//儲存每個ring的位置。
var animate_find_number = 0;//搜尋第幾個ring。
var animate_BoundingVertices = [];

var save_ring_amount = [];
var save_ring_save = [];
var save_BoundingVertices = [];

var need_balance_ring = 0; // last objring;

function animate_FindRings(fobj){
	var ring = [];
	var repeat;
	var repeat1;
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
			if(intersects.length !=0){//如果有偵測到物體，檢測高度是否低於沙面。
				vID = hashHexVertex(ring[k].q,ring[k].r);
				raydis = intersects[0].point.clone();
				if(raydis.z>mesh.geometry.vertices[vID].z){
					if(animate_find_number==0){
						for(check = 0; check < NewRing.length; check++){//檢查是否為已經儲存過的位置。
							if(NewRing[check]===vID){
								repeat = true;
							}
						}
						for(check = 0; check < sumhold.length; check++){//檢查是否為原檢查位置。
							if(sumhold[check]===vID){
								repeat1 = true;
							}
						}							
						if(repeat === false && repeat1 === false){//沒有重複才儲存。
							save_BoundingVertices.push(vID);
							NewRing.push(vID);
						}
					}
					if(animate_find_number!=0){
						for(check = 0; check < NewRing.length; check++){//檢查是否為已經儲存過的位置。
							if(NewRing[check]===vID){
								repeat = true;
							}
						}
						for(check = 0; check < sumhold.length; check++){//檢查是否為原檢查位置。
							if(sumhold[check]===vID){
								repeat1 = true;
							}
						}							
						if(repeat === false && repeat1 === false){//沒有重複才儲存。
							NewRing.push(vID);
						}
					}
						
				}
					
			}
				
				
			if(intersects.length ==0){//如果沒偵測到物體，儲存位置。
				vID = hashHexVertex(ring[k].q,ring[k].r);
				if(animate_find_number==0){
					for(check = 0; check < NewRing.length; check++){//檢查是否為已經儲存過的位置。
						if(NewRing[check]===vID){
							repeat = true;
						}
					}
					for(check = 0; check < sumhold.length; check++){//檢查是否為原檢查位置。
						if(sumhold[check]===vID){
							repeat1 = true;
						}
					}						
					if(repeat === false && repeat1 === false){//沒有重複才儲存。
						save_BoundingVertices.push(vID);
						NewRing.push(vID);
					}
				}
				if(animate_find_number!=0){
					for(check = 0; check < NewRing.length; check++){//檢查是否為已經儲存過的位置。
						if(NewRing[check]===vID){
							repeat = true;
						}
					}
					for(check = 0; check < sumhold.length; check++){//檢查是否為原檢查位置。
						if(sumhold[check]===vID){
							repeat1 = true;
						}
					}							
					if(repeat === false && repeat1 === false){//沒有重複才儲存。
						NewRing.push(vID);
					}
				}

			}
				
		}
	}
	save_ring_amount.push(NewRing.length);//儲存每個ring的數量。
	//console.log(save_ring_amount[animate_find_number]);
	
	save_ring_save[animate_find_number] = new Array();
	
	for(l = 0; l < NewRing.length; l++){
		sumhold.push(NewRing[l]);
		//console.log("1:"+NewRing[l]);
		save_ring_save[animate_find_number][l]= NewRing[l];//儲存每個ring的位置。
		//fobj.ring_save.push(NewRing[l]);
		//console.log("2:"+save_ring_save[animate_find_number][l]);
	}
	if(animate_find_number == 0){
		animate_Find_hi_lo(fobj);
	}
	if(vertical_move === false){
		animate_dir_dis();//找出與行徑方向相同的分配位置。
		
		animate_balance();
	}
}



var newpos = new THREE.Vector2();//新的位置。
var move_direction = new THREE.Vector2();//移動的方向。
var standard = new THREE.Vector2(-100, -100);//計算vertex方向的基準點。
var standard_vector = new THREE.Vector2();//vertex到基準點的向量。
var proj_length = 0;//standard_vector投影到move_direction的長度。
var move_standard_dot; //移動方向、standard_vector內積。
var standard_vector_long = new THREE.Vector2();
var long_num;
var short_num;
var vertical_move = false;//檢測是否為垂直移動
function animate_Find_hi_lo(fobj){
	
	newpos.x = obj1.obj.position.x;//新的位置。
	newpos.y = obj1.obj.position.y;
	//console.log(lastpos);
	//console.log(newpos);
	move_direction.x = newpos.x - fobj.lastpos.x;//移動方向。
	move_direction.y = newpos.y - fobj.lastpos.y;
	//console.log(move_direction);
	if(move_direction.x === 0 && move_direction.y === 0){
		vertical_move = true;
	}
	if(vertical_move === false){
		for(var i = 0; i < save_ring_save[animate_find_number].length; i++){
			//vertex到基準點的向量。
			//mesh.geometry.vertices[save_ring_save[animate_find_number][i]].z = 1;
			standard_vector.x = standard.x - mesh.geometry.vertices[save_ring_save[animate_find_number][i]].x;
			standard_vector.y = standard.y - mesh.geometry.vertices[save_ring_save[animate_find_number][i]].y;
			//console.log(standard_vector);
			move_standard_dot = move_direction.dot(standard_vector);
			//console.log(move_standard_dot);
			proj_length = move_standard_dot/move_direction.length();//投影長度。
			//console.log(proj_length);
			if(i === 0 ){//算出最高&最低的位置。
				long_dis = Math.sqrt(standard_vector.length()*standard_vector.length()-proj_length*proj_length);
				short_dis = Math.sqrt(standard_vector.length()*standard_vector.length()-proj_length*proj_length);
				long_num = save_ring_save[animate_find_number][i];
				short_num = save_ring_save[animate_find_number][i];
			}
			else{
				if(Math.sqrt(standard_vector.length()*standard_vector.length()-proj_length*proj_length) > long_dis){
					long_dis = Math.sqrt(standard_vector.length()*standard_vector.length()-proj_length*proj_length);
					long_num = save_ring_save[animate_find_number][i];
					
				}
				if(Math.sqrt(standard_vector.length()*standard_vector.length()-proj_length*proj_length) < short_dis){
					short_dis = Math.sqrt(standard_vector.length()*standard_vector.length()-proj_length*proj_length);
					short_num = save_ring_save[animate_find_number][i];
					
				}		
			}
			
		}
	}
	//console.log(long_num);
	//console.log(short_num);
	//mesh.geometry.vertices[long_num].z += 1;
	//mesh.geometry.vertices[short_num].z += 1;	
}


function animate_dir_dis(){
	var vertex_vector = new THREE.Vector2();
	if(animate_find_number == 0){
		for(var i = 0; i < save_BoundingVertices.length; i++){
			vertex_vector.x = mesh.geometry.vertices[save_BoundingVertices[i]].x-mesh.geometry.vertices[long_num].x;
			vertex_vector.y = mesh.geometry.vertices[save_BoundingVertices[i]].y-mesh.geometry.vertices[long_num].y;
			if(move_direction.dot(vertex_vector) > 0){
				animate_BoundingVertices.push(save_BoundingVertices[i]);
				//mesh.geometry.vertices[save_BoundingVertices[i]].z+=1;
			}
		}

		animate_ring_save[animate_find_number] = new Array();
		for(var i = 0; i < save_ring_save[animate_find_number].length; i++){
			vertex_vector.x = mesh.geometry.vertices[save_ring_save[animate_find_number][i]].x-mesh.geometry.vertices[long_num].x;
			vertex_vector.y = mesh.geometry.vertices[save_ring_save[animate_find_number][i]].y-mesh.geometry.vertices[long_num].y;
			//console.log("v:"+move_direction.dot(vertex_vector));
			if(move_direction.dot(vertex_vector) > 0){
				animate_ring_save[animate_find_number].push(save_ring_save[animate_find_number][i]);
			}
			
		}
		//console.log(save_BoundingVertices.length);
		//console.log(animate_BoundingVertices.length);
		//console.log(animate_ring_save[0].length);
	}
	
	if(animate_find_number > 0){
		animate_ring_save[animate_find_number] = new Array();
		for(var i = 0; i < save_ring_save[animate_find_number].length; i++){
			//console.log("length:"+save_ring_save[animate_find_number].length);
			//console.log("number:"+animate_find_number);
			//console.log("array:"+save_ring_save[animate_find_number][i]);
			//console.log(mesh.geometry.vertices[long_num]);
			//console.log(move_direction);;
			vertex_vector.x = mesh.geometry.vertices[save_ring_save[animate_find_number][i]].x-mesh.geometry.vertices[long_num].x;
			vertex_vector.y = mesh.geometry.vertices[save_ring_save[animate_find_number][i]].y-mesh.geometry.vertices[long_num].y;
			//console.log("v:"+move_direction.dot(vertex_vector));
			if(move_direction.dot(vertex_vector) > 0){
				animate_ring_save[animate_find_number].push(save_ring_save[animate_find_number][i]);
			}
			
		}
	}
}


var animate_Vertices_Distribution = [];//bounding vertices的分配量。
var animate_Ring_Distribution = [];
var animate_Distribution_Sum = 0;
var animate_D_max = 0;//最大分配值。
var animate_D_min = 0;//最小分配值。
var animate_Distribution_Percent;//多少排沙量的百分比，等於angle of repose。
var animate_less;
var animate_ring_dis_save = [];//紀錄每個ring的最終總分配量。
var animate_bv_dis_save = 0;//紀錄bounding vertices一次所分配的總量。
var animate_need_findring = false;
var animate_need_more = false;
function animate_balance (){
	//console.log("an_run");
	if(animate_find_number==0){
		var VertexDis = new THREE.Vector2();//下壓點到各bounding vertices的距離。
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
				
				VertexDis = downpoint.distanceTo(vertex);//算出兩點距離。
				//console.log(VertexDis);
				animate_Vertices_Distribution[j] += 1/VertexDis;//加反比。
			}
		}
		animate_D_max=animate_Vertices_Distribution[0];
		animate_D_min=animate_Vertices_Distribution[0];
		for(i = 0; i < animate_Vertices_Distribution.length; i++){//所有分配距離加總。
			if(animate_Vertices_Distribution[i]<animate_D_min){//找出最小分配值。
				animate_D_min=animate_Vertices_Distribution[i];
			}
			if(animate_Vertices_Distribution[i]>animate_D_max){//找出最大分配值。
				animate_D_max=animate_Vertices_Distribution[i];
			}
		}
		//console.log("animate_D_min:"+animate_D_min);
		//console.log("animate_D_max:"+animate_D_max);
		//console.log(-sum*animate_D_max/animate_Distribution_Sum);
		
		for(i = 0; i < animate_Vertices_Distribution.length; i++){//將分配比例調為1~2。
			animate_Vertices_Distribution[i] = animate_Vertices_Distribution[i]/animate_D_max +1;
			animate_Distribution_Sum += animate_Vertices_Distribution[i];
			//console.log(animate_Vertices_Distribution[i]);
		}
		//console.log(-sum);
		//console.log(-sum*animate_D_max/animate_Distribution_Sum);
		animate_Distribution_Percent = 33.5/-sum; //多少排沙量的百分比等於angle of repose。
		/*
		限制大小???<1就=1???待測試。
		*/
		//console.log(animate_Distribution_Percent);
		var BV_check=0;
		
		for(i = 0; i < animate_BoundingVertices.length; i++){//試算是否分配完bounding vertices是否符合angle of repose。
			BV_check += -sum*animate_Distribution_Percent/100*animate_Vertices_Distribution[i];
		}
		animate_less = -sum;
		//console.log(-sum);
		//console.log("start animate_less:"+animate_less);
		if(BV_check >= -sum){//符合則直接分配。
			//console.log("just need bounding vertices");
			for(i = 0; i < animate_BoundingVertices.length; i++){
				mesh.geometry.vertices[animate_BoundingVertices[i]].z += -sum*animate_Vertices_Distribution[i]/animate_Distribution_Sum;
			}
			animate_need_more = false;
			//Bas_balance2();
		}
		else{//不符合則紀錄bounding vertices的分配量。
			//console.log("need more");
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
		for(i = 0; i < animate_ring_save.length; i++){//再次分配給已分配過的層數，並檢查是否大於總排沙量。
		//console.log("i:"+i);
			if(i == 0){
				if(animate_less-animate_bv_dis_save<0){//如剩餘量不夠分配至bounding vertices，跳出迴圈。
					//console.log("break1");
					animate_need_findring = false;
				}
				else{
					for(l = 0; l < animate_ring_save[i].length; l++){
						animate_less -= animate_ring_dis_save[i][l] / (animate_find_number);//算出剩餘量。
						animate_ring_dis_save[i][l] = animate_ring_dis_save[i][l] / (animate_find_number) * (animate_find_number+1);
					}
					//console.log(animate_bv_dis_save);
					//console.log("less1:"+animate_less);
				}
			}
			else if(i != animate_find_number){
				if(animate_less - animate_ring_save[i].length * (-sum) * animate_Distribution_Percent/100 < 0){//如剩餘量不夠分配給第i_ring，跳出迴圈。
					//console.log("break2");
					animate_need_findring = false;
				}
				else{
					//console.log(animate_ring_save[i].length);
					for(l = 0; l < animate_ring_save[i].length; l++){
						//animate_less -= animate_ring_dis_save[i][l] / (animate_find_number-1);//算出剩餘量。
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
					for(j = 0; j < animate_ring_save[i].length; j++){//分配及記錄。
						animate_ring_dis_save[i][j] = (-sum) * animate_Distribution_Percent/100;//紀錄新分配層的分配量。
						animate_less -= (-sum) * animate_Distribution_Percent/100;//算出剩餘量。					
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
		animate_FindRings();//找下一個ring。
	}
	
	
}




function animate_balance_final(){
	if(animate_need_more === true){
		for(var i = 0; i < animate_ring_dis_save[0].length; i++){//剩餘量分配到bv。
			//animate_ring_dis_save[0][i] += animate_less*animate_Distribution_Percent/100*animate_Vertices_Distribution[i];
			animate_ring_dis_save[0][i] += animate_less/animate_ring_dis_save[0].length;
		}
		//console.log(animate_ring_dis_save.length);
		for(i = 0; i < animate_ring_dis_save.length; i++){//初步分配。
			for(var j = 0; j < animate_ring_dis_save[i].length; j++){
				mesh.geometry.vertices[animate_ring_save[i][j]].z += animate_ring_dis_save[i][j];
			}
		}	
	}
	//歸零。
	animate_ring_dis_save = [];
	animate_ring_amount = [];//儲存每個ring的數量。
	animate_ring_save = [];//儲存每個ring的位置。
	animate_find_number = 0;//搜尋第幾個ring。	
}



function last_balance(){
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
	/*
	for(var i = 0; i<ring_distance.length; i++){
		sumdis += ring_distance[i];
	}
	
	for(i = 0; i<objring_first.length; i++){
		mesh.geometry.vertices[objring_first[i]].z += remain*ring_distance[i]/sumdis;
	}
	*/
	//console.log(lobj.ring_save.length);
	while(finish === false){
		loop++;
		for(i = 0; i<need_balance.length; i++){
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[need_balance[i]].x,mesh.geometry.vertices[need_balance[i]].y));
			vID = hashHexVertex(hex.q,hex.r);
			SvID = vID;
			ring = hex_ring(hex,1);
			for(var j = 0; j<6; j++){
				vID = hashHexVertex(ring[j].q,ring[j].r);
				check = true;
				check2 = true;
				if(mesh.geometry.vertices[need_balance[i]].z - mesh.geometry.vertices[vID].z > 0.335){
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
				//new_counter++;
			}
		}
		for(i = 0; i<lower.length; i++){
			need_balance.push(lower[i]);
		}
		heigher = [];
		lower = [];
		heigh = [];
	}
	//console.log(new_counter);
}


function last_balance2(){	
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
				if(mesh.geometry.vertices[need_balance[i]].z - mesh.geometry.vertices[vID].z > 0.335){
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
			while(mesh.geometry.vertices[heigher[i]].z-mesh.geometry.vertices[lower[i]].z>0.335){
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

