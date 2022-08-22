let container = document.getElementById("container");
let items = document.getElementsByClassName("item");

let myColor = "blue";

for (let i = 0; i < items.length; i++) {
    items[i].setAttribute("id", i);
    
    items[i].addEventListener("click", (e) => {
        let pixel = document.getElementById(e.target.id);
        pixel.style.backgroundColor = myColor;
    })
}


