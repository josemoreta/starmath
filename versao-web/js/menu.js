var Menu = {
	preload: function(){
		this.load.image('startButton', 'resources/images/play-button.png');
		this.load.image('optionsButton', 'resources/images/options-button.png');
		this.load.image('howToPlayButton', 'resources/images/how-to-play-button.png');
		this.load.image('rankingButton', 'resources/images/ranking-button.png');
		this.load.image('backgroundHomeScreen', 'resources/images/background-home-screen.png');

	},

	create: function(){
		
		this.add.sprite(0, 0, 'backgroundHomeScreen');
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 60, 'startButton', this.startGame, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 20, 'howToPlayButton', this.startTutorial, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY - 50,'optionsButton', this.startOptions, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY + 10, 'howToPlayButton', this.startRanking, this);
		//this.add.button(this.world.centerX - (245/2), this.world.centerY + 70, 'rankingButton', this.startRanking, this);
	},

	startGame: function(){
		this.state.start('ChooseLevels');
	},

	startTutorial : function(){
		this.state.start('HowToPlay');
	}

	// startOptions: function(){
	// 	this.state.start('Opcoes');
	// },

	// startRanking: function(){
	// 	//this.state.start('Ranking');
	// }
};