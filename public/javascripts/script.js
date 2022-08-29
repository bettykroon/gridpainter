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
let restart = document.getElementById("restart");

const socket = io();

let array = [];

let color = "";

//Hämtar arrayen från databasen
window.onload = (e) => {
    fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(data => {
        array = data[0].colors;
        socket.emit("array", {array: array});
    })
}

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
    } else {
        alert("Vänligen fyll i ditt namn!")
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
socket.on("array", (colorArray) => {
    console.log(colorArray.array);
    for (let i = 0; i < colorArray.array.length; i++) {
        console.log();
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
    console.log(msg);

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

    //Skickar array till databas
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(array)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
})


//Börja om knapp
restart.addEventListener("click", (e) => {
    e.preventDefault();

    //Tömmer arrayen och skickar till databasen
    array = [];

    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(array)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })

    //Töm rutorna
    for (let i = 0; i < items.length; i++) {
        let pixel = document.getElementById(items[i].id);
        pixel.style.backgroundColor = "transparent";

        socket.emit("array", {array: array});
    }

})