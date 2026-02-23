const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ضبط حجم canvas ليتناسب مع أي جهاز
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientWidth * 1.5; // ارتفاع مناسب

// اللعبة
let score = 0;
let gameSpeed = 3;
let keys = {};

document.addEventListener("keydown", (e)=> keys[e.key] = true);
document.addEventListener("keyup", (e)=> keys[e.key] = false);

// اللاعب - عمر
let player = {
    x: canvas.width/2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    color: "red",
    speed:7
};

// العقبات
let obstacles = [];
let obstacleTimer = 0;
let obstacleInterval = 90;

// العملات (الحمزة)
let coins = [];
let coinTimer = 0;
let coinInterval = 150;

// وظيفة إنشاء عقبات
function createObstacle(){
    let width = Math.random()*50 + 30;
    let x = Math.random()*(canvas.width - width);
    obstacles.push({x:x, y:-50, width:width, height:20, color:"green"});
}

// وظيفة إنشاء عملات
function createCoin(){
    let size = 20;
    let x = Math.random()*(canvas.width - size);
    coins.push({x:x, y:-20, size:size, color:"yellow"});
}

// التحديث
function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // حركة اللاعب
    if(keys["ArrowLeft"] && player.x>0) player.x -= player.speed;
    if(keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

    // رسم اللاعب
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // العقبات
    obstacleTimer++;
    if(obstacleTimer>obstacleInterval){
        createObstacle();
        obstacleTimer=0;
    }

    obstacles.forEach((ob,i)=>{
        ob.y += gameSpeed;
        ctx.fillStyle = ob.color;
        ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

        // اصطدام اللاعب بالعقبة
        if(player.x < ob.x + ob.width &&
           player.x + player.width > ob.x &&
           player.y < ob.y + ob.height &&
           player.y + player.height > ob.y){
               alert("خسرت! النقاط: " + score);
               score=0;
               obstacles=[];
               coins=[];
        }

        // إزالة العقبات خارج الشاشة
        if(ob.y > canvas.height) obstacles.splice(i,1);
    });

    // العملات
    coinTimer++;
    if(coinTimer>coinInterval){
        createCoin();
        coinTimer=0;
    }

    coins.forEach((coin,i)=>{
        coin.y += gameSpeed;
        ctx.fillStyle = coin.color;
        ctx.beginPath();
        ctx.arc(coin.x + coin.size/2, coin.y + coin.size/2, coin.size/2, 0, Math.PI*2);
        ctx.fill();

        // جمع العملة
        if(player.x < coin.x + coin.size &&
           player.x + player.width > coin.x &&
           player.y < coin.y + coin.size &&
           player.y + player.height > coin.y){
               score += 10;
               coins.splice(i,1);
        }

        if(coin.y > canvas.height) coins.splice(i,1);
    });

    // تحديث النقاط
    document.getElementById("score").innerText = score;

    // زيادة السرعة تدريجيًا
    gameSpeed += 0.001;

    requestAnimationFrame(update);
}

// ابدأ اللعبة
update();