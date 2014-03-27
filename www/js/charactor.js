(function(){
	var blit0={
		x:0,
		y:50,
		w:64,
		h:170,
	}
	var blit1={
		x:0,
		y:50,
		w:64,
		h:119,
	}
	var pudge0={
		x:0,
		y:50,
		w:64,
		h:156
	}
	var pudge1={
		x:0,
		y:50,
		w:64,
		h:108
	}
	BKGM.Charactor=function(type,images,audios){
		this.type=type;
		this.images=images;
		this.audios=audios;
		this.currentImage=this.type=="lol"?images.blit:images.pudge;
		this.game0=type=="lol"?blit0:pudge0;
		this.game1=type=="lol"?blit1:pudge1;
		this.x=this.game0.x;
		this.y=this.game0.y;
		this.w=this.game0.w;
		this.h=this.game0.h;
		this.hook=new BKGM.Hook(this,images.hand);
		this.arm=new BKGM.Hand(this,images.arm);
	}
	BKGM.Charactor.prototype={
		dotapoint:0,
		lolpoint:0,
		kill:0,
		setTarget:function(e){
			if(this.hook.status=="default"){
				this.point={x:e.x,y:e.y};
				if(e.x>this.x)this.speed=3;
				else this.speed=-3;
				this.audios.move.forceplay();
			}
			
		},
		shoot:function(e){
			if(this.hook.status=="default"){
				this.hook.shoot(e);
				this.arm.shoot(e);
				this.point=null;
				this.currentImage=this.images.main;
				this.w=this.game1.w;
				this.h=this.game1.h;
			}
			this.audios.shoot.forceplay();	
		},
		rewinded:function(){
			this.currentImage=this.type=="lol"?this.images.blit:this.images.pudge;
			this.w=this.game0.w;
			this.h=this.game0.h;
			this.hook.visible=false;
			this.arm.visible=false;
			if(this.hook.enemy){
				if(this.hook.enemy.type=="dota") {
					this.dotapoint++;
					if(this.hook.enemy._class=="water") this.dotapoint++;
				} else {
					this.lolpoint++;
					if(this.hook.enemy._class=="water") this.lolpoint++;
				}
				if(this.type=="lol"){
					if(this.hook.enemy.type=="dota")
						this.kill++;
					else this.kill=0;
					switch (this.kill){
						case 0: break;
						case 1: break;
						case 2:this.audios.k2.forceplay();break;
						case 3:this.audios.k3.forceplay();break;
						case 4:this.audios.k4.forceplay();break;
						default:this.audios.k5.forceplay();break;
					}
				} else 
				if(this.type=="dota"){
					if(this.hook.enemy.type=="lol")
						this.kill++;
					else this.kill=0;
					switch (this.kill){
						case 0: break;
						case 1: break;
						case 2:this.audios.k2.forceplay();break;
						case 3:this.audios.k3.forceplay();break;
						case 4:this.audios.k4.forceplay();break;
						default:this.audios.k5.forceplay();break;
					}
				}
	    		this.hook.enemy.Get();
	    		if(!this.fblood){
	    			this.fblood=true;
	    			this.audios.fb.forceplay();
	    		}							
	    	}
		},
		missed:function(){
			this.kill=0;
			this.hook.enemy=null;
			if(this.type=="dota") {
				this.dotapoint++;
			} else {
				this.lolpoint++;
			}
			this.audios.miss.forceplay();
		},
		update:function(){
			if(this.point){
				this.x+=this.speed;
				if(this.point.x>this.x-3&&this.point.x<this.x+3){
					this.point=null;
					if(this.onEnd) this.onEnd();
				}
			}
			this.hook.update();
			this.arm.update();
		},
		draw:function(Game){
			var ctx=Game.ctx;
			this.arm.draw(Game);
			ctx.drawImage(this.currentImage,this.x,this.y,this.w,this.h);			

			this.hook.draw(Game);
			
		}
	}
})();
(function(){
	var blit={
		x:19,
		y:139,
		w:38,
		h:60
	}
	var pudge={
		x:14,
		y:140,
		w:17,
		h:33
	}
	BKGM.Hook=function(charactor,image){
		this.charactor=charactor;
		this.type=charactor.type;
		this.game=this.type=="lol"?blit:pudge;
		this.x=charactor.x+this.game.x;
		this.y=charactor.y+this.game.y;
		this.init={x:this.x,y:this.y};
		this.w=this.game.w;
		this.h=this.game.h;
		this.speed=5;
		this.image=image;
		this.type=charactor.type;
		this.status="default";
		this.box=new BKGM.Box(new BKGM.Vector(this.x-this.w/2-5,this.y-this.h/2-5),this.w-10,this.h-10);
		this.collideArray=[];
	}
	BKGM.Hook.prototype={
		shoot : function(target){
			this.target=target;
			this.init.x=this.charactor.x+this.game.x;
			var dx=target.x-this.init.x;
			var dy=target.y-this.init.y;
			var angle = Math.atan2(dy, dx);
			// var alpha=(this.angle>Math.PI*0.5) ? (Math.PI-this.angle) : this.angle;
			var speedX=this.speed*Math.cos(angle);
			var speedY=this.speed*Math.sin(angle);
			var _dx=dx;
			var _dy=target.y-this.init.y+this.game.w;
			this.angle=Math.atan2(_dy, dx)-Math.PI/2;
			this.speedXY={spx:speedX,spy:speedY};
			// var a=this.height * Math.cos(alpha);
			this.x=this.init.x;
			this.y=this.init.y;
			// this.setRotation(this.angle-Math.PI/2);
			this.visible=true;
			this.status="shoot";
			this.box.rotate(this.angle);
		},
		getEnemy:function(enemy){
			this.status='rewind';
			this.enemy=enemy;
			enemy.hasbeenGet(this);
		},
		draw:function(Game){
					
			if(this.visible) {
				var ctx=Game.ctx;	
				ctx.save();
				ctx.translate(this.x,this.y);
				ctx.rotate(this.angle)
				ctx.drawImage(this.image,-this.w/2,0,this.w,this.h);
				ctx.restore();
				if(BKGM.debug){
					ctx.save();
					var rect = [this.x-this.w/2,this.y-this.h/2,this.w,this.h];
					var  c1, c2, c3, c4, b1 = {},  /// corners
					     bx1, by1, bx2, by2;       /// bounding box
					var px=this.x,py=this.y,ar=this.angle;
					/// get corner coordinates
					c1 = BKGM.getCorner(px, py, rect[0], rect[1], ar);
					c2 = BKGM.getCorner(px, py, rect[0] + rect[2], rect[1], ar);
					c3 = BKGM.getCorner(px, py, rect[0] + rect[2], rect[1] + rect[3], ar);
					c4 = BKGM.getCorner(px, py, rect[0], rect[1] + rect[3], ar);
					 
					/// get bounding box
					bx1 = Math.min(c1.x, c2.x, c3.x, c4.x);
					by1 = Math.min(c1.y, c2.y, c3.y, c4.y);
					bx2 = Math.max(c1.x, c2.x, c3.x, c4.x);
					by2 = Math.max(c1.y, c2.y, c3.y, c4.y);
					// var bounds = [bx1, by1, bx2 - bx1, by2 - by1];
					ctx.rect(bx1, by1, bx2 - bx1, by2 - by1);
					ctx.strokeStyle = "red";
					ctx.stroke();
					ctx.restore();
				}
			}
		},
		update:function(){
			// console.log(this.status)
			switch (this.status){
				case "default": 
					// this.init.x=this.charactor.x;
					// this.x=this.init.x;
					// this.y=this.init.y;
					break;
				case "shoot"://shoot					
					this.x+=this.speedXY.spx;
					this.y+=this.speedXY.spy;
					var dx = this.init.x  - this.x;
					var dy = this.init.y - this.y;
					var d=Math.sqrt(dx*dx+dy*dy);
					if (d>600) {
		                this.status="rewind";
		                this.firt=false;
		                if(this.charactor.missed) this.charactor.missed();
		            }
		            this.box.position=new BKGM.Vector(this.x,this.y);
					// this.box.updateCorners();
					// console.log(this.box.position);
					for (var i = this.collideArray.length - 1; i >= 0; i--) {
						// if()
						switch(this.box.isColliding(this.collideArray[i].box)) {
							case 0:	this.getEnemy(this.collideArray[i]);
									i=-1
									return;
									break;
							
						}

					};
					// console.log(this.charactors)
					// for (var i=0; i<this.charactors.length;i++)
					// if(this.collision(this.charactors[i])&&!this.collision(this.charactors[i]).ishook) {
					// 	this.charactors[i].hooked(this);
					// 	this.firt=false;
					// 	this.setStatus(2);
					// }
					// ctx.lineStyle(1,0x000000);
		   //          ctx.moveTo(this.width/2,0);
		   //          ctx.lineTo(this._x,this._y);
					break;
				case "rewind": //rewind
					var dx=this.x-this.init.x;
					var dy=this.y-this.init.y;
					// this.angle = Math.atan2(dy, dx);
					this.x-=this.speedXY.spx;
					this.y-=this.speedXY.spy;
					if (this.y<this.init.y) {
						// this.setVisible(false);
		                this.status="default";
		                this.charactor.rewinded();
		            }
					break;
			}

			
		}
	}
})();
(function(){
	var blit={
		x:16.5,
		y:98,
		w:7,
		h:25
	}
	var pudge={
		x:13,
		y:110,
		w:8,
		h:19
	}
	BKGM.Hand=function(charactor,image){
		this.charactor=charactor;
		this.hook=charactor.hook;
		this.image=image;
		this.game=charactor.type=="lol"?blit:pudge;
		this.w=this.game.w;
		this.h=this.game.h;
		this.x=charactor.x+this.game.x;
		this.y=charactor.y+this.game.y;
		this.init={x:this.x,y:this.y};
	}
	BKGM.Hand.prototype={
		shoot:function(e){
			this.init.x=this.charactor.x+this.game.x;
			var dx=e.x-this.init.x;
			var dy=e.y-this.init.y;
			this.angle = Math.atan2(dy, dx)-Math.PI/2;
			this.visible=true;
		},
		draw:function(Game){

			if(this.visible){

				var ctx=Game.ctx;	
				ctx.save();
				ctx.translate(this.init.x,this.init.y);
				ctx.rotate(this.angle);
				if(this.charactor.type=="lol"){
					ctx.drawImage(this.image,-this.w/2,-this.w/2,this.w,this.h);
				}else {
					ctx.drawImage(this.image,-this.w/2,0,this.w,this.game.h);
					for (var i = this.num; i > 0; i--) {
						ctx.drawImage(this.image,-this.w/2,i*this.game.h-this.w/2,this.w,this.game.h);
					};	
				}
							
				ctx.restore();
			}
		},
		update:function(){
			var dx=this.hook.x-this.init.x;
			var dy=this.hook.y-this.init.y;
			this.angle = Math.atan2(dy, dx)-Math.PI/2;
			this.h=Math.sqrt(dx*dx+dy*dy)+10;
			this.num=this.h/this.game.h-1>>0;
		}
	}
})();
(function(){
	var genTarget=function(_class){
		var posx,posy;
		if(_class=="water"){
			posx=(Math.random()*600)+100;
    		posy=(Math.random()*100)+450;
		}
		if(_class=="sky"){
			posx=(Math.random()*600)+100;
    		posy=(Math.random()*100)+250;
		}
		return {x:posx,y:posy};
	}

	BKGM.Enemy=function(type,_class){
		BKGM.Enemy.superclass.constructor.call(this);
		this._class=_class;
		this.type=type;
		var target=new genTarget(this._class);
			this.x=target.x;
			this.y=target.y;
		var speed=1.5;
		if(this._class=='sky') speed=3;
		this.speed=speed;
		// this.actor=new BKGM.Actor();
		
		return this;
	}
	BKGM.Enemy.prototype={
		setTarget:function(){
			var target=new genTarget(this._class);
			this.target=target;
			var dx=target.x-this.x;
			var dy=target.y-this.y;
			var angle = Math.atan2(dy, dx);
			this.rotation = angle;
			if(this.box) this.box.rotate(angle);
			
			var speedX=this.speed*Math.cos(angle);
			var speedY=this.speed*Math.sin(angle);
			this.speedXY={spx:speedX,spy:speedY};
		},
		update:function(){
			if(this.isget){
				this.x=this.hook.x;
				this.y=this.hook.y+this.hook.h/2;
			}else {
				this.x+=this.speedXY.spx;
				this.y+=this.speedXY.spy;
				if(this.target.x<this.x+5&&this.target.x>this.x-5&&this.target.y<this.y+5&&this.target.y>this.y-5){
					// if(this._behaviorend) this._behaviorend();
					this.setTarget()
				}
				if(this.box) {
					this.box.position=new BKGM.Vector(this.x,this.y);
					// this.box.updateCorners();
				}
			}
			
		},
		hasbeenGet:function(hook){
			this.isget=true;
			this.hook=hook;
		},
		Get:function(){			
			this.isget=false;
			var target=new genTarget(this._class);
			this.x=target.x;
			this.y=target.y;
			this.setTarget();
		}
	}
	extend(BKGM.Enemy, BKGM.Actor);
	
})();
