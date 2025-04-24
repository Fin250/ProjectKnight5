from flask import (
    Flask,
    render_template,
    request,
    session,
    redirect,
    url_for,
    g,
    flash,
    jsonify,
)
import sqlite3

# Flask initialisation + secret key
app = Flask(__name__)
app.secret_key = "FTzC$V*gm7Xfk8&hn9POXwnV:O9@M"

# Database connection setup
def get_db_connection():
    conn = sqlite3.connect("grades.db")
    return conn
  
# Session user object creation
@app.before_request
def before_request():
    g.user = None
    if "user" in session:
        user = [x for x in users if x.id == session["user"]][0]
        g.user = user

# User class
class User:
    def __init__(self, id, username, password, fullname):
        self.id = id
        self.username = username
        self.password = password
        self.fullname = fullname

    def __repr__(self):
        return f"<User: {self.username}>"

# Teacher credentials from database
conn = get_db_connection()
cur = conn.cursor()
cur.execute("SELECT email,password,firstname,surname FROM teacher;")
row = cur.fetchone()

# User list
users = []
i = 1
while row is not None:
    # appends teacher's credentials to user list
    users.append(User(id=i, username=row[0], password=row[1], fullname=row[2] + " " + row[3]))
    row = cur.fetchone()
    i += 1

