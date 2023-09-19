class PermissionManager {
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

	asArray (permissions){
		const p = this.permissions;

		if (Array.isArray(permissions))
			return permissions;

		else if (typeof permissions === 'string')
			return [permissions];

		return [];
	}

	hasOne (value, permission){
		const p = this.permissions;
		return p.hasOwnProperty(permission) && ((value & p[permission]) === p[permission]);
	}

	hasMany (value, permissions){
		return this.asArray(permissions).every(permission => this.hasOne(value, permission));
	}

	hasSome (value, permissions){
		return this.asArray(permissions).some(permission => this.hasOne(value, permission));
	}

	generate (...permissions){
		return this.granted(0, permissions);
	}

	valueOf (permission){
		return this.permissions.hasOwnProperty(permission) ? this.permissions[permission] : 0;
	}

	new (...permissions){
		return new PermissionChecker(this, permissions);
	}
}

module.exports = exports.PermissionManager = PermissionManager

class PermissionChecker {
	manager;
	value = 0;

	constructor (manager, permissions){
		if (manager instanceof PermissionManager != true)
			throw 'Invalid permission checker';

		this.manager = manager;

		if (Array.isArray(permissions)){
			this.grant(...permissions);
		}
		else if (typeof permissions === 'number')
			this.value = permissions;
	}

	grant (...permissions){
		return this.value = this.manager.granted(this.value, permissions);
	}

	revoke (...permissions){
		return this.value = this.manager.revoked(this.value, permissions);
	}

	has (...permissions){
		return this.manager.has(this.value, permissions)
	}
}

exports.PermissionChecker = PermissionChecker;