var pontuacao;
var nivel;

var Game = {

	INCREMENTO_DE_VELOCIDADE : 0.085,
	PONTUACAO_VITORIA: 200,

	preload: function(){
		this.carregaRecursos();
	},

	create: function(){
		this.carregaAudios();

		this.maxRangeOperacao = 3;
		this.velocidadeMovimentacaoMeteoros = 0.5;

		this.criaCenarioEBackground();
		this.criaNave();
		this.criaTiros();
		this.criaMeta();

		//Texto
		this.textoPergunta = this.add.text(this.world.centerX - 100, this.world.centerY - 300, '', {
			font: "65px Arial",
			fill: "#ffffff",
			align: "center"
		});
		this.alteraPergunta();

		pontuacao = 0;
		this.textoPontuacao = this.add.text(this.world.centerX + 325, this.world.centerY - 290, pontuacao,{
			font: '32px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		this.textoPontos = this.add.text(this.world.centerX + 210, this.world.centerY - 290, 'Pontos:',{
			font: '32px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		this.vidas = 3;
		this.textoVidas = this.add.text(this.world.centerX - 325, this.world.centerY - 290, this.vidas,{
			font: '32px Arial',
			fill: '#ffffff',
			align: 'center'
		});

		// Meteoros com a resposta
		this.meteoros = this.add.group();
		this.meteoros.enableBody = true;
		this.meteoros.physicsBodyType = Phaser.Physics.ARCADE;
		this.criaMeteoros();
	},

	update: function(){
		this.atualizacoes();

		this.movimentaMeteoros();		

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

		this.load.audio('somTiro', ['recursos/audio/somTiro.mp3', 'recursos/audio/somTiro.ogg']);
		this.load.audio('somRespostaCerta', ['recursos/audio/somRespostaCerta.mp3', 'recursos/audio/somRespostaCerta.ogg']);
		this.load.audio('somRespostaErrada', ['recursos/audio/somRespostaErrada.mp3', 'recursos/audio/somRespostaErrada.ogg']);
		this.load.audio('somGameOver', ['recursos/audio/somGameOver.mp3', 'recursos/audio/somGameOver.ogg']);
		this.load.audio('somTema', ['recursos/audio/somTema.mp3', 'recursos/audio/somTema.ogg']);
		this.load.audio('somExplosao', ['recursos/audio/somExplosao.mp3', 'recursos/audio/somExplosao.ogg']);
		this.load.audio('somVitoria', ['recursos/audio/somVitoria.mp3', 'recursos/audio/somVitoria.ogg']);
		
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
		this.somTema.play(null, null, 0.5, true, null);
		this.velocidadeScrollCenario = 2;
	},

	//Função para evitar que algum audio seja executado antes de ser carregado na variável respectiva.
	carregaAudios : function (){
		this.somTema = this.add.audio('somTema');
		this.somTiro = this.add.audio('somTiro');
		this.somRespostaCerta = this.add.audio('somRespostaCerta');
		this.somRespostaErrada = this.add.audio('somRespostaErrada');
		this.somGameOver = this.add.audio('somGameOver');
		this.somExplosao = this.add.audio('somExplosao');
		this.somVitoria = this.add.audio('somVitoria');

	},

	criaNave : function (){
		this.navinha = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'navinha');
		this.physics.enable(this.navinha, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
		this.controles = this.input.keyboard.createCursorKeys(); // retorna um objeto -> up, down, left, right
	},

	criaExplosao : function(meteoro){

		this.somExplosao.play();
		this.explosaoImg =  this.add.sprite(this.navinha.x, this.navinha.y, 'explosao');

		this.time.events.add(400, function(){
			this.explosaoImg.kill(); 			
		}, this);

	},

	criaMeta : function(){

		this.textoMeta = this.add.text(this.world.centerX - 200, this.world.centerY, 'Objetivo da missão: \nFaça ' + this.PONTUACAO_VITORIA + ' pontos!',{
			font: '45px Arial',
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
		this.textCorreto = this.add.text(this.meteoroCerto.x, this.meteoroCerto.y + 3, this.respostaCorreta, { 
			font: "28px Arial",
			fill: "#fff",
			stroke: "000", 
			strokeThickness: 3,
			wordWrap: true,
			wordWrapWidth: this.meteoroCerto.width,
			align: "center" });
		this.textCorreto.anchor.set(0.5, 0.5);


		this.meteoroErrado1 = this.meteoros.create(this.posicoes[1], 76, 'meteoro');
		this.meteoroErrado1.anchor.setTo(0.5, 0.5);
		this.textErrado1 = this.add.text(this.meteoroErrado1.x, this.meteoroErrado1.y + 3, this.respostaCorreta - this.getRandomInt(1,7), { 
			font: "28px Arial",
			fill: "#fff",
			stroke: "000", 
			strokeThickness: 3,
			wordWrap: true,
			wordWrapWidth: this.meteoroErrado1.width,
			align: "center" });	
		this.textErrado1.anchor.set(0.5, 0.5);


		this.meteoroErrado2 = this.meteoros.create(this.posicoes[2], 76, 'meteoro');
		this.meteoroErrado2.anchor.setTo(0.5, 0.5);
		this.textErrado2 = this.add.text(this.meteoroErrado2.x, this.meteoroErrado2.y + 3, this.respostaCorreta - this.getRandomInt(1,3), { 
			font: "28px Arial",
			fill: "#fff",
			stroke: "000", 
			strokeThickness: 3,
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
		pontuacao += 10;
		this.textoPontuacao.text = pontuacao;
		this.somRespostaCerta.play();
		this.aumentaRangeOperacoes();
		this.alteraPergunta();
		this.incrementaVelocidade();
		this.criaMeteoros();

		if (pontuacao >= this.PONTUACAO_VITORIA){
			this.somTema.stop();
			this.somVitoria.play();
			starMath.state.start('Vitoria');
		}
	},

	quandoAconteceColisaoErrada : function (tiroQueAcertou, meteoro){
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

		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (pontuacao >= 10){
			pontuacao -= 10;
			this.textoPontuacao.text = pontuacao;
		}

		this.checkGameOver();
	},

	colisaoNaveMeteoroCerto : function(navinha, meteoro){
		this.criaExplosao();

		meteoro.kill();	
		this.meteoroErrado1.kill();
		this.meteoroErrado2.kill();

		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();		
		
		this.alteraPergunta();
		this.criaMeteoros();
		
		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (pontuacao >= 10){
			pontuacao -= 10;
			this.textoPontuacao.text = pontuacao;
		}

		this.checkGameOver();	
	},

	colisaoNaveMeteoroErrado1 : function(navinha, meteoro){
		this.criaExplosao(); 		

		meteoro.kill();	
		this.meteoroCerto.kill()
		this.meteoroErrado2.kill();

		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();		
		
		this.alteraPergunta();
		this.criaMeteoros();
		
		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (pontuacao >= 10){
			pontuacao -= 10;
			this.textoPontuacao.text = pontuacao;
		}

		this.checkGameOver();
	},

	colisaoNaveMeteoroErrado2 : function(navinha, meteoro){
		this.criaExplosao(); 	

		meteoro.kill();	
		this.meteoroCerto.kill();
		this.meteoroErrado1.kill();

		this.textCorreto.kill();
		this.textErrado1.kill();
		this.textErrado2.kill();

		this.alteraPergunta();
		this.criaMeteoros();

		this.vidas--;
		this.textoVidas.text = this.vidas;

		if (pontuacao >= 10){
			pontuacao -= 10;
			this.textoPontuacao.text = pontuacao;
		}

		this.checkGameOver();	
	},

	alteraPergunta : function (){
		
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
			a = this.getRandomInt(1, 10);
			b = this.getRandomInt(1, 10);
			this.respostaCorreta = a * b;
			this.textoPergunta.text = a + 'x' + b + " = ?"
		} else { //divisão -> op == 4
			//Evita respostas das operações com valores irracionais
			while(a%b != 0) {
				a = this.getRandomInt(1, 10);
				b = this.getRandomInt(1, 10);
			}
			this.respostaCorreta = a / b;
			this.textoPergunta.text = a + '÷' + b + " = ?"
		}

	},

	atualizacoes : function (){

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

			if(this.umTiro){

				
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

		if(this.posicoes[1] - this.posicoes[0] <= 50){
			this.posicoes[1] += 50;
		}

		if(this.posicoes[2] - this.posicoes[1] <= 50){
			this.posicoes[2] += 100;	
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

	checkGameOver : function (){
		if (this.meteoros.y > 550 && this.vidas > 0) { //detecta quando os meteoros não são atingidos
			this.vidas--;
			this.textoVidas.text = this.vidas;
			this.meteoroErrado1.kill();
			this.meteoroErrado2.kill();
			this.meteoroCerto.kill();
			this.somRespostaErrada.play();
			this.criaMeteoros();

		} else if(this.vidas == 0) {
			this.somTema.stop();
			this.somGameOver.play(null, null, 0.2, null, null); //O parametro 0.2 na função .play é o volume do audio
			this.gameOver();
			max = 10; //seta o valor maximo da range novamente.	
		}
	},

	//chama a tela de game over
	gameOver : function () {
		this.state.start('Game-over');
	},

	movimentaMeteoros : function (){
		this.meteoros.y += this.velocidadeMovimentacaoMeteoros;
		this.textCorreto.y += this.velocidadeMovimentacaoMeteoros;
		this.textErrado1.y += this.velocidadeMovimentacaoMeteoros;
		this.textErrado2.y += this.velocidadeMovimentacaoMeteoros;
	},

	incrementaVelocidade : function(){
		this.velocidadeMovimentacaoMeteoros += this.INCREMENTO_DE_VELOCIDADE;
	},

	aumentaRangeOperacoes : function() {
		if (pontuacao % 20 == 0){
			this.maxRangeOperacao += 1;
		}
	}
};