# Index/login page
@app.route("/", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        try:
            user = [x for x in users if x.username == username][0]
            if user and user.password == password:
                session["user"] = user.id
                return redirect(url_for("teacherpanel"))
            flash(f"You entered an invalid password.", "exitmsg")
            return redirect(url_for("login"))
        except IndexError:
            flash(f"You entered an invalid email.", "exitmsg")
            return redirect(url_for("login"))
    else:
        if "user" in session:
            return redirect(url_for("teacherpanel"))
        return render_template("login.html")

#Logout page
@app.route("/logout")
def logout():
    if "user" in session:
        user = g.user.username
        flash(f"You have successfully logged out, {user}", "exitmsg")
    session.pop("user", None)
    return redirect(url_for("login"))

#Teacher panel page
@app.route("/teacherpanel/")
def teacherpanel():
    if not g.user:
        return redirect(url_for("login"))
    else:
        return render_template("/teacherpanel.html")

#Add exam page
@app.route("/addexams/")
def addexams():
    if not g.user:
        return redirect(url_for("login"))
    else:
        class_list = get_columns_values("classid", "classname", "class")
        return render_template("/addexams.html", classes=class_list)

#Edit exam page
@app.route("/editexams/")
def editexams():
    if not g.user:
        return redirect(url_for("login"))
    else:
        class_list = get_columns_values("classid", "classname", "class")
        return render_template("/editexams.html", classes=class_list)


@app.route("/addgrades/")
def addgrades():
    if not g.user:
        return redirect(url_for("login"))
    else:
        # Sending student list to HTML + Render
        students_list = read_record_list("studentid", "student")
        return render_template("/addgrades.html", students=students_list)


@app.route("/editgrades/")
def editgrades():
    if not g.user:
        return redirect(url_for("login"))
    else:
        students_list = read_record_list("studentid", "student")
        return render_template("/editgrades.html", students=students_list)


@app.route("/viewgrades/")
def viewgrades():
    if not g.user:
        return redirect(url_for("login"))
    else:
        class_list = get_columns_values("classid", "classname", "class")
        return render_template("/viewgrades.html", classes=class_list)


@app.route("/viewexams/")
def viewexams():
    if not g.user:
        return redirect(url_for("login"))
    else:
        class_list = get_columns_values("classid", "classname", "class")
        return render_template("/viewexams.html", classes=class_list)


# Insert to database new grade information
@app.route("/addgrades/<student_id>/", methods=["GET", "POST"])
def insert_grade(student_id):
    # Return exam list for selected student by student id on GET request
    if request.method == "GET":
        studentexam_dict = {"data": ""}
        exam_list = []
        exam_list = get_all_student_exams(student_id)
        if len(exam_list) > 0:
            studentexam_dict.update({"data": exam_list})
            return jsonify(studentexam_dict)
        else:
            return jsonify(" Student don't have exams ")

    if request.method == "POST":
        conn = get_db_connection()
        cur = conn.cursor()
        exam_data = request.get_json()

        # Database writing error handling
        try:
            cur.execute(
                f"INSERT INTO grade VALUES ('{student_id}', '{exam_data['examid']}', '{exam_data['mark']}', '{exam_data['feedback']}');"
            )
            conn.commit()
            cur.close()
        except:
            # 304 - response code, when grade of exam already exists
            return " data write skipped", 304
        return redirect(url_for("addgrades"))


@app.route("/editgrades/<student_id>/", methods=["GET", "PUT"])
def student_exams(student_id):
    # Return exam list for selected student by student id on GET request
    if request.method == "GET":
        studentexam_dict = {"data": ""}
        exam_list = []
        exam_list = get_student_exams(student_id)
        if len(exam_list) > 0:
            studentexam_dict.update({"data": exam_list})
            return jsonify(studentexam_dict)
        else:
            return jsonify(" Student don't have exams ")

    # Update Exam grade and feedback on PUT request
    if request.method == "PUT":
        conn = get_db_connection()
        cur = conn.cursor()
        exam_data = request.get_json()
        cur.execute(
            f"UPDATE grade SET mark ='{exam_data['mark']}', feedback = '{exam_data['feedback']}' WHERE studentid_fk = '{student_id}' AND examid_fk = '{exam_data['examid']}';"
        )
        conn.commit()
        cur.close()
    return "update successful", 200


@app.route("/editgrades/", methods=["DELETE"])
# Delete Exam grade and feedback on DELETE request
def delete_student_grade():
    conn = get_db_connection()
    cur = conn.cursor()
    student_id = request.args.get("studentid")
    exam_id = request.args.get("examid")
    cur.execute(
        f"DELETE FROM grade WHERE studentid_fk ='{student_id}' AND examid_fk = '{exam_id}';"
    )
    conn.commit()
    cur.close()
    return "delete successful", 200


# Return exam list for selected student by student id
@app.route("/viewgrades/<class_id>/", methods=["GET"])
def view_exams(class_id):
    classexam_dict = {"data": ""}
    exam_list = []
    exam_list = get_class_exams(class_id)
    if len(exam_list) > 0:
        classexam_dict.update({"data": exam_list})
        return jsonify(classexam_dict)
    else:
        return jsonify(" Student don't have exams ")


# Return class table for selected class and exam id
@app.route("/class_table/", methods=["GET"])
def get_class_table():
    class_id = request.args.get("classid")
    exam_id = request.args.get("examid")

    classtable_dict = {"data": ""}
    student_grade_list = []
    student_grade_list = get_student_grades(class_id, exam_id)

    if len(student_grade_list) > 0:
        classtable_dict.update({"data": student_grade_list})
        return jsonify(classtable_dict)
    else:
        return jsonify(" No marks ")


# Return class table for selected class id
@app.route("/exam_table/", methods=["GET"])
def get_exam_table():
    class_id = request.args.get("classid")

    classtable_dict = {"data": ""}
    exam_list = []
    exam_list = get_exam_data(class_id)

    if len(exam_list) > 0:
        classtable_dict.update({"data": exam_list})
        return jsonify(classtable_dict)
    else:
        return jsonify(" No exams ")


# Insert to database new exam information
@app.route("/addexams/", methods=["POST"])
def insert_exam():
    conn = get_db_connection()
    cur = conn.cursor()
    exam_data = request.get_json()

    # Get last exam examid
    cur.execute("SELECT * FROM exam ORDER BY examid DESC;")
    exam_count = cur.fetchone()

    id = int(exam_count[0][1:]) + 1

    # Database writing error handling
    try:
        cur.execute(
            f"INSERT INTO exam VALUES ('e{id}','{exam_data['examname']}', '{exam_data['classid']}', '{exam_data['mark']}', '{exam_data['weight']}','{exam_data['setdate']}', '{exam_data['duedate']}');"
        )
        conn.commit()
        cur.close()
    except:
        # 304 - response code, when grade of exam already exists
        return " data write skipped", 304
    return redirect(url_for("addexams"))


@app.route("/editexams/<class_id>", methods=["GET", "PUT"])
def class_exam_list(class_id):
    # Return exam list for selected class by class id on GET request
    if request.method == "GET":
        classexam_dict = {"data": ""}
        exam_list = []
        exam_list = get_class_exams_list(class_id)
        if len(exam_list) > 0:
            classexam_dict.update({"data": exam_list})
            return jsonify(classexam_dict)
        else:
            return jsonify(" Class don't have exams ")

    # Update Exam details on PUT request
    if request.method == "PUT":
        conn = get_db_connection()
        cur = conn.cursor()
        exam_data = request.get_json()
        cur.execute(
            f"UPDATE exam SET examname ='{exam_data['examname']}', totalmarks= '{exam_data['mark']}', examWeight = '{exam_data['weight']}',dateset ='{exam_data['setdate']}', datedue = '{exam_data['duedate']}' WHERE examid = '{exam_data['examid']}';"
        )
        conn.commit()
        cur.close()
    return "update successful", 200


# Delete from database grade information
@app.route("/delete_exam/", methods=["DELETE"])
def delete_exam():
    exam_id = request.args.get("examid")
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(f"DELETE FROM grade WHERE  examid_fk = '{exam_id}';")
    cur.execute(f"DELETE FROM exam WHERE  examid = '{exam_id}';")
    conn.commit()
    return " data deleted", 200

# Reads firstnames and surnames from table
def read_record_list(id, table):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT {id}, firstName, surName FROM {table}") #executes select query
    row = cur.fetchone()
    account_details = []

    # appends account details into a list to show on html dropdownlist
    while row is not None:
        account_details.append(row)
        row = cur.fetchone()
    cur.close()
    return account_details


# Returns all exams that a student has taken
def get_all_student_exams(student_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT examid, examname FROM exam, register WHERE register.studentid_fk = '{student_id}' AND exam.classid_fk = register.classid_fk;")  # executes select query
    row = cur.fetchone()
    student_exams = []

    while row is not None:
        # appends student exams into a list to show on html dropdownlist
        student_exams.append(row)
        row = cur.fetchone()
    return student_exams


# Read two columns from provided table name
def get_columns_values(id_column, name_column, table_name):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT {id_column}, {name_column} FROM {table_name}")  # executes select query
    row = cur.fetchone()
    columns_db = []

    while row is not None:
        # appends columns into a list to show on html dropdownlist
        columns_db.append(row)
        row = cur.fetchone()
    return columns_db


# Reads all exams within a class
def get_class_exams(class_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT examid, examname FROM exam WHERE exam.classid_fk = '{class_id}';")  # executes select query
    row = cur.fetchone()
    class_exams = []

    while row is not None:
        # appends class exams into a list to show on html dropdownlist
        class_exams.append(row)
        row = cur.fetchone()
    return class_exams


# Returns student name and exam mark for a selected exam
def get_student_grades(class_id, exam_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT firstName, surName, mark FROM grade, student,exam WHERE exam.classid_fk = '{class_id}' AND exam.examid = '{exam_id}' AND student.studentid= grade.studentid_fk AND exam.examid = grade.examid_fk")  # executes select query
    row = cur.fetchone()
    exams_results = []

    while row is not None:
        # appends exam results into a list to show on html dropdownlist
        exams_results.append(row)
        row = cur.fetchone()
    return exams_results


# Returns all exam details for a class
def get_exam_data(class_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT examname, totalmarks, examweight FROM exam WHERE exam.classid_fk = '{class_id}'")  # executes select query
    row = cur.fetchone()
    exams_details = []

    while row is not None:
        # appends exam details into a list to show on html dropdownlist
        exams_details.append(row)
        row = cur.fetchone()
    return exams_details


# Read exam details with grades by student ID
def get_student_exams(student_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        f"SELECT examid, examname, mark, feedback FROM exam, student, grade WHERE student.studentid= '{student_id}' AND grade.studentid_fk = student.studentid AND exam.examid = grade.examid_fk ;"
    )
    row = cur.fetchone()
    student_grades = []

    while row is not None:
        # appends account details into a list to show on html dropdownlist
        student_grades.append(row)
        row = cur.fetchone()
    return student_grades


# Reads full exam details by class ID
def get_class_exams_list(class_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        f"SELECT examid, examname, totalmarks, examweight, dateset, datedue FROM exam, class WHERE class.classID= '{class_id}' AND exam.classid_fk = class.classID ;"
    )
    row = cur.fetchone()
    class_exams = []

    while row is not None:
        # appends class exams into a list to show on html dropdownlist
        class_exams.append(row)
        row = cur.fetchone()
    return class_exams

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
