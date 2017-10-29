var score;
var level;
var infinityMode;

var Game = {

	VELOCITY_INCREASE : 0.085,
	VICTORY_SCORE: 200,

	preload: function(){
		this.loadResources();
	},

	create: function(){
		this.loadAudios();

		this.maxRangeOperation = 3;
		this.meteorMovementVelocity = 0.5;

		this.createScenarioAndBackgroud();
		this.createShip();
		this.createShots();
		this.createFinishLine();

		//Text
		this.questionText = this.add.text(this.world.centerX - 100, this.world.centerY - 300, '', {
			font: "65px Arial",
			fill: "#ffffff",
			align: "center"
		});
		this.changeQuestion();

		score = 0;
		this.scoreText = this.add.text(this.world.centerX + 325, this.world.centerY - 290, score,{
			font: '32px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		this.scoreText = this.add.text(this.world.centerX + 210, this.world.centerY - 290, 'Pontos:',{
			font: '32px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		this.lives = 3;
		this.livesText = this.add.text(this.world.centerX - 325, this.world.centerY - 290, this.lives,{
			font: '32px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		// Meteors with answer
		this.meteors = this.add.group();
		this.meteors.enableBody = true;
		this.meteors.physicsBodyType = Phaser.Physics.ARCADE;
		this.createMeteors();
	},

	update: function(){
		this.updates();

		this.meteorsMovement();		

		// identify colision for each meteor
		// object that get colision
		this.physics.arcade.overlap(this.shot, this.rightMeteor, this.whenRightCollisionHappens, null, this);
		this.physics.arcade.overlap(this.shot, this.wrongMeteor1, this.whenWrongCollisionHappens, null, this);
		this.physics.arcade.overlap(this.shot, this.wrongMeteor2, this.whenWrongCollisionHappens, null, this);

		this.physics.arcade.overlap(this.ship, this.rightMeteor, this.collisionShipRightMeteor, null, this);
		this.physics.arcade.overlap(this.ship, this.wrongMeteor1, this.collisionShipWrongMeteor1, null, this);
		this.physics.arcade.overlap(this.ship, this.wrongMeteor2, this.collisionShipWrongMeteor2, null, this);

		this.checkGameOver();
	},

	loadResources : function (){

		this.load.audio('shotSound', ['resources/audio/shotSound.mp3', 'resources/audio/shotSound.ogg']);
		this.load.audio('rightAnswerSound', ['resources/audio/rightAnswerSound.mp3', 'resources/audio/rightAnswerSound.ogg']);
		this.load.audio('wrongAnswerSound', ['resources/audio/wrongAnswerSound.mp3', 'resources/audio/wrongAnswerSound.ogg']);
		this.load.audio('gameOverSound', ['resources/audio/gameOverSound.mp3', 'resources/audio/gameOverSound.ogg']);
		this.load.audio('themeSound', ['resources/audio/themeSound.mp3', 'resources/audio/themeSound.ogg']);
		this.load.audio('explosionSound', ['resources/audio/explosionSound.mp3', 'resources/audio/explosionSound.ogg']);
		this.load.audio('victorySound', ['resources/audio/victorySound.mp3', 'resources/audio/victorySound.ogg']);
		
		this.load.image('scenario', 'resources/images/scenario.png');
		this.load.image('ship', 'resources/images/ship.png');
		this.load.image('oneShot', 'resources/images/shot.png');
		this.load.image('meteor', 'resources/images/meteor.png');
		this.load.image('explosion', 'resources/images/explosion.png');
		this.load.image('heart', 'resources/images/heart.png');

	},

	createScenarioAndBackgroud : function (){
		this.scenario = this.add.tileSprite(0, 60, 800, 600, 'scenario'); // x, y, width, heigth, key
		this.heart = this.add.sprite(this.world.centerX - 385, this.world.centerY - 295, 'heart');
		//parameter 0.3 is for volume, true is to reproduce in loop
		this.themeSound.play(null, null, 0.5, true, null);
		this.scenarioScrollVelocity = 2;
	},

	// Function to avoid that some audion is executed before being loaded to its variable
	loadAudios : function (){
		this.themeSound = this.add.audio('themeSound');
		this.shotSound = this.add.audio('shotSound');
		this.rightAnswerSound = this.add.audio('rightAnswerSound');
		this.wrongAnswerSound = this.add.audio('wrongAnswerSound');
		this.gameOverSound = this.add.audio('gameOverSound');
		this.explosionSound = this.add.audio('explosionSound');
		this.victorySound = this.add.audio('victorySound');

	},

	createShip : function (){
		this.ship = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'ship');
		this.physics.enable(this.ship, Phaser.Physics.ARCADE); // apply physics (object, system)
		this.controls = this.input.keyboard.createCursorKeys(); // returns an object -> up, down, left, right
	},

	createExplosion : function(meteor){

		this.explosionSound.play();
		this.explosionImg =  this.add.sprite(this.ship.x, this.ship.y, 'explosion');

		this.time.events.add(400, function(){
			this.explosionImg.kill(); 			
		}, this);

	},

	createFinishLine : function(){

		if (infinityMode) {
			this.finishLineText = this.add.text(this.world.centerX - 390, this.world.centerY - 50, 'Objetivo da missão: \nConseguir a maior pontuação possível.\nBoa Sorte!',{
				font: '45px Arial',
				fill: '#ffffff',
				align: 'center'
			});
		} else {
			this.finishLineText = this.add.text(this.world.centerX - 200, this.world.centerY, 'Objetivo da missão: \nFaça ' + this.VICTORY_SCORE + ' pontos!',{
				font: '45px Arial',
				fill: '#ffffff',
				align: 'center'
			});
		}

		this.finishLineText.alpha = 1;

		this.time.events.add(3000, function(){ //shows text for 3s before starting fade-out
			this.add.tween(this.finishLineText).to( {alpha: 0}, 3000, "Linear", true); //3s (3000ms) fade-out effect for text
			
			this.time.events.add(3000, function(){ //waits for fade-out to complete before destroying the text
				this.finishLineText.kill();

			}, this);
		}, this);

	},


	createShots : function (){

		this.shootingSpeed = 0;

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

		this.shootingButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	createMeteors : function (){
		// resets group position on y axis
		this.meteors.y = 0;

		this.getMeteorsPosition();

		this.rightMeteor = this.meteors.create(this.positions[0], 76,'meteor');
		this.rightMeteor.anchor.setTo(0.5,0.5);		
		this.rightText = this.add.text(this.rightMeteor.x, this.rightMeteor.y + 3, this.rightAnswer, { 
			font: "28px Arial",
			fill: "#fff",
			stroke: "000", 
			strokeThickness: 3,
			wordWrap: true,
			wordWrapWidth: this.rightMeteor.width,
			align: "center" });
		this.rightText.anchor.set(0.5, 0.5);


		this.wrongMeteor1 = this.meteors.create(this.positions[1], 76, 'meteor');
		this.wrongMeteor1.anchor.setTo(0.5, 0.5);
		this.wrongText1 = this.add.text(this.wrongMeteor1.x, this.wrongMeteor1.y + 3, this.rightAnswer - this.getRandomInt(1,7), { 
			font: "28px Arial",
			fill: "#fff",
			stroke: "000", 
			strokeThickness: 3,
			wordWrap: true,
			wordWrapWidth: this.wrongMeteor1.width,
			align: "center" });	
		this.wrongText1.anchor.set(0.5, 0.5);


		this.wrongMeteor2 = this.meteors.create(this.positions[2], 76, 'meteor');
		this.wrongMeteor2.anchor.setTo(0.5, 0.5);
		this.wrongText2 = this.add.text(this.wrongMeteor2.x, this.wrongMeteor2.y + 3, this.rightAnswer - this.getRandomInt(1,3), { 
			font: "28px Arial",
			fill: "#fff",
			stroke: "000", 
			strokeThickness: 3,
			wordWrap: true,
			wordWrapWidth: this.wrongMeteor2.width,
			align: "center" });
		this.wrongText2.anchor.set(0.5, 0.5);
	},

	whenRightCollisionHappens : function (shotHit, meteor){
		shotHit.kill();
		meteor.kill();	
		this.wrongMeteor1.kill();
		this.wrongMeteor2.kill();
		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();
		score += 10;
		this.scoreText.text = score;
		this.rightAnswerSound.play();
		this.increaseOperationsRange();
		this.changeQuestion();
		this.velocityIncrease();
		this.createMeteors();

		if ((score >= this.VICTORY_SCORE) && (!infinityMode)){
			this.themeSound.stop();
			this.victorySound.play();
			starMath.state.start('Vitoria');
		} else if (infinityMode){

		}
	},

	whenWrongCollisionHappens : function (shotHit, meteor){
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

		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10){
			score -= 10;
			this.scoreText.text = score;
		}

		this.checkGameOver();
	},

	collisionShipRightMeteor : function(ship, meteor){
		this.createMeteors();

		meteor.kill();	
		this.wrongMeteor1.kill();
		this.wrongMeteor2.kill();

		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();		
		
		this.changeQuestion();
		this.createMeteors();
		
		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10){
			score -= 10;
			this.scoreText.text = score;
		}

		this.checkGameOver();	
	},

	collisionShipWrongMeteor1 : function(ship, meteor){
		this.createMeteors(); 		

		meteor.kill();	
		this.rightMeteor.kill()
		this.wrongMeteor2.kill();

		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();		
		
		this.changeQuestion();
		this.createMeteors();
		
		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10){
			score -= 10;
			this.scoreText.text = score;
		}

		this.checkGameOver();
	},

	collisionShipWrongMeteor1 : function(ship, meteor){
		this.createMeteors(); 	

		meteor.kill();	
		this.rightMeteor.kill();
		this.wrongMeteor1.kill();

		this.rightText.kill();
		this.wrongText1.kill();
		this.wrongText2.kill();

		this.changeQuestion();
		this.createMeteors();

		this.lives--;
		this.livesText.text = this.lives;

		if (score >= 10){
			score -= 10;
			this.scoreText.text = score;
		}

		this.checkGameOver();	
	},

	changeQuestion : function (){
		
		var op = this.getRandomInt(1, level);
		var a = this.getRandomInt(1, this.maxRangeOperation);
		var b = this.getRandomInt(1, this.maxRangeOperation);


		if (op == 1) { // sum
			this.rightAnswer = a + b;
			this.questionText.text = a + '+' + b + " = ?"
		} else if (op == 2) { // subtraction
			// Avoid answers of operations with negatives
			if (a < b) {
				var temp = a;
				a = b;
				b = temp;
			}

			this.rightAnswer = a - b;
			this.questionText.text = a + '-' + b + " = ?"
		} else 	if (op == 3) { //multiplication
			a = this.getRandomInt(1, 10);
			b = this.getRandomInt(1, 10);
			this.rightAnswer = a * b;
			this.questionText.text = a + 'x' + b + " = ?"
		} else { //division -> op == 4
			// Avoid answers from operations with irrational values
			while(a%b != 0) {
				a = this.getRandomInt(1, 10);
				b = this.getRandomInt(1, 10);
			}
			this.rightAnswer = a / b;
			this.questionText.text = a + '÷' + b + " = ?"
		}
	},

	updates : function (){

		this.scenario.tilePosition.y += this.scenarioScrollVelocity;
		
		//reset to 0
		this.ship.body.velocity.x = 0;
		
		if(this.shootingButton.isDown){
			this.atira();	
		}

		if(this.controls.left.isDown && this.ship.body.x > 0){
			this.ship.body.velocity.x = -500;
		}

		if(this.controls.right.isDown && this.ship.body.x < 737){
			this.ship.body.velocity.x = 500;
		}
	},

	atira : function (){
		
		this.oneShot = this.shot.getFirstExists(false);
		this.shotSound.play();

		if(this.time.now > this.shootingSpeed){

			if(this.oneShot){
				this.oneShot.reset(this.ship.x,this.ship.y);
				// Quão rápido sobe a bala
				this.oneShot.body.velocity.y = -300; //pixels por segundo - rate / velocidade
				// De quanto em quanto tempo sai uma bala
				this.shootingSpeed = this.time.now + 200;
			}
		}
	},

	getMeteorsPosition : function (){
		this.positions = [
		this.getRandomInt(10, 670),	
		this.getRandomInt(10, 670),
		this.getRandomInt(10, 670)
		];

		this.positions.sort(function(a,b){
			return a-b;
		});

		if(this.positions[1] - this.positions[0] <= 50){
			this.positions[1] += 50;
		}

		if(this.positions[2] - this.positions[1] <= 50){
			this.positions[2] += 100;	
		}
		this.shuffle();
		
	},
	// shuffles the positions array
	shuffle : function () {
		var j, x, i;
		for (i = this.positions.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = this.positions[i - 1];
			this.positions[i - 1] = this.positions[j];
			this.positions[j] = x;
		}
	},

	getRandomInt : function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	checkGameOver : function (){
		if (this.meteors.y > 550 && this.lives > 0) { //detects when meteors aren't hit
			this.lives--;
			this.livesText.text = this.lives;
			this.wrongMeteor1.kill();
			this.wrongMeteor2.kill();
			this.rightMeteor.kill();
			this.wrongAnswerSound.play();
			this.createMeteors();

		} else if(this.lives == 0) {
			this.themeSound.stop();
			this.gameOverSound.play(null, null, 0.2, null, null); //The parameter 0.2 on .play function is the audio volume
			this.gameOver();
			max = 10; //resets maximum range value
		}
	},

	//calls the game over canvas
	gameOver : function () {
		this.state.start('Game-over');
	},

	meteorsMovement : function (){
		this.meteors.y += this.meteorMovementVelocity;
		this.rightText.y += this.meteorMovementVelocity;
		this.wrongText1.y += this.meteorMovementVelocity;
		this.wrongText2.y += this.meteorMovementVelocity;
	},

	velocityIncrease : function(){
		if (infinityMode) {
			// reduces the increase velocity in infinity mode so that the game lasts longer
			// (too sleepy to think of a better logic)
			this.meteorMovementVelocity += (this.VELOCITY_INCREASE - 0.035); 

		} else {
			this.meteorMovementVelocity += this.VELOCITY_INCREASE;
			
		}
		console.log(this.meteorMovementVelocity);
	},

	increaseOperationsRange : function() {
		if (score % 20 == 0){
			this.maxRangeOperation += 1;
		}
	}
};
