class Example extends Phaser.Scene
{
   
    preload ()
    {
        // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('tudor', 'assets/Tudor.png');

        this.load.audio('switchSound', 'assets/switch.mp3');
    }

    create ()
    {
        this.parentToMouse = false;

        this.logo = this.physics.add.image(100, 100, 'logo');
        this.artboard = this.add.dom(100, 100, '#riveCanvas');

        let switchSound = this.sound.add('switchSound');

        this.logo.displayHeight = 100;
        this.logo.displayWidth = 100;
        this.logo.setSize(this.logo.width, this.logo.height, true); // Resize collider

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

        
        //this is how you parent stuff
        
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
    scene: Example,
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