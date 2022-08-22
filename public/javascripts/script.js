let container = document.getElementById("container");
let items = document.getElementsByClassName("item");
let input = document.getElementById("enterName");
let submit = document.getElementById("submit");
let nameContainer = document.getElementById("nameContainer");
let game = document.getElementById("game");
let yourName = document.getElementById("name");

const socket = io();

let myColor = "blue";

let array = [];

//Funktion när du skriver in ditt namn
submit.addEventListener("click", (e) => {
    e.preventDefault();

    if(input.value){
        //Skickar valt namn
        socket.emit("username", {namn: input.value});

        game.style.display = "block";
        nameContainer.style.display = "none";
        yourName.innerHTML = input.value;

        myColor = Math.floor(Math.random()*16777215).toString(16);
    }
})

for (let i = 0; i < items.length; i++) {
    items[i].setAttribute("id", i);
    
    items[i].addEventListener("click", (e) => {
        let pixel = document.getElementById(e.target.id);
        pixel.style.backgroundColor = myColor;

        let obj = {id: e.target.id, color: myColor, name: socket.id};
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