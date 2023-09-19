module.exports = exports.PermissionManager = class PermissionManager {
	permissions;

	constructor (...permissions){
		this.permissions = Object.fromEntries(
      [...new Set(permissions)].map((value, index) => [value, index + 1])
    );
	}

	granted (value, permissions){
		for (const permission of permissions)
			if (this.permissions.hasOwnProperty(permission))
				
				value |= this.permissions[permission];

		return value;
	}

	revoked (value, permissions){
		for (const permission of permissions)
			if (this.permissions.hasOwnProperty(permission))
				value &= ~permission;

		return value;
	}

	has (value, permissions){
		const p = this.permissions
		if (typeof permissions === 'string' && p.hasOwnProperty(permissions))
			return (value & p[permissions]) === p[permissions];

		else if (Array.isArray(permissions)){
			permissions.every(
				permission =>
					p.hasOwnProperty(permission) && 
					((value & p[permissions]) === p[permissions])
			);
		}

		return false;
	}

	generate (...permissions){
		return this.granted(0, permissions);
	}

	get data (){
		return this.permissions;
	}

	get valueOf (){

	}

	new (...permissions){
		return new PermissionChecker(this, permissions);
	}
}

exports.PermissionChecker = class PermissionChecker {
	manager;
	value = 0;

	constructor (manager, permissions){
		if (manager instanceof PermissionManager != true)
			throw 'Invalid permission checker';

		this.manager = manager;

		if (Array.isArray(permissions)){
			this.grant(permissions);
		}
		else if (typeof permissions === 'number')
			this.value = permissions;
	}

	grant (permissions){
		return this.value = this.manager.granted(this.value, permissions);
	}

	revoke (permissions){
		return this.value = this.manager.revoked(this.value, permissions);
	}

	has (permission){
		return this.manager.has(this.value, permission)
	}
}