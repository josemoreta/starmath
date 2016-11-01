var Menu = {
	preload: function(){
		jogo.load.image('botaoIniciar', 'recursos/imagens/botao-jogar.png');
		this.load.image('botaoOptions', 'recursos/imagens/botao-opcoes.png');
		this.load.image('botaoComoJogar', 'recursos/imagens/botao-como-jogar.png');
		jogo.load.image('botaoRanking', 'recursos/imagens/botao-ranking.png');
		this.load.image('backgroundTelaInicial', 'recursos/imagens/background-tela-inicial.png');
	},

	create: function(){
		
		this.add.sprite(0, 0, 'backgroundTelaInicial');
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 110, 'botaoIniciar', this.startGame, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 50,'botaoOptions', this.startOptions, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 10, 'botaoComoJogar', this.startRanking, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 70, 'botaoRanking', this.startRanking, this);
	},

	startGame: function(){
		this.state.start('Game');
	},

	startOptions: function(){
		//this.state.start('Options');
	},

	startRanking: function(){
		//this.state.start('Ranking');
	}
};