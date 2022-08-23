let container = document.getElementById("container");
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

const socket = io();

let array = [];

let color = "";

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
        color = Math.floor(Math.random()*16777215).toString(16);
        myColor.style.backgroundColor = color;
    }
})

//Lägger till ett id på varje ruta
for (let i = 0; i < items.length; i++) {
    items[i].setAttribute("id", i);
    
    //Färgar den ruta du klickat på med din färg
    items[i].addEventListener("click", (e) => {
        let pixel = document.getElementById(e.target.id);
        pixel.style.backgroundColor = color;

        let obj = {id: e.target.id, color: color, name: socket.id};
        array.push(obj);

        //Skickar arrayen med ifyllda rutor
        socket.emit("array", {array: array});
    })
}

//Färgar de rutor som andra har färglagt
socket.on("array", (array) => {
    for (let i = 0; i < array.array.length; i++) {
        let pixelId = document.getElementById(array.array[i].id);
        let colorFromUser = array.array[i].color;

        pixelId.style.backgroundColor = colorFromUser;   
    }
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
    console.log(msg);

    if(msg.id === socket.id){
        //Om du själv har skickat meddelandet
        chatt.insertAdjacentHTML("beforeend", "<li id='li'><p id='msg' style='background-color:#e7af1b;color:white;float:right;'>" + msg.text + "</p></li><br>")
    } else {
        //Om någon annan skickat meddelandet
        chatt.insertAdjacentHTML("beforeend", "<li id='li'><p id='msg' style='background-color:#ccc;color:#217543;float:left;'>" + msg.namn + ": " + msg.text + "</p></li><br>");
    }
})

//Spara knapp
saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    socket.emit("database", {colors: array});
})