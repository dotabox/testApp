(function(States){
    BKGM.States = function(){
        this.current = "default";
        this.once    = false;
        this.states  = { default : [] };
        this.tasks   = {};
        this.tasksdraw={};
        this.childs  = [];
        // this.task    = new BKGM.Task();
    }
    BKGM.States.prototype = {
        state: function (name, tasks) {
            this.states[name] = tasks;
        },
        task: function (name, fn, isdraw) {
            isdraw ? this.tasksdraw[name]=fn :this.tasks[name] = fn;
        },
        taskOnce: function(name, fn) {
            var self = this;
            this.tasks[name] = function(arg) {
                self.once === false?fn(arg):null;
                self.once=true;                
            }
        },
        taskActor: function(name, actor){
            this.tasks[name]=function(){actor._update()};
            this.tasksdraw[name]=function(game){actor._draw(game)};
            this.childs.push(actor);
        },
        taskActors: function(name, actors){
            this.tasks[name]=function(){
                for (var i = actors.length - 1; i >= 0; i--) {
                    actors[i]._update();
                };
            };
            this.tasksdraw[name]=function(game){
                for (var i = actors.length - 1; i >= 0; i--) {
                    actors[i]._draw(game);
                };
            };
            // this.childs.concat(actors);
        },
        run: function() {
            var tasks = this.states[this.current];
            var result, tresult;
            for (var i = 0, l = tasks.length; i < l; i++) {
                if(this.tasks[tasks[i]]){
                    tresult = this.tasks[tasks[i]](result);
                    if (typeof(tresult) !== "undefined") result = tresult;
                }
            }
        },
        draw: function(Game){
            var tasks = this.states[this.current]; 
            for (var i = 0, l = tasks.length; i < l; i++) {
                if(this.tasksdraw[tasks[i]]){
                    tresult = this.tasksdraw[tasks[i]](Game);
                }
            }
        },
        switch: function(state, runNow){
            var self=this;
            this.once = false;
            this.current = state;
            if (runNow == true) self.run();
        },
        _touchStart:function(e){
            for (var i = this.childs.length - 1; i >= 0; i--) {
                if(this.childs[i]._eventenable && BKGM.checkEventActor(e,this.childs[i])){
                    if(this.childs[i].touchStart) this.childs[i].touchStart(e);
                    return;
                }
            };
            if(this.touchStart) this.touchStart(e);
        },  
        _mouseDown:function(e){
            for (var i = this.childs.length - 1; i >= 0; i--) {
                if(this.childs[i]._eventenable && BKGM.checkEventActor(e,this.childs[i])){
                    if(this.childs[i].mouseDown) this.childs[i].mouseDown(e);
                    return;
                }
            };
            if(this.mouseDown) this.mouseDown(e);
        },
        touchStart:function(e){

        }
    }

})();