export function dateFromModel(dateModel) {
	return dateModel ? new Date(dateModel.Year, dateModel.Month - 1, dateModel.Day) : null;
}

export function dateTimeFromModel(dateModel) {
	return dateModel ? new Date(dateModel.Year, dateModel.Month - 1, dateModel.Day, dateModel.Hour, dateModel.Minute, dateModel.Second, dateModel.Millisecond) : null;
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
	return date.toLocaleDateString;
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
