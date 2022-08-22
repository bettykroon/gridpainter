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

        color = Math.floor(Math.random()*16777215).toString(16);
        myColor.style.backgroundColor = color;
    }
})

for (let i = 0; i < items.length; i++) {
    items[i].setAttribute("id", i);
    
    items[i].addEventListener("click", (e) => {
        let pixel = document.getElementById(e.target.id);
        pixel.style.backgroundColor = color;

        let obj = {id: e.target.id, color: color, name: socket.id};
        array.push(obj);

        socket.emit("array", {array: array});
    })
}

socket.on("array", (array) => {
    for (let i = 0; i < array.array.length; i++) {
        let pixelId = document.getElementById(array.array[i].id);
        let colorFromUser = array.array[i].color;

        pixelId.style.backgroundColor = colorFromUser;   
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if(message.value){
        socket.emit("chat msg", { id: socket.id, namn: nameInput.value, text: message.value});
        message.value = "";
    }
})

socket.on("chat msg", (msg) => {
    let chatt = document.getElementById("messages");
    console.log(msg);

    if(msg.id === socket.id){
    chatt.insertAdjacentHTML("beforeend", "<li id='li'><p id='msg' style='background-color:#e7af1b;color:white;float:right;'>" + msg.text + "</p></li><br>")
    } else {
    chatt.insertAdjacentHTML("beforeend", "<li id='li'><p id='msg' style='background-color:#ccc;color:#217543;float:left;'>" + msg.namn + ": " + msg.text + "</p></li><br>");
    }
})