/**
 * Application of Principles of Programming
 * Assignment Template 2021 - Javascript
 * @author Tim Orman
 */
console.log("hello from external app.js");

var quoteList = {};
/**
 * event handlers can go here
 */

document.getElementById("listQuotes").addEventListener('click', populateQuotes);

document.getElementById("btnDeleteQuote").addEventListener('click', deleteQuote);
document.getElementById("btnAddQuote").addEventListener('click', addQuote);

document.getElementById("btnSaveChanges").addEventListener('click', uploadQuotes);

document.getElementById("btnRandomQuote").addEventListener('click', randomQuote);

// initialise journal list
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling getQuoteList")
    getQuoteList();
});

//utility functions - DO NOT EDIT OR DELETE
function getUniqueKey(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

/**
 * Journal Stuff
 */


let counter = 0;

/**
 * getJournalEntries() - Get list of journal entries
 *
 * Write a function that will
 * * retrieve the JSON file of journal entries
 * * format the entries into a single string with appropriate html tags
 * * set the content of the "listEntries" element to the formatted string
 */
function getQuoteList(){
  console.log("getting quote list");
  let list = document.getElementById("listQuotes");
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    let response = "";
    if (this.readyState == 4 && this.status == 200) {
      response = JSON.parse(this.responseText).quotes;
      let htmlString = "";
      let counter = 0;
      for (item of response) {
        counter++;
        htmlString += "<li id='item"+counter+"' data-date='"+item.date+"' data-author='"+item.author+"' data-quote='"+item.quote+"'><i>"+item.date+"</i><strong> "+item.author+"</strong> "+item.quote+"</li>";
      }
      console.log("sending: "+counter);
      quoteList.size = counter;
      list.innerHTML = htmlString;
    }
    else if (this.readyState == 4 && this.status != 200) {
      response = "Error: "+this.statusText;
      alert(response);
     }
  }
  request.open("GET", "/api/quotes", true);
  request.send();
  
}
/**
 * Dont forget to call the function that will retrieve the list entries when the page loads
 */

/**
 * clearQuote()
 *
 * Write a function that will
 * * clear the selected entry inputs
 *
 */
function clearQuote(){
  document.getElementById("idEntry").value = ""
  document.getElementById("dateEntry").value = ""
  document.getElementById("authorEntry").value = ""
  document.getElementById("quoteEntry").value = ""
    
}

/**
 * populateQuotes(item)
 *
 * Write a function that will
 * * get the data for a single journal entry from item parameter
 * * extract the individual pieces of data from the entry
 * * and put each piece of information into the text fields on the html page
 * @param item
 */
function populateQuotes(e){
    //clear old entry
    clearQuote();

    let id = e.target.id;
    let element = document.getElementById(id);
  
    let date = element.getAttribute("data-date");
    let author = element.getAttribute("data-author");
    let quote = element.getAttribute("data-quote");
    
    document.getElementById("idEntry").value = id;
    document.getElementById("dateEntry").value = date;
    document.getElementById("authorEntry").value = author;
    document.getElementById("quoteEntry").value = quote;
}

/**
 * addQuote() - add a journal entry
 *
 * Write a function that will
 * * create a new node list item element
 * * create a new text node element for the new list item and attach it to the new list item
 * * set other values of the list item - date, class, id, notes, student
 * * append the new node to the list of entries
 */
function addQuote(){
  console.log("Add quote")
  let uid = getUniqueKey();
  let rawDate = new Date();
  let date = rawDate.getFullYear()+"-"+(rawDate.getMonth()+1)+"-"+rawDate.getDate();
  let author = document.getElementById("authorAdd").value;
  let quote = document.getElementById("quoteAdd").value;
  let htmlString = "<li id='item"+uid+"' data-date='"+date+"' data-author='"+author+"' data-quote='"+quote+"'><i>"+date+"</i><strong> "+author+"</strong> "+quote+"</li>";
  let list = document.getElementById("listQuotes");
  list.innerHTML = list.innerHTML + htmlString;
  
  document.getElementById("authorAdd").value = "";
  document.getElementById("quoteAdd").value = "";
}

/**
 * deleteQuote()
 *
 * Write a function that will
 * * delete a journal entry (list item) from the html page
 */
function deleteQuote(){
  console.log("Delete entry")
  let id = document.getElementById("idEntry").value;
  document.getElementById(id).remove();
  clearQuote();
}

/**
 * uploadQuotes()
 *
 * Write a function that will
 * * get the data from the list entries on the html page
 * * put the entries from the list into a collection
 * * convert the collection into a JSON object
 * * send JSON object to the url in the flask api
 * * and handle the response
 */
function uploadQuotes(){
  console.log("Uploading quotes");
  let list = document.getElementById("listQuotes");
  let items = list.getElementsByTagName("li");
  let jsonObject = {
    quotes: []
      }
  for (item of items) {
    let date = item.getAttribute("data-date");
    let author = item.getAttribute("data-author");
    let quote = item.getAttribute("data-quote");

    let obj = {
      date: date,
      author: author,
      quote: quote
    }
    jsonObject.quotes.push(obj);
  }
  
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    let response = "";
    if (this.readyState == 4 && this.status == 200) {
      alert("Successful");
    }
    else if (this.readyState == 4 && this.status != 200) {
      response = "Error: "+this.statusText;
      alert(response);
     }
  }
  request.open("PUT", "/api/quotes", true);
  request.setRequestHeader("Content-Type","application/json")
  request.send(JSON.stringify(jsonObject));
}


  
function randomQuote(listSize){
  console.log("Randomising quotes");
  //clear old entry

  document.getElementById("randomID").value = "";
  document.getElementById("randomDate").value = "";
  document.getElementById("randomAuthor").value = "";
  document.getElementById("randomQuote").value = "";
  
  console.log("did i make it? "+quoteList.size);
  ranID = Math.floor(Math.random() * quoteList.size)+1;
  console.log(ranID);
  let id = "item"+ranID.toString();
  let element = document.getElementById(id);
  
  let date = element.getAttribute("data-date");
  let author = element.getAttribute("data-author");
  let quote = element.getAttribute("data-quote");
    
  document.getElementById("randomID").value = id;
  document.getElementById("randomDate").value = date;
  document.getElementById("randomAuthor").value = author;
  document.getElementById("randomQuote").value = quote;
  
  
}



  
