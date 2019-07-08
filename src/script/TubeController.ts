export default class TubeController extends Laya.Script {
    constructor() { super(); }
    /** @prop {name:tube0,tips:"水管预制体对象0",type:Prefab}*/
    tube0: Laya.Prefab;
    /** @prop {name:tube1,tips:"水管预制体对象1",type:Prefab}*/
    tube1: Laya.Prefab;

    private bird: Laya.Sprite;

    private grounds: Array<Laya.Sprite>;
    private backgrounds: Array<Laya.Sprite>;

    private groundIndex: number = 1;
    private backgroundIndex: number = 1;
    
    private isOver: boolean = false;
    private tubes: Array<Laya.Sprite>;
	//private maxOrderInLayer:number = 5;

    onEnable(): void {
        this.backgrounds = [];
        this.grounds = [];
        this.tubes = [];
        this.bird = this.owner.getChildByName("bird") as Laya.Sprite;
        this.backgrounds[0] = this.owner.getChildByName("background_0") as Laya.Sprite;
        this.backgrounds[1] = this.owner.getChildByName("background_1") as Laya.Sprite;
        this.backgrounds[2] = this.owner.getChildByName("background_2") as Laya.Sprite;
        this.backgrounds[3] = this.owner.getChildByName("background_3") as Laya.Sprite;
        this.backgrounds[4] = this.owner.getChildByName("background_4") as Laya.Sprite;
        // this.backgrounds[0]._zOrder = 5;
        // this.backgrounds[1]._zOrder = 4;
        // this.backgrounds[2]._zOrder = 3;
        // this.backgrounds[3]._zOrder = 2;
        // this.backgrounds[4]._zOrder = 1;

        this.grounds[0] = this.owner.getChildByName("ground_0") as Laya.Sprite;
        this.grounds[1] = this.owner.getChildByName("ground_1") as Laya.Sprite;
        this.grounds[2] = this.owner.getChildByName("ground_2") as Laya.Sprite;
 
        

    }

    onUpdate(): void {
        var prevIndex: number = 0;
        var aftIndex: number = 0;
        if (this.grounds[this.groundIndex].x + 100 <= this.bird.x) {
            prevIndex = this.groundIndex - 1;
            aftIndex = this.groundIndex + 1;
            if (prevIndex < 0) {
                prevIndex += 3;
            }
            if (aftIndex >= 3) {
                aftIndex -= 3;
            }
            // console.log(prevIndex);
            // console.log(this.grounds[0].x);
            // console.log(this.grounds[1].x);
            // console.log(this.grounds[2].x);
            this.grounds[prevIndex].pos(this.grounds[aftIndex].x + 336, this.grounds[prevIndex].y);
            //this.grounds[prevIndex]._setX(this.grounds[aftIndex].x + 336);
            //console.log(prevIndex);
            //console.log( this.grounds[aftIndex].x);
            //console.log(this.grounds[prevIndex].x);
            this.groundIndex = aftIndex;
        }

        if (this.backgrounds[this.backgroundIndex].x <= this.bird.x) {
			prevIndex = this.backgroundIndex - 2;
			aftIndex = this.backgroundIndex + 2;
			if (prevIndex < 0)
				prevIndex += 5;
			if (aftIndex >= 5)
				aftIndex -= 5;

			this.backgrounds[prevIndex].pos(this.backgrounds[aftIndex].x + 256, this.backgrounds[prevIndex].y);
			this.backgroundIndex++;
			if (this.backgroundIndex >= 5) {
                this.backgroundIndex -= 5;
            }
            
        }
        
        
    }

    createTube(): void {
        if (!this.isOver) {
            let tube1: Laya.Sprite = Laya.Pool.getItemByCreateFun("tube1", this.tube1.create, this.tube1);
            tube1.pos(700, -200 + Math.random() * 100);
            this.owner.addChild(tube1);
            var rb: Laya.RigidBody = tube1.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: -2, y:  0});

            let tube0: Laya.Sprite = Laya.Pool.getItemByCreateFun("tube0", this.tube0.create, this.tube0);
            tube0.pos(700, 445 + tube1.y);
            this.owner.addChild(tube0);
            var rb: Laya.RigidBody = tube0.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: -2, y:  0});

            this.tubes.push(tube1);
            this.tubes.push(tube0);
        }
    }

    onGameStart(): void {
        this.backgrounds.forEach(element => {
            var rb: Laya.RigidBody = element.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: -2, y:  0});
        });

        this.grounds.forEach(element => {
            var rb: Laya.RigidBody = element.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: -2, y:  0});
        });

        Laya.timer.loop(2000, this, this.createTube);
    }

    onGameEnd(): void {
        this.backgrounds.forEach(element => {
            var rb: Laya.RigidBody = element.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: 0, y:  0});
        });

        this.grounds.forEach(element => {
            var rb: Laya.RigidBody = element.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: 0, y:  0});
        });

        
        this.tubes.forEach(element => {
            var rb: Laya.RigidBody = element.getComponent(Laya.RigidBody);
            rb.setVelocity({ x: 0, y:  0});
        });

        this.isOver = true;
    }

}