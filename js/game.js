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
var perguntaMatematica;

var textoPontuacao;
var pontuacao;
// Meteoros com a resposta
var meteoros;
var meteoroCerto;
var meteoroErrado1;
var meteoroErrado2;

var Game = {
	preload: function(){
		carregaRecursos();
	},

	create: function(){
			criaCenarioBackground();
			criaNave();
			criaTiros();
			//Texto
			perguntaMatematica = '5 + 6 = ?';
			textoPergunta = jogo.add.text(jogo.world.centerX - 100, jogo.world.centerY - 300, perguntaMatematica, {
				font: "65px Arial",
		        fill: "#ff0044",
		        align: "center"
			});

			pontuacao = 0;
			textoPontuacao = jogo.add.text(jogo.world.centerX + 325, jogo.world.centerY - 300, pontuacao,{
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
		// Faz meteoros descer (O GRUPO)
		meteoros.y += 0.5;
		// Identificando colisão para cada um dos meteoros
			// objetos que recebem colisao, funcao, 
		jogo.physics.arcade.overlap(tiro, meteoroCerto, quandoAconteceColisaoCorreta, null, this);
		jogo.physics.arcade.overlap(tiro, meteoroErrado1, quandoAconteceColisaoErrada, null, this);
		jogo.physics.arcade.overlap(tiro, meteoroErrado2, quandoAconteceColisaoErrada, null, this);

	}
};