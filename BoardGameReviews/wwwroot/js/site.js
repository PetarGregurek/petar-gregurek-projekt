const debounce = (callback, delay = 250) => {
	let timerId;

	return (...args) => {
		window.clearTimeout(timerId);
		timerId = window.setTimeout(() => callback(...args), delay);
	};
};

const wireAjaxSearch = () => {
	document.querySelectorAll('[data-ajax-search]').forEach((input) => {
		if (input.dataset.bound === 'true') {
			return;
		}

		input.dataset.bound = 'true';
		const targetSelector = input.dataset.searchTarget;
		const searchUrl = input.dataset.searchUrl;
		const target = document.querySelector(targetSelector);

		if (!target || !searchUrl) {
			return;
		}

		const runSearch = debounce(async () => {
			const url = new URL(searchUrl, window.location.origin);
			url.searchParams.set('search', input.value);

			const response = await fetch(url, {
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			});

			if (!response.ok) {
				return;
			}

			target.innerHTML = await response.text();
		});

		input.addEventListener('input', runSearch);
	});
};

const shakeField = (field) => {
	if (!field) {
		return;
	}

	field.classList.remove('field-shake');
	void field.offsetWidth;
	field.classList.add('field-shake');
};

const getValidationMessageSpan = (form, fieldName) =>
	form.querySelector(`[data-valmsg-for="${fieldName}"]`);

const setValidationMessage = (form, fieldName, message) => {
	const span = getValidationMessageSpan(form, fieldName);
	if (!span) {
		return;
	}

	span.textContent = message;
	span.classList.remove('field-validation-valid');
	span.classList.add('field-validation-error');
	span.dataset.customValidation = 'true';
};

const clearValidationMessage = (form, fieldName) => {
	const span = getValidationMessageSpan(form, fieldName);
	if (!span || span.dataset.customValidation !== 'true') {
		return;
	}

	span.textContent = '';
	span.classList.remove('field-validation-error');
	span.classList.add('field-validation-valid');
	delete span.dataset.customValidation;
};

const validatePlayersRelation = (form, animate = true) => {
	const minField = form.querySelector('[name="Input.MinPlayers"]');
	const maxField = form.querySelector('[name="Input.MaxPlayers"]');

	if (!minField || !maxField) {
		return true;
	}

	const minRaw = (minField.value || '').trim();
	const maxRaw = (maxField.value || '').trim();

	if (minRaw.length === 0 || maxRaw.length === 0) {
		clearValidationMessage(form, 'Input.MaxPlayers');
		return true;
	}

	const minValue = Number(minRaw);
	const maxValue = Number(maxRaw);
	if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
		return true;
	}

	if (maxValue < minValue) {
		if (animate) {
			applyFieldState(maxField, 'invalid');
		}

		setValidationMessage(form, 'Input.MaxPlayers', 'Maximum players must be greater than or equal to minimum players.');
		return false;
	}

	clearValidationMessage(form, 'Input.MaxPlayers');
	if (animate && !maxField.classList.contains('field-missing')) {
		applyFieldState(maxField, 'valid');
	}

	return true;
};

const markJQueryErrors = (form) => {
	if (!window.jQuery || !window.jQuery(form).data('validator')) {
		return true;
	}

	const validator = window.jQuery(form).data('validator');
	let valid = true;

	validator.errorList.forEach((error) => {
		valid = false;
		const element = error.element;
		applyFieldState(element, 'invalid');
	});

	return valid;
};

const applyFieldState = (field, state) => {
	field.classList.remove('field-missing');
	if (state === 'missing' || state === 'invalid') {
		field.classList.add('field-missing');
		shakeField(field);
		return false;
	}
	return true;
};

