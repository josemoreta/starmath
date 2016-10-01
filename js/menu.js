var Menu = {
	preload: function(){
		jogo.load.image('botaoIniciar', 'recursos/imagens/botao_start.jpg');
		jogo.load.image('botaoOptions', 'recursos/imagens/botao_options.png');
		jogo.load.image('botaoRanking', 'recursos/imagens/botao_ranking.jpg');
	},

	create: function(){
		this.add.button(jogo.world.centerX - 40, jogo.world.centerY - 160, 'botaoIniciar', this.startGame, this);
		this.add.button(jogo.world.centerX - 40, jogo.world.centerY - 80, 'botaoOptions', this.startOptions, this);
		this.add.button(jogo.world.centerX - 40, jogo.world.centerY, 'botaoRanking', this.startRanking, this);
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