let container = document.getElementById("container");
let pictureContainer = document.getElementById("pictureContainer");
let items = document.getElementsByClassName("item");
let nameInput = document.getElementById("enterName");
let submit = document.getElementById("submit");
let nameContainer = document.getElementById("nameContainer");
let game = document.getElementById("game");
let yourName = document.getElementById("name");
let form = document.getElementById("form");
let message = document.getElementById("inputMsg");
let myColor = document.getElementById("myColor");
let saveBtn = document.getElementById("save");
let restart = document.getElementById("restart");
let doneBtn = document.getElementById("done");
let result = document.getElementById("result");
let score = document.getElementById("score");
let changeColor = document.getElementById("changeColor");
let timer = document.getElementById("timer");
let timerBtn = document.getElementById("timerBtn");

const socket = io();

let emptyGrid = [];

let pictureGrid = [];

let array = [];

let colorArray = [];

let color = "";

let img = "";

let imageToPaint = "";

// Timer 
timerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    timer.innerHTML =
    05 + ":" + 00;
  startTimer();
});

function startTimer() {
    var presentTime = timer.innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    if(s==59){m=m-1}
    if(m<0){
      return alert("Tiden är ute!")
    }
    
    timer.innerHTML =
      m + ":" + s;
    setTimeout(startTimer, 1000);
    
}
  
function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec};
    if (sec < 0) {sec = "59"};
    return sec;
}

//Hämtar arrayen från databasen
window.onload = (e) => {
    fetch("https://gridpaintergame.herokuapp.com/users")
    .then(res => res.json())
    .then(data => {
        array = data[0].colors;
        socket.emit("array", {array: array});

        if(data[0].image.img){
            img = data[0].image.img;
            pictureFromDatabase();
        } else {
            picture();
        }
    })

    spelplan();
}

