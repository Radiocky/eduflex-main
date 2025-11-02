// hashPasswords.js
const bcrypt = require('bcryptjs');

async function gen() {
  console.log('student:', await bcrypt.hash('student123', 10));
  console.log('teacher:', await bcrypt.hash('teacher123', 10));
  console.log('admin:', await bcrypt.hash('Admin@123', 10));
}
gen();
