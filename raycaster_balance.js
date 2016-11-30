var hold = [];
var objring = [];//last balance儲存位置用。
var sumhold = [];
var sum = 0;
var remain;
var slopemax = 0.5;
var ring_distance = [];
var raydis;
var new_counter = 0;
var old_counter = 0;

var BoundingVertices = [];
var NewRing = [];
var CheckRang = [];

function ray(hex,robj){
	
    var ring = [];
	var check = [];
	var lastcheck = false;
	sum = 0;
	sumhold = [];
	hold = [];
	objring = [];
	//console.log("in ray");
	//console.log(robj.obj.position);
	raycaster = new THREE.Raycaster(new THREE.Vector3(robj.obj.position.x, robj.obj.position.y, -30), new THREE.Vector3(0, 0, 1));
	//偵測物體中心是否有被射線射中。
    intersects = raycaster.intersectObjects(pickables,true);
	var counter = 0;
	
	if(intersects.length != 0){
		pick = true;
		//console.log("pick");
		raydis = intersects[0].point.clone();
		vID = hashHexVertex(hex.q,hex.r);
		objring.push(vID);
		if(raydis.z<mesh.geometry.vertices[vID].z){//如偵測到有物體低於地面，儲存hex vID、下壓高度sum。
			hold.push(vID);
			sumhold.push(vID);
			//robj.ring_save.push(vID);
			//console.log(robj.ring_save.length);
			sum += raydis.z-mesh.geometry.vertices[vID].z;//下壓高度sum。
			mesh.geometry.vertices[vID].setZ(raydis.z);//將沙面下壓至物體高度。
		}
	}
	//console.log(robj.boundingBox);
	var hring = Math.floor(robj.boundingBox.radius/size)+1;//計算obj1_boundingBox與hex size的倍數(需要掃描的ring數)。
	//console.log(robj.boundingBox.radius);
	for(var i = 1; i<hring; i++){
		ring = hex_ring(hex,i);
		
		for(var j = 0; j < i*6; j++){
			check = hex_ring(ring[j],1);
			var save1 = hex_to_pixel(layout, ring[j]);
		
			raycaster = new THREE.Raycaster(new THREE.Vector3(save1.x, save1.y, -30), new THREE.Vector3(0, 0, 1));
			intersects = raycaster.intersectObjects(pickables,true);
			if(intersects.length !=0){
				pick = true;
				raydis = intersects[0].point.clone();
				vID = hashHexVertex(ring[j].q,ring[j].r);
				objring.push(vID);
				if(raydis.z<mesh.geometry.vertices[vID].z){//如偵測到有物體低於地面，儲存hex vID、下壓高度sum。
					hold.push(vID);
					sumhold.push(vID);
					//robj.ring_save.push(vID);
					//console.log(robj.ring_save.length);
					sum += raydis.z-mesh.geometry.vertices[vID].z;
					counter++;
					mesh.geometry.vertices[vID].setZ(raydis.z);
					//console.log(sum);
				}

			}
		}
	}
	//console.log("in simulate sumhold:"+sumhold.length);
	//console.log("counter:"+counter);
	//console.log("sum:"+sum);
	
	//console.log("volume:"+sum*1.732/2);
	
	need_balance_ring += hring;//如有移動需要平衡的範圍。
	//console.log(need_balance_ring);
}


var ring_amount = [];//儲存每個ring的數量。
var ring_save = [];//儲存每個ring的位置。
var find_number = 0;//搜尋第幾個ring。
function FindRings(){
	var ring = [];
	var repeat;
	var repeat1;
	var check;
	
	
	NewRing = [];
	for(j = 0; j <sumhold.length; j++){
		hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[sumhold[j]].x,mesh.geometry.vertices[sumhold[j]].y));
		ring = hex_ring(hex,1);
		for(k = 0; k < 6; k++){
			var save = hex_to_pixel(layout, ring[k]);
			raycaster = new THREE.Raycaster(new THREE.Vector3(save.x, save.y, -30), new THREE.Vector3(0, 0, 1));
			intersects = raycaster.intersectObjects(pickables,true);
			repeat = false;
			repeat1 = false;
			if(intersects.length !=0){//如果有偵測到物體，檢測高度是否低於沙面。
				vID = hashHexVertex(ring[k].q,ring[k].r);
				raydis = intersects[0].point.clone();
				if(raydis.z>mesh.geometry.vertices[vID].z){
					if(find_number==0){
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
							BoundingVertices.push(vID);
							NewRing.push(vID);
						}
					}
					if(find_number!=0){
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
				if(find_number==0){
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
						BoundingVertices.push(vID);
						NewRing.push(vID);
					}
				}
				if(find_number!=0){
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
						//console.log(vID);
					}
				}

			}
				
		}
	}
	ring_amount.push(NewRing.length);//儲存每個ring的數量。
	//console.log(ring_amount[find_number]);
	
	ring_save[find_number] = new Array();
	//console.log(fobj.obj.position);
	for(l = 0; l < NewRing.length; l++){
		sumhold.push(NewRing[l]);
		//fobj.ring_save.push(l);
		//console.log(NewRing[l]);
		//console.log(NewRing[l]);
		//console.log("1:"+NewRing[l]);
		ring_save[find_number][l]= NewRing[l];//儲存每個ring的位置。
		//console.log("2:"+ring_save[find_number][l]);
	}
	
	//find_number++;
	Adv_balance2();
}

