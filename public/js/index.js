"use strict";

const form = document.getElementById("loginForm");

form.addEventListener("submit", submitLoginForm);

async function submitLoginForm (event) {
    event.preventDefault();
    const errorsContainer = document.querySelector("#errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch("/login", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // Account created
            window.location.href="/posts"; 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } else if( response.status === 404) {  // Username/Email already in DB
            clearInputs();
            appendData(errorsContainer, "Invalid username/email or password!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

function getInputs() {
    const value = document.getElementById("value").value;
    const password = document.getElementById("password").value;

    return {
        value,
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
    document.getElementById("value").value = "";
    document.getElementById("password").value = "";    
}