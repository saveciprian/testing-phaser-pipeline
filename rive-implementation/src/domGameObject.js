import { enablePlayer } from './importRive.js';
import { menuText } from "./importCSV";

const languages = {
    English: 0,
    Spanish: 1,
    Romanian: 2
}

var language = languages.English;
var resolvedMenuText;

class MainMenu extends Phaser.Scene
{
    
    constructor ()
    {
        super({ key: 'MainMenu'});
    }

    preload ()
    {
        this.load.audio('switchSound', '/switch.mp3');

        async function getCopy(){
            resolvedMenuText = await menuText; 
        }
        getCopy();
    }

    create ()
    { 
        
        
        let switchSound = this.sound.add('switchSound');
        //#region Text Labels
        const languageButtonText = new TextButton(this, 200, 250, "en", { fontSize: '32px', fill: '#fff'}, changeLanguage);
        languageButtonText.on('pointerdown', () => {
            buttonHoverSound();
        });
        this.add.existing(languageButtonText);

        const menuButtonText = new TextButton(this, 300, 300, "menu", { fontSize: '64px', fill: '#fff'}, () => { });
        menuButtonText.on('pointerdown', () => {
            buttonHoverSound();
        });
        this.add.existing(menuButtonText);

        const continueButton = new TextButton(this, 300, 400, "continue", { fontSize: '64px', fill: '#fff'}, () => { this.scene.start('MainGame'); });
        continueButton.on('pointerdown', () => {
            buttonHoverSound();
        });
        this.add.existing(continueButton);

        const exitButton = new TextButton(this, 300, 800, "continue", { fontSize: '64px', fill: '#fff'}, () => { window.close() });
        exitButton.on('pointerdown', () => {
            buttonHoverSound();
        });
        this.add.existing(exitButton);
        //#endregion

        updateCopy();
        
        
        function buttonHoverSound(){
            switchSound.play({detune: 1000});
        }   

        function updateCopy()
        {
            languageButtonText.text = resolvedMenuText[0][language];
            menuButtonText.text = resolvedMenuText[1][language];
            continueButton.text = resolvedMenuText[2][language];
            exitButton.text = resolvedMenuText[3][language];
        }

        function changeLanguage()
        {
            let languageCount = resolvedMenuText[0].length;
            if(language + 1 < languageCount) language++;
            else language = 0;

            updateCopy();
        }
    }
}

class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback)
    {
        super(scene, x, y, text, style);
        this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
            this.enterButtonHoverState();
            callback();
        });   
    }
    enterButtonHoverState() {
        this.setStyle({ fill: '#f00'});
    }

    enterButtonRestState() {
        this.setStyle({ fill: '#fff'});
    }

    enterButtonActiveState() {
        this.setStyle({ fill: '#fff' });
    }
}

class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'MainGame' });
    }
   
    preload ()
    {
        this.load.image('logo', '/white.png');
        this.load.image('tudor', '/Tudor.png');

        this.load.audio('switchSound', '/switch.mp3');
    }

    create ()
    {
        this.parentToMouse = false;

        document.getElementById("riveCanvas").style.display = "";
        enablePlayer();
        this.logo = this.physics.add.image(100, 100, 'logo2');
        this.logo.displayHeight = 100;
        this.logo.displayWidth = 100;
        this.logo.setSize(this.logo.width, this.logo.height, true); // Resize collider
        this.artboard = this.add.dom(100, 100, '#riveCanvas');

        console.log("{",this.logo.displayWidth, this.logo.displayHeight, "}", ", {", this.artboard.displayWidth, this.artboard.displayHeight, "}");

        let switchSound = this.sound.add('switchSound');

        this.cursorFollow = this.add.image(0, 0);
        this.cursorFollow.setDisplaySize(50, 50);
        this.cursorFollow.setTint(0xff0000);

        this.input.on('pointermove', (pointer) => {
            this.cursorFollow.setPosition(pointer.x, pointer.y);
        });
        // this.cursorFollow.setPosition(this.input.x, this.input.y);

        this.input.on('pointerdown', () => {
            if(this.sound.get('switchSound').isPlaying){
                this.sound.get('switchSound').stop();
            }
            switchSound.play({detune: 1000, rate: 5});

            if(this.parentToMouse){
                this.parentToMouse = false;
            }
            else{
                this.parentToMouse = true;
            }
        });

        this.logo.setVelocity(100, 200);
        this.logo.setBounce(1, 1);
        this.logo.setCollideWorldBounds(true);
        
        //creating particles
        this.particles = this.add.particles(0, 0, 'tudor', {
            speed: 100,
            opacity: { start: 1, end: 0 },
            frequency: 3,
            scale: { steps: 10, start: 0.03, end: 0, ease: 'ease.in.out'},
            blendMode: 'ADD',
            rotate: { start: 0, end: 360, ease: 'ease.out' },
            //gravityY: 200
            });

        
        //this is how you parent stuff, too bad it doesn't work with DOM game objects ffs
        // artboard.startFollow(logo);


    }

    update (time, delta)
    {
        if(!this.parentToMouse){
            this.particles.startFollow(this.logo);    
        }else{
            this.particles.startFollow(this.cursorFollow);
        }

        let deltaInSeconds = delta / 1000; // Convert to seconds
        this.logo.rotation += 1 * deltaInSeconds;
        this.artboard.setPosition(this.logo.x, this.logo.y);
        this.artboard.setAngle(this.logo.angle);
    }


}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    scene: [MainMenu, GameScene],
    dom:{
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 }
        }
    }
};

const game = new Phaser.Game(config);