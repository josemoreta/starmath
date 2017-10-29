var Options = {
	
	preload: function(){
		this.load.image('backgroundGameOver', 'resources/images/background-game-over.png');
		this.load.image('decreaseButton', 'resources/images/left.png');
		this.load.image('menuButton', 'resources/images/button-menu.png');
		this.load.image('controlArrowsButton', 'resources/images/right.png');
	},

	create: function(){

		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'menuButton', this.backToMenu, this);		
	},
	
	backToMenu: function(){
		starMath.state.start('Menu');
	}

};