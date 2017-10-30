var Menu = {
	preload: function(){
		this.load.image('startButton', 'recursos/imagens/botao-jogar.png');
		this.load.image('optionsButton', 'recursos/imagens/botao-opcoes.png');
		this.load.image('howToPlayButton', 'recursos/imagens/botao-como-jogar.png');
		this.load.image('rankingButton', 'recursos/imagens/botao-ranking.png');
		this.load.image('backgroundHomeScreen', 'recursos/imagens/background-tela-inicial.png');
	},

	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.add.sprite(0, 0, 'backgroundHomeScreen');
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 110, 'startButton', this.startGame, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 50,'optionsButton', this.startOptions, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 10, 'howToPlayButton', this.startTutorial, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY + 70, 'rankingButton', this.startRanking, this);
	},

	startGame: function(){
		this.state.start('Levels');
	},

	startOptions: function(){
		this.state.start('Options');
	},

	startRanking: function(){
		//this.state.start('Ranking');
	},

	startTutorial: function(){
		this.state.start('HowToPlay');
	}
};