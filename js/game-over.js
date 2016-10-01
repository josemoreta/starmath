var GameOver = {
	preload: function(){
		
	},

	create: function(){
		this.add.button(jogo.world.centerX - 40, jogo.world.centerY - 160, 'botaoIniciar', this.jogaNovamente, this);
		this.add.button(jogo.world.centerX - 40, jogo.world.centerY - 80, 'botaoOptions', this.voltaProMenu, this);
		this.add.button(jogo.world.centerX - 40, jogo.world.centerY, 'botaoRanking', this.salvaPontuacao, this);



		gameOverText = jogo.add.text(jogo.world.centerX - 300, jogo.world.centerY - 250, 'Game-over!! Boa sorte na próxima.', {
				font: "30px Arial",
		        fill: "#ff0044",
		        align: "center"
		});

		pontuacaoText = jogo.add.text(jogo.world.centerX - 300, jogo.world.centerY + 250, 'Sua nota foi: '+ pontuacao, {
				font: "30px Arial",
		        fill: "#ff0044",
		        align: "center"
		});
	},

	salvaPontuacao: function(){
		
	},

	jogaNovamente: function(){
		jogo.state.start('Game');
	},

	voltaProMenu: function(){
		jogo.state.start('Menu');
	}
};