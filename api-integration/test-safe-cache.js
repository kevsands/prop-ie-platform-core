// Test script for safeCache implementations
const safeCache = require('./src/lib/utils/safeCache.js');

// Basic test function
function add(a, b) {
  console.log(`Computing ${a} + ${b}`);
  return a + b;
}

// Async test function
async function asyncAdd(a, b) {
  console.log(`Computing async ${a} + ${b}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(a + b);
    }, 100);
  });
}

// Test basic safeCache
const cachedAdd = safeCache.default(add);
console.log('Testing basic safeCache:');
console.log(cachedAdd(1, 2)); // Should print "Computing 1 + 2" and then "3"
console.log(cachedAdd(1, 2)); // Should just print "3" (from cache)
console.log(cachedAdd(3, 4)); // Should print "Computing 3 + 4" and then "7"

// Test ttlCache
const ttlCachedAdd = safeCache.ttlCache(add, 1000); // 1 second TTL
console.log('\nTesting ttlCache:');
console.log(ttlCachedAdd(1, 2)); // Should print "Computing 1 + 2" and then "3"
console.log(ttlCachedAdd(1, 2)); // Should just print "3" (from cache)

// Test asyncSafeCache
const asyncCachedAdd = safeCache.asyncSafeCache(asyncAdd);
console.log('\nTesting asyncSafeCache:');
async function testAsync() {
  console.log(await asyncCachedAdd(1, 2)); // Should print "Computing async 1 + 2" and then "3"
  console.log(await asyncCachedAdd(1, 2)); // Should just print "3" (from cache)
  console.log(await asyncCachedAdd(3, 4)); // Should print "Computing async 3 + 4" and then "7"
}

testAsync().then(() => {
  console.log('\nAll tests completed!');
});