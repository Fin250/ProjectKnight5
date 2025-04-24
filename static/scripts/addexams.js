console.log("addexams.js");

// "Add Exam"  Button
document.getElementById("btnAddExam").addEventListener('click', function(e){
  // Getting data from the screen and putting them into variables
  var selectClass = document.getElementById('examClass');
  var classId = String(selectClass.options[ selectClass.selectedIndex ].id);
  var examName = String(document.getElementById('examTitle').value);
  var mark = String(document.getElementById("examTotalMarks").value);
  var weight = String(document.getElementById("examWeight").value);
  var setDate = document.getElementById('examSetDate').value;
  var dueDate = document.getElementById('examDueDate').value;

  // Check mark or Feedback field not empty

  if (mark === "") { alert("Please enter exam total marks!"); return false; }
  if (weight === "") { alert("Please enter exam weight!"); return false; }
  if (setDate === "") { alert("Please enter exam set date!"); return false; }
  if (dueDate === "") { alert("Please enter exam due date!"); return false; }
  postRequest("https://2223-software-engineering.fsweet.repl.co/addexams/",classId,examName,mark,weight, setDate, dueDate);

});

// Front-end function to add new exam data in the Back-End via POST request.
function postRequest(expUrl,classId,examName,mark,weight, setDate, dueDate){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", expUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"classid": classId,"examname": examName,"mark": mark,"weight": weight, "setdate": setDate, "duedate": dueDate}));
    xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.reload(true);
        }
        //  If failed, find out the error status code
          else {
            alert("Error " + xhr.status);
            }
    };
}
