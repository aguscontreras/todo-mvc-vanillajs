/**
 * Crea un elemento HTML
 * @param {string} tagName Tag HTML
 * @param {string | string[]} classList Lista de clases
 * @param {Object}} Propiedades
 * @returns {Element} Elemento creado
 */
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

/**
 * Selecciona un elemento HTML del dom
 * @param {string} selector Selector
 * @returns {Element} Element
 */
export function getElement(selector) {
	const element = document.querySelector(selector);
	return element;
}

/**
 * Selecciona elementos HTML del dom
 * @param {string} selector Selector
 * @returns {NodeListOf<Element>} Elements
 */
export function getElements(selector) {
	const elements = document.querySelectorAll(selector);
	return elements;
}