var Vertices_Distribution = [];//bounding vertices的分配量。
var Ring_Distribution = [];
var Distribution_Sum = 0;
var D_max = 0;//最大分配值。
var D_min = 0;//最小分配值。
var Distribution_Percent;//多少排沙量的百分比，等於angle of repose。
var less;
var ring_dis_save = [];//紀錄每個ring的最終總分配量。
var bv_dis_save = 0;//紀錄bounding vertices一次所分配的總量。
var need_findring = false;
var need_more = false;
function Adv_balance2(){
	if(find_number==0){
		var VertexDis = new THREE.Vector2();//下壓點到各bounding vertices的距離。
		var vertex = new THREE.Vector2();
		var downpoint = new THREE.Vector2();
		
		for(var i = 0; i < BoundingVertices.length; i++){
			Vertices_Distribution[i]=0;
		}
		
		for(i = 0; i < hold.length; i++){
			downpoint.x = mesh.geometry.vertices[hold[i]].x;
			downpoint.y = mesh.geometry.vertices[hold[i]].y;
			for(j = 0; j<BoundingVertices.length; j++){
				vertex.x = mesh.geometry.vertices[BoundingVertices[j]].x;
				vertex.y = mesh.geometry.vertices[BoundingVertices[j]].y;
				
				VertexDis = downpoint.distanceTo(vertex);//算出兩點距離。
				//console.log(VertexDis);
				Vertices_Distribution[j] += 1/VertexDis;//加反比。
			}
		}
		D_max=Vertices_Distribution[0];
		D_min=Vertices_Distribution[0];
		for(i = 0; i < Vertices_Distribution.length; i++){//所有分配距離加總。
			if(Vertices_Distribution[i]<D_min){//找出最小分配值。
				D_min=Vertices_Distribution[i];
			}
			if(Vertices_Distribution[i]>D_max){//找出最大分配值。
				D_max=Vertices_Distribution[i];
			}
		}
		//console.log("D_min:"+D_min);
		//console.log("D_max:"+D_max);
		//console.log(-sum*D_max/Distribution_Sum);
		
		for(i = 0; i < Vertices_Distribution.length; i++){//將分配比例調為1~2。
			Vertices_Distribution[i] = Vertices_Distribution[i]/D_max +1;
			Distribution_Sum += Vertices_Distribution[i];
			//console.log(Vertices_Distribution[i]);
		}
		//console.log(-sum);
		
		Distribution_Percent = 33.5/-sum; //多少排沙量的百分比等於angle of repose。
		/*
		限制大小???<1就=1???待測試。
		*/
		//console.log(Distribution_Percent);
		var BV_check=0;
		
		for(i = 0; i < BoundingVertices.length; i++){//試算是否分配完bounding vertices是否符合angle of repose。
			BV_check += -sum*Distribution_Percent/100*Vertices_Distribution[i];
		}
		less = -sum;
		//console.log("start less:"+less);
		if(BV_check >= -sum){//符合則直接分配。
			//console.log("just need bounding vertices");
			for(i = 0; i < BoundingVertices.length; i++){
				mesh.geometry.vertices[BoundingVertices[i]].z += -sum*Vertices_Distribution[i]/Distribution_Sum;
			}
			need_more = false;
			//Bas_balance2();
		}
		else{//不符合則紀錄bounding vertices的分配量。
			ring_dis_save[find_number] = new Array();
			for(i = 0; i < BoundingVertices.length; i++){
				ring_dis_save[find_number][i] = -sum*Distribution_Percent/100*Vertices_Distribution[i];
				less -= ring_dis_save[find_number][i];
				//console.log(less);
				bv_dis_save += ring_dis_save[find_number][i];
				//console.log(ring_dis_save[find_number][i]);
			}
			
			//console.log("less0:"+less);
			need_findring = true;
			need_more = true;
		}		
	}
	/*console.log("ring:"+ring_dis_save.length);
	for(i = 0; i < ring_dis_save.length; i++){
		console.log("i:"+i);
		for(j = 0; j < ring_dis_save[i].length; j++){
			console.log("i:"+i+", j:"+j+" = "+ring_dis_save[i][j]);
		}
	}*/
	
	
	else{
		//console.log("find_number:"+find_number);
		//console.log("ring_dis_save:"+ring_dis_save.length);
		for(i = 0; i < ring_save.length; i++){//再次分配給已分配過的層數，並檢查是否大於總排沙量。
		//console.log("i:"+i);
			if(i == 0){
				if(less-bv_dis_save<0){//如剩餘量不夠分配至bounding vertices，跳出迴圈。
					//console.log("break1");
					need_findring = false;
				}
				else{
					for(l = 0; l < ring_save[i].length; l++){
						less -= ring_dis_save[i][l] / (find_number);//算出剩餘量。
						//console.log("before:"+ring_dis_save[i][l]);
						ring_dis_save[i][l] = ring_dis_save[i][l] / (find_number) * (find_number+1);
						//console.log("after"+ring_dis_save[i][l]);
					}
					//console.log("less0:"+less);
				}
			}
			else if(i != find_number){
				if(less - ring_save[i].length * (-sum) * Distribution_Percent/100 < 0){//如剩餘量不夠分配給第i_ring，跳出迴圈。
					//console.log("break2");
					need_findring = false;
				}
				else{
					for(l = 0; l < ring_save[i].length; l++){
						//less -= ring_dis_save[i][l] / (find_number-1);//算出剩餘量。
						less -= ring_dis_save[i][l] / find_number;
						ring_dis_save[i][l] = ring_dis_save[i][l] / (find_number) * (find_number+1);
					}
					//less -= ring_save[i].length * (-sum) * Distribution_Percent/100;
					//console.log(ring_save[i].length * (-sum) * Distribution_Percent/100);
					//console.log("i=:"+find_number);
					//console.log("less1:"+less);
				}
			}
			else if(i == find_number && i != 0){//**************************************************************
				if(less - ring_save[i].length * (-sum) * Distribution_Percent/100 < 0){
					//console.log("break3");
					need_findring = false;
				}
				else{
					ring_dis_save[find_number] = new Array();
					for(j = 0; j < ring_save[i].length; j++){//分配及記錄。
						ring_dis_save[i][j] = (-sum) * Distribution_Percent/100;//紀錄新分配層的分配量。
						less -= (-sum) * Distribution_Percent/100;//算出剩餘量。	
						//a+=(-sum) * Distribution_Percent/100;
						//console.log((-sum) * Distribution_Percent/100);
					}
					//console.log("sum:"+-sum);
					//console.log("less_jump:"+less);
					need_findring = true;
				}
			}

		}
	}
	/*
	if(find_number==2)
		need_findring = false;*/
	
	if(need_findring === true){
		find_number++;
		FindRings();//找下一個ring。
	}
	
	
	/*
	for(i = 0; i < 1; i++){
		console.log("in");
	}*/
	/*
	console.log("ring:"+ring_dis_save.length);
	for(i = 0; i < ring_dis_save.length; i++){
		console.log("i:"+i);
		for(j = 0; j < ring_dis_save[i].length; j++){
			console.log("i:"+i+", j:"+j+" = "+ring_dis_save[i][j]);
		}
	}
*/

	
}

