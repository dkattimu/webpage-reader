let color = "teal"; //#3aa757';
let DEBUG_FLAG = true;

if (DEBUG_FLAG) {
	console.log(`background.js is called`);
}

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ color: color }, () => {
		console.log(
			"Default background color set to color %cgreen",
			`color: ${color}`
		);
	});
});

chrome.storage.sync.get(["color"], (res) => {
	console.log(`current value of 'color' is ${JSON.stringify(res.color)}`);
});

chrome.storage.sync.get("narrateText", (res) => {
	console.log(
		`narration text from storage: ${JSON.stringify(res.narrateText)}`
	);
});

/*
const getWholePageText = (debug = DEBUG_FLAG) =>{

    let range =  document.createRange();
    let body = document.getElementsByTagName('body')[0];
	range.selectNodeContents(body);
	let selection = window.getSelection()
    selection.removeAllRanges();
	selection.addRange(range);
    let text = selection.toString()
    //textToNarrate = text
    if(debug){
        console.log(`---Inside getWholePageText(.) ----`)
        console.log(`Text: ${text}`)
    }
    return text
}
*/
