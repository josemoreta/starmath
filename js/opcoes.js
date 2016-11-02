var Opcoes = {
	

	preload: function(){
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');
		this.load.image('botaoDiminui', 'recursos/imagens/esquerda.png');
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu.png');
		this.load.image('botaoSetaControles', 'recursos/imagens/direita.png');
	},

	create: function(){

		

		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.button(this.world.centerX - (245/2) + 120, this.world.centerY - 180, 'botaoSetaControles', this.aumentaVelocidade, this);
		this.add.button(this.world.centerX - (245/2) + 30, this.world.centerY - 180, 'botaoDiminui', this.diminuiVelocidade, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'botaoMenu', this.voltaProMenu, this);		

		this.velocidadeText = this.add.text(this.world.centerX - 130, this.world.centerY - 200, 'Velocidade dos Meteoros: ' +velocidadeMovimentacaoMeteoros, {
				font: "20px Arial",
		        fill: "#ff0044",
		        align: "left"
			});

	},
	
	aumentaVelocidade: function(){		
		if (velocidadeMovimentacaoMeteoros < 1.2) {
			velocidadeMovimentacaoMeteoros += 0.2;
			setouVelocidade = true;
		}
		this.velocidadeText.text  = 'Velocidade dos Meteoros: ' + velocidadeMovimentacaoMeteoros.toFixed(1);		
	},
	
	diminuiVelocidade: function(){
		if (velocidadeMovimentacaoMeteoros >= 0.7){
			velocidadeMovimentacaoMeteoros -= 0.2;			
		}
		this.velocidadeText.text  = 'Velocidade dos Meteoros: ' + velocidadeMovimentacaoMeteoros.toFixed(1);
	},
	
	voltaProMenu: function(){
		jogo.state.start('Menu');
	}



};