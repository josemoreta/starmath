var HowToPlay = {
	preload: function() {
		this.load.image('background', 'resources/imagens/background-game-over.png');
		this.load.image('buttonMenu', 'resources/imagens/button-menu.png');
		
	},

	create: function() {
		this.add.sprite(0, 0, 'background');

		this.finishLineText = this.add.text(50, 50, 'Atire no meteoro certo para ganhar pontos. Utilize os botões na parte inferior da tela ou a inclinação do celular.',{
			font: '30px Arial',
			fill: '#ffffff',
			align: 'center',
			strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: 250
		});
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 120, 'buttonMenu', this.backToMenu, this);		
	},
	
	backToMenu: function() {
		starMath.state.start('Menu');
	}
};