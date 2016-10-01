function carregaRecursos(){
	jogo.load.image('cenario', 'recursos/imagens/cenario.png');
	jogo.load.image('navinha', 'recursos/imagens/navinha.png');
	jogo.load.image('umTiro', 'recursos/imagens/tiro.png');
	jogo.load.audio('somTiro', ['recursos/audio/somTiro.mp3', 'recursos/audio/somTiro.ogg']);
	jogo.load.image('meteoroErrado', 'recursos/imagens/meteoroErrado.png');
	jogo.load.image('meteoroCerto', 'recursos/imagens/meteoroCerto.png');
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
	// Cria cada meteoro a partir do grupo de meteoros
	meteoroCerto = meteoros.create(getRandomInt(10,600), 25,'meteoroCerto');
	meteoroCerto.anchor.setTo(0.5,0.5);	

	meteoroErrado1 = meteoros.create(getRandomInt(10, 600), 25, 'meteoroErrado');
	meteoroErrado1.anchor.setTo(0.5, 0.5);

	meteoroErrado2 = meteoros.create(getRandomInt(10, 600), 25, 'meteoroErrado');
	meteoroErrado2.anchor.setTo(0.5, 0.5);


}

function quandoAconteceColisaoCorreta(tiroQueAcertou, meteoro){
	tiroQueAcertou.kill();
	meteoro.kill();	
	meteoroErrado1.kill();
	meteoroErrado2.kill();
	pontuacao += 20;
	textoPontuacao.text = pontuacao;
	criaMeteoros();
	
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





function getRandomInt(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
}