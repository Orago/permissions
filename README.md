# @orago/p

### Usage:
```js
import { PermissionManager } from '@orago/permissions';

const perms = new PermissionManager('admin', 'member');

// Use the same names from instancing the manager, 
// If not it'll be ignored
// Leave black for no permissions

// A generated number can be used to automatically update permissions
// (ONLY DO THIS IF YOU KNOW WHAT YOU ARE DOING!!!)
const john = perms.new();
const mike = perms.new('admin');
const scott = perms.new('member');
const alex = perms.new('admin', 'member');


function test (num){
	return [
		num.has('admin'),
		num.has('member'),
	];
}

console.log(
	'john:',
	test(john), // [false, false]

	'mike:',
	test(mike), // [true, false]

	'scott:',
	test(scott), // [false, true]

	'alex:',
	test(alex) // [true, true]
);
```