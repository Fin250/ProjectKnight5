// Adding event handlers for select student dropdown list
document.getElementById("examClass").addEventListener('change', function(e){
    // Getting the active student name from select list
    var selectClass = document.getElementById('examClass');
    var classId = selectClass.options[ selectClass.selectedIndex ].id;
    // After student select always shaw first exam index. Index count from 0
    findExams(classId, 0);
    }
);

// Adding event handlers for select exam dropdown list
document.getElementById("examTitle").addEventListener('change', function(e){
    // Getting the active student name from select list
    var selectClass = document.getElementById('examClass');
    var exam = document.getElementById('examTitle');
    var examListIndex = exam.selectedIndex;
    console.log(" Current index of exam"+ examListIndex);
    var classId = selectClass.options[ selectClass.selectedIndex ].id;
    // On first html page load list index -1
    if (examListIndex == -1) {examListIndex = 0;}
    findExams(classId, examListIndex);
    }
);

// "Edit Exam"  Button
document.getElementById("btnEditExam").addEventListener('click', function(e){
  // Getting data from the screen and putting them into variables
  var selectClass = document.getElementById('examClass');
  var classId = String(selectClass.options[ selectClass.selectedIndex ].id);
  var exam = document.getElementById('examTitle');
  var examId = String(exam.options[ exam.selectedIndex ].id);
  var examName = String(document.getElementById('examName').value);
  var mark = String(document.getElementById("examTotalMarks").value);
  var weight = String(document.getElementById("examWeight").value);
  var setDate = document.getElementById('examSetDate').value;
  var dueDate = document.getElementById('examDueDate').value;

  // Check field's not empty
  
  if (examName === "") { alert("Please enter exam title!"); return false; }
  if (mark === "") { alert("Please enter exam total marks!"); return false; }
  if (weight === "") { alert("Please enter exam weight!"); return false; }
  if (setDate === "") { alert("Please enter exam set date!"); return false; }
  if (dueDate === "") { alert("Please enter exam due date!"); return false; }
  putRequest("https://2223-software-engineering.fsweet.repl.co/editexams/" + classId, examId, examName, mark, weight, setDate, dueDate);

});


// "Delete Exam"  Button
document.getElementById("btnDeleteExam").addEventListener('click', function(e){
  // Getting data from the screen and putting them into variables
  var selectClass = document.getElementById('examClass');
  var classId = String(selectClass.options[ selectClass.selectedIndex ].id);
  var exam = document.getElementById('examTitle');
  var examId = String(exam.options[ exam.selectedIndex ].id);
    
  deleteRequest('https://2223-software-engineering.fsweet.repl.co/delete_exam/?examid='+ examId);
});


// Front-end function to update exam data in the Back-End via PUT request.
function putRequest(expUrl,examId,examName,mark,weight, setDate, dueDate){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", expUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"examid": examId,"examname": examName,"mark": mark,"weight": weight, "setdate": setDate, "duedate": dueDate}));
    xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            alert(" Exam details updated successfully.")
            window.location.reload();
        }
        //  If failed, find out the error status code
          else {
            alert("Error " + xhr.status);
            }
    };
}

// Function to delete exam in the Back-End via DELETE request.
function deleteRequest(expUrl){
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", expUrl, true);
    xhr.send();
    xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Exam deleted successfully.");
            // Reload page
            window.location.reload(true);
        }
        //  If failed, find out the error status code
        else {
                alert("Error " + xhr.status);
              }
        };
}

// Function to request student exam list
function findExams(classId, examIndex){
    var xhr = new XMLHttpRequest();
    xhr.open ("GET", "https://2223-software-engineering.fsweet.repl.co/editexams/" + classId, true);
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

//  Function to fill exam select drop down list by student ID
// from Python receive array (0, Exam id, 1 - Exam name, 2- Exame mark, 3 -Total marks, 4- Exam weight
// 5- exam date set, 6 - exam date due)
function renderExams(objExamList, examListIndex) {
    // remove previous exame exam_list
    document.getElementById('examTitle').innerText = null;
    // Clear mark and Feedback field's
    document.getElementById("examTotalMarks").setAttribute("value","");
    document.getElementById("examWeight").setAttribute("value","");
    document.getElementById("examSetDate").setAttribute("value","");
    document.getElementById("examDueDate").setAttribute("value","");
  

    // Add options to exam dropdown list
    for ( var objExam in objExamList.data){
      var newOption = document.getElementById("examTitle");
      var option = document.createElement("option");
      option.id = objExamList.data[objExam][0];
      option.text = objExamList.data[objExam][1];
      newOption.add(option);
    }
      //  Set exam dropdown index, selected by user
      document.getElementById("examTitle").selectedIndex = examListIndex;
      // Set mark and feedback fields for exam by exam index
      document.getElementById("examName").setAttribute("value", objExamList.data[examListIndex][1]);
      document.getElementById("examTotalMarks").setAttribute("value", objExamList.data[examListIndex][2]);
      document.getElementById("examWeight").setAttribute("value", objExamList.data[examListIndex][3]);
      document.getElementById("examSetDate").setAttribute("value", objExamList.data[examListIndex][4]);
      document.getElementById("examDueDate").setAttribute("value", objExamList.data[examListIndex][5]);

}