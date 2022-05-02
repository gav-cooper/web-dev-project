"use strict";

const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", submitUserForm);

async function submitUserForm (event) {
    event.preventDefault();
    const errorsContainer = document.querySelector("#errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch("/forgottenPassword", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        appendData(errorsContainer,"If the account is found, an email has been sent to reset the password","error")
    } catch (err) {
        console.error(err);
    }
}

function getInputs() {
    const email = document.getElementById("email").value;

    return {
        email
    }
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}