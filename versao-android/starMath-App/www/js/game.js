var inclinaCelular = false;
var velocidadeMovimentacaoMeteoros = 0.5;
var pontuacao;
var nivel;

var Game = {

	INCREMENTO_DE_VELOCIDADE : 0.04,
	maxRangeOperacao: 9, 
	andandoEsquerda: false,
	andandoDireita: false,
	atirando: false,

	preload: function(){
		this.carregaRecursos();
	},

	create: function(){
			//window.plugins.insomnia.keepAwake();
			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			
			this.somTema = this.add.audio('somTema'); 			
 			this.somRespostaCerta = this.add.audio('somRespostaCerta');
			this.somRespostaErrada = this.add.audio('somRespostaErrada');
 			this.somGameOver = this.add.audio('somGameOver');
 			this.somExplosao = this.add.audio('somExplosao');

			this.criaCenarioBackground();
			this.criaNave();
			this.criaTiros();


			/*Device orientado, 
				API para detectar inclinações do celular e movimentar a nave
				*/
			if (inclinaCelular){
				window.addEventListener("deviceorientation", this.chamaHandlerOrientation , true);				
			}
			

			//Texto
			this.textoPergunta = this.add.text(this.world.centerX - 175, this.world.centerY - 300, '', {
				font: "40px Arial",
		        fill: "#ff0044",
		        align: "left"
			});
			this.alteraPergunta();

			pontuacao = 0;
			this.textoPontuacao = this.add.text(this.world.centerX + 100, this.world.centerY - 300, pontuacao,{
				font: '35px Arial',
				fill: '#ff0044',
				align: 'center'
			});

			// Meteoros com a resposta
			this.meteoros = this.add.group();
			this.meteoros.enableBody = true;
			this.meteoros.physicsBodyType = Phaser.Physics.ARCADE;
			this.criaMeteoros();
	},

	update: function(){
		this.atualizoes();
		// Faz meteoros descer (O GRUPO)
		

		this.movimentaMeteoros();		

		if(this.andandoDireita && this.navinha.body.x < 296){
			this.navinha.body.velocity.x = 115;
		} else if(this.andandoEsquerda && this.navinha.body.x > 0){		
			this.navinha.body.velocity.x = -115;
		}

		// Identificando colisão para cada um dos meteoros
			// objetos que recebem colisao, funcao, 
		this.physics.arcade.overlap(this.tiro, this.meteoroCerto, this.quandoAconteceColisaoCorreta, null, this);
		this.physics.arcade.overlap(this.tiro, this.meteoroErrado1, this.quandoAconteceColisaoErrada, null, this);
		this.physics.arcade.overlap(this.tiro, this.meteoroErrado2, this.quandoAconteceColisaoErrada, null, this);

		this.physics.arcade.overlap(this.navinha, this.meteoroCerto, this.colisaoNaveMeteoroCerto, null, this);
		this.physics.arcade.overlap(this.navinha, this.meteoroErrado1, this.colisaoNaveMeteoroErrado1, null, this);
		this.physics.arcade.overlap(this.navinha, this.meteoroErrado2, this.colisaoNaveMeteoroErrado2, null, this);

		this.checkGameOver();

	},

	carregaRecursos : function (){
		this.load.image('cenario', 'recursos/imagens/cenario.png');
		this.load.image('navinha', 'recursos/imagens/navinha.png');
		this.load.image('umTiro', 'recursos/imagens/tiro.png');
		this.load.audio('somTiro',  'recursos/audio/somTiro.ogg');
		this.load.image('meteoro', 'recursos/imagens/meteoro.png');
		this.load.image('coracao', 'recursos/imagens/coracao.png');
		this.load.image('botaoEsquerda', 'recursos/imagens/esquerda.png');
		this.load.image('botaoDireita', 'recursos/imagens/direita.png');
		this.load.image('botaoAtira', 'recursos/imagens/atira.png');

		this.load.audio('somRespostaCerta', 'recursos/audio/somRespostaCerta.ogg');
		this.load.audio('somRespostaErrada',  'recursos/audio/somRespostaErrada.ogg');
 		this.load.audio('somGameOver',  'recursos/audio/somGameOver.ogg');
 		this.load.audio('somTema',  'recursos/audio/somTema.ogg');

 		this.load.audio('somExplosao', 'recursos/audio/somExplosao.ogg');
	},



	criaCenarioBackground: function (){
		// refatorar tamanho do cenario aqui
		if (inclinaCelular){
			this.cenario = this.add.tileSprite(0, 48, 800, 600, 'cenario'); // x, y, width, heigth, key
		} else {
			this.cenario = this.add.tileSprite(0, 48, 800, 500, 'cenario'); // x, y, width, heigth, key			
		}

		this.coracao = this.add.sprite(this.world.centerX + 25, this.world.centerY - this.world.centerY, 'coracao');
		this.velocidadeScrollCenario = 2;
		this.somTema.play(null, null, 0.5, true, null);

		this.vidas = 3;
		this.textoVidas = this.add.text(this.world.centerX + 45, this.world.centerY - this.world.centerY + 14, this.vidas,{
			font: '18px Arial',
			fill: '#ffffff',
			align: 'center'
		});
	},

	criaNave: function (){
		
		if(inclinaCelular){
			this.navinha = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'navinha');			
		} else {
			this.navinha = this.add.sprite(this.world.centerX, this.world.centerY + 120, 'navinha');						
			
			this.botaoDireita = this.add.button(this.world.centerX * 2 - 55, this.world.centerY * 2 - 45, 'botaoDireita');		
			this.botaoDireita.onInputDown.add(function(){
				this.andandoDireita = true;			
			}, this);
			this.botaoDireita.onInputUp.add(function(){
				this.andandoDireita = false;			
			}, this);


			this.botaoEsquerda = this.add.button(20, this.world.centerY * 2 - 45, 'botaoEsquerda');
			this.botaoEsquerda.onInputDown.add(function(){
				this.andandoEsquerda = true;			
			}, this);
			this.botaoEsquerda.onInputUp.add(function(){
				this.andandoEsquerda = false;			
			}, this);			
		}

		this.physics.enable(this.navinha, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
		
	},

	
	criaTiros: function (){
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

		if (inclinaCelular){
			this.touchAtirar = this.input.pointer1;			
		} else {
			this.botaoAtirar = this.add.button(this.world.centerX - 15, this.world.centerY * 2 - 45, 'botaoAtira', function(){
				this.atira();
			}, this);
			
		}


	},


	criaMeteoros: function (){
		// reseta posição do gurpo no eixo y
		this.meteoros.y = 0;

		this.getPosicaoMeteoros();

		this.meteoroCerto = this.meteoros.create(this.posicoes[0], 65,'meteoro');
		this.meteoroCerto.anchor.setTo(0.5,0.5);		
	    this.textCorreto = this.add.text(this.meteoroCerto.x, this.meteoroCerto.y, this.respostaCorreta, { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	wordWrap: true,
	    	wordWrapWidth: this.meteoroCerto.width,
	    	align: "center" });
	    this.textCorreto.anchor.set(0.5, 0.5);
	    

		this.meteoroErrado1 = this.meteoros.create(this.posicoes[1], 65, 'meteoro');
		this.meteoroErrado1.anchor.setTo(0.5, 0.5);
		this.textErrado1 = this.add.text(this.meteoroErrado1.x, this.meteoroErrado1.y, this.respostaCorreta - this.getRandomInt(1,7), { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	wordWrap: true,
	    	wordWrapWidth: this.meteoroErrado1.width,
	    	align: "center" });	
		this.textErrado1.anchor.set(0.5, 0.5);


		this.meteoroErrado2 = this.meteoros.create(this.posicoes[2], 65, 'meteoro');
		this.meteoroErrado2.anchor.setTo(0.5, 0.5);
		this.textErrado2 = this.add.text(this.meteoroErrado2.x, this.meteoroErrado2.y, this.respostaCorreta - this.getRandomInt(1,3), { 
	    	font: "20px Arial",
	    	fill: "#ffffff",
	    	wordWrap: true,
	    	wordWrapWidth: this.meteoroErrado2.width,
	    	align: "center" });
		this.textErrado2.anchor.set(0.5, 0.5);
	},

	quandoAconteceColisaoCorreta: function (tiroQueAcertou, meteoro){
		tiroQueAcertou.kill();
		meteoro.kill();	
		this.meteoroErrado1.kill();
		this.meteoroErrado2.kill();
		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();
		pontuacao += 10;
		this.textoPontuacao.text = pontuacao;

		this.somRespostaCerta.play();
		this.aumentaRangeOperacoes();
		this.alteraPergunta();
		this.incrementaVelocidade();
		this.criaMeteoros();


	},


	alteraPergunta: function (){
		var op = this.getRandomInt(1, nivel);
		var a = this.getRandomInt(1, this.maxRangeOperacao);
		var b = this.getRandomInt(1, this.maxRangeOperacao);


		if (op == 1) { //soma
			this.respostaCorreta = a + b;
			this.textoPergunta.text = a + '+' + b + " = ?"
		} else if (op == 2) { //subtração

			//Evita respostas das operações com negativos
			if (a < b) {
				var temp = a;
				a = b;
				b = temp;
			}

			this.respostaCorreta = a - b;
			this.textoPergunta.text = a + '-' + b + " = ?"
		} else 	if (op == 3) { //multiplicação
			this.respostaCorreta = a * b;
			this.textoPergunta.text = a + 'x' + b + " = ?"
		} else { //divisão -> op == 4
			//Evita respostas das operações com valores irracionais
			while(a%b != 0) {
				a = this.getRandomInt(1, this.maxRangeOperacao);
				b = this.getRandomInt(1, this.maxRangeOperacao);
			}
			this.respostaCorreta = a / b;
			this.textoPergunta.text = a + '÷' + b + " = ?"
		}
	},


	quandoAconteceColisaoErrada: function (tiroQueAcertou, meteoro){
		tiroQueAcertou.kill();
		meteoro.kill();

		this.meteoroCerto.kill();
		this.meteoroErrado1.kill();
		this.meteoroErrado2.kill();

		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

		this.somRespostaErrada.play();

		this.alteraPergunta();
		this.criaMeteoros();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;
		this.checkGameOver();
	},

	atualizoes: function (){

		this.cenario.tilePosition.y += this.velocidadeScrollCenario;
		


		//resetando para 0
		this.navinha.body.velocity.x = 0;

		if (inclinaCelular){
			if(this.touchAtirar.isDown){
				this.atira();	
			}			
		} //else if (this.atirando){
			//this.atira();
		//}


	},

	atira: function (){
		
		this.umTiro = this.tiro.getFirstExists(false);
			
		this.somTiro.play();
		if(this.time.now > this.tiroVelocidade){
			//console.log('entrou no primeiro if');
			if(this.umTiro){
				//console.log('entrou no segundo if')
				this.umTiro.reset(this.navinha.x, this.navinha.y);
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

		console.log('ordenando: '+ this.posicoes);
		if(this.posicoes[1] - this.posicoes[0] <= 50){
			this.posicoes[1] += 50;
			console.log('primeiro if ' + this.posicoes);
		}
		if(this.posicoes[2] - this.posicoes[1] <= 50){
	 		this.posicoes[2] += 100;	
	 		console.log('segundo if ' + this.posicoes);	
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

	chamaHandlerOrientation: function(e){
		Reflect.apply(Game.handleOrientation, Game, [e])
	},

	handleOrientation: function (e){
	
		/*maior que 1 e menor que -1 apenas para evitar de andar com o celular parado,
		 	 pois mesmo praticamente parado é detectado inclinações.	 
		 	 console.log(e);*/
		if (e.gamma >= 3 && this.navinha.body.x < 296) { 		
			this.navinha.body.velocity.x = 115;		
			return; // quebra o fluxo, não executa resto do código
		}  else if (e.gamma <= -3 && this.navinha.body.x > 0) {
			this.navinha.body.velocity.x = -115;
			return; // quebra o fluxo, não executa resto do código
		}
		
		// só volta pra zero quando não temm inclinação (tilt)
		this.navinha.body.velocity.x = 0;		
	},

	checkGameOver: function(){
		if(inclinaCelular){
			if (this.meteoros.y > 600 && this.vidas > 0) {
				this.vidas--;
				this.textoVidas.text = this.vidas;
				this.meteoroErrado1.kill();
				this.meteoroErrado2.kill();
				this.meteoroCerto.kill();
				this.textCorreto.kill();
				this.textErrado1.kill();
				this.textErrado2.kill();
				this.somRespostaErrada.play();
				this.criaMeteoros();
			} else if(this.meteoros.y > 600 && this.vidas <= 0) {
				this.somTema.stop();
				this.somGameOver.play(null, null, 0.2, null, null);				
				this.gameOver();
			} else if(this.vidas <= 0){
				this.somTema.stop();
				this.somGameOver.play(null, null, 0.2, null, null);
				this.gameOver();
			}			
		} else {
			if (this.meteoros.y > 480 && this.vidas > 0){
				this.vidas--;
				this.textoVidas.text = this.vidas;
				this.meteoroErrado1.kill();
				this.meteoroErrado2.kill();
				this.meteoroCerto.kill();
				this.textCorreto.kill();
				this.textErrado1.kill();
				this.textErrado2.kill();
				this.somRespostaErrada.play();
				this.criaMeteoros();
			}else if(this.meteoros.y > 480 && this.vidas <= 0) {
				this.somTema.stop();
				this.somGameOver.play(null, null, 0.2, null, null);
				this.gameOver();
			} else if(this.vidas <= 0){
				this.somTema.stop();
				this.somGameOver.play(null, null, 0.2, null, null);
				this.gameOver();
			}	
		}
	},

	gameOver: function(){
		if (inclinaCelular){
			window.removeEventListener('deviceorientation', this.chamaHandlerOrientation, true);			
		}		
			
		velocidadeMovimentacaoMeteoros = 0.5;
		starMath.state.start('Game-over');
	},

	movimentaMeteoros: function(){
		this.meteoros.y += velocidadeMovimentacaoMeteoros;			
		this.textCorreto.y +=  velocidadeMovimentacaoMeteoros;
		this.textErrado1.y += velocidadeMovimentacaoMeteoros;
		this.textErrado2.y += velocidadeMovimentacaoMeteoros;
	},

	incrementaVelocidade: function(){
		velocidadeMovimentacaoMeteoros += this.INCREMENTO_DE_VELOCIDADE;
		console.log(velocidadeMovimentacaoMeteoros);
	},

	aumentaRangeOperacoes : function() {
		if (pontuacao%100 == 0) { //aumenta a range a cada 100 pontos
			this.maxRangeOperacao += 1;
			console.log("range aumentada");
			console.log("valor maximo = " + this.maxRangeOperacao);
		}
  	},

  	criaExplosao : function(){
 		this.somExplosao.play(); 		
 	},

 	colisaoNaveMeteoroCerto : function(navinha, meteoro){
 		meteoro.kill();	
 		this.meteoroErrado1.kill();
 		this.meteoroErrado2.kill();
 		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

 		this.criaExplosao(); 		
		
		this.alteraPergunta();
		this.criaMeteoros();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;
		this.checkGameOver();	

  	},
  	 	colisaoNaveMeteoroErrado1 : function(navinha, meteoro){
 		meteoro.kill();	
 		this.meteoroCerto.kill()
 		this.meteoroErrado2.kill();
 		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

 		this.criaExplosao(); 		
		
		this.alteraPergunta();
		this.criaMeteoros();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;
		this.checkGameOver();	
  	}, 
  		colisaoNaveMeteoroErrado2 : function(navinha, meteoro){
 		meteoro.kill();	
 		this.meteoroCerto.kill();
 		this.meteoroErrado1.kill();
 		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();
 		
 		this.criaExplosao(); 	


		this.alteraPergunta();
		this.criaMeteoros();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;
		this.checkGameOver();	
  	}
};