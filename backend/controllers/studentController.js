



const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const Log = require('../models/TransactionLog');
const Batch = require('../models/Batch');

// ➕ Add student
// const addStudent = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { name, rollNo, course, year } = req.body;

//   try {
//     const student = new Student({ name, rollNo, course, year, user: req.user._id });
//     await student.save();

//     // Create or update batch
//     let batch = await Batch.findOne({ course, year });
//     if (!batch) {
//       batch = new Batch({
//         name: `${course}-${year}`,
//         course,
//         year,
//         students: [student._id]
//       });
//       await batch.save();
//     } else {
//       batch.students.push(student._id);
//       await batch.save();
//     }

//     // Link batch to student
//     student.batches.push(batch._id);
//     await student.save();

//     // Log action
//     await new Log({
//       action: 'student_add',
//       user: req.user._id,
//       details: { studentId: student._id, batchId: batch._id }
//     }).save();

//     res.json({ student, batch });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// const addStudent = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, rollNo, course, year } = req.body;

//   try {
//     // ✅ Check if rollNo already exists
//     const existingStudent = await Student.findOne({ rollNo });
//     if (existingStudent) {
//       return res.status(400).json({ message: "Student with this roll number already exists." });
//     }

//     const student = new Student({ name, rollNo, course, year, user: req.user._id });
//     await student.save();

//     // Create or update batch
//     let batch = await Batch.findOne({ course, year });
//     if (!batch) {
//       batch = new Batch({
//         name: `${course}-${year}`,
//         course,
//         year,
//         students: [student._id]
//       });
//       await batch.save();
//     } else {
//       if (!batch.students.includes(student._id)) {
//         batch.students.push(student._id);
//         await batch.save();
//       }
//     }

//     // Link batch to student
//     student.batches.push(batch._id);
//     await student.save();

//     // Log action
//     await new Log({
//       action: "student_add",
//       user: req.user._id,
//       details: { studentId: student._id, batchId: batch._id }
//     }).save();

//     res.json({ message: "Student added successfully", student, batch });
//   } catch (err) {
//     // ✅ Catch Mongo duplicate key error as backup
//     if (err.code === 11000) {
//       return res.status(400).json({ message: "Duplicate roll number detected." });
//     }
//     res.status(500).json({ message: err.message });
//   }
// };


const addStudent = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, rollNo, course, year } = req.body;

  try {
    // Check if rollNo already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this roll number already exists." });
    }

    // Create new student
    const student = new Student({
      name,
      rollNo,
      course,
      year,
      user: req.user._id,
      batches: [] // initialize empty array
    });
    await student.save();

    // Find or create batch
    let batch = await Batch.findOne({ course, year });
    if (!batch) {
      batch = new Batch({
        name: `${course}-${year}`,
        course,
        year,
        students: [student._id]
      });
      await batch.save();
    } else {
      // Add student to batch if not already included
      if (!batch.students.includes(student._id)) {
        batch.students.push(student._id);
        await batch.save();
      }
    }

    // Link batch to student
    student.batches.push(batch._id);
    await student.save();

    // Log action
    await new Log({
      action: "student_add",
      user: req.user._id,
      details: { studentId: student._id, batchId: batch._id }
    }).save();

    res.status(201).json({ message: "Student added successfully", student, batch });
  } catch (err) {
    // Catch duplicate rollNo errors just in case
    if (err.code === 11000 && err.keyPattern?.rollNo) {
      return res.status(400).json({ message: "Duplicate roll number detected." });
    }
    res.status(500).json({ message: err.message });
  }
};



// 📌 Get all students
const getStudents = async (req, res) => {
  const students = await Student.find().populate('batches');
  res.json(students);
};

// 📌 Get single student
const getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('batches');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

// ✏️ Update student
const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await new Log({ action: 'student_update', user: req.user._id, details: { studentId: student._id } }).save();
  res.json(student);
};

// ❌ Delete student
const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await new Log({ action: 'student_delete', user: req.user._id, details: { studentId: req.params.id } }).save();
  res.json({ message: 'Student deleted' });
};

// 📌 Get student batches
const getStudentBatches = async (req, res) => {
  const student = await Student.findById(req.params.id).populate('batches');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student.batches);
};

// 📌 Update own profile
const updateStudentSelf = async (req, res) => {
  const student = await Student.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

// ❌ Delete own profile
const deleteStudentSelf = async (req, res) => {
  const student = await Student.findOneAndDelete({ user: req.user._id });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Profile deleted' });
};

// 📌 Get student by userId (for dashboard)
const getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.params.userId }).populate('batches');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentBatches,
  updateStudentSelf,
  deleteStudentSelf,
  getStudentByUserId
};
