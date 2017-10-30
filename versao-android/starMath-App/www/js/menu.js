var Menu = {
	preload: function() {
		this.load.image('startButton', 'resources/imagens/button-play.png');
		this.load.image('optionsButton', 'resources/imagens/button-options.png');
		this.load.image('howToPlayButton', 'resources/imagens/button-how-to-play.png');
		this.load.image('rankingButton', 'resources/imagens/button-ranking.png');
		this.load.image('backgroundHomeScreen', 'resources/imagens/background-home-screen.png');
	},

	create: function() {
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.add.sprite(0, 0, 'backgroundHomeScreen');
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 110, 'startButton', this.startGame, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 50,'optionsButton', this.startOptions, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 10, 'howToPlayButton', this.startTutorial, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY + 70, 'rankingButton', this.startRanking, this);
	},

	startGame: function() {
		this.state.start('Levels');
	},

	startOptions: function() {
		this.state.start('Options');
	},

	startRanking: function() {
		//this.state.start('Ranking');
	},

	startTutorial: function() {
		this.state.start('HowToPlay');
	}
};