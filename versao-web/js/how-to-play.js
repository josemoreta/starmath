var HowToPlay = {
	
	preload: function(){
		this.load.image('background', 'resources/images/tela_de_jogo_tuto.jpg');
		this.load.image('menuButton', 'resources/images/menu-button2.png');
		
	},

	create: function(){

		this.add.sprite(0, 0, 'background');
		this.add.button(this.world.centerX + 180, this.world.centerY + 240, 'menuButton', this.backToMenu, this);		
	},
	
	backToMenu: function(){
		starMath.state.start('Menu');
	}

};