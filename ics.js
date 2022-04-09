let data;
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
            createHTMLElements();
        } catch (error) {
            console.log(error);
        }
    } else {
        createHTMLElements();
    }
};





function saveAndRefreshUI() {

    localStorage.setItem('ICSdata', JSON.stringify(data));
    createHTMLElements();
}

function processInput(e) {
    const DOMgetinput = e.originalTarget.parentElement;
    const elemData = DOMgetinput.elemData;
    // Make a weak attempt at sanitiizing the text TODO make more secure
    const newText = DOMgetinput.children[1].value.replace(/[^a-z0-9/?/!/'/"ßáéíóúñü \.,_-]/gim,"");





    if (!newText) { // No text entered - refreshUI and exit
        createHTMLElements();
        return
    }

    if ((!elemData.is_reply) && (!elemData.is_edit)) { // New comment (not a reply)
        const newComment = {
            "id": getHighestId() + 1,
            "content": newText,
            "createdAt": "Today",
            "score": 0,
            "user": Object.assign(data.currentUser),
            "replies": []
        };

        data.comments.push(newComment);
        saveAndRefreshUI();
        return;
    }

    if (elemData.is_edit) { // Editing current posting
        const thisComment = data.comments.findIndex(x => x.id == elemData.comment_id);

        if (elemData.reply_id) {
            const thisReply = data.comments[thisComment].replies.findIndex(x => x.id === elemData.reply_id);
            data.comments[thisComment].replies[thisReply].content = newText;
        } else {
            data.comments[thisComment].content = newText;
        }
        saveAndRefreshUI();
        return;
    }
}








function getNewInput(elemData) {


    const getinput = document.createElement("div");
    getinput.classList.add("getinput");
    const img = new Image();
    img.src = data.currentUser.image.png;
    getinput.append(img);

    const inp = document.createElement("textarea");
    inp.setAttribute("type", "text");

    if (elemData.is_edit) {
        inp.innerHTML = elemData.content;
    } else {
        inp.setAttribute("placeholder", (elemData.is_reply) ? "Add a reply" : "Add a comment")
 }

if(elemData.is_reply && (!elemData.is_edit)){

    inp.innerHTML="@"+ elemData.author.username + "  ";
}

    getinput.append(inp);
    const submit = document.createElement("div");
    submit.classList.add("submit");
    submit.innerHTML = (elemData.is_edit) ? "SAVE" : (elemData.is_reply) ? "REPLY" : "SEND";

    submit.addEventListener("click", processInput);
    getinput.append(submit);
    getinput.elemData = Object.assign(elemData);

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

function btnEdit(e) {
    const DOMparent = e.originalTarget.parentElement.parentElement;
    elemData = DOMparent.elemData;
    elemData.is_edit = true;
    const newInput = getNewInput(elemData);
    DOMparent.after(newInput);

}

function btnReply(e) {
    const DOMparent = e.originalTarget.parentElement.parentElement;
    elemData = DOMparent.elemData;
    const newInput = getNewInput(elemData);
    DOMparent.after(newInput);
   const ta= newInput.querySelector("textarea");
   const v=ta.innerHTML;
   ta.innerHTML="";
   ta.focus();
   ta.innerHTML=v;




}

function btnDelete() {}





function createElement(elemData) {

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
    if (elemData.is_reply) newElement.classList.add("reply")


    elAuthor.classList.add("author");
    img.src = elemData.author.image.png;
    img.setAttribute("alt", "Image of " + elemData.author.username);
    elAuthor.append(img);
    elAuthorName.classList.add("author-name");
    elAuthorName.innerHTML = elemData.author.username;
    elAuthor.append(elAuthorName);
    elAuthorDate.classList.add("author-date");
    elAuthorDate.innerHTML = elemData.createdAt;
    elAuthor.append(elAuthorDate);
    newElement.append(elAuthor)


    elButtons.classList.add("buttons");
    newElement.append(elButtons);
    if (elemData.IamAuthor) {
        elButtonDelete.classList.add("button-delete");
        elButtonDelete.innerHTML = " <img src='./images/icon-delete.svg' /> Delete";
        elButtonDelete.setAttribute("href", "#");
        elButtonDelete.setAttribute("onclick", "return false");
        elButtonDelete.addEventListener("click", btnDelete);
    }
    elButtonReplyEdit.classList.add((elemData.IamAuthor) ? "button-reply" : "button-edit");
    elButtonReplyEdit.innerHTML = (!elemData.IamAuthor) ? "<img src='./images/icon-reply.svg' /> Reply" : "<img src='./images/icon-edit.svg' /> Edit";
    elButtonReplyEdit.setAttribute("href", "#");
    elButtonReplyEdit.setAttribute("onclick", "return false");

    elButtonReplyEdit.addEventListener("click", (elemData.IamAuthor) ? btnEdit : btnReply);
    elButtons.append(elButtonDelete);
    elButtons.append(elButtonReplyEdit);

    elScoreboard.classList.add("scoreboard");
    newElement.append(elScoreboard);
    elScoreboard.append(elSc1);
    elScoreboard.append(elSc2);
    elScoreboard.append(elSc3);
    elSc1.innerHTML = "+";
    elSc2.innerHTML = elemData.score;
    elSc3.innerHTML = "-";
    elCommentText.classList.add("text");
    elCommentText.innerHTML = elemData.content;
    newElement.append(elCommentText)

    newElement.elemData = Object.assign(elemData);
    return newElement;




}


const createHTMLElements = () => {
    comments.innerHTML = ""; // deletes all 
    data.comments.forEach(c => {
        const elemData = {
            is_reply: false,
            is_edit: false,
            comment_id: c.id,
            reply_id: null,
            content: c.content,
            createdAt: c.createdAt,
            score: c.score,
            author: Object.assign(c.user),
            replyingToComment: null,
            replyingToUser: null,
            IamAuthor: (c.user.username === data.currentUser.username)
        }

        const newElement = createElement(elemData);
        comments.append(newElement);


        c.replies.forEach(r => {
            const elemData = {
                is_reply: true,
                reply_id: r.id,
                comment_id: c.id,
                content: r.content,
                createdAt: r.createdAt,
                score: r.score,
                author: Object.assign(r.user),
                replyingToComment: c.id,
                replyingToUser: r.replyingTo,
                IamAuthor: (r.user.username === data.currentUser.username)
            }
            const newReply = createElement(elemData)
            comments.append(newReply);
        })
    });


    // Add input box st bottom for new comments

    comments.append(
        getNewInput({
            is_reply: false,
            id: null,
            author: Object.assign(data.currentUser),
            replyingToComment: null,
            replyingToUser: null,
            IamAuthor: false
        })

    )







}



// Initialise by loading data, which calls createHTMLElements asynchronously

loadData()