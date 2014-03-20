(function(){
    var blockHeight   = 0,
        blockGap      = 0,
        maxLeftWidth  = 0,
        blockDistance = 0,
        maxY          =0;

    BKGM.Blocks = function(game){
        this.blocks  = [];
        this.current = 0;
        this.height  = blockHeight;
        this.game    = game;
        blockHeight   = 50 * game.SCALE,
        blockGap      = 100 * game.SCALE,
        maxLeftWidth  = game.WIDTH - blockGap,
        blockDistance = 250 * game.SCALE,
        maxY          = game.HEIGHT + blockHeight / 2;
    };

    BKGM.Blocks.prototype = {
        get: function(i){
            return this.blocks[i];
        },

        head: function(){
            return this.blocks[0];
        },

        last: function(){
            var blocks = this.blocks;
            return blocks[blocks.length-1];
        },

        now: function(){
            return this.get(this.current);
        },

        spawn: function(pos_y){
            pos_y = pos_y || 0;
            var sy = pos_y - blockHeight;
            var sw = this.game.random(blockGap, maxLeftWidth);
            var swr = sw + blockGap
            var height = this.height
            return this.blocks.push({y : sy, w : sw, wr : swr, height: height});
        },

        unshift: function(){
            this.blocks.shift();
            this.current--;
        },

        update: function(){

            for (v in this.blocks) {
                this.blocks[v].y += this.game.speed;
            }

            if (this.get(0).y >= maxY) this.unshift();

            var s = this.last().y - blockDistance;
            if (s >= 0) this.spawn(s);

        },

        pass: function(drop){
            var condition = this.now().y > drop.top;
            if (condition) this.current++;
            return condition
        },

        draw: function(){
            var blocks = this.blocks;
            var game = this.game;
            for (var i = 0, l = blocks.length; i < l; i++) {
                var v = blocks[i];
                var r = game.random(0, 2);
                var k = game.random(5, 10) * SCALE;
                if (r < 1){
                    game.fill(255, 255, 255, Math.random()*0.3);
                    game.rect(0, v.y-k, v.w, this.height+2*k);
                    game.rect(v.wr, v.y-k, WIDTH - v.wr, this.height+2*k);
                }
                game.fill(255, 255, 255, 1);
                game.rect(0, v.y, v.w, this.height);
                game.rect(v.wr, v.y, WIDTH - v.wr, this.height);
            }
        }
    }
})();
