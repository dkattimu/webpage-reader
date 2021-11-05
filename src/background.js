let color = "teal"; //#3aa757';
let DEBUG_FLAG = true;

if (DEBUG_FLAG) {
	console.log(`background.js is called`);
}
/*
let theme_exist;
try {
	chrome.storage.sync.get("theme", (res) => {
		if (theme) {
			console.log(`theme in local storage: ${JSON.stringify(res.theme)}`);
		} else {
			chrome.storage.sync.set(
				{ theme: { type: "dark", icon: "dark.png" } },
				() => {
					console.log(`set default theme: ${JSON.stringify(theme)}`);
				}
			);
		}
	});
} catch(ex){
    console.log(`failed gracefully: ${ex}`)
}

finally {
}
*/
chrome.runtime.onInstalled.addListener(() => {
	if (DEBUG_FLAG) {
		console.log(`Inside onInstalled event handler`);
	}
});
/*
chrome.storage.sync.get("narrateText", (res) => {
	console.log(
		`narration text from storage: ${JSON.stringify(res.narrateText)}`
	);
});*/
