window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
             window.setTimeout(callback, 1000 / 60);
        };
})();


var BKGM = BKGM||{};

(function(){
    ((typeof(cordova) == 'undefined') && (typeof(phonegap) == 'undefined')) ? BKGM._isCordova=false : BKGM._isCordova=true;
    var lastTime=0;
    var t = 0;
    var sceneTime = 0;
    var frameTime=1000/60;
    var _statesLoop=[];
    var _count=[];
    
    var debug=document.createElement("div");
    debug.style.position="absolute";
    debug.style.color="red";
    var addLoop = function(_this){
        _statesLoop.push(_this);
    };
    var _loop = function(){
        var time=new Date();
        for (var i = _statesLoop.length - 1; i >= 0; i--) {
            var now =new Date();
            var dt =  now - lastTime;//Khoang thoi gian giua 2 lan cap nhat
            lastTime = now;
            t += dt ;//Thoi gian delay giua 2 lan cap nhat
            while (t >= frameTime) {//Chay chi khi thoi gian delay giua 2 lan lon hon 10ms
                t -= frameTime;//Dung de xac dinh so buoc' tinh toan
                sceneTime += frameTime;
                _statesLoop[i].update(_statesLoop[i], sceneTime);
            }   
            _statesLoop[i].loop(_statesLoop[i]);
        };
        var _drawtime=(new Date()- time);
        var drawtime=0;
        _count.push(_drawtime);
        for (var i = _count.length - 1; i >= 0; i--) {
            drawtime+=_count[i];
        };
        
        if (_count.length>=100) {
            _count.unshift();

        }
        if(debug && BKGM.debug)debug.innerHTML="draw time: "+(drawtime/_count.length*100>>0)/100 +"</br> FPS: "+_statesLoop[0].FPS;  
        requestAnimFrame(function(){
            _loop();
        });
    };
    
    BKGM = function(obj){
        var _this=this;
        _this.gravity={x:0,y:0,z:0};
        
        if(BKGM.Codea)
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', function(eventData){
                        if(eventData.accelerationIncludingGravity)
                            _this.gravity = {x:eventData.accelerationIncludingGravity.y/3,y:eventData.accelerationIncludingGravity.x/3,z:eventData.accelerationIncludingGravity.z};

                    }, false);

        } else {
            if(navigator &&  navigator.accelerometer){
                 // The watch id references the current `watchAcceleration`
                var watchID = null;


                

                // Start watching the acceleration
                //
                function startWatch() {

                    // Update acceleration every 1000/60 seconds
                    var options = { frequency: 1000/60 };

                    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
                }

                // Stop watching the acceleration
                //
                function stopWatch() {
                    if (watchID) {
                        navigator.accelerometer.clearWatch(watchID);
                        watchID = null;
                    }
                }


                function onSuccess(acceleration) {
                    _this.gravity = {x:acceleration.x/3,y:acceleration.y/3,z:acceleration.z};
                };

                function onError() {
                    alert('onError!');
                };
                startWatch();
                // navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);*/
            } else
                console.log("Not supported on your device or browser.  Sorry.")
        }
        
        
        if(obj){
            this.setup=obj.setup||this.setup;
            this.update=obj.update||this.update;
            this.draw=obj.draw||this.draw;
        }
        this.resource={};
        this.childrentList=[];

        if (document.getElementById("game"))
            this.canvas = document.getElementById("game");
        else {
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute("id", "game");
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;
            document.appendChild(this.canvas);
        }       
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.textAlign = "center";
        

        this.ctx.imageSmoothingEnabled= true;
        this.ctx.mozImageSmoothingEnabled= true;
        this.ctx.webkitImageSmoothingEnabled= true;
        // this._circle = document.createElement('canvas');
        // this._circle.width=200;
        // this._circle.height=200;
        // var _ctx = this._circle.getContext('2d');
        // _ctx.arc(100,100,100,0,Math.PI*2);
        // _ctx.fillStyle='#fff';
        // _ctx.fill();
       
        this._fps = {
            startTime : 0,
            frameNumber : 0,
            getFPS : function(){
                this.frameNumber++;
                var d = new Date().getTime(),
                    currentTime = ( d - this.startTime ) / 1000,
                    result = Math.floor( ( this.frameNumber / currentTime ) );

                if( currentTime > 1 ){
                    this.startTime = new Date().getTime();
                    this.frameNumber = 0;
                }
                return result;

            }

        };
        //this.ctx.globalCompositeOperation = 'source-atop';
        addMouseTouchEvent(this);
        return this;
    }
    BKGM.prototype = {
        loop:function(_this){            
            _this.FPS=_this._fps.getFPS();            
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this._staticDraw();
            _this.draw(_this);                  
            return _this;
        },
        run:function(){
            document.body.appendChild(debug);
            this.WIDTH = this.canvas.width;
            this.HEIGHT  = this.canvas.height;
            this.SCALE = Math.min(this.HEIGHT/1152,this.WIDTH/768) ;
            this.setup();
            if(BKGM.Codea){
                this.ctx.translate(0, this.canvas.height);
                this.ctx.scale(1,-1);
            }            
            lastTime=new Date();
            addLoop(this);
            _loop();
            return this;
        },
        setup:function(){
            return this;
        },
        update:function(){
            return this;
        },
        draw:function(){
            return this;
        },
        _staticDraw:function(){
            if (this._bg){       
                this.ctx.beginPath();
                this.ctx.rect(0, 0, this.canvas.width, this.canvas.height); 
                this.ctx.fillStyle = 'rgb('+this._bg.R+','+this._bg.G+','+this._bg.B+')';               
                this.ctx.fill();
            }
            return this;
        },
        background:function(R, G, B){
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height); 
            this.ctx.fillStyle = 'rgb('+R+','+G+','+B+')';               
            this.ctx.fill();
            return this;
        },
        fill:function(R, G, B, A){
            this.ctx.beginPath();
            this.ctx.fillStyle="rgba("+R+", "+G+", "+B+", " + A + ")";
            // this.ctx.fill();
            return this;
        },
        rect:function(x, y, width, height){
            if(this._rectMode==="CENTER"){
                this.ctx.rect(x-width/2, y-height/2, width, height);  
            } else 
            this.ctx.rect(x, y, width, height);
            this.ctx.fill();  
            return this;
        },
        rectMode:function(Input){
            this._rectMode=Input;
            return this;
        },
        text:function( string, x, y, fontSize){
            this.ctx.save();
            this.ctx.translate(0, this.canvas.height);
            this.ctx.scale(1,-1);  
            
            this.ctx.font = fontSize+'px Times New Roman'||'40px Times New Roman';
            this.ctx.fillText(string, x, this.canvas.height-(y-fontSize/2));
            this.ctx.restore();
            return this;
        },
        circle:function( x, y, diameter){
            this.ctx.beginPath();
            // this.ctx.drawImage(this._circle,0,0,this._circle.width,this._circle.width,x - diameter,y - diameter,diameter*2,diameter*2);
            this.ctx.arc(x, y, diameter, 0, Math.PI*2,false);
            this.ctx.fill(); 
            return this;
        },
        line:function(x1, y1, x2, y2){
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineCap = this._linemode||'butt';
            if (this._strokeWidth) this.ctx.lineWidth = this._strokeWidth;
            if (this._strokeColor) this.ctx.strokeStyle = this._strokeColor;
            this.ctx.stroke();
            this.ctx.closePath();
            return this;
        },
        lineCapMode:function(lineMode){
            this._linemode=lineMode;
            return this;
        },
        stroke:function(color, width){
            this._strokeColor=color;
            this._strokeWidth=width;
            return this;
        },
        addRes:function(res){
            this.resource=res;
            return this;
        },
        addChild:function(child){
            this.childrentList.push(child);
            return this;
        },
        removeChild:function(child){
            this.childrentList.splice(this.childrentList.indexOf(child),1);
            return this;
        },
        addStates:function(states){
            this.states=states;
        }
        
    }
    var checkMousePos=function(e,_this){
        var x;
        var y;
        if (e.pageX || e.pageY) { 
          x = e.pageX;
          y = e.pageY;
        }
        else { 
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        x -= _this.canvas.offsetLeft;
        y -= _this.canvas.offsetTop;
        return {x:x,y:y}
    }
    
    var addMouseTouchEvent= function(_this){
        
        _this.currentTouch={ state:"ENDED" };
        _this.canvas.addEventListener('touchstart', function(event) {
            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];  
                var e=checkMousePos(touch,_this);
                 _this.currentTouch.state="START";

                // for (var j = _this.childrentList.length - 1; j >= 0; j--) {
                //     if(_this.childrentList[j]._eventenable &&checkEventActor( e,_this.childrentList[j])) {
                //         if(_this.childrentList[j].touchStart) _this.childrentList[j].touchStart(e)
                //         return;
                //     }
                // };
                if(_this.states && _this.states._touchStart) _this.states._touchStart(e); else
                if(_this.touchStart) _this.touchStart(e);              
            }
           
        }, false);
        _this.canvas.addEventListener('touchmove', function(event) {
            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                _this.currentTouch.state="MOVING";
                if(_this.touchDrag) _this.touchDrag(checkMousePos(touch,_this));
            }
            
        }, false);
        _this.canvas.addEventListener('touchend', function(event) {
            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];   
                _this.currentTouch.state="ENDED";
                if(_this.touchEnd) _this.touchEnd(checkMousePos(touch,_this));             
            }
            
        }, false);
        _this.canvas.addEventListener('mousedown', function(event) {
            var e=checkMousePos(event,_this);
            _this._mouseDown=true;
            _this.currentTouch.state="START";
            // for (var i = _this.childrentList.length - 1; i >= 0; i--) {
            //     if(_this.childrentList[i]._eventenable &&checkEventActor( e,_this.childrentList[i])) {
            //         _this.childrentList[i].mouseDown(e)
            //         return;
            //     }
            // };
            if(_this.mouseDown) _this.mouseDown(e);
        }, false);
        _this.canvas.addEventListener('mousemove', function(event) {
            if(_this._mouseDown) _this.currentTouch.state="MOVING";
            if(_this.mouseDrag) _this.mouseDrag(checkMousePos(event,_this));
        }, false);
        _this.canvas.addEventListener('mouseup', function(event) {
            var e=checkMousePos(event,_this);
            _this._mouseDown=false;
            _this.currentTouch.state="ENDED";
            // for (var i = _this.childrentList.length - 1; i >= 0; i--) {
            //     if(_this.childrentList[i]._eventenable &&checkEventActor( e,_this.childrentList[i])) {
            //         _this.childrentList[i].mouseUp(e)
            //         return;
            //     }
            // };
            if(_this.mouseUp) _this.mouseUp(e);
        }, false);
    }
})();
(function(){
    // var BKGM = BKGM||{};
    // var s1 = new BKGM.Audio().setAudio('1');
    function getPhoneGapPath() {

        var path = window.location.pathname;
        path = path.substr( path, path.length - 10 );
        return path;

    };
    BKGM.Audio = function(){
        return this;
    }
    BKGM.Audio.prototype= {

        audio   : null,

        setAudio : function( name ,callback) {
            var self=this;
            if(BKGM._isCordova){
                // this.src=getPhoneGapPath()+name+'.mp3';
                // alert(getPhoneGapPath());
                this.src = getPhoneGapPath() + "/" + name;
                // var src='http://static.weareswoop.com/audio/charlestown/track_1.mp3';
                // alert(name)
                if (callback && !self.call) {callback();self.call=1;}
                // var src='/android_asset/www/audio/gameover.ogg';
                 
                //alert(this.src)
                // this.audio = new Media(name+'.m4a', function() { 
                //    self._onload();
                //    alert("loadok")
                //    if (callback) callback();
                // }
                // ,function(error){
                //     alert(error)
                // },
                // function(mediaStatus){
                //     // if(mediaStatus==4 && this.audio.getDuration()==media.getCurrentPosition()){
                //     //     if(self.ended) self.ended();
                //     //     if(self._loop) {
                //     //         self.play();
                //     //     }
                //     // }
                //     alert(mediaStatus)
                // });
            }else {
                this.audio= new Audio(name);
                this.audio.preload = 'auto';
                // var source = document.createElement('source');
                // if (this.audio.canPlayType("audio/ogg; codecs=vorbis")) {
                //     source.type= 'audio/ogg';
                //     source.src= name+'.ogg';
                // } else {
                //     source.type= 'audio/mpeg';
                //     source.src= name+'.mp3';
                // }
                // this.audio.appendChild(source);

                this.audio.load();
                
                this.audio.addEventListener('ended', function() { 
                        // this.currentTime=0;
                        if(self.ended) self.ended();
                    }, false);
                this.audio.addEventListener('canplaythrough', function() { 
                   self._onload();
                   if (callback && !self.call) {callback();self.call=1;}
                }, false);
            }
            return this;
        },

        loop : function( loop ) {
            this._loop=loop;
            return this;
        },
        forceplay:function(){
           
            if(BKGM._isCordova){
                var src=this.src;
                // var src='http://static.weareswoop.com/audio/charlestown/track_1.mp3';

                // Create Media object from src
                if(!this.audio)this.audio = new Media(src, function(){
                   self._onload();
                   
                 }, function(error){});
                // Play audio
                this.stop();
                this.audio.play();

                
            } else {
                 this.stop();
                 this.play();
            }
            
            return this;
        },
        play : function() {
            this.audio.play();
            return this;
        },

        pause : function() {
            //this.audio.pause();
            if (this.audio) {
                this.audio.pause();
            }
            return this;
        },
        stop : function(){
            if(BKGM._isCordova && this.audio) {
                this.audio.stop();
            } else {                
                this.audio.currentTime=0;
                this.audio.pause();
            }            
            return this;
        },
        ended:function(){
            return this;
        },
        _onload:function(){
            return this;
        }

    };
})();
(function(){
    BKGM.loadJS=function(url,callback){
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    };
    BKGM.checkMouseBox=function(e,obj){          
        return (e.x>obj.x&&e.y>obj.y&&e.x<(obj.x+obj.w)&&e.y<(obj.y+obj.h));
    };
    BKGM.checkEventActor=function(e,_actor){
        var originX=_actor.x,originY=_actor.y;
        var mouseX=e.x,mouseY=e.y;
        var dx = mouseX - originX, dy = mouseY - originY;
        // distance between the point and the center of the rectangle
        var h1 = Math.sqrt(dx*dx + dy*dy);
        var currA = Math.atan2(dy,dx);
        // Angle of point rotated around origin of rectangle in opposition
        var newA = currA - _actor.rotation;
        // New position of mouse point when rotated
        var x2 = Math.cos(newA) * h1;
        var y2 = Math.sin(newA) * h1;
        // Check relative to center of rectangle
        if (x2 > -0.5 * _actor.width && x2 < 0.5 * _actor.width && y2 > -0.5 * _actor.height && y2 < 0.5 * _actor.height){
            return true;
        }
    };
    BKGM.ajax = function(obj){
        var ajax = {
            url:obj.url ? obj.url :"", //url
            type:obj.type ? obj.type : "POST",// POST or GET
            data:obj.data ? obj.data : null,
            // processData:obj.processData ? obj.processData : false,
            // contentType:obj.contentType ? obj.contentType :false,
            // cache: obj.cache ? obj.cache : true,
            success: obj.success ? obj.success : null,
            error: obj.error ? obj.error : null,
            complete: obj.complete ? obj.complete : null
        }
        
        var xhr = new XMLHttpRequest();
        // xhr.upload.addEventListener('progress',function(ev){
        //     console.log((ev.loaded/ev.total)+'%');
        // }, false);
        xhr.onreadystatechange = function(ev){
            if (xhr.status==200) {
                if(ajax.success) ajax.success(xhr.responseText);
                if (xhr.readyState==4)
                    if (ajax.complete) ajax.complete(xhr.responseText)            
            } else {
                if (ajax.error) ajax.error(xhr.responseText);
            }            
        };
        xhr.open(ajax.type, ajax.url, true);
        xhr.send(ajax.data);
    }
})();
(function(){
    BKGM.preload=function(){
        this.audios={};
        this.images={};
        this._maxElementLoad=0;
        this._elementLoaded=0;
    };
    BKGM.preload.prototype.load=function(type,name,url,callback){
            var self=this;
            this._maxElementLoad++;
            if (type==="image"){
                var image=new Image();
                image.src=url;
                self.images[name]=image;
                image.onload=function(){
                        self._onload();
                        if (callback) callback();
                }
            } else
            if(type==="audio"){
                
                var audio=new BKGM.Audio();
                audio.setAudio(url,function(){self._onload()});
                self.audios[name]=audio;
                if (callback) callback();
            }
            return this;
        }
    BKGM.preload.prototype._onload=function(){

        this._elementLoaded++;
        if(this._maxElementLoad<=this._elementLoaded)
            this.onloadAll();
        return this;
    }
    BKGM.preload.prototype.onloadAll=function(){
        return this;
    }
})();

(function(){
    BKGM.Ads=function(adunit){
        this.adunit=adunit;
        mopub_ad_unit = adunit;
        mopub_ad_width = this.width; // optional
        mopub_ad_height = this.height; // optional
    }
    BKGM.Ads.prototype={
        width:320,
        height:50,
        init:function(adunit){
           
            return this;
        },
        setSize:function(w,h){
            this.width=w;
            this.height=h;
            mopub_ad_width = this.width; // optional
            mopub_ad_height = this.height; // optional
            return this;
        },
        setKeyword:function(arr){
            this.key=arr;
            mopub_keywords = arr; // optional
            return this;
        }

    }
     
        
       
})();
