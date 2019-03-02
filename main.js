function loadFarm() {
	let width = 9;
	let height = 9;



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



function newPlant(soort) {
	return $("<plant><img src='img/" + soort + "/1.png'>");
}


$(".knop-zaaien").each(function(_, knop) {
	$(knop).on("click", function(ev) {
		$("farm").addClass("outline");
		let soort = knop.dataset.plant;
		let snelheid = parseInt(knop.dataset.snelheid);
		let stadia = parseInt(knop.dataset.stadia);

		$("farm").on("click", "farm-background-tile", function(ev) {
			let tile = $(ev.target);
			if (tile.children().length > 0)
				return;

			let plant = newPlant(soort);
			tile.append(plant);
	
			for (let i = 1; i < stadia; i++)
				setTimeout(() => plant.children("img").attr("src", "img/" + soort + "/" + (i+1) + ".png"), i * snelheid);
			
		});

		$("#mainControls").css("display", "none");
		$("#annuleerControls").css("display", "").on("click", () => {
			$("farm").removeClass("outline");
			$("farm").off();
			$("#mainControls").css("display", "");
			$("#annuleerControls").css("display", "none")
		});


		$("#knop-oogsten").on("click", (ev) => {

		});
	});
});