function checkDefault(v1, v2, defaultV?) {
	return v1 === undefined ? v2 || (defaultV || 0) : v1;
}

export function dateFromModel(dateModel) {
	const dm = dateModel;
	return dm ? new Date(checkDefault(dm.Year, dm.year), checkDefault(dm.Month, dm.month) - 1, checkDefault(dm.Day, dm.day)) : null;
}

export function dateTimeFromModel(dateModel) {
	const dm = dateModel;
	return dateModel ? new Date(checkDefault(dm.Year, dm.year), checkDefault(dm.Month, dm.month) - 1, checkDefault(dm.Day, dm.day),
		checkDefault(dm.Hour, dm.hour), checkDefault(dm.Minute, dm.minute), checkDefault(dm.Second, dm.second), checkDefault(dm.Millisecond, dm.millisecond)
	) : null;
}

export function dateToModel(date) {
	if (!date) return null;
	if (date.toDate) {
		date = date.toDate();
	}
	return {
		Year: date.getFullYear(),
		Month: date.getMonth() + 1,
		Day: date.getDate()
	};
}

export function dateTimeToModel(date) {
	if (!date) return null;
	if (date.toDate) {
		date = date.toDate();
	}
	return {
		Year: date.getFullYear(),
		Month: date.getMonth() + 1,
		Day: date.getDate(),
		Hour: date.getHours(),
		Minute: date.getMinutes(),
		Second: date.getSeconds(),
		Millisecond: date.getMilliseconds()
	};
}

export function formatDate(date) {
	if (!date) return "";
	if (date.toDate) {
		date = date.toDate();
	}
	return date.toLocaleDateString();
};


export function formatDateTime(date) {
	if (!date) return "";
	if (date.toDate) {
		date = date.toDate();
	}
	return formatDate(date) + ", " + padZeros(date.getHours(), 2) + ":" + padZeros(date.getMinutes(), 2);
};

export function padZeros(num, size) {
	// no more than 2 leading zeros supported;
	var s = "00" + num;
	var numStr = num + "";
	return numStr.length >= size ? numStr : s.substr(s.length - size);
}
