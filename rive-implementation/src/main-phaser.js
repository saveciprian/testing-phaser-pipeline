import { enablePlayer } from './importRive.js';
import { menuText } from "./importCSV.js";
import { randomRange } from "./helperFunctions.js";

const languages = {
    English: 0,
    Spanish: 1,
}

var language = languages.English;
var parsedCopy;
var swipePositions = [];
var swipeDuration = 0; //I used this to multiply the swipe vector's magnitude in order to increase the weight of short swipes and decrease the long swipes
var timeDuration = false;
var swipePowerModifier = 3;

class MainMenu extends Phaser.Scene
//#region Main Menu
{
    
    constructor ()
    {
        super({ key: 'MainMenu'});
    }

    preload ()
    {
        this.load.audio('switchSound', '/switch.mp3');

        async function getCopy(){
            parsedCopy = await menuText; 
        }
        getCopy();
    }

    create ()
    { 
        let menuOverlay = this.add.dom(window.innerWidth/2, window.innerHeight/2, '#mainMenu');
        let switchSound = this.sound.add('switchSound');

        //#region Text Labels
        this.languageBTN = document.getElementById('languageBTN');
        this.menuBTN = document.getElementById('menuBTN');
        this.continueBTN = document.getElementById('continueBTN');
        this.exitBTN = document.getElementById('exitBTN');

        this.languageBTN.addEventListener('pointerdown', (event) => {
            buttonHoverSound();
            changeLanguage();
        });
        this.menuBTN.addEventListener('pointerdown', (event) => {
            // buttonHoverSound();
        });
        this.continueBTN.addEventListener('pointerdown', (event) => {
            buttonHoverSound();
            menuOverlay.destroy();
            this.scene.start('DidYouKnow');
        });
        this.exitBTN.addEventListener('pointerdown', (event) => {
            buttonHoverSound();
            window.close();
        });
        //#endregion

        updateCopy();
        
        
        function buttonHoverSound(){
            switchSound.play({detune: 1000});
        }   

        function updateCopy()
        {
            // languageButtonText.text = parsedCopy[0][language];
            // menuButtonText.text = parsedCopy[1][language];
            // continueButton.text = parsedCopy[2][language];
            // exitButton.text = parsedCopy[3][language];

            languageBTN.innerHTML = parsedCopy[0][language];
            menuBTN.innerHTML = parsedCopy[1][language];
            continueBTN.innerHTML = parsedCopy[2][language];
            exitBTN.innerHTML = parsedCopy[3][language];
        }

        function changeLanguage()
        {
            let languageCount = parsedCopy[0].length;
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

class DidYouKnow extends Phaser.Scene
//#region Did You Know
{
    constructor ()
    {
        super({ key: 'DidYouKnow'});
    }

    preload()
    {
        this.load.audio('switchSound', '/switch.mp3');
    }

    // parsedCopy[4][language]

    create()
    {
        

        let switchSound = this.sound.add('switchSound');
        const languageButtonText = new TextButton(this, 200, 250, "en", { fontSize: '32px', fill: '#fff'}, changeLanguage);
        languageButtonText.on('pointerdown', () => {
            buttonHoverSound();
        });
        this.add.existing(languageButtonText);

        const continueButton = new TextButton(this, 200, window.innerHeight/2 + 200, "continue", { fontSize: '32px', fill: '#fff'}, () => { this.scene.start('MainGame'); });
        continueButton.on('pointerdown', () => {
            buttonHoverSound();
        });
        this.add.existing(continueButton);

        
        const didYouKnowText = this.add.dom(window.innerWidth/2, window.innerHeight/2 - 200).createElement('div', 'width: 700px; height: 0px; text-align:center; font-size:36px; animation: fade-in 1s ease-out;', parsedCopy[4][language]);
        const message = this.add.dom(window.innerWidth/2, window.innerHeight/2 - 100).createElement('div', 'width: 700px; height: 0px; text-align:center; font-size:48px; animation: fade-in 3s ease-in;', parsedCopy[randomRange(5, parsedCopy.length - 1)][language]);

        
        updateCopy();
    
        // this.input.on('pointerdown', () =>{
        //     this.scene.start('MainGame');
        // });

        function buttonHoverSound(){
            switchSound.play({detune: 1000});
        }   

        function updateCopy()
        {
            languageButtonText.text = parsedCopy[0][language];
            continueButton.text = parsedCopy[2][language];
            didYouKnowText.setText(parsedCopy[4][language]);
            message.setText(parsedCopy[randomRange(5, parsedCopy.length - 1)][language]);
        }

        function changeLanguage()
        {
            let languageCount = parsedCopy[0].length;
            if(language + 1 < languageCount) language++;
            else language = 0;

            updateCopy();
        }

        this.time.delayedCall(8000, () => {
            this.scene.start('MainGame');
        }, [], this);
        
    }

    update()
    {

    }
}

class GameScene extends Phaser.Scene
//#region Game Scene
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

        // this.arrowCanvas = document.createElement("canvas");
        // this.arrowCanvas.id = "riveArrow";
        // this.arrowCanvas.width = 200;
        // this.arrowCanvas.height = 500;
        // document.body.appendChild(this.arrowCanvas);
        
        // enableArrow(this.arrowCanvas);
        
        this.logo = this.physics.add.image(100, 100);
        this.logo.setBodySize(100, 100);
        this.logo.refreshBody();
        
        this.logo.setDebug(true, true, 0xff0000);
        
        this.artboard = this.add.dom(100, 100, '#riveCanvas');
        // let arrow = this.add.dom(500, 700, '#riveArrow');

        //#region Render Texture
        // this.arrowTexture = this.add.renderTexture(250, 250, 500, 500);

        // this.arrowCanvas.style.display = "none";

        // this.events.on("postupdate", this.updateRiveTexture, this);
~

        console.log("{",this.logo.displayWidth, this.logo.displayHeight, "}", ", {", this.artboard.displayWidth, this.artboard.displayHeight, "}");

        let switchSound = this.sound.add('switchSound');

        this.cursorFollow = this.add.image(0, 0);
        this.cursorFollow.setDisplaySize(50, 50);
        this.cursorFollow.setTint(0xff0000);

        this.input.on('pointermove', (pointer) => {
            this.cursorFollow.setPosition(pointer.x, pointer.y);
        });
        // this.cursorFollow.setPosition(this.input.x, this.input.y);

        
        this.graphics = this.add.graphics({ lineStyle: { width:5, color: 0xFF00FF } });

        //#region Start Swipe
        this.input.on('pointerdown', (e) => {
            playSound(this, switchSound);

            // if(this.parentToMouse){
            //     this.parentToMouse = false;
            // }
            // else{
            //     this.parentToMouse = true;
            // }

            swipePositions.push(new Vector2D(e.x, e.y));
            this.graphics.clear();
            this.graphics.moveTo(e.x, e.y);
            swipeDuration = 0;
            timeDuration = true;

            this.timer = this.time.addEvent({
                delay: 10, // ms
                callback: this.startTracking,
                args: [e, this.graphics],
                loop: true,
                repeat: 0,
                startAt: 0,
                timeScale: 1,
                paused: false,
            });

        });

        //#region End Swipe
        this.input.on('pointerup', (e) => {
            timeDuration = false;
            console.log(`Swipe duration: ${swipeDuration}`);
            this.timer.remove();
            this.launchDirection = this.stopTracking();
            this.logo.body.setVelocity(0, 0);
            this.logo.body.velocity.x += this.launchDirection[0] * swipePowerModifier;
            this.logo.body.velocity.y += this.launchDirection[1] * swipePowerModifier;
            playSound(this, switchSound);

        });

        // this.logo.setVelocity(100, 200);
        this.logo.setBounce(0.5, 0.5);
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

    //#region Update Textures
    updateRiveTexture() {
        // // Copy the Rive canvas onto the Phaser RenderTexture
        // this.arrowTexture.clear();
        // this.arrowTexture.draw(this.textures.createCanvasFromCanvas(this.riveCanvas));

        // Create a texture from the Rive canvas
        // const texture = this.textures.createCanvas('riveArrow', this.arrowTexture.width, this.arrowTexture.height);
        // const context = texture.getContext();

        // // Clear the texture first
        // context.clearRect(0, 0, texture.width, texture.height);

        // // Draw the Rive canvas onto the Phaser texture
        // context.drawImage(this.riveCanvas, 0, 0);

        // // Clear and update the RenderTexture with the new texture
        // this.riveTexture.clear();
        // this.riveTexture.draw(texture, 0, 0);
    }
    
    startTracking(event, graphics)
    {
        graphics.lineTo(event.x, event.y);
        graphics.strokePath();
        
        swipePositions.push(new Vector2D(event.x, event.y));
        console.log("tick");
    }

    stopTracking(event)
    {
        console.log("swipe positions ", swipePositions);
        let value = this.calculateTrajectory();
        swipePositions = [];
        console.log("stopped tracking");
        return value;
    }
    
    update (delta)
    {
        let deltaInSeconds = delta / 1000; // Convert to seconds

        if(!this.parentToMouse){
            this.particles.startFollow(this.logo);    
        }else{
            this.particles.startFollow(this.cursorFollow);
        }

        if(timeDuration)
        {
            swipeDuration += deltaInSeconds; 
        }
        
        // this.logo.rotation += 1 * deltaInSeconds;
        this.artboard.setPosition(this.logo.x, this.logo.y);
        this.artboard.setAngle(this.logo.angle);
    }
    
    calculateTrajectory()
    {
        if(swipePositions.length < 3) return [0, 0];
        
        var deltas = []; 
        var result = [];
        for(let i = 0; i < swipePositions.length - 1; i++)
        {
            deltas.push([swipePositions[i+1].x - swipePositions[i].x, swipePositions[i+1].y - swipePositions[i].y]);
        }

        result = deltas[0];
        for(let i = 0; i < deltas.length - 1; i++)
        {
            result = [deltas[i+1][0] + result[0], deltas[i+1][1] + result[1]];
        }

        return result;
    }
}

class Vector2D
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    

    normalized()
    {
        let magnitude = this.getMagnitude();
        return [this.x * magnitude, this.y * magnitude];
    }

    getMagnitude()
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    value()
    {
        return [this.x, this.y];
    }
}

function playSound(obj, soundToPlay)
{
    if(obj.sound.get('switchSound').isPlaying){
        obj.sound.get('switchSound').stop();
    }
    soundToPlay.play({detune: 1000, rate: 5});
}
const config = {
    //#region Config
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    parent: gameContainer,
    dom:{ createContainer: true },
    // scene: [GameScene],
    scene: [MainMenu, DidYouKnow, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }
        }
    }
};

const game = new Phaser.Game(config);