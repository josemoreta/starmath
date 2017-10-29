var ChooseLevels = {

	preload: function(){
		this.load.image('imgLevel1', 'resources/images/level1.png');
		this.load.image('imgLevel2', 'resources/images/level2.png');
		this.load.image('imgLevel3', 'resources/images/level3.png');
		this.load.image('imgLevel4', 'resources/images/level4.png');	
		this.load.image('imgLevelInfinity', 'resources/images/levelInfinity.png');
		this.load.image('buttonMenu', 'resources/images/button-menu.png');
	},

	create: function(){
		
		this.add.sprite(0, 0, 'backgroundHomeScreen');
		
		this.add.button(this.world.centerX - 140, this.world.centerY - 50, 'imgLevel1', this.addLevel, this);
		this.add.button(this.world.centerX, this.world.centerY - 50, 'imgLevel2', this.subtractionLevel, this);
		this.add.button(this.world.centerX - 140, this.world.centerY + 20, 'imgLevel3', this.multiplicationLevel, this);
		this.add.button(this.world.centerX, this.world.centerY + 20, 'imgLevel4', this.divisionLevel, this);
		this.add.button(this.world.centerX - 120, this.world.centerY + 80, 'imgLevelInfinity', this.infinityLevel, this);

		this.add.text(this.world.centerX - 100, this.world.centerY - 100, 'Escolha seu nível!', {
			font: "25px Arial",
			fill: "#ffffff",
			align: "center",
		});

		this.add.button(this.world.centerX - 120, this.world.centerY + 150, 'buttonMenu', this.backToMenu, this);

	},

	addLevel : function() {
		level = 1;
		this.state.start('Game');
	},

	subtractionLevel : function() {
		level = 2;
		this.state.start('Game');
	},
	
	multiplicationLevel : function() {
		level = 3;
		this.state.start('Game');
	},
	
	divisionLevel : function() {
		level = 4;
		this.state.start('Game');
	},

	infinityLevel : function() {
		level = 4;
		infinityMode = true;
		this.state.start('Game');
	},

	backToMenu: function(){
		this.state.start('Menu');
	}
};