//Hämtar grid.json som kommer bli ett tomt rutnät
function spelplan(){
    fetch("https://gridpaintergame.herokuapp.com/grid.json", {
        method: "GET",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((json) => {
        emptyGrid = json.grid;
        grid();
    })
}

//Skapar rutnätet
function grid(){
    //Sätter ett id på varje ruta i rutnätet
    for (let i = 0; i < emptyGrid.length; i++) {
        let div = document.createElement("div");
        div.setAttribute("id", emptyGrid[i].id);
        div.classList = "item";
        container.appendChild(div);
    }

    for (let i = 0; i < items.length; i++) {
        //Färgar den ruta du klickat på med din färg
        items[i].addEventListener("click", (e) => {
            if(timer.innerHTML === "05:00"){
                startTimer();
                timerBtn.style.display = "none";
            }

            let pixel = document.getElementById(e.target.id);
            pixel.style.backgroundColor = color;
    
            let obj = {id: e.target.id, color: color, name: socket.id};
            array.push(obj);

            score.style.display = "none";
            saveBtn.style.display = "none";
    
            //Skickar arrayen med ifyllda rutor
            socket.emit("array", {array: array});
        })
    }
}

//Slumpar en bild att måla av
function picture(){
    let randomPicture = Math.floor(Math.random() * 5) + 1;
    imageToPaint = {img: randomPicture};

    //Hämtar bilden som ska målas av
    fetch("https://gridpaintergame.herokuapp.com/images/bild" + randomPicture + ".json", {
        method: "GET",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((json) => {
        colorArray = json.colors;
        pictureGrid = json.grid;

        socket.emit("picture", pictureGrid)
        showPicture();
    })

    //Sparar bilden i databasen för att alla ska måla av samma bild
    fetch("https://gridpaintergame.herokuapp.com/users/image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(imageToPaint)
    })
    .then(res => res.json())
    .then(data => {
    })

}

//Hämtar bild från databasen
function pictureFromDatabase(){
    fetch("https://gridpaintergame.herokuapp.com/images/bild" + img + ".json", {
        method: "GET",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((json) => {
        colorArray = json.colors;
        pictureGrid = json.grid;

        socket.emit("picture", pictureGrid)
        showPicture();
    })
}

//Visar slumpad bild att måla av
function showPicture(){
    for (let i = 0; i < pictureGrid.length; i++) {
        let div = document.createElement("div");
        div.setAttribute("pictureId", pictureGrid[i].id);
        div.style.backgroundColor = pictureGrid[i].color;
        div.classList = "pictureItem";
        pictureContainer.appendChild(div);
    }
} 

function randomColor(){
    color = colorArray[Math.floor(Math.random() * colorArray.length)];
    myColor.style.backgroundColor = color;
}

changeColor.addEventListener("click", (e) => {
    e.preventDefault();
    randomColor();
})

//Funktion när du skriver in ditt namn
submit.addEventListener("click", (e) => {
    e.preventDefault();

    if(nameInput.value){
        //Skickar valt namn
        socket.emit("username", {namn: nameInput.value});

        game.style.display = "block";
        nameContainer.style.display = "none";
        yourName.innerHTML = nameInput.value;
        
        //Får en slumpad färg
        randomColor();
    } else {
        alert("Vänligen fyll i ditt namn!")
    }
})

//Färgar de rutor som andra har färglagt
socket.on("array", (colorArray) => {
    for (let i = 0; i < colorArray.array.length; i++) {
        let pixelId = document.getElementById(colorArray.array[i].id);
        let colorFromUser = colorArray.array[i].color;

        pixelId.style.backgroundColor = colorFromUser; 
    }
    let obj = colorArray.array;
    array = obj;
})

//Skickar ett meddelande i chatten
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if(message.value){
        socket.emit("chat msg", { id: socket.id, namn: nameInput.value, text: message.value});
        message.value = "";
    }
})

//Skriver ut meddelandet i chatten
socket.on("chat msg", (msg) => {
    let chatt = document.getElementById("messages");

    if(msg.id === socket.id){
        //Om du själv har skickat meddelandet
        chatt.insertAdjacentHTML("beforeend", "<li id='li'><p id='msg' style='background-color:#e7af1b;color:white;float:right;'>" + msg.text + "</p></li><br>")
    } else {
        //Om någon annan skickat meddelandet
        chatt.insertAdjacentHTML("beforeend", "<li id='li'><p id='msg' style='background-color:#217543;color:white;float:left;'>" + msg.namn + ": " + msg.text + "</p></li><br>");
    }
})

//Spara knapp
saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(array);

    //Skickar array till databas
    fetch("https://gridpaintergame.herokuapp.com/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(array)
    })
    .then(res => res.json())
    .then(data => {
    })
})

//Börja om knapp
restart.addEventListener("click", (e) => {
    e.preventDefault();

    //Tömmer arrayen och skickar till databasen
    array = [];
    imageToPaint = "";

    fetch("https://gridpaintergame.herokuapp.com/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(array)
    })
    .then(res => res.json())
    .then(data => {
    })

    fetch("https://gridpaintergame.herokuapp.com/users/image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(array)
    })
    .then(res => res.json())
    .then(data => {
    })

    socket.emit("reload", {});
})

socket.on("reload", (reload) => {
    window.location.reload();
})

//Klar knapp
doneBtn.addEventListener("click", (e) => {
    socket.emit("done", { id: socket.id, done: "yes"});
})

let playersDone = 0;
let correctAnswers = 0;

socket.on("done", (done) => {
    playersDone ++;

    if(playersDone === 4){
        for (let i = 0; i < array.length; i++) {
            let hej = pictureGrid.find( o => o.id === JSON.parse(array[i].id));

            if(JSON.parse(array[i].id) === hej.id && array[i].color === hej.color){
                correctAnswers++;
                score.style.display = "block";
                result.innerHTML = (correctAnswers / 225) * 100;
                console.log("CA", correctAnswers);
            } else {
                score.style.display = "block";
                result.innerHTML = (correctAnswers / 225) * 100;
            }
        }
        playersDone = 0;
        correctAnswers = 0;
        saveBtn.style.display = "inline";
    }
})

