var pontuacao;
var velocidadeMovimentacaoMeteoros  = 0.5;
var setouVelocidade;

var Game = {

	preload: function(){
		this.carregaRecursos();
	},

	create: function(){
			this.carregaAudios();
			this.criaCenarioEBackground();
			this.criaNave();
			this.criaTiros();
			
			//Texto
			this.textoPergunta = this.add.text(this.world.centerX - 100, this.world.centerY - 300, '', {
				font: "65px Arial",
		        fill: "#ff0044",
		        align: "center"
			});
			this.alteraPergunta();

			pontuacao = 0;
			this.textoPontuacao = this.add.text(this.world.centerX + 325, this.world.centerY - 290, pontuacao,{
				font: '32px Arial',
				fill: '#ff0044',
				align: 'center'
			});

			this.textoPontos = this.add.text(this.world.centerX + 210, this.world.centerY - 290, 'Pontos:',{
				font: '32px Arial',
				fill: '#ff0044',
				align: 'center'
			});

			this.vidas = 3;
			this.textoVidas = this.add.text(this.world.centerX - 325, this.world.centerY - 290, this.vidas,{
				font: '32px Arial',
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

		this.movimentaMeteoros();		

		// Identificando colisão para cada um dos meteoros
		// objetos que recebem colisao, funcao, 
		this.physics.arcade.overlap(this.tiro, this.meteoroCerto, this.quandoAconteceColisaoCorreta, null, this);
		this.physics.arcade.overlap(this.tiro, this.meteoroErrado1, this.quandoAconteceColisaoErrada, null, this);
		this.physics.arcade.overlap(this.tiro, this.meteoroErrado2, this.quandoAconteceColisaoErrada, null, this);

		this.checkGameOver();
	},


	carregaRecursos : function (){
	
		this.load.audio('somTiro', ['recursos/audio/somTiro.mp3', 'recursos/audio/somTiro.ogg']);
		this.load.audio('somRespostaCerta', ['recursos/audio/somRespostaCerta.mp3', 'recursos/audio/somRespostaCerta.ogg']);
		this.load.audio('somRespostaErrada', ['recursos/audio/somRespostaErrada.mp3', 'recursos/audio/somRespostaErrada.ogg']);
		this.load.audio('somGameOver', ['recursos/audio/somGameOver.mp3', 'recursos/audio/somGameOver.ogg']);
		this.load.audio('somTema', ['recursos/audio/somTema.mp3', 'recursos/audio/somTema.ogg']);
		
		this.load.image('cenario', 'recursos/imagens/cenario.png');
		this.load.image('navinha', 'recursos/imagens/navinha.png');
		this.load.image('umTiro', 'recursos/imagens/tiro.png');
		this.load.image('meteoro', 'recursos/imagens/meteoro.png');
		this.load.image('explosao', 'recursos/imagens/explosao.png');
		this.load.image('coracao', 'recursos/imagens/coracao.png');

	},

	criaCenarioEBackground : function (){
		this.cenario = this.add.tileSprite(0, 60, 800, 600, 'cenario'); // x, y, width, heigth, key
		this.coracao = this.add.sprite(this.world.centerX - 385, this.world.centerY - 295, 'coracao');
		//parametro 0.3 refere-se ao volume, true é para que a musica reproduza em loop
		this.somTema.play(null, null, 0.3, true, null);
		this.velocidadeScrollCenario = 2;
	},

	//Função para evitar que algum audio seja executado antes de ser carregado na variável respectiva.
	carregaAudios : function (){
		this.somTema = this.add.audio('somTema');
		this.somTiro = this.add.audio('somTiro');
		this.somRespostaCerta = this.add.audio('somRespostaCerta');
		this.somRespostaErrada = this.add.audio('somRespostaErrada');
		this.somGameOver = this.add.audio('somGameOver');
	},

	criaNave : function (){
		this.navinha = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'navinha');
		this.physics.enable(this.navinha, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
		this.controles = this.input.keyboard.createCursorKeys(); // retorna um objeto -> up, down, left, right
	},

	criaTiros : function (){
		this.tiroVelocidade = 0;

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

		this.botaoAtirar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	criaMeteoros : function (){
		// reseta posição do gurpo no eixo y
		this.meteoros.y = 0;

		this.getPosicaoMeteoros();

		this.meteoroCerto = this.meteoros.create(this.posicoes[0], 76,'meteoro');
		this.meteoroCerto.anchor.setTo(0.5,0.5);		
		this.textCorreto = this.add.text(this.meteoroCerto.x, this.meteoroCerto.y, this.respostaCorreta, { 
			font: "20px Arial",
			fill: "#ffffff",
			wordWrap: true,
			wordWrapWidth: this.meteoroCerto.width,
			align: "center" });
		this.textCorreto.anchor.set(0.5, 0.5);


		this.meteoroErrado1 = this.meteoros.create(this.posicoes[1], 76, 'meteoro');
		this.meteoroErrado1.anchor.setTo(0.5, 0.5);
		this.textErrado1 = this.add.text(this.meteoroErrado1.x, this.meteoroErrado1.y, this.respostaCorreta - this.getRandomInt(1,7), { 
			font: "20px Arial",
			fill: "#ffffff",
			wordWrap: true,
			wordWrapWidth: this.meteoroErrado1.width,
			align: "center" });	
		this.textErrado1.anchor.set(0.5, 0.5);


		this.meteoroErrado2 = this.meteoros.create(this.posicoes[2], 76, 'meteoro');
		this.meteoroErrado2.anchor.setTo(0.5, 0.5);
		this.textErrado2 = this.add.text(this.meteoroErrado2.x, this.meteoroErrado2.y, this.respostaCorreta - this.getRandomInt(1,3), { 
			font: "20px Arial",
			fill: "#ffffff",
			wordWrap: true,
			wordWrapWidth: this.meteoroErrado2.width,
			align: "center" });
		this.textErrado2.anchor.set(0.5, 0.5);


	},

	quandoAconteceColisaoCorreta : function (tiroQueAcertou, meteoro){
		tiroQueAcertou.kill();
		meteoro.kill();	
		this.meteoroErrado1.kill();
		this.meteoroErrado2.kill();
		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();
		pontuacao += 20;
		this.textoPontuacao.text = pontuacao;
		this.somRespostaCerta.play();
		this.alteraPergunta();
		this.criaMeteoros();
		
		/*Implementar lógica de atualização progressiva da dificuldade*/
		if(pontuacao > 40){
			velocidadeMovimentacaoMeteoros = 1;
		}
		if(pontuacao > 100){
			velocidadeMovimentacaoMeteoros = 2;
		}

		// O código abaixo faz com que o grupo de tiros seja destruido e em seguida criado novamente, 
		//para evitar de acertar meteoros errados
		/*
		tiro.removeAll(true, true, true);
			tiro = jogo.add.group();
		// Faz com que os objetos do grupo tenham um 'corpo' e em seguida seta o sistema de fisica aplicado a esses corpos
		tiro.enableBody = true;
		tiro.physicsBodyType = Phaser.Physics.ARCADE;
		// Cria um grupo de 30 sprites usando a imagem da key fornecida
		tiro.createMultiple(30, 'umTiro');
		// Posiçao do tiro no bico da nave   ---- Altura em que o tiro sai, pra sair da boca da nave e não do meio da tela
		tiro.setAll('anchor.x', -0.9);
		tiro.setAll('anchor.y', 0.8);
		// Faz o objeto ser killado após sair da tela chamando automaticamente a função inWorld que retorna false	
		tiro.setAll('outOfBoundsKill', true);
		tiro.setAll('checkWorldBounds', true);
		*/

	},

	alteraPergunta : function (){
		var op = this.getRandomInt(1, 4);
		var a = this.getRandomInt(1, 9);
		var b = this.getRandomInt(1, 9);


		if (op == 1) { //soma
			this.respostaCorreta = a + b;
			this.textoPergunta.text = a + '+' + b + " = ?"
		} else if (op == 2) { //subtração

			//Evita respostas das operações com negativos
			if (a < b) {
				temp = a;
				a = b;
				b = temp;
			}

			this.respostaCorreta = a - b;
			this.textoPergunta.text = a + '-' + b + " = ?"
		} else 	if (op == 3) { //multiplicação
			this.respostaCorreta = a * b;
			this.textoPergunta.text = a + '*' + b + " = ?"
		} else { //divisão -> op == 4
			//Evita respostas das operações com valores irracionais
			while(a%b != 0) {
				var a = this.getRandomInt(1, 9);
				var b = this.getRandomInt(1, 9);
			}
			this.respostaCorreta = a / b;
			this.textoPergunta.text = a + '/' + b + " = ?"
		}

	},

	quandoAconteceColisaoErrada : function (tiroQueAcertou, meteoro){
		tiroQueAcertou.kill();
		this.meteoroCerto.kill();
		meteoro.kill();	
		this.meteoroErrado1.kill();
		this.meteoroErrado2.kill();
		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();
		this.alteraPergunta();
		this.criaMeteoros();
		// verifica vidas e chama game-over
		this.vidas--;
		this.textoVidas.text = this.vidas;
		this.somRespostaErrada.play();
		this.checkGameOver();
		//jogo.state.start('Game-over');

	},

	atualizoes : function (){

		this.cenario.tilePosition.y += this.velocidadeScrollCenario;
		
		//resetando para 0
		this.navinha.body.velocity.x = 0;

		
		if(this.botaoAtirar.isDown){
			this.atira();	
		}

		if(this.controles.left.isDown && this.navinha.body.x > 0){
			this.navinha.body.velocity.x = -500;
		}

		if(this.controles.right.isDown && this.navinha.body.x < 737){
			this.navinha.body.velocity.x = 500;
		}
	},

	atira : function (){
		
		this.umTiro = this.tiro.getFirstExists(false);
		this.somTiro.play();

		if(this.time.now > this.tiroVelocidade){
			//console.log('entrou no primeiro if');
			if(this.umTiro){
				
				//console.log('entrou no segundo if')
				this.umTiro.reset(this.navinha.x,this.navinha.y);
				// Quão rápido sobe a bala
				this.umTiro.body.velocity.y = -300; //pixels por segundo - rate / velocidade
				// De quanto em quanto tempo sai uma bala
				this.tiroVelocidade = this.time.now + 200;
				
			}
		}
	},

	getPosicaoMeteoros : function (){
		this.posicoes = [
			this.getRandomInt(10, 670),	
		 	this.getRandomInt(10, 670),
		 	this.getRandomInt(10, 670)
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
		
	},
	// mistura o array posicoes
	shuffle : function () {
	    var j, x, i;
	    for (i = this.posicoes.length; i; i--) {
	        j = Math.floor(Math.random() * i);
	        x = this.posicoes[i - 1];
	        this.posicoes[i - 1] = this.posicoes[j];
	        this.posicoes[j] = x;
	    }
	},


	getRandomInt : function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	//detecta quando os meteoros não são atingidos
	checkGameOver : function (){
		if (this.meteoros.y > 550 && this.vidas > 0) {
			this.vidas--;
			this.textoVidas.text = this.vidas;
			this.meteoroErrado1.kill();
			this.meteoroErrado2.kill();
			this.meteoroCerto.kill();
			this.somRespostaErrada.play();
			this.criaMeteoros();
		} else if(this.meteoros.y > 600 && this.vidas <= 0) {
			//O parametro 0.2 na função .play é o volume do audio
			this.somTema.stop();
			this.somGameOver.play(null, null, 0.2, null, null);
			this.gameOver();
		} else if(this.vidas <= 0){
			this.somTema.stop();
			this.somGameOver.play(null, null, 0.2, null, null);
			this.gameOver();
		}
	},

	//chama a tela de game over quando acabam as vidas
	gameOver : function () {
		if(!setouVelocidade){
			velocidadeMovimentacaoMeteoros = 0.5;
		}
		this.state.start('Game-over');
	},

	movimentaMeteoros : function (){
		this.meteoros.y += velocidadeMovimentacaoMeteoros;
		this.textCorreto.y +=  velocidadeMovimentacaoMeteoros;
		this.textErrado1.y += velocidadeMovimentacaoMeteoros;
		this.textErrado2.y += velocidadeMovimentacaoMeteoros;
	}
};