function loadFarm() {
	let width = 6;
	let height = 6;



	let farm = document.createElement("farm");
	let bg = document.createElement("farm-background");
	farm.appendChild(bg);
	for (let i = 0; i < width; i++) {
		let row = document.createElement("farm-background-row");
		for (let j = 0; j < height; j++) {
			let tile = document.createElement("farm-background-tile");
			row.appendChild(tile);
		}
		bg.appendChild(row);

	}
	let farmContainer = document.getElementById("farmContainer");
	console.log(farmContainer);
	farmContainer.appendChild(farm);
}


loadFarm();