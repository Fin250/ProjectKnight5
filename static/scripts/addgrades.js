console.log("addgrades.js");

// Adding event handlers for select student dropdown list
document.getElementById("studentAddGrades").addEventListener('change', function(e){
    // Getting the active student name from select list
    var student = document.getElementById('studentAddGrades');
    var exam = document.getElementById('examAddGrades');
    var selectedStudentId = student.options[ student.selectedIndex ].id;
    // After student select always shaw first exam index. Index count from 0
    findExams(selectedStudentId, 0);
    }
);

// "Add Grade"  Button
document.getElementById("btnAddGrade").addEventListener('click', function(e){
  // Getting data from the screen and putting them into variables
  var student = document.getElementById('studentAddGrades');
  var studentId = String(student.options[ student.selectedIndex ].id);
  var exam = document.getElementById('examAddGrades');
  var examId = String(exam.options[ exam.selectedIndex ].id);
  var mark = String(document.getElementById("inputMark").value);
  var feedback = String(document.getElementById("inputFeedback").value);

  // Check mark or Feedback field not empty

  if (mark === "") { alert("Please enter exam mark!"); return false; }
  if (feedback === "") { alert("Please enter exam feedback!"); return false; }
  postRequest("https://2223-software-engineering.fsweet.repl.co/addgrades/"+studentId + "/",examId,mark,feedback);

});

// Function to request student exam list
function findExams(studentId, examIndex){
    var xhr = new XMLHttpRequest();
    xhr.open ("GET", 'https://2223-software-engineering.fsweet.repl.co/addgrades/' + studentId + "/", true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var objExams = JSON.parse(xhr.responseText);
            renderExams(objExams, examIndex);
          }
        else {
            alert("Error " + xhr.status);
            }
    };
    xhr.send();
}

// Front-end function to add new data in the Back-End via POST request.
function postRequest(expUrl,examId,mark,feedback){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", expUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"examid": examId,"mark": mark,"feedback": feedback}));
    xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.reload(true);
        }
        //  If failed, find out the error status code
        else if (xhr.status == 304){
                alert("Mark for this exam alredy entered.");
                //console.log('Error 304');
              }
              else {
            alert("Error " + xhr.status);
            }
    };
}

//  Function to fill exam select drop down list by student ID
// from Python receive array (0, Exam id, 1 - Exam name, 2- Exame mark, 3 -Exame feedback)
function renderExams(objExamList, examListIndex) {
    // remove previous exame exam_list
    document.getElementById('examAddGrades').innerText = null;

    // Add options to exam dropdown list
    for ( var objExam in objExamList.data){
      var newOption = document.getElementById("examAddGrades");
      var option = document.createElement("option");
      option.id = objExamList.data[objExam][0];
      option.text = objExamList.data[objExam][1];
      newOption.add(option);
    }
      //  Set exam dropdown index, selected by user
      document.getElementById("examAddGrades").selectedIndex = examListIndex;

}