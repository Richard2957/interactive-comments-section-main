let data;
console.log('yuiyuiyu')
const comments = document.querySelector(".comments");
const url = "./data.json";
let jdata;

const loadData = async () => {
    // Read data from local storage
    data = JSON.parse(localStorage.getItem('ICSdata'));
    if (!data) { // if nothing in local storage
        console.log("nothing in local storage");
        try {
            const jdata = await fetch(url);
            data = await jdata.json();
            localStorage.setItem('ICSdata', JSON.stringify(data));
            console.log("json read, now creating the coomen elements")
            createHTMLElements();

        } catch (error) {
            console.log(error);
        }

    } else {
        console.log("Read from local stiorage, lets create elements");
        createHTMLElements();
    }

};



function createElement(is_reply, replying_to_id, replying_to_user, id, content, createdAt, score, userimage, username, ImAuthor) {
    // Creates individual HTML Elements for the comments
    const newElement = document.createElement("div");

    const elAuthor = document.createElement("div");
    const img = new Image();
    const elAuthorName = document.createElement("div");
    const elAuthorDate = document.createElement("div");
    const elButtons = document.createElement("div");
    const elButtonDelete = document.createElement("a");
    const elButtonReplyEdit = document.createElement("a");
    const elScoreboard = document.createElement("div");
    const elSc1 = document.createElement("div");
    const elSc2 = document.createElement("div");
    const elSc3 = document.createElement("div");
    const elCommentText = document.createElement("div");

    newElement.classList.add("comment");
    if (is_reply) newElement.classList.add("reply")
    newElement.id = "com--" + id;
    elAuthor.classList.add("author");
    comments.append(elAuthor);
    img.src = userimage;
    img.setAttribute("alt", "Image of " + username);
    elAuthor.append(img);
    elAuthorName.classList.add("author-name");
    elAuthorName.innerHTML = username;
    elAuthor.append(elAuthorName);
    elAuthorDate.classList.add("author-date");
    elAuthorDate.innerHTML = createdAt;
    elAuthor.append(elAuthorDate);
    newElement.append(elAuthor)
    elButtons.classList.add("buttons");
    newElement.append(elButtons);
    if (ImAuthor) {
        elButtonDelete.classList.add("button-delete");
        elButtonDelete.innerHTML = " <img src='./images/icon-delete.svg' /> Delete";
        elButtonDelete.setAttribute("href", "#");
        elButtonDelete.addEventListener("click", btnDelete);
    }
    elButtonReplyEdit.classList.add((ImAuthor) ? "button-reply" : "button-edit");
    elButtonReplyEdit.innerHTML = (!ImAuthor) ? "<img src='./images/icon-reply.svg' /> Reply" : "<img src='./images/icon-edit.svg' /> Edit";
    elButtonReplyEdit.setAttribute("href", "#");
    elButtonReplyEdit.addEventListener("click", (ImAuthor) ? btnEdit : btnReply);
    elButtons.append(elButtonDelete);
    elButtons.append(elButtonReplyEdit);

    elScoreboard.classList.add("scoreboard");
    newElement.append(elScoreboard);
    elScoreboard.append(elSc1);
    elScoreboard.append(elSc2);
    elScoreboard.append(elSc3);
    elSc1.innerHTML = "+";
    elSc2.innerHTML = score;
    elSc3.innerHTML = "-";
    elCommentText.classList.add("text");
    elCommentText.innerHTML = content;
    newElement.append(elCommentText)

    newElement.replying_to_id=replying_to_id;
    newElement.replying_to_user=replying_to_user;
    return newElement;

}


function createInput(is_reply, is_edit, parent, replying_to_id, replying_to_user) {
    // Creates an Input box
    const getinput = document.createElement("div");
    getinput.classList.add("getinput");
    const img = new Image();
    img.src = data.currentUser.image.png;
    getinput.append(img);
    const inp = document.createElement("input");
    inp.setAttribute("type", "text");
    inp.setAttribute("placeholder", (is_reply) ? "Add a reply" : "Add a comment")
    getinput.append(inp);
    const submit = document.createElement("div");
    submit.classList.add("submit");
    submit.innerHTML = (is_reply) ? "REPLY" : "SEND";
    submit.addEventListener("click", processInput);
    getinput.append(submit);

    // Add some properties to the element we can read when he has entered the text
    getinput.ICSis_reply = is_reply;
    getinput.ICSis_edit = is_edit;
    getinput.ICSparent = parent;
    getinput.ICSreplying_to_id=replying_to_id;
    getinput.ICSreplying_to_user=replying_to_user;

    return getinput;
}

function getHighestId() {
    highestID = 0;
    data.comments.forEach(c => {
        highestID = Math.max(highestID, c.id);
        c.replies.forEach(r => {
            highestID = Math.max(highestID, r.id);
        })
    })
    return highestID;
}

function btnEdit() {}

function btnReply(e) {
    //  console.log(e.originalTarget.parentElement.parentElement);
    const newReply = createInput(true,  false,  e.originalTarget.parentElement.parentElement,  e.originalTarget.parentElement.parentElement.replying_to_id,e.originalTarget.parentElement.parentElement.replying_to_user);
    debugger
    e.originalTarget.parentElement.parentElement.after(newReply);

}

function btnDelete() {}

function processInput(e) {
    // Called when he finishes writing text in an input box
    function saveAndRefreshUI() {
        
        localStorage.setItem('ICSdata', JSON.stringify(data));
        createHTMLElements();
    }

    const is_reply = e.srcElement.parentElement.ICSis_reply;
    const is_edit = e.srcElement.parentElement.ICSis_edit;
    const ICSparent = e.srcElement.parentElement.ICSparent;
    const input = e.srcElement.parentElement.children[1].value;
    const highestID = getHighestId();
        const d = new Date();

    if (!input) return; // no words 

    // Add brand new comment
    if (!(is_edit || is_reply || ICSparent)) {
    
        const newComment = {
            id: highestID + 1,
            content: input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // weak attempt at sanitization
            createdAt: d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear(),
            score: 0,
            user: data.currentUser,
            replies: []
        }
        data.comments.push(newComment);
        saveAndRefreshUI(newComment);

    }
    debugger
    // Add new Reply
    if ((!is_edit) && (is_reply) && ICSparent ){
        const newReply = {
            id: highestID + 1,
            content: input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // weak attempt at sanitization
            createdAt: d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear(),
            score: 0,
            user: data.currentUser,
}
console.log(newReply)
    }


}



const createHTMLElements = () => {

    comments.innerHTML = ""; // deletes all 

    data.comments.forEach(c => {
        const newElement = createElement(false, null, null, c.id, c.content, c.createdAt, c.score, c.user.image.png, c.user.username, (c.username == data.currentUser.username));
        newElement.style.transform = "scaleY(0)";
        comments.append(newElement);
        c.replies.forEach(r => {
            const newReply = createElement(true, c.id, c.user.username,  r.id, r.content, r.createdAt, r.score, r.user.image.png, r.user.username, (r.user.username == data.currentUser.username))


            comments.append(newReply);
        })
    });
    const c = document.querySelectorAll(".comment");
    for (let i = 0; i < c.length; i++) {





    }



    const newReply = createInput(false, false, false);
    comments.append(newReply);




}



// Initialise by loading data, which calls createHTMLElements asynchronously

loadData()