function Adv_balance_final(){
	//console.log(less);
	if(need_more === true){	
		for(i = 0; i < ring_dis_save[0].length; i++){//剩餘量分配到bv。
			//ring_dis_save[0][i] += less*Distribution_Percent/100*Vertices_Distribution[i];
			ring_dis_save[0][i] += less/ring_dis_save[0].length;
		}
		for(i = 0; i < ring_dis_save.length; i++){//初步分配。
			for(j = 0; j < ring_dis_save[i].length; j++){
				mesh.geometry.vertices[ring_save[i][j]].z += ring_dis_save[i][j];
			}
		}
	}
	//歸零。
	ring_amount = [];//儲存每個ring的數量。
	ring_save = [];//儲存每個ring的位置。
	find_number = 0;//搜尋第幾個ring。		
	
}

function Bas_balance2(){
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
	while(finish === false){
		loop++;
		for(i = 0; i<sumhold.length; i++){
			hex = pixel_to_hex(layout, Point(mesh.geometry.vertices[sumhold[i]].x,mesh.geometry.vertices[sumhold[i]].y));
			vID = hashHexVertex(hex.q,hex.r);
			SvID = vID;
			ring = hex_ring(hex,1);
			for(var j = 0; j<6; j++){
				vID = hashHexVertex(ring[j].q,ring[j].r);
				check = true;
				check2 = true;
				if(mesh.geometry.vertices[sumhold[i]].z - mesh.geometry.vertices[vID].z > 0.335){
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
			sumhold.push(lower[i]);
			objring.push(lower[i]);
		}
		heigher = [];
		lower = [];
		heigh = [];
	}
	need_balance_ring += loop;	
	//console.log(new_counter);
}



function startset(sobj){//一開始壓多深
	//console.log(sobj.weight*70);
	
	while(-sum<sobj.weight*70){
		sobj.obj.position.z -= 0.8;
		sobj.obj.updateMatrixWorld();
		hex = pixel_to_hex(layout, Point(sobj.obj.position.x, sobj.obj.position.y));
		ray(hex_round(hex),sobj);
		//console.log(sum);
		//sum = 0;
	}
	sobj.lastpos.copy(sobj.obj.position);
}
