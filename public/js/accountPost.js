"use strict";

// Get all buttons and add a listener for each one
let button = document.getElementsByClassName("button");
for (let i = 0; i < button.length; i++) {
    button[i].addEventListener("click", deletePost);
}

/*  Deletes a user's post by extracting the ID from the event and sending a
    delete request
*/
async function deletePost(event) {
    // get post id from the event
    const postID = event.target.attributes.postID.value;
    try {
        const response = await fetch(`${window.location}/${postID}`, {
            "method": "DELETE",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        // reload the page
        location.reload();
    } catch(error) {
        console.log("Could not delete")
        location.reload();
    }
}


