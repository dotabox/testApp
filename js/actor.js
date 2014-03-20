(function(){
	function getCorner(pivotX, pivotY, cornerX, cornerY, angle) {
 
	    var x, y, distance, diffX, diffY;
	 
	    /// get distance from center to point
	    diffX = cornerX - pivotX;
	    diffY = cornerY - pivotY;
	    distance = Math.sqrt(diffX * diffX + diffY * diffY);
	 
	    /// find angle from pivot to corner
	    angle += Math.atan2(diffY, diffX);
	 
	    /// get new x and y and round it off to integer
	    x = pivotX + distance * Math.cos(angle);
	    y = pivotY + distance * Math.sin(angle);
	 
	    return {x:x, y:y};
	}
	function getBounds(w, h, radians){
	    var a = Math.abs(Math.cos(radians)),
	        b = Math.abs(Math.sin(radians));
	 
	    return {h: h * a + w * b,
	            w: h * b + w * a}
	}
	BKGM.Actor = function(obj){
		var _this = this;
		if(obj){
			_this.setup = obj.setup || _this.setup;
			//_this.draw = obj.draw || _this.draw;
			//_this.update = obj.update || _this.update;
		}
		this.canvas = document.createElement('canvas');
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx=this.canvas.getContext('2d');
		return this;
    }
	BKGM.Actor.prototype={
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		_eventenable:true,
		_strokeStyle: "black",
		_fillStyle: "black",
		_BKGMIsMouseDown: false,
		childrentList: [],
		behaviorList:[],
		parent: null,
		setup: function (){
			return this;
		},
		_update: function(time){
			this.update();
			if(this.sprite) sprite.update();
			for (var i = this.childrentList.length - 1; i >= 0; i--) {
				this.childrentList[i]._update();
			};
			return this;	
		},
		_draw: function(game){
			var ctx=game.ctx;
			// if(this.rotation){
			// 	this.sprite ? this.sprite.draw(this) : this.draw(this);	
			// }else {
				ctx.save();
				ctx.translate(this.x,this.y);
				this.rotation ? ctx.rotate(this.rotation):null;
				this.sprite ? this.sprite.draw(game) : this.draw(game);	
				ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
				ctx.strokeStyle = this._strokeStyle;
				ctx.stroke();

				ctx.restore();
				if(BKGM.debug){
					ctx.save();
					var rect = [this.x-this.width/2,this.y-this.height/2,this.width,this.height];
					var  c1, c2, c3, c4, b1 = {},  /// corners
					     bx1, by1, bx2, by2;       /// bounding box
					var px=this.x,py=this.y,ar=this.rotation;
					/// get corner coordinates
					c1 = getCorner(px, py, rect[0], rect[1], ar);
					c2 = getCorner(px, py, rect[0] + rect[2], rect[1], ar);
					c3 = getCorner(px, py, rect[0] + rect[2], rect[1] + rect[3], ar);
					c4 = getCorner(px, py, rect[0], rect[1] + rect[3], ar);
					 
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
				

			// } 		
			for (var i = this.childrentList.length - 1; i >= 0; i--) {
				this.childrentList[i]._draw(game);
			};
			return this;
		},
		update:function(){
			return this;
		},
		draw:function(game){
			var ctx=game.ctx;
			ctx.beginPath();
			ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
			ctx.fillStyle=this._fillStyle;
			ctx.fill();
			ctx.strokeStyle = this._strokeStyle
			ctx.stroke();
			ctx.closePath();
			return this;
		},
		addChild: function(child){
			if(!child) return this;
			this.childrentList.push(child)
			child._id = this.childrentList.length;
			child.parent = this;
			return this;
		},
		removeChild:function (child) {
			var pos = this.findChild(child);
			var ret = this.removeChildAt(pos);
			return ret;
        },
		findChild:function (child) {
			var cl = this.childrenList;
			var i;
			var len = cl.length;
			for (i = 0; i < len; i++) {
				if (cl[i] === child) {
					return i;
				}
			}
			return -1;
        },
		removeChildAt:function (pos) {
			var cl = this.childrenList;
			var rm;
			if (-1 !== pos && pos>=0 && pos<this.childrenList.length) {
				cl[pos].setParent(null);
				rm = cl.splice(pos, 1);
				return rm[0];
			}
			return null;
		},
		setParent:function (parent) {
			if(!parent) return this;
			this.parent = parent;
			return this;
        },
		setBounds: function (x,y,w,h){
			this.x = x || this.x;
			this.y = y || this.y;
			this.width = w || this.width;
			this.height = h || this.height;
			return this;
		},
		setSize: function(w,h){
			this.width = w || this.width
			this.height = h || this.height;
			return this;
		},
		setPosition: function(x,y){
			this.x = x || this.x;
			this.y = y || this.y;
			return this;
		},
		getPosition: function(){
			return {
				x: this.x,
				y: this.y
			}
		},
		setFillStyle: function(fillStyle){
			this._fillStyle= fillStyle;
			return this;
		},
		setStrokeStyle: function(strokeStyle){
			this._strokeStyle= strokeStyle;
			return this;
		},
		setRotationAnchored:function(rotation,achorX,achorY){
			this.rotation=rotation;
			// console.log(rotation)
			// this.
			return this;
		},
		addSprite:function(sprite){
			this.sprite=sprite;
			this.canvas.width= this.width=sprite.width;
			this.canvas.height=this.height=sprite.height;

			return this;
		},
		removeSprite:function(){
			this.sprite=null;
			return this;
		},
		addAnimation:function(name, arr, time, endfn){
            this.sprite.animation[name]={arr:arr,time:time};
            this.sprite.endfn=endfn;
            return this;
        },
        playAnimation:function(name){
            this.sprite.currentAnimation=this.sprite.animation[name];
            this.sprite.animationIndex=0;
            this.sprite.index=this.sprite.currentAnimation.arr[0];
            return this;
        },
        eventEnable:function(on){
        	this._eventenable=on;
        	return this;
        },
        addBehavior:function(behavior){
        	this.behaviorList.push(behavior);
        	return this;
        },
        removeChild:function(behavior){
            this.behaviorList.splice(this.behaviorList.indexOf(behavior),1);
            return this;
        },
		mouseDrag: function(e){
			return this;
		},
		mouseDown: function(e){
			return this;
		},
		mouseUp: function(e){
			return this;
		},
		touchStart: function(e){
			return this;
		},
		touchEnd: function(e){
			return this;
		},
		touchMove: function(e){
			return this;
		}
	}
})();
(function(){
	BKGM.Collide = function(){
	}
	BKGM.Collide.prototype={

	}

})();