window.onload = () => {
    setTimeout(()=>{
        scrollTo(0,0);
    },100)
}

class Player{
    constructor() {
        this.x = 0;
        this.y = 90;
        this.inJump = false;
        this.$element = document.querySelector("#runner");
    }
    posPlus(v){
        this.x += v;
        document.querySelector("#runner").style.left = `${this.x}px`;
    }
    jump(){
        if(this.inJump) return;
        this.inJump = true;
        this.y += 25;
        document.querySelector("#runner").style.bottom = `${this.y}px`;
        setTimeout(()=>{
            this.y -= 25;
            this.inJump = false;
            document.querySelector("#runner").style.bottom = `${this.y}px`;
        },400)
    }
}
class Point{
    constructor(selector) {
        let element = document.querySelector(selector);
        this.x = element.getBoundingClientRect().x;

        this.hitbox = this.x;
        this.$el = element;
        this.trigger = this.$el.dataset.triggerPoint;
    }

}
class Game{
    constructor() {
        window.addEventListener('scroll', function(ev) {
            ev.preventDefault();
        });
        this.started = false;
        this.paused = false;
        this.runaway = 2;
        this.player = new Player();
    }
    start(){

        document.querySelectorAll(".panel").forEach((i)=>{
            i.dataset.triggerPoint = i.getBoundingClientRect().x;
        })


        start.remove();
        this.loop();
        this.enableHotKeys();
    }
    enableHotKeys(){
        document.addEventListener("keyup",(ev)=>{
            if(ev.keyCode === 32){
                this.player.jump();
            }
            if(ev.keyCode === 40){
                this.changeRunway(0);
            }if(ev.keyCode === 38){
                this.changeRunway(1);
            }
        })
    }
    changeRunway(dir){
        // верх
        let runwayCords = [25, 0, -25];
        if(dir === 1){
            this.runaway--;
            if(this.runaway === -1) this.runaway = 3;
        }
        else{
            this.runaway++;
            if(this.runaway === 4) this.runaway = 1;
        }
        this.player.$element.style.bottom = this.player.y + runwayCords[this.runaway - 1] + "px";

    }
    checkCollision(){
        let res = {
            type : "panel",
            name : null,
            colEl : null,
        }
        if(this.player.x > new Point("#amazonPanel").trigger){

            res.name = "amazon";
        }
        if(this.player.x > new Point("#bahiaPanel").trigger){

            res.name = "bahia";
        }
        if(this.player.x > new Point("#paranaPanel").trigger){

            res.name = "parana"
        }
        if(this.player.x > new Point("#saopauloPanel").trigger){

            res.name = "saopaulo";
        }
        if(this.player.x > new Point("#rioPanel").trigger){

            res.name = "rio";
        }
        if(this.player.x > new Point("#pyrePanel").trigger){

            res.name = "pyre";
        }
        // Проверяем коллизию на препятствия
        document.querySelectorAll(`#runway${this.runaway} .obstacle`).forEach((i)=>{
            if(this.player.x > i.getBoundingClientRect().x - i.getBoundingClientRect().width && this.player.x < i.getBoundingClientRect().x + i.getBoundingClientRect().width  && !this.player.inJump){
                end.classList.remove("hide");
                this.paused = true;
            }
        })


        if(res.type === "panel" && res.name != null && ~~document.querySelector(`#${res.name}`).style.opacity === 1) return false
        if(res.name != null) return res;

        return false
    }
    movePlayer(){
        this.player.posPlus(6)
        scrollTo(this.player.x - 2 - 50,0);
        let clsn = this.checkCollision();
        if(!clsn) return true;
        if(clsn.type === "panel"){
            console.log(clsn)
            if(clsn.name === "pyre"){
                this.paused = true;
                pyreImage.src = "imgs/pyre_fire.svg";
            }
            else document.querySelector(`#${clsn.name}`).style.opacity = 1;
        }
    }

    loop(){
        if(!this.paused) this.movePlayer();
        requestAnimationFrame(()=> this.loop())
    }

}

let game = new Game();