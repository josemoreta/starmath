var tiltPhone = false;
var score;
var level;

var Game = {	
	VICTORY_SCORE: 200,
	INCREMENTO_DE_VELOCIDADE : 0.060,
	goingLeft: false,
	goingRight: false,
	shooting: false,
	shipButtonDistance: 120,
	shipDeviceOrientationDistance: 125,

	preload: function(){
		this.carregaRecursos();
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

			/*Device orientado, 
				API para detectar inclinações do celular e movimentar a nave
				*/
			if (tiltPhone){
				window.addEventListener("deviceorientation", this.callOrientationHandler , true);				
			}			

			//Texto
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

			// Meteoros com a resposta
			this.meteoros = this.add.group();
			this.meteoros.enableBody = true;
			this.meteoros.physicsBodyType = Phaser.Physics.ARCADE;
			this.createMeteors();
	},

	update: function(){
		this.updates();
		// Faz meteoros descer (O GRUPO)		

		this.moveMeteors();		

		if(this.goingRight && this.ship.body.x < 296){
			this.ship.body.velocity.x = this.shipButtonDistance;
		} else if(this.goingLeft && this.ship.body.x > 0){		
			this.ship.body.velocity.x = this.shipButtonDistance * -1;
		}

		// Identificando colisão para cada um dos meteoros
			// objetos que recebem colisao, funcao, 
		this.physics.arcade.overlap(this.tiro, this.rightMeteor, this.whenRightCollisionHappens, null, this);
		this.physics.arcade.overlap(this.tiro, this.wrongMeteor1, this.whenWrongCollisionHappens, null, this);
		this.physics.arcade.overlap(this.tiro, this.wrongMeteor2, this.whenWrongCollisionHappens, null, this);

		this.physics.arcade.overlap(this.ship, this.rightMeteor, this.shipRightMeteorCollision, null, this);
		this.physics.arcade.overlap(this.ship, this.wrongMeteor1, this.shipWrongMeteorCollision1, null, this);
		this.physics.arcade.overlap(this.ship, this.wrongMeteor2, this.shipWrongMeteorCollision2, null, this);

		this.checkGameOver();
	},

	carregaRecursos : function (){
		this.load.image('scenario', 'recursos/imagens/cenario.png');
		this.load.image('ship', 'recursos/imagens/navinha.png');
		this.load.image('umTiro', 'recursos/imagens/tiro.png');
		this.load.image('meteoro', 'recursos/imagens/meteoro.png');
		this.load.image('coracao', 'recursos/imagens/coracao.png');
		this.load.image('explosao', 'recursos/imagens/explosao.png');

		this.load.image('botaoEsquerda', 'recursos/imagens/esquerda.png');
		this.load.image('botaoDireita', 'recursos/imagens/direita.png');
		this.load.image('botaoAtira', 'recursos/imagens/atira.png');

		this.load.audio('somTiro',  'recursos/audio/somTiro.ogg');
		this.load.audio('rightAnswerSound', 'recursos/audio/somRespostaCerta.ogg');
		this.load.audio('wrongAnswerSound',  'recursos/audio/somRespostaErrada.ogg');
 		this.load.audio('gameOverSound',  'recursos/audio/somGameOver.ogg');
 		this.load.audio('themeSound',  'recursos/audio/somTema.ogg');
 		this.load.audio('victorySound', 'recursos/audio/somVitoria.ogg');
 		this.load.audio('explosionSound', 'recursos/audio/somExplosao.ogg');
	},

	createBackgroundScenario: function (){
		// refatorar tamanho do cenario aqui
		if (tiltPhone){
			this.scenario = this.add.tileSprite(0, 48, 800, 600, 'scenario'); // x, y, width, heigth, key
		} else {
			this.scenario = this.add.tileSprite(0, 48, 800, 500, 'scenario'); // x, y, width, heigth, key			
		}

		this.coracao = this.add.sprite(this.world.centerX + 25, this.world.centerY - this.world.centerY, 'coracao');
		this.velocidadeScrollCenario = 2;
		this.themeSound.play(null, null, 0.5, true, null);

		this.vidas = 3;
		this.textoVidas = this.add.text(this.world.centerX + 45, this.world.centerY - this.world.centerY + 14, this.vidas,{
			font: '18px Arial',
			fill: '#ffffff',
			align: 'center'
		});
	},

	createShip: function (){
		
		if(tiltPhone){
			this.ship = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'ship');			
		} else {
			this.ship = this.add.sprite(this.world.centerX, this.world.centerY + 120, 'ship');						
			
			this.botaoDireita = this.add.button(this.world.centerX * 2 - 64, this.world.centerY * 2 - 50, 'botaoDireita');		
			this.botaoDireita.onInputDown.add(function(){
				this.goingRight = true;			
			}, this);
			this.botaoDireita.onInputUp.add(function(){
				this.goingRight = false;			
			}, this);


			this.botaoEsquerda = this.add.button(0, this.world.centerY * 2 - 50, 'botaoEsquerda');
			this.botaoEsquerda.onInputDown.add(function(){
				this.goingLeft = true;			
			}, this);
			this.botaoEsquerda.onInputUp.add(function(){
				this.goingLeft = false;			
			}, this);			
		}

		this.physics.enable(this.ship, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
		
	},

	
	createShots: function (){

		this.tiroVelocidade = 0;

		this.somTiro = this.add.audio('somTiro');
		
		this.tiro = this.add.group();
		// Faz com que os objetos do grupo tenham um 'corpo' e em seguida seta o sistema de fisica aplicado a esses corpos
		this.tiro.enableBody = true;
		this.tiro.physicsBodyType = Phaser.Physics.ARCADE;
		// Cria um grupo de 30 sprites usando a imagem da key fornecida
		this.tiro.createMultiple(30, 'umTiro');
		// Posiçao do tiro no bico da nave   ---- Altura em que o tiro sai, pra sair da boca da nave e não do meio da tela
		this.tiro.setAll('anchor.x', -0.9);
		this.tiro.setAll('anchor.y', 0.8);
		// Faz o objeto ser killado após sair da tela chamando automaticamente a função inWorld que retorna false	
		this.tiro.setAll('outOfBoundsKill', true);
		this.tiro.setAll('checkWorldBounds', true);

		if (tiltPhone){
			this.touchAtirar = this.input.pointer1;			
		} else {
			this.botaoAtirar = this.add.button(this.world.centerX - 15, this.world.centerY * 2 - 50, 'botaoAtira', function(){
				this.atira();
			}, this);
			
		}

	},


	createMeteors: function (){
		// reseta posição do gurpo no eixo y
		this.meteoros.y = 0;

		this.getPosicaoMeteoros();

		this.rightMeteor = this.meteoros.create(this.posicoes[0], 65,'meteoro');
		this.rightMeteor.anchor.setTo(0.5,0.5);		
	    this.textCorreto = this.add.text(this.rightMeteor.x, this.rightMeteor.y, this.respostaCorreta, { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	stroke: "000",
	    	strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: this.rightMeteor.width,
	    	align: "center" });
	    this.textCorreto.anchor.set(0.5, 0.5);
	    

		this.wrongMeteor1 = this.meteoros.create(this.posicoes[1], 65, 'meteoro');
		this.wrongMeteor1.anchor.setTo(0.5, 0.5);
		this.textErrado1 = this.add.text(this.wrongMeteor1.x, this.wrongMeteor1.y, this.respostaCorreta - this.getRandomInt(1,7), { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	stroke: "000",
	    	strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: this.wrongMeteor1.width,
	    	align: "center" });	
		this.textErrado1.anchor.set(0.5, 0.5);


		this.wrongMeteor2 = this.meteoros.create(this.posicoes[2], 65, 'meteoro');
		this.wrongMeteor2.anchor.setTo(0.5, 0.5);
		this.textErrado2 = this.add.text(this.wrongMeteor2.x, this.wrongMeteor2.y, this.respostaCorreta - this.getRandomInt(1,3), { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	stroke: "000",
	    	strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: this.wrongMeteor2.width,
	    	align: "center" });
		this.textErrado2.anchor.set(0.5, 0.5);


	},

	whenRightCollisionHappens: function (tiroQueAcertou, meteoro){
		tiroQueAcertou.kill();
		meteoro.kill();	
		this.wrongMeteor1.kill();
		this.wrongMeteor2.kill();
		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();
		score += 10;
		this.textScore.text = score;

		this.rightAnswerSound.play();
		this.aumentaRangeOperacoes();
		this.changeQuestion();
		this.incrementaVelocidade();
		this.createMeteors();

		if (score >= this.VICTORY_SCORE){
			this.themeSound.stop();
			this.victorySound.play();
			starMath.state.start('Victory');
		}


	},


	changeQuestion: function (){
		var op = this.getRandomInt(1, level);
		var a = this.getRandomInt(1, this.operationMaxRange);
		var b = this.getRandomInt(1, this.operationMaxRange);


		if (op == 1) { //soma
			this.respostaCorreta = a + b;
			this.questionText.text = a + '+' + b + " = ?"
		} else if (op == 2) { //subtração

			//Evita respostas das operações com negativos
			if (a < b) {
				var temp = a;
				a = b;
				b = temp;
			}

			this.respostaCorreta = a - b;
			this.questionText.text = a + '-' + b + " = ?"
		} else 	if (op == 3) { //multiplicação
			a = this.getRandomInt(1, 10);
			b = this.getRandomInt(1, 10);
			this.respostaCorreta = a * b;
			this.questionText.text = a + 'x' + b + " = ?"
		} else { //divisão -> op == 4
			//Evita respostas das operações com valores irracionais
			while(a%b != 0) {
				a = this.getRandomInt(1, 10);
				b = this.getRandomInt(1, 10);
			}
			this.respostaCorreta = a / b;
			this.questionText.text = a + '÷' + b + " = ?"
		}
	},


	whenWrongCollisionHappens: function (tiroQueAcertou, meteoro){
		tiroQueAcertou.kill();
		meteoro.kill();

		this.rightMeteor.kill();
		this.wrongMeteor1.kill();
		this.wrongMeteor2.kill();

		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

		this.wrongAnswerSound.play();

		this.changeQuestion();
		this.createMeteors();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();
	},

	updates: function (){

		this.scenario.tilePosition.y += this.velocidadeScrollCenario;
		


		//resetando para 0
		this.ship.body.velocity.x = 0;

		if (tiltPhone){
			if(this.touchAtirar.isDown){
				this.atira();	
			}			
		} //else if (this.shooting){
			//this.atira();
		//}


	},

	atira: function (){
		
		this.umTiro = this.tiro.getFirstExists(false);
			
		this.somTiro.play();
		if(this.time.now > this.tiroVelocidade){
			
			if(this.umTiro){
				
				this.umTiro.reset(this.ship.x, this.ship.y);
				// Quão rápido sobe a bala
				this.umTiro.body.velocity.y = -200; //pixels por segundo - rate / velocidade
				// De quanto em quanto tempo sai uma bala
				this.tiroVelocidade = this.time.now + 300;
			}
		}
	},


	getPosicaoMeteoros: function (){
		this.posicoes  = [
			this.getRandomInt(20, 235),
			this.getRandomInt(20, 235),
			this.getRandomInt(20, 235)
		];


		this.posicoes.sort(function(a,b){
			return a-b;
		});

		
		if(this.posicoes[1] - this.posicoes[0] <= 50){
			this.posicoes[1] += 50;
		}
		if(this.posicoes[2] - this.posicoes[1] <= 50){
	 		this.posicoes[2] += 100;	
 		}

 		this.shuffle();
		// implementar lógica da posição dos meteoros, para que um não sobreponha o outro

		
	},

	shuffle: function () {
	    var j, x, i;
	    for (i = this.posicoes.length; i; i--) {
		    j = Math.floor(Math.random() * i);
		    x = this.posicoes[i - 1];
		    this.posicoes[i - 1] = this.posicoes[j];
		    this.posicoes[j] = x;
	    }
	},


	getRandomInt: function (min, max) {
	 	return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	callOrientationHandler: function(e){
		Reflect.apply(Game.handleOrientation, Game, [e])
	},

	handleOrientation: function (e){
	
		/*maior que 1 e menor que -1 apenas para evitar de andar com o celular parado,
		 	 pois mesmo praticamente parado é detectado inclinações.	 
		 	 */
		if (e.gamma >= 1.5 && this.ship.body.x < 296) { 		
			this.ship.body.velocity.x = this.shipDeviceOrientationDistance;		
			return; // quebra o fluxo, não executa resto do código
		}  else if (e.gamma <= -1.5 && this.ship.body.x > 0) {
			this.ship.body.velocity.x = this.shipDeviceOrientationDistance * -1;
			return; // quebra o fluxo, não executa resto do código
		}
		
		// só volta pra zero quando não temm inclinação (tilt)
		this.ship.body.velocity.x = 0;		
	},

	checkGameOver: function(){
		if(tiltPhone){
			if (this.meteoros.y > 600 && this.vidas > 0) {
				this.vidas--;
				this.textoVidas.text = this.vidas;
				if (score >= 10){
					score -= 10;
					this.textScore.text = score;
				}
				this.wrongMeteor1.kill();
				this.wrongMeteor2.kill();
				this.rightMeteor.kill();
				this.textCorreto.kill();
				this.textErrado1.kill();
				this.textErrado2.kill();
				this.wrongAnswerSound.play();
				this.createMeteors();
			} else if(this.meteoros.y > 600 && this.vidas <= 0) {					
				this.gameOver();
			} else if(this.vidas <= 0){				
				this.gameOver();
			}			
		} else {
			if (this.meteoros.y > 480 && this.vidas > 0){
				this.vidas--;
				this.textoVidas.text = this.vidas;
				if (score >= 10){
					score -= 10;
					this.textScore.text = score;
				}
				this.wrongMeteor1.kill();
				this.wrongMeteor2.kill();
				this.rightMeteor.kill();
				this.textCorreto.kill();
				this.textErrado1.kill();
				this.textErrado2.kill();
				this.wrongAnswerSound.play();
				this.createMeteors();
			}else if(this.meteoros.y > 480 && this.vidas <= 0) {				
				this.gameOver();
			} else if(this.vidas <= 0){				
				this.gameOver();
			}	
		}
	},

	gameOver: function(){

		this.themeSound.stop();
		this.gameOverSound.play(null, null, 0.2, null, null);

		if (tiltPhone){
			window.removeEventListener('deviceorientation', this.callOrientationHandler, true);			
		}		
			
		this.meteorMovementVelocity = 0.5;
		starMath.state.start('Game-over');
	},

	moveMeteors: function(){
		this.meteoros.y += this.meteorMovementVelocity;			
		this.textCorreto.y +=  this.meteorMovementVelocity;
		this.textErrado1.y += this.meteorMovementVelocity;
		this.textErrado2.y += this.meteorMovementVelocity;
	},

	incrementaVelocidade: function(){
		this.meteorMovementVelocity += this.INCREMENTO_DE_VELOCIDADE;		
	},

	aumentaRangeOperacoes : function() {
		this.operationMaxRange += 1;		
  	},

  	criaExplosao : function(meteoro){

 		this.explosionSound.play();
 		this.explosaoImg =  this.add.sprite(this.ship.x, this.ship.y, 'explosao');
 		
 		this.time.events.add(400, function(){
 			this.explosaoImg.kill(); 			
 		}, this);

 	},

 	shipRightMeteorCollision : function(ship, meteoro){
 		this.criaExplosao();
 		
 		meteoro.kill();	
 		this.wrongMeteor1.kill();
 		this.wrongMeteor2.kill();

 		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();		

		this.changeQuestion();
		this.createMeteors();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;
		
		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();	

  	},

  	shipWrongMeteorCollision1 : function(ship, meteoro){
 		this.criaExplosao();

 		meteoro.kill();	
 		this.rightMeteor.kill()
 		this.wrongMeteor2.kill();

 		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

		this.changeQuestion();
		this.createMeteors();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();	
  	}, 
  	shipWrongMeteorCollision2 : function(ship, meteoro){
 		this.criaExplosao(); 	

 		meteoro.kill();	
 		this.rightMeteor.kill();
 		this.wrongMeteor1.kill();

 		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

		this.changeQuestion();
		this.createMeteors();

		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (score >= 10){
			score -= 10;
			this.textScore.text = score;
		}

		this.checkGameOver();	
  	},
  	createFinishLine : function(){

		this.textoMeta = this.add.text(this.world.centerX - 125, this.world.centerY, 'Objetivo da missão: \nFaça ' + this.VICTORY_SCORE + ' pontos!',{
			font: '30px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		this.textoMeta.alpha = 1;

		this.time.events.add(3000, function(){ //exibe o texto por 3s antes de iniciar o fade-out
			this.add.tween(this.textoMeta).to( {alpha: 0}, 3000, "Linear", true); //efeito fade-out de 3s (3000ms) para o texto
			
			this.time.events.add(3000, function(){ //espera o fade-out completar antes de destruir o texto
				this.textoMeta.kill();

			}, this);
		}, this);

	}
};