export function createExpanded() {
	const divExpanded = document.createElement("div");
	divExpanded.classList.add("expanded");

	const desc = document.createElement("div");
	const subtitle = document.createElement("h1");
	subtitle.classList.add("subtitle--desc");
	subtitle.textContent = "Description";

	const par = document.createElement("p");
	par.classList.add("par--desc");
	par.textContent =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Id distinctio, velit eaque voluptates ea adipisci itaque repellat vitae minima numquam.";

	desc.append(subtitle, par);
	divExpanded.append(desc);

	return divExpanded;
}
