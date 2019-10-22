
function name(value, error) {
	if("" != value && null != value && undefined != value) {
		if(!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
			return error;
		}
	}
}

function phone(value, error) {
	if("" != value && null != value && undefined != value) {
		if(!/^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[2|5|6|7]|17[1|2|3|5|6|7|8]|18[0|1|2|3|5|6|7|8|9]|19[1|3|5|8|9])\d{8}$/.test(value)) {
			return error;
		}
	}
}

function seq(value, error) {
	if("" != value && null != value && undefined != value) {
		if(!/^[1-9][0-9]{0,2}$/.test(value)) {
			return error;
		}
	}
}

function password(value, error) {
	if("" != value && null != value && undefined != value) {
		if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
			return error;
		}
	}
}