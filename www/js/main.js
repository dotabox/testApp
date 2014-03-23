(function(){
// var dmno=new BKGM.Audio().setAudio("audio/slap")
	// Wait for device API libraries to load
            //
            
            window.addEventListener("load", bodyload, false);

            // device APIs are available
            //
            function bodyload(){
            	onDeviceReady()
            	// document.addEventListener("deviceready", onDeviceReady, false);

            }
            function onDeviceReady() { 

            	((typeof(cordova) == 'undefined') && (typeof(phonegap) == 'undefined')) ? BKGM._isCordova=false : BKGM._isCordova=true;
            	
            	var preload= new BKGM.preload();           	
				preload.load("image","chim","img/chuotngu.png")
					   .load("image","lol_blit","img/LOL/LOL_Blit.png")
					   .load("image","lol_hand","img/LOL/LOL_2.png")
					   .load("image","lol_main","img/LOL/LOL_1.png")
					   .load("image","lol_3","img/LOL/LOL_3.png")
					   .load("image","dota_pudge","img/DOTA/DOTA_Pudge.png")
					   .load("image","dota_hand","img/DOTA/DOTA_2.png")
					   .load("image","dota_main","img/DOTA/DOTA_1.png")
					   .load("image","dota_3","img/DOTA/DOTA_3.png")
					   .load("audio","slap","audio/slap.mp3");
				preload.onloadAll= function(){
					windowLoad(preload);  
				}
            }
	// window.onload=function(){
        function windowLoad(preload) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", "game"); 
            canvas.width  = 800;
            canvas.height = 600;
            var ctx = canvas.getContext("2d");
            document.body.appendChild(canvas);

            var director;
            var _fb;
            
            
            var Game = new BKGM({
			    setup: function(){
			        director = new BKGM.States();
			        var Game = this;
			        Game.addStates(director);
			        BKGM.debug=1;
			        Game.addRes(preload);
			        
			       	// _fb = new BKGM.FBConnect();
			       	// _fb.init({appId:"296632137153437"});
			       	Game.touchStart=function(e){
			       			// _fb.postCanvas("Test post diem");
			       			// mb.setTarget(e.x,e.y);
			       			
			       	}
			       
			        Game.random = function(min, max){
			        	return Math.floor(min + Math.random()*(max-min));
			        };
			        

    				
				    director.state("ready", [	
				     	"background",
				     	"setup",
				     	"lolvsdota"
				     	// "drop.tail",
				     	// "drop.update",
				     	// "drop.draw",
				     	// "testactor.update",
				     	// "testactor.draw"
				    ]);
				    
				    director.state("menu", [
				    	"setup",
				    	"background",
				    	"lolvsdota"				    	
				    ]);
				    director.state("run", [
				    	"background",
				    	"charactor.update",
				    	"charactor.draw",
				    	"heroes",
				    	"testactor"
				    ]);

				    var menudota={
				    	x:150,
				    	y:100,
				    	w:200,
				    	h:450
				    }
				    var menulol={
				    	x:500,
				    	y:100,
				    	w:200,
				    	h:450
				    }
				    director.task("lolvsdota", function(){
				        // Game.drop.updateTail()
				        Game.fill(255,255,255,1);
				        Game.rect(menudota.x,menudota.y,menudota.w,menudota.h);
				        Game.rect(menulol.x,menulol.y,menulol.w,menulol.h);
				    },true);
				    var charactor;
				    director.touchStart=function(e){
				    	switch (director.current){
				    		case 'menu': 
				    			if(BKGM.checkMouseBox(e,menulol)) {
				    				charactor=new BKGM.Charactor('lol',{blit:Game.resource.images["lol_blit"],hand:Game.resource.images["lol_hand"],main:Game.resource.images["lol_main"],arm:Game.resource.images["lol_3"]});
				    				charactor.x=Game.WIDTH/2;
				    				initHero();
				    				director.switch("run"); 
				    			}
				    			if(BKGM.checkMouseBox(e,menudota)) {
				    				charactor=new BKGM.Charactor('dota',{pudge:Game.resource.images["dota_pudge"],hand:Game.resource.images["dota_hand"],main:Game.resource.images["dota_main"],arm:Game.resource.images["dota_3"]});
				    				charactor.x=Game.WIDTH/2;
				    				initHero();
				    				director.switch("run"); 
				    			}
				    			break;
				    		case 'run': 
				    			if(e.y<200)
				    				charactor.setTarget(e);
				    			else charactor.shoot(e);
				    			break;
				    	}
				    }
		   //        	var sprite = new BKGM.Sprite({image:Game.resource.images["chim"],rows:2,columns:2}).addAnimation("run",[0,1],200,"loop").playAnimation("run");
					// var testactor=new BKGM.Actor().addSprite(sprite);
					// testactor.touchStart=function(e){
					// 	var s0=Game.resource.audios["slap"];
					// 	s0.forceplay();
					// 	// dmno.play()
					// }
				    director.taskOnce("setup", function(){
				        Game.speed = 3 * Game.SCALE;
				        Game.highscore = 0;
				        // Game.drop  = new BKGM.Drop(Game);
				        // Game.blocks = new BKGM.Blocks(Game);
				        // Game.blocks.spawn(0);
				        
				        Game.score = 0;
				        //Game.highscore = readLocalData("highscore", 0);
				    });
				    
				   
				    
				    director.task("background", function(){
				        Game.background(100, 50, 100, 1);
				    }, true);
				    var heroes=[];
				    function initHero(){
				    	for (var i = 3; i >= 0; i--) {
					    	var sprite = new BKGM.Sprite({image:Game.resource.images["chim"],rows:2,columns:2}).addAnimation("run",[0,1],200,"loop").playAnimation("run");
					    	var posx=(Math.random()*600)+100;
					    	var posy=(Math.random()*200)+200;
							var hero=new BKGM.Enemy(i%4==0||i%4==1?"dota":"lol",i%2==0?"water":"sky");
							hero.x=posx;
							hero.y=posy;
							hero.addSprite(sprite);
							hero.setTarget({x:posx,y:posy});
							hero.box = new BKGM.Box(new BKGM.Vector(hero.x-hero.width/2-10,hero.y-hero.height/2-5), hero.width-20, hero.height-10);
							// var bb = new BKGM.Behavior(posx,posy, 10, hero);
							heroes.push(hero);
							charactor.hook.collideArray.push(hero);
					    };
				    }
				    
				    director.taskActors("heroes", heroes);
				    director.task("charactor.draw", function(){
				        if(charactor) charactor.draw(Game);
				    }, true);
				    director.task("charactor.update", function(){
				        if(charactor) charactor.update(Game);
				    });
				    
				    director.task("menu", function(){
				        return {
				            logo_x : Game.WIDTH / 2,
				            logo_y : 2 * Game.HEIGHT / 3,
				            buttons : [
				                { 
				                    x : Game.WIDTH/2,
				                    y : Game.HEIGHT/2,
				                    w : 300 * Game.SCALE,
				                    h : 60 * Game.SCALE,
				                    s : 20 * Game.SCALE,
				                    f : 30 * Game.SCALE,
				                    list : [
				                        "PLAY",
				                        "SPEED"
				                    ]
				                }
				            ]
				        };
				    });
				    
				    director.task("logo", function(pos){

				        var c = Game.random(0, 30);
				        var f = 25 * Game.SCALE;
				                
				        Game.fill(255-c, 255-c, 255-c, 1);
				        
				        var d = Game.random(-1, 1);
				        var e = Game.random(-1, 1);
				        
				        Game.text("BKGameMaker", pos.logo_x + d, pos.logo_y + f + e, 20 * Game.SCALE);
				        
				        Game.text("SLIPPY DROP", pos.logo_x + d, pos.logo_y - f + e, 50 * Game.SCALE);
				        Game.fill(255-c, 255-c, 255-c, 1);
				    });
				    
				    director.task("buttons", function(opt){
				        var buttons = table.remove(opt.buttons, 1);
				        var x = buttons.x;
				        var y = buttons.y;
				        var w = buttons.w;
				        var h = buttons.h;
				        var s = buttons.s;
				        var f = buttons.f;
				        
				        var c = Game.random(0, 100);
				                
				        Game.rectMode(CENTER);
				        
				        var d = Game.random(-1, 1);
				        var e = Game.random(-1, 1);

				        var list = buttons.list;
				        for (var i = 0, l = list.length; i < l; i++) {
				            Game.fill(0, 0, 0, 255);
				            Game.rect(x + d, y - ( h + s ) * (i-1) + e, w, h, f);
				            Game.fill(255-c, 255-c, 255-c, 255);
				            Game.text(list[i], x + d, y - ( h + s ) * (i-1) + e, f);
				        }
				    });
				    
				    director.switch("menu");
			    },
			    draw: function(Game){
			        // Runs every interval
			        director.draw(Game);
			    },
			    update: function(){
			    	//Run every 100060 ms
			    	// 
			    	director.run();
			    }
			}).run();
        }
	// };
})()