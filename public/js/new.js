"use strict";

const form = document.getElementById("createPostForm");

form.addEventListener("submit", submitUserForm);

async function submitUserForm (event) {
    event.preventDefault();
    const errorsContainer = document.querySelector("#errors");
    errorsContainer.innerHTML = "";
    
    const body = getInputs();

    try {
        const response = await fetch("/posts", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body)
        });
        if (response.ok) {      // Post was created
            window.location.href="/posts"; 

        } else if (response.status === 400) {   // Input parameter error
            const data = await response.json();
            const errors = data.errors;
            
            for (const errorMsg of errors) {
                console.error(errorMsg);
                appendData(errorsContainer, errorMsg, "error");
            }
        } 
    } catch (err) {
        console.error(err);
    }
}

function getInputs() {
    const subject = document.getElementById("subject").value;
    const post = document.getElementById("post").value;

    return {
        subject,
        post
    }
}

function appendData(container, message, className) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    paragraph.classList.add(className);
    container.append(paragraph);
}