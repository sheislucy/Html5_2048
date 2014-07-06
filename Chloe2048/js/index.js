/**
 * @author lucy
 */

;(function(){
	var canvas = document.getElementById('main');
	var t_width = 60 * 4;
	var t_height = 80 * 4;
	var x_start = (window.innerWidth - t_width) / 2;
	var y_start = 30;
	var recArray = new Array();
	
	// game variable
	var AVAILABLE_NEW_NUM = [1<<1, 1<<2];	
	var MAX_POP_AMOUNT = 2;
	
	if (canvas.getContext) {
	    var ctx = canvas.getContext('2d');
	    ctx.lineWidth = 1.0; 
		ctx.strokeStyle = '#2ebdf5'; 
	}
	
	var init = function(){
		ctx.strokeRect(x_start, y_start, 60*4, 80*4);
		for(var i = 0; i < 4; i++){
			for(var j = 0; j< 4; j++){
				ctx.strokeRect(x_start + 60 * j, y_start + 80 * i, 60, 80);
				var node = {"x_s": x_start + 60 * j, "y_s": y_start + 80 * i};
				recArray.push(node);
			}
		}
	};
	
	// node: {"x_s":"", "y_s": "", "val": ""}
	var paintNum = function(node, color){
		ctx.textAlign = "middle";
		ctx.fillStyle = color ? color : "#ff99bb";
		ctx.clearRect(node.x_s, node.y_s, 60, 80);
		ctx.strokeRect(node.x_s, node.y_s, 60, 80);
		if(node.val){
			if(node.val < (1 << 4)){
				ctx.font = "Bold 50px Arial";
				ctx.fillText(node.val, node.x_s + 60 / 4, node.y_s + 80 / 4 * 3);
			}else if(node.val < (1 << 7)){
				ctx.font = "Bold 40px Arial";
				ctx.fillText(node.val, node.x_s + 60 / 10, node.y_s + 80 / 4 * 3);
			}else{
				ctx.font = "Bold 30px Arial";
				ctx.fillText(node.val, node.x_s + 60 / 20, node.y_s + 80/ 4 * 3);
			}		
		}
	};
	
	var popNewNum = function(){
		// generate numbers
		var amount = Math.ceil(MAX_POP_AMOUNT * Math.random()); //new number amount
		var i = 0;
		var leftSpace = 0;
		for(var j = 0; j<recArray.length; j++){
			if(!recArray[j].val){
				leftSpace++;
			}
		}
		if(leftSpace>0){
			if(leftSpace<amount){
				amount = leftSpace;
			}
			while( i < amount){
				var pickedPos = Math.floor(Math.random() * 16);
				if(!recArray[pickedPos].val){
					recArray[pickedPos].val = AVAILABLE_NEW_NUM[Math.floor(Math.random() * 2)];
					paintNum(recArray[pickedPos], '#ff934c');
					i++;
				}
			}
		}
	};
	
	var gravity = function(arr){
		var gravitated= false;
		var originLength = arr.length;
		if(arr.length > 0){
			for(var i =0; i<arr.length; i++){
				if(!arr[i]){
					arr.splice(i, 1);
					i--; 
					gravitated = gravitated || true;
				}
			}
		}
		while(arr.length < originLength){
			arr.push(undefined);
		}
		return gravitated;
	};
	
	var merge = function(arr){
		var merged = false;
		if(arr.length > 0){
			for(var i=0; i< arr.length; i++){
				if( i < arr.length-1 && arr[i] ){
					if(arr[i] == arr[i+1]){
						arr[i] = arr[i] * 2;
						arr[i+1] = undefined;
						i++;
						merged = merged || true;
					}
				}
			}
		}
		return merged;
	};
	
	var rollNumber = function(direction){
		var moved = false;
		if(direction.toLowerCase() == 'left'){
			for(var i = 0; i < 4; i++){
				var arr = new Array();
				for(var j=0; j< 4; j++){
					arr.push(recArray[j + 4*i].val);
				}
				var gravitated = gravity(arr);
				var merged = merge(arr);
				moved = moved || gravitated || merged;
				gravity(arr);
				for(var k=0; k< 4; k++){
					recArray[k + 4*i].val = arr[k];
					paintNum(recArray[k + 4*i]);
				}
			}
		}else if(direction.toLowerCase() == 'right'){
			for(var i = 0; i < 4; i++){
				var arr = new Array();
				for(var j=0; j< 4; j++){
					arr.push(recArray[j + 4*i].val);
				}
				arr.reverse();
				var gravitated = gravity(arr);
				var merged = merge(arr);
				moved = moved || gravitated || merged;
				gravity(arr);
				arr.reverse();
				for(var k=0; k< 4; k++){
					recArray[k + 4*i].val = arr[k];
					paintNum(recArray[k + 4*i]);
				}
			}
		}else if(direction.toLowerCase() == 'up'){
			for(var i = 0; i < 4; i++){
				var arr = new Array();
				for(var j = 0; j< 4; j++){
					arr.push(recArray[4*j + i].val);
				}
				var gravitated = gravity(arr);
				var merged = merge(arr);
				moved = moved || gravitated || merged;
				gravity(arr);
				for(var k = 0; k< 4; k++){
					recArray[4*k + i].val = arr[k];
					paintNum(recArray[4*k + i]);
				}
			}
		}else if(direction.toLowerCase() == 'down'){
			for(var i = 0; i < 4; i++){
				var arr = new Array();
				for(var j = 0; j< 4; j++){
					arr.push(recArray[4*j + i].val);
				}
				arr.reverse();
				var gravitated = gravity(arr);
				var merged = merge(arr);
				moved = moved || gravitated || merged;
				gravity(arr);
				arr.reverse();
				for(var k = 0; k< 4; k++){
					recArray[4*k + i].val = arr[k];
					paintNum(recArray[4*k + i]);
				}
			}
		}
		return moved;
	};
	
	init();
	popNewNum();
	
	document.onkeydown = function(event){
		e = event ? event :(window.event ? window.event : null); 
		var moved = false;
		if(e.keyCode == 37){
			//left
			moved = rollNumber('left');
		}else if(e.keyCode == 38){
			//up
			moved = rollNumber('up');
		}else if(e.keyCode == 39){
			//right
			moved = rollNumber('right');
		}else if(e.keyCode == 40){
			//down
			moved = rollNumber('down');
		}
		if(e.keyCode >= 37 && e.keyCode <= 40 && moved){
			popNewNum();
			event.preventDefault();
		}
	};
	
})();
