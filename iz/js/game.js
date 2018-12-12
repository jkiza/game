// create a new scene
let gameScene = new Phaser.Scene('Game');

class Menu extends Phaser.Scene {
    
    constructor() {
        
        super('Menu');

        this.active;
        this.currentScene;

    }

    preload() {
        
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(138, 500, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: 470,
            text: 'Loading',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: 525,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        percentText.setOrigin(0.5, 0.5);
        
        var title = this.make.text({
            x: width / 2,
            y: height / 2 - 270,
            text: 'WINTER ESCAPE',
            style: {
                font: '44px monospace',
                fill: '#ffffff'
            }
        });
        
        title.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(148, 510, 300 * value, 30);

        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });

        this.load.on('complete', function () {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        this.load.image('play', './assets/play.gif');
        this.load.image('options', './assets/options.gif');
        this.load.image('help', './assets/help.gif');
        this.load.image('background', './assets/background.gif');
        this.load.image('player', './assets/player.png');
        this.load.image('bell', './assets/bell.png');
        this.load.image('pause', './assets/mute.png');
        this.load.image('black', './assets/plain-black-background.jpg');
        this.load.audio('winter', './assets/nicolai-heidlas-winter-sunshine.mp3');

    }

    create() {    

        let button1 = this.add.sprite(170, 380, 'play');
        button1.setScale(0.5);
        button1.setOrigin(0, 0);
        button1.setInteractive();
        button1.on('pointerdown', () => this.scene.start('Game'));
        
        let button2 = this.add.sprite(170, 520, 'options');
        button2.setScale(0.5);
        button2.setOrigin(0, 0);
        button2.setInteractive();
        button2.on('pointerdown', () => this.scene.start('Options'));
        
        let button3 = this.add.sprite(170, 660, 'help');
        button3.setScale(0.5);
        button3.setOrigin(0, 0);
        button3.setInteractive();
        button3.on('pointerdown', () => this.scene.start('Help'));

    }

}

// load assets
gameScene.preload = function () {

};

var w = 600,
    h = 1024;
var s;
var music;
var score = 10000;
var scoreText;
var gameOver;

// called once after the preload ends
gameScene.create = function () {

    // create bg sprite
    this.bg = this.add.tileSprite(300, 512, 600, 1024, 'background');

    // create the player
    this.player = this.physics.add.sprite(290, 920, 'player');

    // we are reducing the width and height
    this.player.setScale(0.33);
    //this.player.setBounce(5);

    this.player.setCollideWorldBounds(true);

    this.bells = this.physics.add.group({
        defaultKey: 'bell',
        bounceX: 0,
        bounceY: 0,
        collideWorldBounds: false,

    });

    this.player.body.allowGravity = false;
    
    let randomV = Phaser.Math.Between(-100, -300);
    this.bells.create(Phaser.Math.Between(80, 120), 0);
    this.bells.create(295, 300);
    this.bells.create(Phaser.Math.Between(470, 530), -200);
    this.bells.create(Phaser.Math.Between(70, 130), -450);
    this.bells.create(Phaser.Math.Between(470, 530), -650);
    this.bells.create(Phaser.Math.Between(270, 330), -900);
    this.bells.create(Phaser.Math.Between(70, 130), -1100);
    this.bells.create(Phaser.Math.Between(270, 330), -1300);
    this.bells.create(Phaser.Math.Between(470, 530), -1450);
    this.bells.create(Phaser.Math.Between(270, 330), -1700);
    this.bells.create(Phaser.Math.Between(470, 530), -1900);
    this.bells.create(Phaser.Math.Between(70, 130), -2100);
    this.bells.create(Phaser.Math.Between(470, 530), -2350);
    this.bells.create(Phaser.Math.Between(70, 130), -2550);


    this.bells.children.iterate(function (child) {

        //console.log(child);
        child.body.allowGravity = false;

    });

    scoreText = this.add.text(25, 20, 'Score: 10000', { fontSize: '32px', fill: '#ffffff' });
    
    let button4 = this.add.sprite(526, 20, 'pause');
    button4.setScale(0.1);
    button4.setOrigin(0, 0);
    button4.setInteractive();
    
    button4.on('pointerdown', () => music.stop());

    music = this.sound.add('winter');

    music.play();

    this.physics.add.overlap(this.player, this.bells, this.jumpBell, null, this);

};

gameScene.update = function () {
    
    console.log(this.input.activePointer.x);

    this.bg.tilePositionY -= 3;

    if (this.input.activePointer.x > this.player.x) {
        this.player.x += 6;
    } else if (this.input.activePointer.x < this.player.x) {
        this.player.x -= 6;
    }

    //if (this.input.activePointer.isDown) {

    //console.log("is down");

    //gameScene.physics.moveTo(this.player, 100, 850);

    //}

    let bells = this.bells.getChildren();
    let numBells = bells.length;
    
    let bellSpeed = 4;

    for (let i = 0; i < numBells; i++) {
        let bellY = bells[i].y;
        if (bellY > 3000) {
            bells[i].y = -30;
        }
        bells[i].y += bellSpeed;
    }

    this.bells.allowGravity = false;
    
    if (this.player.y > 950) {
        music.stop();
        this.scene.start(GameOver);
        
    }
    
    if (this.player.y < 50) {
        music.stop();
        this.scene.start(GameOver);
        
    }

};

gameScene.jumpBell = function () {
    
    console.log("jump called");
    console.log(this.player);
    console.log(gameScene);

    gameScene.physics.moveTo(this.player, this.input.activePointer.downX, this.player.y - 1000, 400);
    
    this.player.body.allowGravity = true;
    
    score -= 10;
    
    scoreText.setText('Score: ' + score);

}

class Options extends Phaser.Scene {

    constructor() {
        
        super('Options');

        this.active;
        this.currentScene;

    }   
    
    preload() {
        
    }

    create() {
        
        this.bg = this.add.sprite(0, 0, 'black');
        let button5 = this.add.sprite(250, 500, 'mute');
        button5.setScale(0.1);
        button5.setOrigin(0, 0);
        button5.setInteractive();
        button5.on('pointerdown', () => music.destroy());
        
    }

}

class Help extends Phaser.Scene {

    constructor() {
        
        super('Help');

        this.active;
        this.currentScene;

    }   
    
    preload() {  
        
    }

    create() {
        
        this.bg = this.add.sprite(0, 0, 'black');
        
    }

}

class GameOver extends Phaser.Scene {

    constructor() {
        
        super('Game over');

        this.active;
        this.currentScene;

    }   
    
    preload() {  
        
    }

    create() {
        
        this.bg = this.add.sprite(0, 0, 'black');
        
    }

}

class Win extends Phaser.Scene {

    constructor() {
        
        super('Win');

        this.active;
        this.currentScene;

    }   
    
    preload() {  
        
    }

    create() {
        
        this.bg = this.add.sprite(0, 0, 'black');
        
    }

}

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 600,
    height: 1024,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 800
            },
            debug: false
        }
    },
    scene: [Menu, gameScene]
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);