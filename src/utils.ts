export class Utils {

	// generates a new Universally unique identify (UUID) 
	// the UUID is used to identify each of the tasks
	static uuid(): string {
		/*jshint bitwise:false */
		let i: number;
		let random: number;
		let uuid = "";

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				uuid += "-";
			}
			uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
				.toString(16);
		}

		return uuid;
	}

	// adds 's' to the end of a given world when count > 1
	static pluralize(count: number, word: string) {
		return count === 1 ? word : word + "s";
	}

	// stores data using the localStorage API
	static store(namespace: string, data?: string) {
		if (data) {
			return localStorage.setItem(namespace, JSON.stringify(data));
		}

		const store = localStorage.getItem(namespace);
		return (store && JSON.parse(store)) || [];
	}

	// just a helper for inheritance
	static extend(...objs: any[]): any {
		const newObj = {} as any;
		for (let i = 0; i < objs.length; i++) {
			const obj = objs[i];
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					newObj[key] = obj[key];
				}
			}
		}
		return newObj;
	}
}
