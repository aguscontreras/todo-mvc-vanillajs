export function createElement(tagName, classList, props) {
	const element = document.createElement(tagName);

	if (classList) {
		if (Array.isArray(classList)) {
			element.classList.add(...classList);
		} else {
			element.classList.add(classList);
		}
	}

	if (props) {
		for (const [name, value] of Object.entries(props)) {
			element[name] = value;
		}
	}

	return element;
}

export function getElement(selector) {
	const element = document.querySelector(selector);
	return element;
}
