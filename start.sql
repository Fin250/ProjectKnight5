-- Removing Current Tables

DROP TABLE teacher, class, exam, student, register, grade;

COMMIT;

--  Creating New Tables

CREATE TABLE teacher
(
  teacherID VARCHAR(8) PRIMARY KEY NOT NULL,
  email VARCHAR(50),
  firstName VARCHAR(50),
  surname VARCHAR(50),
  age NUMERIC(3),
  password VARCHAR(15)
);

CREATE TABLE class
(
  classID VARCHAR(8) PRIMARY KEY NOT NULL,
  className VARCHAR(50),
  teacherID_fk VARCHAR(50),
  FOREIGN KEY (teacherID_fk) REFERENCES teacher(teacherID)
);

CREATE TABLE exam
(
  examID VARCHAR(8) PRIMARY KEY NOT NULL,
  examName VARCHAR(50),
  classID_fk VARCHAR(8),
  totalMarks NUMERIC(3),
  examWeight NUMERIC(3),
  dateSet DATE,
  dateDue DATE,
  FOREIGN KEY (classID_fK) REFERENCES class(classID)
);

CREATE TABLE student
(
  studentID VARCHAR(8) PRIMARY KEY NOT NULL,
  email VARCHAR(50),
  firstName VARCHAR(50),
  surname VARCHAR(50),
  age NUMERIC(3),
  yearGroup NUMERIC (4),
  password VARCHAR(15)
);

CREATE TABLE register
(
  studentID_fk VARCHAR(50),
  classID_fK VARCHAR(8),
  PRIMARY KEY (studentID_fk, classID_fK),
  FOREIGN KEY (studentID_fk) REFERENCES student(studentID),
  FOREIGN KEY (classID_fK) REFERENCES class(classID)
);

CREATE TABLE grade
(
  studentID_fk VARCHAR(8),
  examID_fk VARCHAR(8),
  mark NUMERIC (3),
  feedback VARCHAR (1000),
  PRIMARY KEY (studentID_fk, examID_fk),
  FOREIGN KEY (studentID_fk) REFERENCES student(studentID),
  FOREIGN KEY (examID_fk) REFERENCES exam(examID)
);

-- Inserting Data

INSERT INTO teacher VALUES ('t1', 'test@mail.com', 'Fred', 'Charles', 45, 'test');
INSERT INTO teacher VALUES ('t2', 'boris@mail.com', 'Boris', 'Morozov', 38, 'pas');
INSERT INTO teacher VALUES ('t3', 'henry@mail.com', 'Henry', 'Proudmore', 29, 'pas');

INSERT INTO class VALUES ('c1', 'English 21/22', 't1');
INSERT INTO class VALUES ('c2', 'French 21/22', 't2');
INSERT INTO class VALUES ('c3', 'Maths 21/22', 't3');
INSERT INTO class VALUES ('c4', 'Geography 21/22', 't3');

INSERT INTO exam VALUES ('e1', 'Reading Test', 'c1', 100, 50, '2022-01-16', '2022-06-16');
INSERT INTO exam VALUES ('e2', 'Literature Essay', 'c1', 100, 50, '2022-02-12', '2022-05-20');
INSERT INTO exam VALUES ('e3', 'Dialogue en Francais', 'c2', 100, 100, '2022-02-01', '2022-05-28');
INSERT INTO exam VALUES ('e4', 'Political Map of Europe', 'c4', 100, 50, '2022-02-18', '2022-04-08');
INSERT INTO exam VALUES ('e5', 'GeoGussr', 'c4', 100, 50, '2022-02-02', '2022-04-24');
INSERT INTO exam VALUES ('e6', 'Probability-in-Depth', 'c3', 100, 100, '2022-02-06', '2022-06-09');

INSERT INTO student VALUES ('s1', 'auriel@mail.com', 'Auriel', 'Kenning', 18, 2022,'pas');
INSERT INTO student VALUES ('s2', 'dan@mail.com', 'Dan', 'Hvide', 19, 2022, 'pas');
INSERT INTO student VALUES ('s3', 'zack@mail.com', 'Zack', 'McGuffin', 18, 2022, 'pas');
INSERT INTO student VALUES ('s4', 'michael@mail.com', 'Michael', 'Newton', 20, 2022, 'pas');
INSERT INTO student VALUES ('s5', 'varian@mail.com', 'Varian', 'Norden', 19, 2022, 'pas');
INSERT INTO student VALUES ('s6', 'diego@mail.com', 'Diego', 'Umbra', 19, 2022, 'pas');
INSERT INTO student VALUES ('s7', 'dave@mail.com', 'Dave', 'Reims', 20, 2022, 'pas');
INSERT INTO student VALUES ('s8', 'cath@mail.com', 'Catharine', 'Vladislaus', 18, 2022, 'pas');
INSERT INTO student VALUES ('s9', 'uriel@mail.com', 'Uriel', 'Septim', 22, 2022, 'pas');
INSERT INTO student VALUES ('s10', 'harald@mail.com', 'Harald', 'Yngvi', 21, 2022, 'pas');

INSERT INTO register VALUES ('s1', 'c1');
INSERT INTO register VALUES ('s1', 'c2');
INSERT INTO register VALUES ('s1', 'c3');
INSERT INTO register VALUES ('s2', 'c1');
INSERT INTO register VALUES ('s2', 'c2');
INSERT INTO register VALUES ('s3', 'c1');
INSERT INTO register VALUES ('s4', 'c1');
INSERT INTO register VALUES ('s4', 'c2');
INSERT INTO register VALUES ('s5', 'c1');
INSERT INTO register VALUES ('s5', 'c2');
INSERT INTO register VALUES ('s5', 'c3');
INSERT INTO register VALUES ('s6', 'c2');
INSERT INTO register VALUES ('s6', 'c3');
INSERT INTO register VALUES ('s7', 'c3');
INSERT INTO register VALUES ('s8', 'c3');
INSERT INTO register VALUES ('s9', 'c2');
INSERT INTO register VALUES ('s9', 'c3');
INSERT INTO register VALUES ('s10', 'c1');
INSERT INTO register VALUES ('s10', 'c3');

INSERT INTO grade VALUES ('s1', 'e1', 82, 'Generic Feedback');
INSERT INTO grade VALUES ('s1', 'e6', 60, 'You are on the right track. By starting to study for the exam earlier, you may be able to retain more knowledge on exam day');
INSERT INTO grade VALUES ('s2', 'e3', 57, 'More analysis of this point is necessary.');
INSERT INTO grade VALUES ('s2', 'e2', 60,'You have improved a lot and should start to look towards taking on harder tasks for the future to achieve more self-development');
INSERT INTO grade VALUES ('s3', 'e2', 52,'You are making good progress, but don’t forget to focus on your weaknesses too.');
INSERT INTO grade VALUES('s4', 'e3', 55,'You are doing well, but there is always room for improvement. Try these tips to get better results');
INSERT INTO grade VALUES('s4', 'e1', 50,'There are a few errors in your essay, but overall it is well-written and easy to understand.');
INSERT INTO grade VALUES('s5', 'e2', 62,'Keep up the good work! You will see better results in the future if you make the effort to attend our study groups more regularly.');
INSERT INTO grade VALUES('s5', 'e3', 53,'Your writing style is good but you need to use more academic references in your paragraphs.');


COMMIT;