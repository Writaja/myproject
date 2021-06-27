var canvas =new fabric.Canvas("myCanvas");
var block_img_width=30;
var block_img_height=30;
var playar_X=10;
var playar_Y=10;
var playar_object="";
var blocks="";
function playar_update(){
    fabric.Image.fromURL("player.png",function(Img){
        playar_object=Img;
        playar_object.scaleToWidth(150);
        playar_object.scaleToHeight(140);
playar_object.set({
    top:playar_Y,
    left:playar_X

});
canvas.add(playar_object);
    });

}
function new_img(get_img){
    fabric.Image.fromURL(get_img,function(Img){
        blocks=Img;
        blocks.scaleToWidth( block_img_width);
        blocks.scaleToHeight( block_img_height);
        blocks.set({
    top:playar_Y,
    left:playar_X
});
canvas.add(blocks);
    });

}
window.addEventListener("keydown",my_keydown);
function my_keydown(e) {
keypressed=e.keyCode;
console.log(keypressed);
if(e.shiftKey==true && keypressed=="80"){
    console.log("P and shift pressed togeather");
    block_img_height=block_img_height+10;
    block_img_width=block_img_width+10;
    document.getElementById("current_width").innerHTML=block_img_width;
    document.getElementById("current_height").innerHTML=block_img_height;

}
if(e.shiftKey==true && keypressed=="77"){
    console.log("M and shift pressed togeather");
    block_img_height=block_img_height-10;
    block_img_width=block_img_width-10;
    document.getElementById("current_width").innerHTML=block_img_width;
    document.getElementById("current_height").innerHTML=block_img_height;

            if(keypressed=='82'){
                new_img ("rr1.png");
                console.log("r");
                }
                if(keypressed=='80'){
                    new_img ("pr.png");
                    console.log("p");
                    }
                    if(keypressed=='71'){
                        new_img ("gr.png");
                        console.log("g");
                        }
                        if(keypressed=='66'){
                            new_img ("br.png");
                            console.log("b");
                            }  
                           if(keypressed=='89'){
                                    new_img ("yr.png");
                                    console.log("y");
                           }
