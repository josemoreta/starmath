var Opcoes = {
	

	preload: function(){
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');
		this.load.image('botaoDiminui', 'recursos/imagens/esquerda.png');
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu.png');
		this.load.image('botaoSetaControles', 'recursos/imagens/direita.png');
	},

	create: function(){

		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'botaoMenu', this.voltaProMenu, this);		
	},
	
	voltaProMenu: function(){
		starMath.state.start('Menu');
	}

};