const validateNativeField = (field) => {
	if (!field || field.type === 'hidden' || field.disabled || field.type === 'checkbox') {
		return true;
	}

	const form = field.closest('form');
	const hasJq = form && window.jQuery && window.jQuery(form).data('validator');
	const value = (field.value || '').trim();
	const hasRequiredRule = field.required || field.dataset.valRequired !== undefined;
	const isMissing = hasRequiredRule && value.length === 0;

	if (isMissing) {
		if (!hasJq && form) {
			setValidationMessage(form, field.name, field.dataset.valRequired || 'This field is required.');
		}
		return applyFieldState(field, 'missing');
	}

	if (value.length > 0) {
		const minValue = field.dataset.valRangeMin;
		const maxValue = field.dataset.valRangeMax;
		if (minValue !== undefined && maxValue !== undefined) {
			const numericValue = Number(value);
			const min = Number(minValue);
			const max = Number(maxValue);
			if (!Number.isFinite(numericValue) || numericValue < min || numericValue > max) {
				if (!hasJq && form) {
					const msg = field.dataset.valRange || `Must be between ${min} and ${max}.`;
					setValidationMessage(form, field.name, msg);
				}
				return applyFieldState(field, 'invalid');
			}
		}

		if (!field.checkValidity()) {
			if (!hasJq && form) {
				const msg = field.dataset.valEmail || field.dataset.valRegex || 'Invalid value.';
				setValidationMessage(form, field.name, msg);
			}
			return applyFieldState(field, 'invalid');
		}
	}

	if (!hasJq && form) clearValidationMessage(form, field.name);
	return applyFieldState(field, 'valid');
};

const wireFieldFeedback = () => {
	document.querySelectorAll('form').forEach((form) => {
		if (form.dataset.feedbackBound === 'true') {
			return;
		}

		form.dataset.feedbackBound = 'true';

		form.querySelectorAll('input, select, textarea').forEach((field) => {
			if (field.type === 'hidden') {
				return;
			}

			field.addEventListener('blur', () => {
				validateNativeField(field);
				if (field.name === 'Input.MinPlayers' || field.name === 'Input.MaxPlayers') {
					validatePlayersRelation(form, true);
				}
			});

			field.addEventListener('input', () => {
				if ((field.value || '').trim().length > 0) {
					field.classList.remove('field-missing');
				}

				if (field.name === 'Input.MinPlayers' || field.name === 'Input.MaxPlayers') {
					clearValidationMessage(form, 'Input.MaxPlayers');
				}
			});
		});
	});
};

const createOptionMarkup = (item) => `
	<button type="button" class="autocomplete-dropdown__option" data-autocomplete-option data-value="${item.id}" data-label="${item.label}">
		<span class="autocomplete-dropdown__option-title">${item.label}</span>
		<span class="autocomplete-dropdown__option-meta">${item.description ?? ''}</span>
	</button>`;

const wireAutocompleteDropdowns = () => {
	document.querySelectorAll('[data-autocomplete-dropdown]').forEach((root) => {
		if (root.dataset.bound === 'true') {
			return;
		}

		root.dataset.bound = 'true';
		const lookupUrl = root.dataset.lookupUrl;
		const hiddenInput = root.querySelector('[data-autocomplete-value]');
		const textInput = root.querySelector('[data-autocomplete-input]');
		const panel = root.querySelector('[data-autocomplete-panel]');
		const results = root.querySelector('[data-autocomplete-results]');
		const validation = root.querySelector('[data-autocomplete-validation]');
		const requiredMessage = hiddenInput?.dataset.requiredMessage || 'Please select an option.';
		const invalidSelectionMessage = 'Please select an option from the list.';
		let hasInteracted = false;

		if (!lookupUrl || !hiddenInput || !textInput || !panel || !results || !validation) {
			return;
		}

		const setValidationState = (state) => {
			if (state === 'valid') {
				validation.textContent = '';
				validation.classList.add('autocomplete-dropdown__validation--hidden');
				applyFieldState(textInput, 'valid');
				return true;
			}

			validation.textContent = state === 'missing' ? requiredMessage : invalidSelectionMessage;
			validation.classList.remove('autocomplete-dropdown__validation--hidden');
			applyFieldState(textInput, state);
			return false;
		};

		const validateSelection = () => {
			const selectedValue = Number.parseInt(hiddenInput.value || '0', 10);
			if (Number.isFinite(selectedValue) && selectedValue > 0) {
				return setValidationState('valid');
			}

			const hasTypedValue = (textInput.value || '').trim().length > 0;
			return setValidationState(hasTypedValue ? 'invalid' : 'missing');
		};

		const renderResults = (items) => {
			if (!items.length) {
				results.innerHTML = '<div class="autocomplete-dropdown__empty">No results found.</div>';
				panel.hidden = false;
				return;
			}

			results.innerHTML = items.map(createOptionMarkup).join('');
			panel.hidden = false;
		};

		const loadResults = debounce(async () => {
			const url = new URL(lookupUrl, window.location.origin);
			url.searchParams.set('query', textInput.value);

			const response = await fetch(url);
			if (!response.ok) {
				return;
			}

			const items = await response.json();
			renderResults(items);
			textInput.setAttribute('aria-expanded', 'true');
		}, 200);

		textInput.addEventListener('focus', loadResults);
		textInput.addEventListener('focus', () => {
			hasInteracted = true;
		});
		textInput.addEventListener('input', () => {
			hasInteracted = true;
			hiddenInput.value = '0';
			validation.classList.add('autocomplete-dropdown__validation--hidden');
			textInput.classList.remove('field-missing');
			loadResults();
		});

		textInput.addEventListener('blur', () => {
			window.setTimeout(() => {
				if (!panel.hidden) {
					return;
				}

				if (hasInteracted || (textInput.value || '').trim().length > 0) {
					validateSelection();
				}
			}, 120);
		});

		results.addEventListener('click', (event) => {
			const option = event.target.closest('[data-autocomplete-option]');
			if (!option) {
				return;
			}

			hiddenInput.value = option.dataset.value;
			textInput.value = option.dataset.label;
			panel.hidden = true;
			textInput.setAttribute('aria-expanded', 'false');
			setValidationState('valid');
		});

		document.addEventListener('click', (event) => {
			if (root.contains(event.target)) {
				return;
			}

			panel.hidden = true;
			textInput.setAttribute('aria-expanded', 'false');
		});

		const form = root.closest('form');
		if (form) {
			if (!form._autocompleteValidators) {
				form._autocompleteValidators = [];
			}

			form._autocompleteValidators.push(validateSelection);
		}
	});
};

