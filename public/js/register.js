"use strict";

const form = document.getElementById("createUserForm");

form.addEventListener("submit", submitUserForm);

async function submitUserForm (event) {
    event.preventDefault();
    const errorsContainer = document.querySelector("#errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch("/register", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // Account created
            window.location.href="/"; 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } else if( response.status === 409) {  // Username/Email already in DB
            clearInputs();
            appendData(errorsContainer, "Username and/or Email is Taken!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

function getInputs() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    return {
        username,
        email,
        password
    }
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}

function clearInputs() {
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";    
}

function timeoutButton() {
    const button = document.getElementById("submit");
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 10000)
    return true;
}