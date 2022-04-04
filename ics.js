// Data will be stored in this
let data;
const comments = document.querySelector(".comments");
const url = "./data.json";
let jdata;
const initialise = async () => {
    // Read data from local storage
    data = JSON.parse(localStorage.getItem('ICSdata'));
    if (!data) { // if nothing in local storage

        try {
            const jdata = await fetch(url);
            data = await jdata.json();
            localStorage.setItem('ICSdata', JSON.stringify(data));
            createHTMLElements();

        } catch (error) {
            console.log(error);
        }

    } else createHTMLElements();

};

const createHTMLElements = () => {

    function createElement(is_reply, id, content, createdAt, score, userimage, username, ImAuthor) {
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
        elButtonReplyEdit.addEventListener("click", (!ImAuthor) ? btnEdit : btnReply);
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

        return newElement;

    }


    function createInput(is_reply, is_edit,  parent) {
        const getinput=document.createElement("div");
        getinput.classList.add("getinput");
        const img=new Image();
        img.src=data.currentUser.image.png;
        getinput.append(img);
        const inp=document.createElement("input");
        inp.setAttribute("type","text");
        inp.setAttribute("placeholder", (is_reply) ? "Add a reply" : "Add a comment")
 getinput.append(inp);
 const submit=document.createElement("div");
 submit.classList.add("submit");
 submit.innerHTML=(is_reply) ? "REPLY" : "SEND";
 submit.addEventListener("click",processInput);
 getinput.append(submit);

 getinput.ICSis_reply=is_reply;
 getinput.ICSis_edit=is_edit;
 getinput.ICSparent=parent;

 return getinput;
    }

function getHighestId(){
    highestID=0;
    data.comments.forEach(c=>{
        highestID=Math.max(highestID,c.id);
        c.replies.forEach(r=>{
            highestID=Math.max(highestID, r.id);
        })
    })
    return highestID;
}

    function btnEdit() {}

    function btnReply() {}

    function btnDelete() {}

    function processInput(e){
const is_reply=e.srcElement.parentElement.ICSis_reply;
const is_edit=e.srcElement.parentElement.ICSis_edit;
const ICSparent=e.srcElement.parentElement.ICSparent;
const input=e.srcElement.parentElement.children[1].value;

if(!input) return;

// Add brand new comment
if (!( is_edit||is_reply||ICSparent)){
const highestID=getHighestId();
const d = new Date();
const newComment={
id:highestID+1,
content:input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
createdAt:d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear(),
score:0,
user:data.currentUser,
replies:[]
}
data.comments.push(newComment);

}


    }



    //console.log(data);
    function showComments(){

    comments.innerHTML="";
    data.comments.forEach(c => {
        const newElement = createElement(false, c.id, c.content, c.createdAt, c.score, c.user.image.png, c.user.username, (c.username == data.currentUser.username));
        comments.append(newElement);
        c.replies.forEach(r => {
            const newReply = createElement(true, r.id, r.content, r.createdAt, r.score, r.user.image.png, r.user.username, (r.user.username == data.currentUser.username))
  comments.append(newReply);
        })
    });
    const newReply=createInput(false, false, false);
comments.append(newReply);
    }

initialise();

}