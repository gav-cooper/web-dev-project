"use strict";

const form = document.getElementById("updatePasswordForm");

form.addEventListener("submit", submitUpdatePasswordForm);

async function submitUpdatePasswordForm (event) {
    event.preventDefault();
    const errorsContainer = document.querySelector("#errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch(`${window.location}/password`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // Account created
            appendData(errorsContainer, "Password updated successfully", "error"); 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } else if( response.status === 403) {  // Username/Email already in DB
            appendData(errorsContainer, "Current password is incorrect!", "error");
        }
    } catch (err) {
        console.error(err);
    }
}

function getInputs() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    console.log(oldPassword);
    return {
        oldPassword,
        newPassword
    }
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}
