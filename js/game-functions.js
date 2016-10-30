function carregaRecursos(){
	jogo.load.image('cenario', 'recursos/imagens/cenario.png');
	jogo.load.image('navinha', 'recursos/imagens/navinha.png');
	jogo.load.image('umTiro', 'recursos/imagens/tiro.png');
	jogo.load.audio('somTiro', ['recursos/audio/somTiro.mp3', 'recursos/audio/somTiro.ogg']);
	jogo.load.image('meteoro', 'recursos/imagens/meteoro.png');
}

function criaCenarioBackground(){
	cenario = jogo.add.tileSprite(0, 0, 800, 600, 'cenario'); // x, y, width, heigth, key
	velocidadeScrollCenario = 2;
}

function criaNave(){
	navinha = jogo.add.sprite(jogo.world.centerX, jogo.world.centerY + 175, 'navinha');
	jogo.physics.enable(navinha, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
	controles = jogo.input.keyboard.createCursorKeys(); // retorna um objeto -> up, down, left, right
}

function criaTiros(){
	tiroVelocidade = 0;

	somTiro = jogo.add.audio('somTiro');

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

	botaoAtirar = jogo.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}


function criaMeteoros(){
	// reseta posição do gurpo no eixo y
	meteoros.y = 0;

	let posicoes = getPosicaoMeteoros();

	meteoroCerto = meteoros.create(posicoes[0], 25,'meteoro');
	meteoroCerto.anchor.setTo(0.5,0.5);		
    textCorreto = jogo.add.text(meteoroCerto.x, meteoroCerto.y, respostaCorreta, { 
    	font: "20px Arial",
    	fill: "#ffffff",
    	wordWrap: true,
    	wordWrapWidth: meteoroCerto.width,
    	align: "center" });
    textCorreto.anchor.set(0.5, 0.5);
    

	meteoroErrado1 = meteoros.create(posicoes[1], 25, 'meteoro');
	meteoroErrado1.anchor.setTo(0.5, 0.5);
	textErrado1 = jogo.add.text(meteoroErrado1.x, meteoroErrado1.y, respostaCorreta - getRandomInt(1,7), { 
    	font: "20px Arial",
    	fill: "#ffffff",
    	wordWrap: true,
    	wordWrapWidth: meteoroErrado1.width,
    	align: "center" });	
	textErrado1.anchor.set(0.5, 0.5);


	meteoroErrado2 = meteoros.create(posicoes[2], 25, 'meteoro');
	meteoroErrado2.anchor.setTo(0.5, 0.5);
	textErrado2 = jogo.add.text(meteoroErrado2.x, meteoroErrado2.y, respostaCorreta - getRandomInt(1,3), { 
    	font: "20px Arial",
    	fill: "#ffffff",
    	wordWrap: true,
    	wordWrapWidth: meteoroErrado2.width,
    	align: "center" });
	textErrado2.anchor.set(0.5, 0.5);
}

function quandoAconteceColisaoCorreta(tiroQueAcertou, meteoro){
	tiroQueAcertou.kill();
	meteoro.kill();	
	meteoroErrado1.kill();
	meteoroErrado2.kill();
	textCorreto.kill();
	textErrado1.kill();
	textErrado2.kill();
	pontuacao += 20;
	textoPontuacao.text = pontuacao;
	alteraPergunta();
	criaMeteoros();
}


function alteraPergunta(){
	var a = getRandomInt(1, 11);
	var b = getRandomInt(1, 11);
	respostaCorreta = a + b;
	textoPergunta.text = a + '+' + b + " = ?"
}


function quandoAconteceColisaoErrada(tiroQueAcertou, meteoro){
	tiroQueAcertou.kill();
	meteoro.kill();
	// verifica vidas e chama game-over
	jogo.state.start('Game-over');
}

function atualizoes(){

	cenario.tilePosition.y += velocidadeScrollCenario;
	
	//resetando para 0
	navinha.body.velocity.x = 0;

	
	if(botaoAtirar.isDown){
		atira();	
	}

	if(controles.left.isDown){
		navinha.body.velocity.x = -300;
	}

	if(controles.right.isDown){
		navinha.body.velocity.x = 300;
	}
}

function atira(){
	
	umTiro = tiro.getFirstExists(false);
		
	if(jogo.time.now > tiroVelocidade){
		//console.log('entrou no primeiro if');
		if(umTiro){
			//console.log('entrou no segundo if')
			umTiro.reset(navinha.x,navinha.y);
			// Quão rápido sobe a bala
			umTiro.body.velocity.y = -200; //pixels por segundo - rate / velocidade
			// De quanto em quanto tempo sai uma bala
			tiroVelocidade = jogo.time.now + 300;
			somTiro.play();
		}
	}
}

function getPosicaoMeteoros(){
	let posicoes = [
		getRandomInt(10, 710),
		getRandomInt(10, 710),
		getRandomInt(10, 710)];

	//adiciona lógica para controlar a posição dos meteoros
	posicoes.sort();
	let temp = 0;
	for(let i = 1; i < 3; i++, temp++){
		if(posicoes[i] - posicoes[temp] < 42){
			posicoes[i] += 42;
			let otherTemp = 0;
			for(let j = 1; j < 3; j++, otherTemp++){
				if(posicoes[j] - posicoes[otherTemp] < 42){
					posicoes[j] += 42;
				}
			}
		} else if (posicoes[temp] - posicoes[i] < 42){
			posicoes[temp] += 42;
			let otherTemp2 = 0;
			for(let j = 1; j < 3; j++, otherTemp2++){
				if(posicoes[j] - posicoes[otherTemp2] < 42){
					posicoes[j] += 42;
				}
			}		
		}
	}

	return posicoes;
}

function getRandomInt(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameOverPorPosicao(meteoros){
	if (meteoros.y > 600) {
		jogo.state.start('Game-over');
	}
}