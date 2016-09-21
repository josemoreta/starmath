// game object
var jogo = new Phaser.Game(800, 600, Phaser.CANVAS, 'jogo',
	{ preload: preload, create: create, update: update });
 
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
4
// Função para carregar os recursos, ela é a primeira a função a ser chamada
function preload(){
	console.log("Preload");
	carregaRecursos();
}

// Função para atribuir valores as variaveis, ela é chamada após a função preload
function create(){
	console.log("Create");
	criaCenarioBackground();
	criaNave();
	criaTiros();
	//Texto
	perguntaMatematica = '5 + 6 = ?';
	texto = jogo.add.text(jogo.world.centerX - 100, jogo.world.centerY - 300, perguntaMatematica, {
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
}

// Função que é chamada no GAME LOOP, resposavel por detectar comandos e atualizar informações / imagens
function update(){
	console.log("Update");
	atualizoes();
	// Faz meteoros descer (O GRUPO)
	meteoros.y += 0.5;
	// Identificando colisão para cada um dos meteoros
		// objetos que recebem colisao, funcao, 
	jogo.physics.arcade.overlap(tiro, meteoroCerto, quandoAconteceColisaoCorreta, null, this);
	jogo.physics.arcade.overlap(tiro, meteoroErrado1, quandoAconteceColisaoErrada, null, this);
	jogo.physics.arcade.overlap(tiro, meteoroErrado2, quandoAconteceColisaoErrada, null, this);
}