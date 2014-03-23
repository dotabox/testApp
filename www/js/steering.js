(function (key) {
    BKGM.SteeringManager = function (host) {
        var privateVars = {
            host: host,
            MAX_FORCE: 5.4,
            desired: new BKGM.Vector(0, 0),
            steering: new BKGM.Vector(0, 0)
        };

        // Define a getter function that will only return private members
        // for privileged functions.
        this._ = function (aKey) {
            return aKey === key && privateVars;
        };
    };

    BKGM.SteeringManager.prototype = {

        seek: function (target, slowingRadius) {
            var _ = this._(key);
            _.steering.incrementBy(this.doSeek(target, slowingRadius));
        },

        update: function () {
            var _ = this._(key);
            var velocity = _.host.getVelocity();
            var position = _.host.getPosition();

            //truncate(steering, MAX_FORCE);
            _.steering.truncate(_.MAX_FORCE);
            _.steering.scaleBy(1 / _.host.getMass());

            velocity.incrementBy(_.steering);
            //truncate(velocity, host.getMaxVelocity());
            velocity.truncate(_.host.getMaxVelocity());

            position.incrementBy(velocity);
        },

        reset: function () {
            var _ = this._(key);
            _.steering.setPos(0, 0);
            _.desired.setPos(0, 0);
        },

        doSeek: function (target, slowingRadius) {
            slowingRadius = slowingRadius || 200;
            var _ = this._(key);
            var force;
            var distance;

            _.desired = target.subtract(_.host.getPosition());

            distance = _.desired.length;
            _.desired.normalize();

            if (distance <= slowingRadius) {
                _.desired.scaleBy(_.host.getMaxVelocity() * distance / slowingRadius);
            } else {
                _.desired.scaleBy(_.host.getMaxVelocity());
            }

            force = _.desired.subtract(_.host.getVelocity());
            return force;
        }
    };

})({});
(function (key) {
    BKGM.Vector = function (x, y) {
        var privateVars = {
        };

        this.x = x || 0;
        this.y = y || 0;
        var self = this;

        privateVars.calLength = function () {
            self.length = Math.sqrt(self.x * self.x + self.y * self.y);
        };
        privateVars.calLength();

        // Define a getter function that will only return private members
        // for privileged functions.
        this._ = function (aKey) {
            return aKey === key && privateVars;
        };
    };

    BKGM.Vector.prototype = {
        setPos: function (x, y) {
            this.x = x;
            this.y = y;
            this._(key).calLength();
        },

        add: function (v) {
            return new BKGM.Vector(this.x + v.x, this.y + v.y);
        },

        subtract: function (v) {
            return new BKGM.Vector(this.x - v.x, this.y - v.y);
        },

        incrementBy: function (v) {
            this.x += v.x;
            this.y += v.y;
            this._(key).calLength();
        },

        decrementBy: function (vector) {
            this.x -= v.x;
            this.y -= v.y;
            this._(key).calLength();
        },

        scaleBy: function (s) {
            this.x *= s;
            this.y *= s;
            this._(key).calLength();
        },

        normalize: function () {
            this.x = this.x / this.length;
            this.y = this.y / this.length;
            this._(key).calLength();
        },

        truncate: function (maxlength) {
            var s;
            s = maxlength / this.length;
            s = s < 1.0 ? s : 1.0;
            this.x *= s;
            this.y *= s;
            this._(key).calLength();
        },

        getAngle: function () {
            if (!this.y || !this.x) {
                return 0;
            }
            return Math.atan2(this.y, this.x);
        },

        setAngle: function (value) {
            this.x = Math.cos(value) * this.length;
            this.y = Math.sin(value) * this.length;
        },

        clone: function () {
            return new BKGM.Vector(this.x, this.y);
        }
    };

})({});
(function (key) {
    BKGM.Behavior = function (posX, posY, totalMass, view) {
        var privateVars = {
            MAX_VELOCITY: 4,
            mass: totalMass,
            actorView: view
        };

        privateVars.position = new BKGM.Vector(posX, posY);
        privateVars.velocity = new BKGM.Vector(-1, -2);
        privateVars.steering = new BKGM.SteeringManager(this);
        privateVars.target = new BKGM.Vector(posX, posY);
        privateVars.actorView.addBehavior(this);

        // Define a getter function that will only return private members
        // for privileged functions.
        this._ = function (aKey) {
            return aKey === key && privateVars;
        };
    };

    BKGM.Behavior.prototype = {

        update: function () {
            var _ = this._(key);
            _.steering.seek(_.target);

            _.steering.update();

            _.actorView.x = _.position.x - _.actorView.width / 2;
            _.actorView.y = _.position.y - _.actorView.height / 2;

            var rotate = _.velocity.getAngle();
            // console.log(_.velocity.x,_.velocity.y)
            _.actorView.setRotationAnchored(rotate, 0.5, 0.5);
        },

        setTarget: function (x, y) {
            this._(key).target.setPos(x, y);
        },

        getVelocity: function () {
            return this._(key).velocity;
        },

        getMaxVelocity: function () {
            return this._(key).MAX_VELOCITY;
        },

        getPosition: function () {
            return this._(key).position;
        },

        getMass: function () {
            return this._(key).mass;
        }
    };

})({});