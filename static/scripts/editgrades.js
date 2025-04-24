console.log("editgrades.js");

// Adding event handlers for select student dropdown list
document.getElementById("studentEditGrades").addEventListener('change', function(e){
    // Getting the active student name from select list
    var student = document.getElementById('studentEditGrades');
    var exam = document.getElementById('examEditGrades');
    var selectedStudentId = student.options[ student.selectedIndex ].id;
    // After student select always shaw first exam index. Index count from 0
    findExams(selectedStudentId, 0);
    }
);

// Adding event handlers for select exam dropdown list
document.getElementById("examEditGrades").addEventListener('change', function(e){
    // Getting the active student name from select list
    var exam = document.getElementById('examEditGrades');
    var student = document.getElementById('studentEditGrades');
    var examListIndex = exam.selectedIndex;
    var selectedStudentId = student.options[ student.selectedIndex ].id;
    // On first html page load list index -1
    if (examListIndex == -1) {examListIndex = 0;}
    findExams(selectedStudentId, examListIndex);
    }
);

// Adding event handlers for "Update" button
document.getElementById("btnUpdateGrade").addEventListener('click', function(e){
    // Getting the active student name from select list
    var student = document.getElementById('studentEditGrades');
    var studentId = String(student.options[ student.selectedIndex ].id);
    var exam = document.getElementById('examEditGrades');
    var examId = String(exam.options[ exam.selectedIndex ].id);
    var mark = String(document.getElementById('updatedMark').value);
    var feedback = String(document.getElementById('updateFeedback').value);

    // Check mark or Feedback field not empty

    if (mark === "") { alert("Please enter exam mark!"); return false; }
    if (feedback === "") { alert("Please enter exam feedback!"); return false; }
    putRequest("https://2223-software-engineering.fsweet.repl.co/editgrades/"+ studentId + "/",examId, mark, feedback);
    }
);

// Adding event handlers for "Delete" button
document.getElementById("btnDeleteGrade").addEventListener('click', function(e){
    // Getting the active student name from select list
    var student = document.getElementById('studentEditGrades');
    var studentId = String(student.options[ student.selectedIndex ].id);
    var exam = document.getElementById('examEditGrades');
    var examId = String(exam.options[ exam.selectedIndex ].id);
    alert("Delete Button Has Been Pressed Successfully!");
    deleteRequest('https://2223-software-engineering.fsweet.repl.co/editgrades/?studentid='+ studentId + '&examid='+ examId);
    }
);

// Function to request student exam list
function findExams(studentId, examIndex){
    var xhr = new XMLHttpRequest();
    xhr.open ("GET", "https://2223-software-engineering.fsweet.repl.co/editgrades/" + studentId + "/", true);
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

// Function to update student exam mark and feedback
function putRequest(expUrl,examId,mark,feedback){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", expUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"examid": examId,"mark": mark,"feedback": feedback}));
    xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Grade updated successfully.");
            // Reload page
            window.location.reload(true);
        }
        //  If failed, find out the error status code
        else {
                alert("Error " + xhr.status);
              }
        };
}

// Function to update student exam mark and feedback
function deleteRequest(expUrl){
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", expUrl, true);
    xhr.send();
    xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Grade deleted successfully.");
            // Reload page
            window.location.reload(true);
        }
        //  If failed, find out the error status code
        else {
                alert("Error " + xhr.status);
              }
        };
}

//  Function to fill exam select drop down list by student ID
// from Python receive array (0, Exam id, 1 - Exam name, 2- Exame mark, 3 -Exame feedback)
function renderExams(objExamList, examListIndex) {
    // remove previous exame exam_list
    document.getElementById('examEditGrades').innerText = null;
    // Clear mark and Feedback field's
    document.getElementById("updatedMark").setAttribute("value","");
    document.getElementById("updateFeedback").innerHTML = "";

    // Add options to exam dropdown list
    for ( var objExam in objExamList.data){
      var newOption = document.getElementById("examEditGrades");
      var option = document.createElement("option");
      option.id = objExamList.data[objExam][0];
      option.text = objExamList.data[objExam][1];
      newOption.add(option);
    }
      //  Set exam dropdown index, selected by user
      document.getElementById("examEditGrades").selectedIndex = examListIndex;
      // Set mark and feedback fields for exam by exam index
      document.getElementById("updatedMark").setAttribute("value", objExamList.data[examListIndex][2]);
      document.getElementById("updateFeedback").innerHTML = objExamList.data[examListIndex][3];

}