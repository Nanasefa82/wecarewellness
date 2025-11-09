// Clear cached profile data
// Copy and paste this into your browser console (F12 -> Console tab)

console.log('🧹 Clearing cached profile data...');

// Clear the specific profile cache
localStorage.removeItem('profile_8285ede3-ed62-493f-a3b6-c7a3ed21338c');

// Or clear everything (more thorough)
// localStorage.clear();

console.log('✅ Cache cleared!');
console.log('🔄 Reloading page...');

// Reload the page
location.reload();
