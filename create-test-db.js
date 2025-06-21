// Create test database
const { execSync } = require('child_process');

try {
  execSync('createdb propie_test', { stdio: 'inherit' });
  console.log('✓ Created propie_test database');
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('Database propie_test already exists');
  } else {
    console.error('Failed to create database:', error.message);
  }
}