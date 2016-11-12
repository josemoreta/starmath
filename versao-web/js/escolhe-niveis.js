var EscolheNiveis = {

	preload: function(){
		this.load.image('imgNivel1', 'recursos/imagens/nivel1.jpg');
		this.load.image('imgNivel2', 'recursos/imagens/nivel2.jpg');
		this.load.image('imgNivel3', 'recursos/imagens/nivel3.jpg');
		this.load.image('imgNivel4', 'recursos/imagens/nivel4.jpg');
	},

	create: function(){
		
		this.add.sprite(0, 0, 'backgroundTelaInicial');
		this.add.button(this.world.centerX -300, this.world.centerY, 'imgNivel1', this.nivelAdicao, this);
		this.add.button(this.world.centerX -137, this.world.centerY, 'imgNivel2', this.nivelSubtracao, this);
		this.add.button(this.world.centerX +37, this.world.centerY, 'imgNivel3', this.nivelMultiplicacao, this);
		this.add.button(this.world.centerX +200, this.world.centerY, 'imgNivel4', this.nivelDivicao, this);

		this.add.text(this.world.centerX -200, this.world.centerY -80, 'Escolha seu nível!', {
			font: "45px Arial",
			fill: "#ff0044",
			align: "center",
			fontWeight: "bold",
			stroke: "#000",
			strokeThickness: "2"
		});
		
		this.add.text(this.world.centerX -285, this.world.centerY +75, 'Adição', {
			font: "24px Arial",
			fill: "#ff0044",
			align: "center"
		});
		
		this.add.text(this.world.centerX -137, this.world.centerY +75, 'Subtração', {
			font: "24px Arial",
			fill: "#ff0044",
			align: "center"
		});
		
		this.add.text(this.world.centerX +25, this.world.centerY +75, 'Multiplicação', {
			font: "24px Arial",
			fill: "#ff0044",
			align: "center"
		});
		
		this.add.text(this.world.centerX +212, this.world.centerY +75, 'Divisão', {
			font: "24px Arial",
			fill: "#ff0044",
			align: "center"
		});

	},

	nivelAdicao : function() {
		nivel = 1;
		console.log("nivel: " + nivel)
		this.state.start('Game');
	},

	nivelSubtracao : function() {
		nivel = 2;
		console.log("nivel: " + nivel);
		this.state.start('Game');
	},
	
	nivelMultiplicacao : function() {
		nivel = 3;
		console.log("nivel: " + nivel);
		this.state.start('Game');
	},
	
	nivelDivicao : function() {
		nivel = 4;
		console.log("nivel: " + nivel);
		this.state.start('Game');
	}

};