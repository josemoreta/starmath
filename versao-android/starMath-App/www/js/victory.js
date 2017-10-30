var Victory = {
	preload: function(){
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');		
		this.load.image('menuButton', 'recursos/imagens/button-menu.png');
		this.load.image('playAgainButton', 'recursos/imagens/botao-jogar-novamente.png');
		this.load.image('playAgainNextLevelButton', 'recursos/imagens/jogar-prox-nivel.png');
		this.load.image('astronaut', 'recursos/imagens/astronauta.png');
	},

	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.sprite(100, 100, 'astronauta');	
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
			 	'playAgainNextLevelButton', 
			 	this.playAgainNextLevel, 
			 	this);
		}
	},
	
	backToMenu: function(){
		starMath.state.start('Menu');
	},

	playAgain: function(){
		starMath.state.start('Game');
	},

	playAgainNextLevel: function(){
		level ++;
		starMath.state.start('Game');
	}
};