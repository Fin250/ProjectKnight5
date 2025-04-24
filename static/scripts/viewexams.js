console.log("viewexams.js");

// TODO: Clear table after changing CLASS

// Adding event handlers for select class dropdown list
document.getElementById("classViewExams").addEventListener('change', function(e){
    // Getting the active student name from select list
    var studentClass = document.getElementById('classViewExams');
    var selectedClassId = String(studentClass.options[ studentClass.selectedIndex ].id);
    showClassTable(selectedClassId);
    }
);

// Function to request student details and exam marks VIA class id
function showClassTable(classId){
    var xhr = new XMLHttpRequest();
    // Creating appropriate link for Python
    var url = 'https://2223-software-engineering.fsweet.repl.co/exam_table/?classid='+ classId;
    xhr.open ("GET", url, true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var objClassExams = JSON.parse(xhr.responseText);
            renderClassTable(objClassExams);
                      }
        else {
            alert("Error " + xhr.status);
            }
    };
    xhr.send();
}

//  Function to fill exam select drop down list by student ID
// from Python receive array (0, Exam name, 1 - Total marks, 2- Exam weight)
function renderClassTable(objExamList) {
  var table = document.getElementById ("tblClassTable");
    // Remove previous table content
    while (table.rows.length > 1)
    {
        table.deleteRow(1);
    }

    // Add values to class table marks
    for ( var objExam in objExamList.data){
      // Insert row at end of table. Create html string to put on page
      var row = table.insertRow(-1);
      var cellName = row.insertCell(0);
      var cellMarks = row.insertCell(1);
      var cellWeight = row.insertCell(2);

      //set string in page using .innerHTML()

      cellName.innerHTML = objExamList.data[objExam][0];
      cellMarks.innerHTML = objExamList.data[objExam][1];
      cellWeight.innerHTML = objExamList.data[objExam][2] + '%';
    }
}