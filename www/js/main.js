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
            	var isload=false;
            	BKGM.audioDetect(function(mime){
            		if(isload||!mime) return;
            		isload=true;
            		var preload= new BKGM.preload(); 
            		preload.mime=mime;

					preload
						   .load("image","lol_blit","img/LOL/LOL_Blit.png")
						   .load("image","lol_hand","img/LOL/LOL_2.png")
						   .load("image","lol_main","img/LOL/LOL_1.png")
						   .load("image","lol_3","img/LOL/LOL_3.png")
						   .load("image","dota_pudge","img/DOTA/DOTA_Pudge.png")
						   .load("image","dota_hand","img/DOTA/DOTA_2.png")
						   .load("image","dota_main","img/DOTA/DOTA_1.png")
						   .load("image","dota_3","img/DOTA/DOTA_3.png")
						   .load("image","LOL_Renekton","img/LOL/LOL_Renekton.png")
						   .load("image","DOTA_Jakiro","img/DOTA/DOTA_Jakiro.png")
						   .load("image","DOTA_Tide","img/DOTA/DOTA_Tide.png")
						   .load("image","LOL_Teemo","img/LOL/LOL_teemo.png")
						   .load("image","bg","img/bg.png")
						   .load("soundBase64","k5_dota","announcer_kill_rampage_01")
						   .load("soundBase64","k4_dota","announcer_kill_ultra_01")
						   .load("soundBase64","k3_dota","announcer_kill_triple_01")
						   .load("soundBase64","k2_dota","announcer_kill_double_01")
						   .load("soundBase64","win_dota","pud_win_05")
						   .load("soundBase64","spawn_dota","pud_spawn_11")
						   .load("soundBase64","move_dota","pud_move_03")
						   .load("soundBase64","lose_dota","pud_lose_08")
						   .load("soundBase64","kill_dota","pud_kill_10")
						   .load("soundBase64","begin_dota","announcer_battle_begin_01")
						   .load("soundBase64","miss_dota","pud_ability_hook_miss_09")
						   .load("soundBase64","hook_dota","pud_ability_hook_04")
						   .load("soundBase64","welcome_dota","announcer_welcome_01")
						   .load("soundBase64","fb_dota","announcer_1stblood_01")
						   .load("soundBase64","k5_lol","pentakill")
						   .load("soundBase64","k4_lol","quartrakill")
						   .load("soundBase64","k3_lol","tripplekill")
						   .load("soundBase64","k2_lol","doublekill")
						   .load("soundBase64","win_lol","laught")
						   .load("soundBase64","spawn_lol","Blitzcrank_Select")
						   .load("soundBase64","move_lol","Blitzcrank")
						   .load("soundBase64","lose_lol","lose")
						   // .load("soundBase64","kill_lol","pud_kill_10")
						   .load("soundBase64","begin_lol","announcer_battle_begin_01")
						   .load("soundBase64","miss_lol","miss")
						   .load("soundBase64","hook_lol","shoot")
						   .load("soundBase64","welcome_lol","welcome")
						   .load("soundBase64","fb_lol","fb")
						   ;
					preload.onloadAll= function(){
						windowLoad(preload);  
					}
            	})
            	
            }
	// window.onload=function(){
        function windowLoad(preload) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute("id", "game"); 
            // canvas.style.width  = '100%';
            // canvas.style.height ='100%';
            var ctx = canvas.getContext("2d");
            document.body.appendChild(canvas);
            // var div= document.createElement('div');
            // div.style.width='100%';
            // div.style.height='100%';
            // document.body.appendChild(div);
            // div.appendChild(canvas);
            canvas.width=800;
            canvas.height=600;

            var director;
            var _fb;
            
            var Game = new BKGM({
			    setup: function(){
			        director = new BKGM.States();
			        var Game = this;
			        Game.addStates(director);
			        // BKGM.debug=1;
			        Game.addRes(preload);
			        Game.GameScore=new BKGM.ScoreLocal("dotavslol");
			       	_fb = new BKGM.FBConnect();
			       	_fb.init({appId:"296632137153437"});
			       	// Game.touchStart=function(e){
			       	// 		// _fb.postCanvas("Test post diem");
			       	// 		// mb.setTarget(e.x,e.y);
			       			
			       	// }
			       
			        Game.random = function(min, max){
			        	return Math.floor(min + Math.random()*(max-min));
			        };
			        

    				
				    
				    
				    director.state("menu", [
				    	"background",
				    	"lolvsdota"				    	
				    ]);
				    director.state("ready", [
				    	"setcount",
				    	"background",				    	
				    	"count"
				    	// "charactor.draw"
				    ]);
				    director.state("run", [
				    	"setup",
				    	"background0",
				    	"countdown",
				    	"point",
				    	"charactor.update",				    	
				    	"heroes",
				    	"charactor.draw"
				    ]);
				    director.state("gameover", [
				    	"calscore",
				    	"background0",		    	
				    	"scoreBoard",
				    	"try_postscore"
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
				        Game.fill(222,222,222,1);
				        Game.rect(menudota.x,menudota.y,menudota.w,menudota.h);
				        Game.rect(menulol.x,menulol.y,menulol.w,menulol.h);
				        Game.fill(50,50,50,1);
				        var text1="DOTA";
				        var text2="LOL";
				        Game.text(text1,menudota.x+Game.ctx.measureText(text1).width,menudota.y+50,50);
				        Game.text(text2,menulol.x+Game.ctx.measureText(text2).width+30,menulol.y+50,50);
				    },true);
				    director.task("point", function(){
				        // Game.drop.updateTail()
				        Game.fill(16,16,16,1);
				        Game.text("DOTA POINT: "+charactor.dotapoint,20,20,20);
				        Game.text("LOL POINT: "+charactor.lolpoint,Game.WIDTH-150,20,20);
				    },true);
				    var pudgesound={
				    	fb:Game.resource.audios["fb_dota"],
				    	k2:Game.resource.audios["k2_dota"],
				    	k3:Game.resource.audios["k3_dota"],
				    	k4:Game.resource.audios["k4_dota"],
				    	k5:Game.resource.audios["k5_dota"],
				    	shoot:Game.resource.audios["hook_dota"],
				    	miss:Game.resource.audios["miss_dota"],
				    	kill:Game.resource.audios["kill_dota"],
				    	win:Game.resource.audios["win_dota"],
				    	lose:Game.resource.audios["lose_dota"],
				    	begin:Game.resource.audios["begin_dota"],
				    	spawn:Game.resource.audios["spawn_dota"],
				    	welcome:Game.resource.audios["welcome_dota"],
				    	move:Game.resource.audios["move_dota"]
				    }
				    var pudgeimages={
				    	pudge:Game.resource.images["dota_pudge"],
				    	hand:Game.resource.images["dota_hand"],
				    	main:Game.resource.images["dota_main"],
				    	arm:Game.resource.images["dota_3"]
				    }
				    var blitsound={
				    	fb:Game.resource.audios["fb_lol"],
				    	k2:Game.resource.audios["k2_lol"],
				    	k3:Game.resource.audios["k3_lol"],
				    	k4:Game.resource.audios["k4_lol"],
				    	k5:Game.resource.audios["k5_lol"],
				    	shoot:Game.resource.audios["hook_lol"],
				    	miss:Game.resource.audios["miss_lol"],
				    	kill:Game.resource.audios["kill_lol"],
				    	win:Game.resource.audios["win_lol"],
				    	lose:Game.resource.audios["lose_lol"],
				    	begin:Game.resource.audios["begin_lol"],
				    	spawn:Game.resource.audios["spawn_lol"],
				    	welcome:Game.resource.audios["welcome_lol"],
				    	move:Game.resource.audios["move_lol"]
				    }
				    var blitimages={
				    	blit:Game.resource.images["lol_blit"],
				    	hand:Game.resource.images["lol_hand"],
				    	main:Game.resource.images["lol_main"],
				    	arm:Game.resource.images["lol_3"]
				    }
				    var charactor;
				    var _down=function(e){
				    	switch (director.current){
				    		case 'menu': 
				    			if(BKGM.checkMouseBox(e,menulol)) {
				    				charactor=new BKGM.Charactor('lol',blitimages,blitsound);
				    				charactor.x=Game.WIDTH/2;
				    				initHero();
				    				director.switch("ready"); 
				    			} else
				    			if(BKGM.checkMouseBox(e,menudota)) {
				    				charactor=new BKGM.Charactor('dota',pudgeimages,pudgesound);
				    				charactor.x=Game.WIDTH/2;
				    				initHero();
				    				director.switch("ready"); 
				    			}
				    			break;
				    		case 'run': 
				    			if(e.y<200)
				    				charactor.setTarget(e);
				    			else charactor.shoot(e);
				    			break;
			    			case 'gameover':
			    				if(BKGM.checkMouseBox(e,TryButton)) {
			    					director.switch("menu");
			    				} else
			    				if(BKGM.checkMouseBox(e,ScoreButton)) {
			    				}
			    				break;
				    	}
				    }
				    director.touchStart=function(e){
				    	_down(e);
				    }
				    director.mouseDown=function(e){
				    	_down(e);
				    }
				    director.taskOnce("setup", function(){
				        Game.speed = 3 * Game.SCALE;
				        Game.highscore = Game.GameScore.getScore();
				        Game.startTime=Game.time;
				        Game.countdown=30000;
				        Game.score = 0;
				        Game.font='kirbyss';
				        Game.gameover=false;
				        heroes=[];
				        charactor.audios.spawn.forceplay();
				        //Game.highscore = readLocalData("highscore", 0);
				    });

				    director.taskOnce("setcount",function(){
				    	charactor.audios.welcome.forceplay();
				    	charactor.audios.welcome.ended=function(){
				    		charactor.audios.begin.forceplay();
				    	}
				   		Game._count=4000;
				    })
				    director.task("count",function(){
				   		Game._count-=1000/60;
				   		if(Game._count<0){
				   			director.switch("run");
				   		}
				    })
				    director.task("count",function(){
				    	Game.fill(222,222,222,1);
				    	Game.text("GET READY!",Game.WIDTH/2,Game.HEIGHT/2-100,60,1)
				    	var count=(Game._count/1000-0.1)>>0;
				    	var text=(count==0)?"GO":(count+"");
				    	Game.text(text,Game.WIDTH/2,Game.HEIGHT/2,60,1);
				    },true);
				    
				    director.task("background", function(){
				        Game.background(100, 100, 200, 1);
				    }, true);
				    director.task("background0", function(){
				        Game.ctx.drawImage(Game.resource.images.bg,0,0,Game.WIDTH,Game.HEIGHT);
				    }, true);
				    director.task("countdown", function(){
				    	Game.countdown-=1000/60;
				    	if(Game.countdown<0){
				    		Game.countdown=0;
				    		Game.gameover=true;
				    		director.switch("gameover");
				    	}
				    });
				    director.task("countdown", function(){
				    	Game.fill(16,16,16,1);
				    	var text="Time: "+(Game.countdown/1000>>0) +" s";
				        Game.text(text, Game.WIDTH/2-50, 20, 20);
				    }, true);

				    var heroes=[];
				    var _heroes=[
				    {image:Game.resource.images["DOTA_Jakiro"],rows:1,columns:1,type:'dota',_class:'sky'},
				    {image:Game.resource.images["DOTA_Tide"],rows:1,columns:1,type:'dota',_class:'water'},
				    {image:Game.resource.images["LOL_Renekton"],rows:1,columns:1,type:'lol',_class:'water'},
				    {image:Game.resource.images["LOL_Teemo"],rows:1,columns:1,type:'lol',_class:'sky'}
				    ]
				    function initHero(){
				    	for (var i = _heroes.length - 1; i >= 0; i--) {
				    		var sprite = new BKGM.Sprite(_heroes[i]).addAnimation("run",[0,0],200,"loop").playAnimation("run");
					    	var posx=(Math.random()*600)+100;
					    	var posy=(Math.random()*200)+200;
							var hero=new BKGM.Enemy(_heroes[i].type,_heroes[i]._class);
							
							hero.addSprite(sprite);
							hero.setTarget({x:posx,y:posy});
							hero.box = new BKGM.Box(new BKGM.Vector(hero.x-hero.width/2-10,hero.y-hero.height/2-5), hero.width-20, hero.height-10);
							// var bb = new BKGM.Behavior(posx,posy, 10, hero);
							heroes.push(hero);
							charactor.hook.collideArray.push(hero);
				    		
				    	};
				    	for (var i = 3; i >= 0; i--) {
					    	
					    };
					    director.taskActors("heroes", heroes);
				    }
				    
				    // director.taskActors("heroes", heroes);
				    director.task("charactor.draw", function(){
				        if(charactor) charactor.draw(Game);
				    }, true);
				    director.task("charactor.update", function(){
				        if(charactor) charactor.update(Game);
				    });
				    
				    var scoreBoard={
				    	topMessage:["You are so stupid"],
				    	tip:["Shut up and play your game"],
				    	images:[]
				    }
				    director.taskOnce("calscore", function(){
				        Game.score = charactor.type=="lol"? charactor.dotapoint-charactor.lolpoint : charactor.lolpoint-charactor.dotapoint;				        
				        
				        if(Game.highscore<Game.score){
				        	Game.GameScore.submitScore(Game.score);
				        	Game._newtext="NEW ";
				        	Game.highscore=Game.score;
				        } else {
				        	Game._newtext="";
				        }
				        if(Game.score < 0){
				        	charactor.audios.lose.forceplay();
				        } else {
				        	charactor.audios.win.forceplay();
				        }
				        // console.log(Game._newtext);

				    });
				   	director.task("scoreBoard", function(){
				   		Game.fill(33,33,33,1);
				   		Game.text(scoreBoard.topMessage[0],Game.WIDTH/2,100,50,1);
				   		Game.text(scoreBoard.tip[0],Game.WIDTH/2,170,30,1);
				        Game.fill(50,50,50,1);
				        Game.rectMode("CENTER");
				        Game.rect(Game.WIDTH/2,Game.HEIGHT/2,400,200);
				        Game.fill(222,222,222,1);
				        Game.text("DOTA POINT: "+charactor.dotapoint,Game.WIDTH/2-170,Game.HEIGHT/2-80,26);
				        Game.text("LOL POINT: "+charactor.lolpoint,Game.WIDTH/2-170,Game.HEIGHT/2-35,26);
				        Game.line(Game.WIDTH/2-170,Game.HEIGHT/2,Game.WIDTH/2+26,Game.HEIGHT/2);
				        Game.text("SCORE: "+Game.score,Game.WIDTH/2-170,Game.HEIGHT/2+20,26);
				        
				        Game.text(Game._newtext+"BEST SCORE: "+Game.highscore,Game.WIDTH/2-170,Game.HEIGHT/2+60,26);				        
				    },true);

				    var TryButton={
				    	x:Game.WIDTH/2-230,
				    	y:Game.HEIGHT/2+120,
				    	w:200,
				    	h:60
				    }
				    var ScoreButton={
				    	x:Game.WIDTH/2+50,
				    	y:Game.HEIGHT/2+120,
				    	w:200,
				    	h:60
				    }
				    director.task("try_postscore", function(){
				    	Game.fill(50,50,50,1);
				        Game.rectMode("DEFAULT");
				        Game.rect(TryButton.x,TryButton.y,TryButton.w,TryButton.h);
				        Game.rect(ScoreButton.x,ScoreButton.y,ScoreButton.w,ScoreButton.h);
				        Game.fill(222,222,222,1);
				        Game.text("Try again",TryButton.x+15,TryButton.y+TryButton.h/2-5,25);
				        Game.text("Post score",ScoreButton.x+5,ScoreButton.y+ScoreButton.h/2-5,25);
				    },true);
				    
				    
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