const wireFormSubmit = () => {
	document.querySelectorAll('form').forEach((form) => {
		// Disable browser native validation popups — we handle all validation ourselves
		form.setAttribute('novalidate', '');

		if (form._submitBound) {
			return;
		}

		form._submitBound = true;

		if (!form._autocompleteValidators) {
			form._autocompleteValidators = [];
		}

		form.addEventListener('submit', (event) => {
			// jQuery validation (messages + built-in rules)
			let jqValid = true;
			if (window.jQuery && window.jQuery(form).data('validator')) {
				jqValid = window.jQuery(form).valid();
			}

			// Always run native validation (red borders; also sets messages when jQuery is absent)
			let nativeValid = true;
			form.querySelectorAll('input, select, textarea').forEach((field) => {
				nativeValid = validateNativeField(field) && nativeValid;
			});

			// Paint red borders for any extra jQuery-detected errors
			markJQueryErrors(form);

			const relationValid = validatePlayersRelation(form, true);

			let autocompleteValid = true;
			form._autocompleteValidators.forEach((validator) => {
				autocompleteValid = validator() && autocompleteValid;
			});

			if (!jqValid || !nativeValid || !relationValid || !autocompleteValid) {
				event.preventDefault();
			}
		});
	});
};

const applyServerSideValidationStyles = () => {
	document.querySelectorAll('.field-validation-error[data-valmsg-for]').forEach((span) => {
		if (!span.textContent.trim()) {
			return;
		}

		const fieldName = span.dataset.valmsgFor;
		const form = span.closest('form');
		if (!form) {
			return;
		}

		const field = form.querySelector(`[name="${fieldName}"]`);
		if (field && field.type !== 'hidden') {
			field.classList.add('field-missing');
		}
	});
};

document.addEventListener('DOMContentLoaded', () => {
	wireAjaxSearch();
	wireFieldFeedback();
	wireAutocompleteDropdowns();
	wireFormSubmit();
	applyServerSideValidationStyles();

	const navLinks = document.querySelectorAll('.site-nav-link');
	const path = window.location.pathname.toLowerCase();
	const pathSegments = path.split('/').filter(Boolean);
	const firstSegment = (pathSegments[0] || '').toLowerCase();
	const currentController = firstSegment || 'home';
	const currentAction = (pathSegments[1] || 'index').toLowerCase();

	navLinks.forEach((link) => {
		link.classList.remove('active');
		const controller = (link.dataset.controller || '').toLowerCase();
		const route = (link.dataset.route || '').toLowerCase();
		const action = (link.dataset.action || '').toLowerCase();
		const matchesHome = !firstSegment && controller === 'home' && !action;
		const matchesRoute = firstSegment && route && firstSegment === route;
		const matchesController = firstSegment && controller && firstSegment === controller;

		if (!matchesHome && !matchesRoute && !matchesController) {
			return;
		}

		if (action && action !== currentAction && !matchesRoute) {
			return;
		}

		link.classList.add('active');
	});

	window.requestAnimationFrame(() => {
		window.requestAnimationFrame(() => {
			document.body.classList.add('nav-ready');
		});
	});
});
