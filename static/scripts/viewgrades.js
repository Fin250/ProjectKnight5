console.log("viewgrades.js");

// TODO: Clear table after changing CLASS

// Adding event handlers for select class dropdown list
document.getElementById("classViewGrades").addEventListener('change', function(e){
    // Getting the active student name from select list
    var studentClass = document.getElementById('classViewGrades');
    var exam = document.getElementById('examViewGrades');
    var selectedClassId = String(studentClass.options[ studentClass.selectedIndex ].id);
    // After class select always show first exam index. Index count from 0
    findExams(selectedClassId, 0);
    }
);

// Adding event handlers for select exam dropdown list
document.getElementById("examViewGrades").addEventListener('change', function(e){
    // Getting the active student name from select list
    var exam = document.getElementById('examViewGrades');
    var studentClass = document.getElementById('classViewGrades');
    var examId = exam.options[ exam.selectedIndex ].id;
    var selectedClassId = studentClass.options[ studentClass.selectedIndex ].id;
    showClassTable(selectedClassId, examId);
    }
);

// Function to request exam list by class Id
function findExams(classId, examIndex){
    var xhr = new XMLHttpRequest();
    xhr.open ("GET", "/viewgrades/" + classId + "/", true);
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

// Function to request student details and exam marks VIA class id and exam id
function showClassTable(classId, examId){
    var xhr = new XMLHttpRequest();
    // Creating appropriate link for Python
    var url = 'https://2223-software-engineering.fsweet.repl.co/class_table/?classid='+ classId + '&examid='+ examId;
    //var url = '/api/class_table?classid=' + classId + '&examid='+ examId;
    xhr.open ("GET", url, true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var objStudentsGrades = JSON.parse(xhr.responseText);
            renderClassTable(objStudentsGrades);
                      }
        else {
            alert("Error " + xhr.status);
            }
    };
    xhr.send();
}

//  Function to fill exam select drop down list by student ID
// from Python receive array (0, Exam id, 1 - Exam name, 2- Exame mark )
function renderExams(objExamList, examListIndex) {
    // Remove previous exame exam_list
    document.getElementById('examViewGrades').innerText = null;
    // Add first element to exams list
    var examList = document.getElementById("examViewGrades");
    var value = document.createElement("option");
    value.id = "null";
    value.text = "...";
    examList.add(value);

    // Add options to exam dropdown list
    for ( var objExam in objExamList.data){
      var newOption = document.getElementById("examViewGrades");
      var option = document.createElement("option");
      option.id = objExamList.data[objExam][0];
      option.text = objExamList.data[objExam][1];
      newOption.add(option);
    }
      //  Set exam dropdown index, selected by user
      document.getElementById("examViewGrades").selectedIndex = examListIndex;
  }

  //  Function to fill exam select drop down list by student ID
// from Python receive array (0, Student name, 1 - Student surname, 2- Exame mark)
function renderClassTable(objStudentList) {
  var table = document.getElementById ("tblClassTable");
    // Remove previous table content
    while (table.rows.length > 1)
    {
        table.deleteRow(1);
    }

    // Add values to class table marks
    for ( var objStudent in objStudentList.data){
      // Insert row at end of table. Create html string to put on page
      var row = table.insertRow(-1);
      var cellName = row.insertCell(0);
      var cellSurname = row.insertCell(1);
      var cellMark = row.insertCell(2);

      //set string in page using .innerHTML()

      cellName.innerHTML = objStudentList.data[objStudent][0];
      cellSurname.innerHTML = objStudentList.data[objStudent][1];
      cellMark.innerHTML = objStudentList.data[objStudent][2];
    }
}