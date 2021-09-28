export function createControl(config, validation) {
	return {
		...config,
		valid: !validation,
	}
}

export function validateForm(formControls) {
	let isFormValid = true

	for (let control in formControls) {
		if (formControls.hasOwnProperty(control)) {
			isFormValid = formControls[control].isValid && isFormValid
		}
	}

	return isFormValid
}