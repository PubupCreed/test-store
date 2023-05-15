async function addToCart(btn) {
	const variantId = btn.dataset.variantId;
	if (!variantId) {
		return console.error('Set data-variant-id="{{ variant.id }}" on button!!!');
	}
	btn.classList.add("loading");
	const id = parseInt(variantId, 10);
	const cart = document.querySelector("cart-items");

	const res = await fetch(`${window.routes.cart_add_url}.js`, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
			"X-Requested-With": "xmlhttprequest",
		},
		body: JSON.stringify({
			id,
			quantity: 1,
			sections:
				cart?.getSectionsToRender().map((section) => section.section) || [],
			sections_url: window.location.pathname,
		}),
	});

	// code from cart.js for update cart
	const parsedState = await res.json();

	cart?.classList.toggle("is-empty", parsedState.item_count === 0);
	const cartDrawerWrapper = document.querySelector("cart-drawer");
	const cartFooter = document.getElementById("main-cart-footer");

	if (cartFooter)
		cartFooter.classList.toggle("is-empty", parsedState.item_count === 0);
	if (cartDrawerWrapper)
		cartDrawerWrapper.classList.toggle(
			"is-empty",
			parsedState.item_count === 0
		);

	cart?.getSectionsToRender().forEach((section) => {
		const elementToReplace =
			document.getElementById(section.id).querySelector(section.selector) ||
			document.getElementById(section.id);
		elementToReplace.innerHTML = cart.getSectionInnerHTML(
			parsedState.sections[section.section],
			section.selector
		);
	});
	// end

	// delete card product
	btn.closest(".featured-product-card")?.remove();
}

async function changeVariant(form, handle) {
	const res = await fetch(
		`${Shopify.routes.root}products/${handle}?view=featured-product-card&variant=${form.id}`
	);

	const html = await res.text();

	const newDom = new DOMParser().parseFromString(html, "text/html");

	form.closest(".featured-product-card").innerHTML = newDom.querySelector(
		".featured-product-card"
	).innerHTML;
}
