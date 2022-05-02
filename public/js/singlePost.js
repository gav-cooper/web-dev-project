"use strict";

const button = document.getElementById("likePost");
const likes = document.getElementById("likes")
const numLikes = document.getElementById("numLikes");

button.addEventListener("click", likeThePost);

async function likeThePost (event) {
    timeoutButton();
    if (likes.className === "liked") {
        numLikes.innerHTML = addElement(numLikes,-1);
        likes.className = "unliked";
        button.innerHTML = "Like";
    } else {
        numLikes.innerHTML = addElement(numLikes,1);
        likes.className = "liked";
        button.innerHTML = "Unlike";
    }
    try {
        const response = await fetch(`${window.location}/like`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            }
        });
    } catch(error) {
        console.log("Could not like!")
    }
}

function addElement (element, num) {
    let int = parseInt(element.innerHTML);
    int = int + num;
    return int.toString();
}

function timeoutButton() {
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 10000)
    return true;
}