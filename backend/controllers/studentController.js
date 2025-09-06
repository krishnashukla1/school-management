const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const Log = require('../models/TransactionLog');
const Batch = require('../models/Batch');


const addStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, rollNo, course, year } = req.body;

  // ✅ Step 1: Create student
  const student = new Student({ name, rollNo, course, year, user: req.user._id });
  await student.save();

  // ✅ Step 2: Check if batch already exists
  let batch = await Batch.findOne({ course, year });
  if (!batch) {
    // If not, create a new batch
    batch = new Batch({
      name: `${course}-${year}`, 
      course, 
      year, 
      students: [student._id]
    });
    await batch.save();
  } else {
    // If batch exists, just push student into it
    batch.students.push(student._id);
    await batch.save();
  }

  // ✅ Step 3: Link batch to student
  student.batches.push(batch._id);
  await student.save();

  // ✅ Step 4: Log action
  await new Log({
    action: 'student_add',
    user: req.user._id,
    details: { studentId: student._id, batchId: batch._id }
  }).save();

  res.json({ student, batch });
};




const getStudents = async (req, res) => {
  const students = await Student.find().populate('batches');
  res.json(students);
};

const getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('batches');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await new Log({ action: 'student_update', user: req.user._id, details: { studentId: student._id } }).save();
  res.json(student);
};

const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await new Log({ action: 'student_delete', user: req.user._id, details: { studentId: req.params.id } }).save();
  res.json({ message: 'Student deleted' });
};

const getStudentBatches = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('batches');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student.batches);
};


module.exports = { addStudent, getStudents, getStudent, updateStudent, deleteStudent, getStudentBatches };