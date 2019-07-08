import TubeController from "./TubeController";

export default class BirdController extends Laya.Script {
    constructor() { super(); }

    private speed: number = -7.5;

    private rb: Laya.RigidBody;

    private rotationMax: number = 90;

    private rotationMin: number = -20;

    private radius: number = 1;

    private radian: number = 0;

    private perRadian: number = 0.15;

    // 是否正式开始
    private isStart:boolean = false;

    onEnable(): void {
        //设置初始速度
        this.rb = this.owner.getComponent(Laya.RigidBody);
        this.rb.gravityScale = 0;
        //Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
    }

    onUpdate(): void {
        var owner: Laya.Sprite = this.owner as Laya.Sprite;
        // 准备阶段做上下缓动
        if (!this.isStart) {
            this.radian += this.perRadian;
            var dy: number = Math.cos(this.radian) * this.radius;
            owner.pos(owner.x, owner.y + dy);
            //console.log(owner.y);
            
        }
        else{
            // 处理下降和上升过程中的旋转
            var rotation: number = owner.rotation;
            if (rotation >= 180) {
                rotation -= 360;
            }
            if (this.rb.linearVelocity.y < 0) {
                rotation -= this.rb.linearVelocity.y * this.rb.linearVelocity.y * 0.5;
            } else if (this.rb.linearVelocity.y > 2.5) {
                rotation += this.rb.linearVelocity.y * this.rb.linearVelocity.y * 0.5;
            }
            rotation = Math.min(this.rotationMax, rotation);
            rotation = Math.max(this.rotationMin, rotation);
            owner._setRotation(rotation);
        }
    }

    onKeyDown(e: Laya.Event): void {
        var owner: Laya.Sprite = this.owner as Laya.Sprite;
        this.rb.setVelocity({ x: 0, y:  this.speed});
        if (!this.isStart) {
            this.isStart = true;
            this.rb.gravityScale = 1.5;
            console.log(owner.numChildren);
            console.log(owner._children[0].name);
            var fly: Laya.Animation =  owner.getChildByName("Animation") as Laya.Animation;
            fly.autoPlay = true;

            var tc: TubeController = this.owner.parent.getComponent(TubeController);
            tc.onGameStart();
        }
    }

    onTriggerEnter(other: any, self: any, contact: any): void {
        //console.log("collide");
        var tc: TubeController = this.owner.parent.getComponent(TubeController);
        tc.onGameEnd();

		// 若撞柱而死，则旋转90度下落
		// if (other.owner.label == "Tube") {
        //var owner: Laya.Sprite = this.owner as Laya.Sprite;
        //owner.rotation = owner.rotation + 90;

		 	//Vector3 rotation = this.transform.localEulerAngles;
		 	//this.transform.localEulerAngles = new Vector3 (rotation.x, rotation.y, -90f);
		// }

        this.enabled = false;
        var fly: Laya.Animation =  this.owner.getChildByName("Animation") as Laya.Animation;
        fly.autoPlay = false;
        var rb: Laya.RigidBody = this.owner.getComponent(Laya.RigidBody);
        rb.enabled = false;
		// int birdLayer = LayerMask.NameToLayer("Bird");
		// int layerMask = Physics2D.GetLayerCollisionMask(birdLayer);
		// int tubeLayer = LayerMask.NameToLayer ("Tube");
		// int maskChange = ~(1 << tubeLayer);
		// Physics2D.SetLayerCollisionMask(birdLayer, layerMask & maskChange);
    }


}