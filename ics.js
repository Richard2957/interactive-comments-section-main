


// Data will be stored in this
let data;

const url = "./data.json";
let jdata;
const initialise = async () => {
    // Read data from local storage
    data = JSON.parse(localStorage.getItem('ICSdata'));
if(!data) { // if nothing in local storage

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

const createHTMLElements = ()=>{

    console.log(data);
}