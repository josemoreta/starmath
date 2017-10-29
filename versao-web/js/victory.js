var Victory = {
	
	preload: function(){
		this.load.image('backgroundGameOver', 'resources/images/background-game-over.png');		
		this.load.image('menuButton', 'resources/images/button-menu.png');
		this.load.image('playAgainButton', 'resources/images/play-again-button.png');
		this.load.image('nextLevelButton', 'resources/images/play-next-level.png');
		this.load.image('astronaut', 'resources/images/astronaut.png');
	},

	create: function(){
		
		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.sprite(300, 100, 'astronaut');	
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'menuButton', this.backToMenu, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY  + 55, 'playAgainButton', this.playAgain, this);

		this.add.text(this.world.centerX - 155, this.world.centerY - 240, 'Você conseguiu! Parabéns!!!', {
				font: "26px Arial",
		        fill: "#ffffff",
		        align: "left"
			});

		if (level < 4){
			this.add.button(
				this.world.centerX - (245/2), 
			 	this.world.centerY  + 110, 
			 	'nextLevelButton', 
			 	this.playNextLevel, 
			 	this);
		}
	},
	
	backToMenu: function(){
		starMath.state.start('Menu');
	},

	playAgain: function(){
		starMath.state.start('Game');
	},

	playNextLevel: function(){
		level++;
		starMath.state.start('Game');
	}	
};