var ComoJogar = {
	
	preload: function(){
		this.load.image('background', 'recursos/imagens/tela_de_jogo_tuto.jpg');
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu2.png');
		
	},

	create: function(){

		this.add.sprite(0, 0, 'background');
		this.add.button(this.world.centerX + 180, this.world.centerY + 240, 'botaoMenu', this.voltaProMenu, this);		
	},
	
	voltaProMenu: function(){
		starMath.state.start('Menu');
	}

};