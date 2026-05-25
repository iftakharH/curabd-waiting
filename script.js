document.addEventListener('DOMContentLoaded', () => {
	const SHEET_WEB_APP_URL = window.CURABD_CONFIG?.SHEET_WEB_APP_URL || '';
	const formWrap = document.getElementById('form-wrap');
	const formContent = document.getElementById('form-content');
	const successState = document.getElementById('success-state');
	const submitBtn = document.getElementById('submit-btn');
	const roleField = document.getElementById('role');
	const nameField = document.getElementById('fname');
	const emailField = document.getElementById('email');
	const phoneField = document.getElementById('phone');
	const districtField = document.getElementById('district');

	function buildSubmissionPayload() {
		return {
			fullName: nameField.value.trim(),
			email: emailField.value.trim(),
			phone: phoneField.value.trim(),
			role: roleField.value,
			district: districtField.value.trim(),
			source: 'curabd-waiting',
			submittedAt: new Date().toISOString(),
		};
	}

	async function submitToSheet(payload) {
		if (!SHEET_WEB_APP_URL || SHEET_WEB_APP_URL.startsWith('PASTE_')) {
			throw new Error('Google Apps Script web app URL is not configured.');
		}

		const body = new URLSearchParams(payload);

		await fetch(SHEET_WEB_APP_URL, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
			body,
		});
	}

	document.querySelectorAll('a[href="#form-wrap"]').forEach(link => {
		link.addEventListener('click', event => {
			event.preventDefault();

			const roleValue = link.dataset.setRole;
			if (roleValue && roleField) {
				roleField.value = roleValue;
			}

			formWrap.scrollIntoView({ behavior: 'smooth' });

			const focusFieldId = link.dataset.focusField;
			if (focusFieldId) {
				const focusField = document.getElementById(focusFieldId);
				if (focusField) {
					focusField.focus();
				}
			}
		});
	});

	async function handleSubmit() {
		const name = nameField.value.trim();
		const email = emailField.value.trim();
		const role = roleField.value;

		if (!name) {
			alert('Please enter your name.');
			nameField.focus();
			return;
		}

		if (!email || !email.includes('@')) {
			alert('Please enter a valid email address.');
			emailField.focus();
			return;
		}

		if (!role) {
			alert('Please select your role.');
			roleField.focus();
			return;
		}

		submitBtn.disabled = true;
		submitBtn.textContent = 'Sending...';

		try {
			await submitToSheet(buildSubmissionPayload());
			formContent.style.display = 'none';
			successState.style.display = 'block';

			const count = document.querySelector('.cta-note');
			if (count) {
				count.textContent = 'Already 54+ people waiting. Launching later in 2026.';
			}
		} catch (error) {
			alert('The sheet connection is not set up yet. Paste your Google Apps Script web app URL into script.js, then try again.');
			console.error(error);
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Reserve my early access →';
		}
	}

	if (submitBtn) {
		submitBtn.addEventListener('click', handleSubmit);
	}
});
