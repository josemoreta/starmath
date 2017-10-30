var tiltPhone = false;
var score;
var level;

var Game = {	
	VICTORY_SCORE: 200,
	VELOCITY_INCREASE : 0.060,
	goingLeft: false,
	goingRight: false,
	shooting: false,
	shipButtonDistance: 120,
	shipDeviceOrientationDistance: 125,

	preload: function(){
		this.loadResources();
	},

	create: function(){
			//window.plugins.insomnia.keepAwake();
			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			
			this.themeSound = this.add.audio('themeSound'); 			
 			this.rightAnswerSound = this.add.audio('rightAnswerSound');
			this.wrongAnswerSound = this.add.audio('wrongAnswerSound');
 			this.gameOverSound = this.add.audio('gameOverSound');
 			this.explosionSound = this.add.audio('explosionSound');
 			this.victorySound = this.add.audio('victorySound');

			this.operationMaxRange = 3;
			this.meteorMovementVelocity = 0.5;

			this.createBackgroundScenario();
			this.createShip();
			this.createShots();
			this.createFinishLine();

			/* Oriented device,
				API ro detect phone tilts and to move the ship */
			if (tiltPhone) {
				window.addEventListener("deviceorientation", this.callOrientationHandler , true);				
			}			

			// Text
			this.questionText = this.add.text(this.world.centerX - 175, this.world.centerY - 300, '', {
				font: "40px Arial",
		        fill: "#ffffff",
		        align: "left"
			});
			this.changeQuestion();

			score = 0;
			this.textScore = this.add.text(this.world.centerX + 100, this.world.centerY - 300, score,{
				font: '35px Arial',
				fill: '#ffffff',
				align: 'center'
			});

			// Meteors with the answer
			this.meteors = this.add.group();
			this.meteors.enableBody = true;
			this.meteors.physicsBodyType = Phaser.Physics.ARCADE;
			this.createMeteors();
	},

	update: function(){
		this.updates();
		// Make meteors go down (THE GROUP)		

		this.moveMeteors();		

		if (this.goingRight && this.ship.body.x < 296) {
			this.ship.body.velocity.x = this.shipButtonDistance;
		} else if(this.goingLeft && this.ship.body.x > 0){		
			this.ship.body.velocity.x = this.shipButtonDistance * -1;
		}

		// Identifying the collision for each meteor
		// objects that receive collision, function 
		this.physics.arcade.overlap(this.shot, this.rightMeteor, this.whenRightCollisionHappens, null, this);
		this.physics.arcade.overlap(this.shot, this.wrongMeteor1, this.whenWrongCollisionHappens, null, this);
		this.physics.arcade.overlap(this.shot, this.wrongMeteor2, this.whenWrongCollisionHappens, null, this);

		this.physics.arcade.overlap(this.ship, this.rightMeteor, this.shipRightMeteorCollision, null, this);
		this.physics.arcade.overlap(this.ship, this.wrongMeteor1, this.shipWrongMeteorCollision1, null, this);
		this.physics.arcade.overlap(this.ship, this.wrongMeteor2, this.shipWrongMeteorCollision2, null, this);

		this.checkGameOver();
	},

	loadResources : function (){
		this.load.image('scenario', 'resources/imagens/scenario.png');
		this.load.image('ship', 'resources/imagens/ship.png');
		this.load.image('oneShot', 'resources/imagens/shot.png');
		this.load.image('meteor', 'resources/imagens/meteor.png');
		this.load.image('heart', 'resources/imagens/heart.png');
		this.load.image('explosion', 'resources/imagens/explosion.png');

		this.load.image('leftButton', 'resources/imagens/left.png');
		this.load.image('rightButton', 'resources/imagens/right.png');
		this.load.image('shootButton', 'resources/imagens/shoot.png');

		this.load.audio('shotSound',  'resources/audio/shootSound.ogg');
		this.load.audio('rightAnswerSound', 'resources/audio/rightAnswerSound.ogg');
		this.load.audio('wrongAnswerSound',  'resources/audio/wrongAnswerSound.ogg');
 		this.load.audio('gameOverSound',  'resources/audio/gameOverSound.ogg');
 		this.load.audio('themeSound',  'resources/audio/themeSound.ogg');
 		this.load.audio('victorySound', 'resources/audio/victorySound.ogg');
 		this.load.audio('explosionSound', 'resources/audio/explosionSound.ogg');
	},

	createBackgroundScenario: function (){
		// refactor scenario size here
		if (tiltPhone) {
			this.scenario = this.add.tileSprite(0, 48, 800, 600, 'scenario'); // x, y, width, heigth, key
		} else {
			this.scenario = this.add.tileSprite(0, 48, 800, 500, 'scenario'); // x, y, width, heigth, key			
		}

		this.heart = this.add.sprite(this.world.centerX + 25, this.world.centerY - this.world.centerY, 'heart');
		this.scenarioScrollVelocity = 2;
		this.themeSound.play(null, null, 0.5, true, null);

		this.lives = 3;
		this.livesText = this.add.text(this.world.centerX + 45, this.world.centerY - this.world.centerY + 14, this.lives,{
			font: '18px Arial',
			fill: '#ffffff',
			align: 'center'
		});
	},

	createShip: function (){
		if (tiltPhone){
			this.ship = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'ship');			
		} else {
			this.ship = this.add.sprite(this.world.centerX, this.world.centerY + 120, 'ship');						
			
			this.rightButton = this.add.button(this.world.centerX * 2 - 64, this.world.centerY * 2 - 50, 'rightButton');		
			this.rightButton.onInputDown.add(function(){
				this.goingRight = true;			
			}, this);
			this.rightButton.onInputUp.add(function(){
				this.goingRight = false;			
			}, this);

			this.leftButton = this.add.button(0, this.world.centerY * 2 - 50, 'leftButton');
			this.leftButton.onInputDown.add(function(){
				this.goingLeft = true;			
			}, this);
			this.leftButton.onInputUp.add(function(){
				this.goingLeft = false;			
			}, this);			
		}

		this.physics.enable(this.ship, Phaser.Physics.ARCADE); // apply physics (object, system)
	},
	
	createShots: function (){

		this.shootingSpeed = 0;

		this.shotSound = this.add.audio('shotSound');
		
		this.shot = this.add.group();
		// Makes that objects of the groups have a 'body' and sets the physics system applied to those bodies
		this.shot.enableBody = true;
		this.shot.physicsBodyType = Phaser.Physics.ARCADE;
		// Creates a group of 30 sprites using the supplied key image
		this.shot.createMultiple(30, 'oneShot');
		// Shot position on tip of the ship --- Height the shot comes from, to leave the tip of the ship and not the middle of the canvar
		this.shot.setAll('anchor.x', -0.9);
		this.shot.setAll('anchor.y', 0.8);
		// Makes the object get killed after leaving the canvas, automatically calling the inWorld function which returns false
		this.shot.setAll('outOfBoundsKill', true);
		this.shot.setAll('checkWorldBounds', true);

		if (tiltPhone){
			this.touchShoot = this.input.pointer1;			
		} else {
			this.shootButton = this.add.button(this.world.centerX - 15, this.world.centerY * 2 - 50, 'shootButton', function(){
				this.shoot();
			}, this);
		}
	},

	createMeteors: function (){
		// resets group position on y axis
		this.meteors.y = 0;

		this.getMeteorsPosition();

		this.rightMeteor = this.meteors.create(this.posicoes[0], 65,'meteor');
		this.rightMeteor.anchor.setTo(0.5,0.5);		
	    this.rightText = this.add.text(this.rightMeteor.x, this.rightMeteor.y, this.rightAnswer, { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	stroke: "000",
	    	strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: this.rightMeteor.width,
	    	align: "center" });
	    this.rightText.anchor.set(0.5, 0.5);
	    
		this.wrongMeteor1 = this.meteors.create(this.posicoes[1], 65, 'meteor');
		this.wrongMeteor1.anchor.setTo(0.5, 0.5);
		this.wrongText1 = this.add.text(this.wrongMeteor1.x, this.wrongMeteor1.y, this.rightAnswer - this.getRandomInt(1,7), { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	stroke: "000",
	    	strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: this.wrongMeteor1.width,
	    	align: "center" });	
		this.wrongText1.anchor.set(0.5, 0.5);

		this.wrongMeteor2 = this.meteors.create(this.posicoes[2], 65, 'meteor');
		this.wrongMeteor2.anchor.setTo(0.5, 0.5);
		this.wrongText2 = this.add.text(this.wrongMeteor2.x, this.wrongMeteor2.y, this.rightAnswer - this.getRandomInt(1,3), { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	stroke: "000",
	    	strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: this.wrongMeteor2.width,
	    	align: "center" });
		this.wrongText2.anchor.set(0.5, 0.5);
	},

	whenRightCollisionHappens: function (shotHit, meteor){
		shotHit.kill();
		meteor.kill();	
		this.wrongMeteor1.kill();
		this.wrongMeteor2.kill();
		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();
		score += 10;
		this.textScore.text = score;

		this.rightAnswerSound.play();
		this.increaseOperationsRange();
		this.changeQuestion();
		this.increaseVelocity();
		this.createMeteors();

		if (score >= this.VICTORY_SCORE) {
			this.themeSound.stop();
			this.victorySound.play();
			starMath.state.start('Victory');
		}
	},

	changeQuestion: function (){
		var op = this.getRandomInt(1, level);
		var a = this.getRandomInt(1, this.operationMaxRange);
		var b = this.getRandomInt(1, this.operationMaxRange);

		if (op == 1) { // sum
			this.rightAnswer = a + b;
			this.questionText.text = a + '+' + b + " = ?"
		} else if (op == 2) { // subtraction
			// Avoid answers from operations with negatives
			if (a < b) {
				var temp = a;
				a = b;
				b = temp;
			}

			this.rightAnswer = a - b;
			this.questionText.text = a + '-' + b + " = ?"
		} else if (op == 3) { // multiplication
			a = this.getRandomInt(1, 10);
			b = this.getRandomInt(1, 10);
			this.rightAnswer = a * b;
			this.questionText.text = a + 'x' + b + " = ?"
		} else { // division -> op == 4
			// Avoid answers from operations with irrational values
			while (a % b != 0) {
				a = this.getRandomInt(1, 10);
				b = this.getRandomInt(1, 10);
			}
			this.rightAnswer = a / b;
			this.questionText.text = a + '÷' + b + " = ?"
		}
	},

	whenWrongCollisionHappens: function (shotHit, meteor) {
		shotHit.kill();
		meteor.kill();

		this.rightMeteor.kill();
		this.wrongMeteor1.kill();
		this.wrongMeteor2.kill();

		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();

		this.wrongAnswerSound.play();

		this.changeQuestion();
		this.createMeteors();
		// check lives and call game-over
		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10) {
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();
	},

	updates: function () {
		this.scenario.tilePosition.y += this.scenarioScrollVelocity;
		
		// reset to 0
		this.ship.body.velocity.x = 0;

		if (tiltPhone){
			if (this.touchShoot.isDown){
				this.shoot();	
			}			
		} //else if (this.shooting){
			//this.shoot();
		//}
	},

	shoot: function () {
		this.oneShot = this.tiro.getFirstExists(false);
			
		this.shotSound.play();
		if (this.time.now > this.shootingSpeed) {
			
			if (this.oneShot) {
				this.oneShot.reset(this.ship.x, this.ship.y);
				// How fast the bullet goes up
				this.oneShot.body.velocity.y = -200; // pixels per second - rate / velocity
				// How often a bullet is shot
				this.shootingSpeed = this.time.now + 300;
			}
		}
	},

	getMeteorsPosition: function (){
		this.positions = [
			this.getRandomInt(20, 235),
			this.getRandomInt(20, 235),
			this.getRandomInt(20, 235)
		];

		this.positions.sort(function(a,b) {
			return a - b;
		});
		
		if (this.positions[1] - this.positions[0] <= 50) {
			this.positions[1] += 50;
		}
		if (this.positions[2] - this.positions[1] <= 50) {
	 		this.positions[2] += 100;	
 		}

 		this.shuffle();
		// implement meteors position logic, so that one doesn't overlap the other
		
	},

	shuffle: function () {
	    var j, x, i;
	    for (i = this.positions.length; i; i--) {
		    j = Math.floor(Math.random() * i);
		    x = this.positions[i - 1];
		    this.positions[i - 1] = this.positions[j];
		    this.positions[j] = x;
	    }
	},

	getRandomInt: function (min, max) {
	 	return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	callOrientationHandler: function(e){
		Reflect.apply(Game.handleOrientation, Game, [e])
	},

	handleOrientation: function (e){
		/* greater than 1 and less than -1 just to avoid moving with the phone stopped,
		because even when it is stopped some tilts are detected */
		if (e.gamma >= 1.5 && this.ship.body.x < 296) { 		
			this.ship.body.velocity.x = this.shipDeviceOrientationDistance;		
			return; // break the flow, don't execute the rest of the code
		}  else if (e.gamma <= -1.5 && this.ship.body.x > 0) {
			this.ship.body.velocity.x = this.shipDeviceOrientationDistance * -1;
			return; // break the flow, don't execute the rest of the code
		}
		
		// only resets to zero when there is no tilt
		this.ship.body.velocity.x = 0;		
	},

	checkGameOver: function(){
		if (tiltPhone) {
			if (this.meteors.y > 600 && this.lives > 0) {
				this.lives--;
				this.livesText.text = this.lives;
				if (score >= 10){
					score -= 10;
					this.textScore.text = score;
				}
				this.wrongMeteor1.kill();
				this.wrongMeteor2.kill();
				this.rightMeteor.kill();
				this.rightText.kill();
				this.wrongText1.kill();
				this.wrongText2.kill();
				this.wrongAnswerSound.play();
				this.createMeteors();
			} else if (this.meteors.y > 600 && this.lives <= 0) {					
				this.gameOver();
			} else if (this.lives <= 0){				
				this.gameOver();
			}			
		} else {
			if (this.meteors.y > 480 && this.lives > 0) {
				this.lives--;
				this.livesText.text = this.lives;
				if (score >= 10) {
					score -= 10;
					this.textScore.text = score;
				}
				this.wrongMeteor1.kill();
				this.wrongMeteor2.kill();
				this.rightMeteor.kill();
				this.rightText.kill();
				this.wrongText1.kill();
				this.wrongText2.kill();
				this.wrongAnswerSound.play();
				this.createMeteors();
			} else if (this.meteors.y > 480 && this.lives <= 0) {				
				this.gameOver();
			} else if (this.lives <= 0) {
				this.gameOver();
			}	
		}
	},

	gameOver: function () {
		this.themeSound.stop();
		this.gameOverSound.play(null, null, 0.2, null, null);

		if (tiltPhone) {
			window.removeEventListener('deviceorientation', this.callOrientationHandler, true);			
		}		
			
		this.meteorMovementVelocity = 0.5;
		starMath.state.start('Game-over');
	},

	moveMeteors: function(){
		this.meteors.y += this.meteorMovementVelocity;			
		this.rightText.y +=  this.meteorMovementVelocity;
		this.wrongText1.y += this.meteorMovementVelocity;
		this.wrongText2.y += this.meteorMovementVelocity;
	},

	increaseVelocity: function(){
		this.meteorMovementVelocity += this.VELOCITY_INCREASE;		
	},

	increaseOperationsRange : function() {
		this.operationMaxRange += 1;		
  	},

  	createExplosion : function(meteor){
 		this.explosionSound.play();
 		this.explosionImg =  this.add.sprite(this.ship.x, this.ship.y, 'explosion');
 		
 		this.time.events.add(400, function(){
 			this.explosionImg.kill(); 			
 		}, this);

 	},

 	shipRightMeteorCollision : function(ship, meteor){
 		this.createExplosion();
 		
 		meteor.kill();	
 		this.wrongMeteor1.kill();
 		this.wrongMeteor2.kill();

 		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();		

		this.changeQuestion();
		this.createMeteors();
		// check lives and call game-over
		this.lives--;
		this.livesText.text = this.lives;
		
		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();	
  	},

  	shipWrongMeteorCollision1 : function (ship, meteor) {
 		this.createExplosion();

 		meteor.kill();	
 		this.rightMeteor.kill()
 		this.wrongMeteor2.kill();

 		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();

		this.changeQuestion();
		this.createMeteors();
		// check lives and call game-over
		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();	
	}, 
	  
  	shipWrongMeteorCollision2 : function (ship, meteor) {
 		this.createExplosion(); 	

 		meteor.kill();	
 		this.rightMeteor.kill();
 		this.wrongMeteor1.kill();

 		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();

		this.changeQuestion();
		this.createMeteors();

		// check lives and call game-over
		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();	
	},
	  
  	createFinishLine : function () {
		this.finishLineText = this.add.text(this.world.centerX - 125, this.world.centerY, 'Objetivo da missão: \nFaça ' + this.VICTORY_SCORE + ' pontos!',{
			font: '30px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		this.finishLineText.alpha = 1;

		this.time.events.add(3000, function(){ // show the text for 3s before starting fade-out
			this.add.tween(this.finishLineText).to( {alpha: 0}, 3000, "Linear", true); // 3s (3000ms) fade-out effect for text
			
			this.time.events.add(3000, function(){ // wait for fade-out to complete before destroying the text
				this.finishLineText.kill();

			}, this);
		}, this);
	}
};