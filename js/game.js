// Cenario
var cenario;
var velocidadeScrollCenario;
// Jogador
var navinha;
// Movimentação
var controles;
// Tiros
var botaoAtirar;
var tiro;	
var tiroVelocidade;
// Barulho do Tiro - audio
var somTiro;
// Elementos textuais
var textoPergunta;
var textoPontuacao;
var textoVidas;
var vidas;
var pontuacao;
// Meteoros com a resposta
var meteoros;
var meteoroCerto;
var meteoroErrado1;
var meteoroErrado2;
var velocidadeMovimentacaoMeteoros  = 0.5;
var respostaCorreta;

var setouVelocidade;


var Game = {

	preload: function(){
		carregaRecursos();
	},

	create: function(){
			criaCenarioEBackground();
			criaNave();
			criaTiros();
			
			//Texto
			textoPergunta = jogo.add.text(jogo.world.centerX - 100, jogo.world.centerY - 300, '', {
				font: "65px Arial",
		        fill: "#ff0044",
		        align: "center"
			});
			alteraPergunta();

			pontuacao = 0;
			textoPontuacao = jogo.add.text(jogo.world.centerX + 325, jogo.world.centerY - 290, pontuacao,{
				font: '32px Arial',
				fill: '#ff0044',
				align: 'center'
			});

			vidas = 3;
			textoVidas = jogo.add.text(jogo.world.centerX - 325, jogo.world.centerY - 290, vidas,{
				font: '32px Arial',
				fill: '#ff0044',
				align: 'center'
			});

			// Meteoros com a resposta
			meteoros = jogo.add.group();
			meteoros.enableBody = true;
			meteoros.physicsBodyType = Phaser.Physics.ARCADE;
			criaMeteoros();
	},

	update: function(){
		atualizoes();

				
		movimentaMeteoros();		

		// Identificando colisão para cada um dos meteoros
		// objetos que recebem colisao, funcao, 
		jogo.physics.arcade.overlap(tiro, meteoroCerto, quandoAconteceColisaoCorreta, null, this);
		jogo.physics.arcade.overlap(tiro, meteoroErrado1, quandoAconteceColisaoErrada, null, this);
		jogo.physics.arcade.overlap(tiro, meteoroErrado2, quandoAconteceColisaoErrada, null, this);

		checkGameOver();
		
	}
};