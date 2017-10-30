var Options = {
	preload: function(){
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');		
		this.load.image('menuButton', 'recursos/imagens/button-menu.png');
		this.load.image('controlsArrowButton', 'recursos/imagens/direita.png');
	},

	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.add.sprite(0, 0, 'backgroundGameOver');		
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'menuButton', this.backToMenu, this);
		this.add.button(this.world.centerX - (245/2) + 30, this.world.centerY - 100, 'controlsArrowButton', this.controlsArrow, this);
		
		this.controlsText = this.add.text(this.world.centerX - 130, this.world.centerY - 130, 'Controles: Botões', {
				font: "20px Arial",
		        fill: "#ffffff",
		        align: "left"
			});
	},	
	
	backToMenu: function(){
		starMath.state.start('Menu');
	},

	controlsArrow: function(){
		tiltPhone = !tiltPhone;
		if(tiltPhone){
			this.controlsText.text = 'Controles: Inclinação do Aparelho';
		} else {
			this.controlsText.text = 'Controles: Botões';			
		}
	}

};