const DEBUG_FLAG = true;

if (DEBUG_FLAG) {
	console.log("executing popup.js");
}

// --------------------------------- MVP FXNALITY----------------------
/**
 * Function will narrate what ever is selected
 */
const narrateSelection = () => {
	//speechSynthesis.speak(new SpeechSynthesisUtterance("Jesus is Lord"));
	let text = window.getSelection().toString();
	if (text) {
	} else {
		text = `Nothing was selected on this page. Please select some text or click on 
        the Narrate Page button to read the whole web page`;
	}
	//narrateSelectionBtn.class = 'button-pulse'
	//console.log(`fire event to sythesis: ${window.speechSynthesis.dispatchEvent(new Event('start-narration-selected'))}`)
	window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

/**
 *
 * @param {*} debug
 * @returns
 */
const getWholePageText = (debug = true) => {
	let range = document.createRange();
	let body = document.getElementsByTagName("body")[0];
	range.selectNodeContents(body);
	let selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
	let text = selection.toString();
	textToNarrate = text;
	if (debug) {
		console.log(`---Inside getWholePageText(.) ----`);
		console.log(`Text: ${text}`);
	}
	return text;
};
/**
 * Narrate the whole page
 */
const narrateWholePage = (debug = true) => {
	const text = getWholePageText();
	if (debug) {
		console.log(`inside narrateWholePage()`);
		console.log(`text: ${text}`);
	}
	speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

const narratePage = (debug = true) => {
	//const text = getWholePageText()
	if (debug) {
		console.log(`inside narrateWholePage()`);
		//console.log(`text: ${text}`)
	}
	let range = document.createRange();
	let body = document.getElementsByTagName("body")[0];
	range.selectNodeContents(body);
	let selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
	let text = selection.toString(); //document.getSelection();
	console.log(text);
	speechSynthesis.speak(new SpeechSynthesisUtterance(text));
	selection.removeAllRanges();
};

//---------------------------------------------------------------------
let changeColorBtn = document.getElementById("narrate-page");
let origBGColor = document.body.style.backgroundColor;
//console.log(`Orig BG Color: ${JSON.stringify(origBGColor)}`);

const updateStore = async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (DEBUG_FLAG) {
		console.log(`Inside Update Store`);
	}
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: () => {
			if (DEBUG_FLAG) {
				console.log(`Inside execution of anon lambda to populat store`);
			}
			let text = getWholePageText();
			chrome.storage.sync.put({ narrateText: text });
		},
	});
};

updateStore();

chrome.storage.sync.get("narrateText", (res) => {
	console.log(`The text from storage is : ${JSON.stringify(res.narrateText)}`);
});

chrome.storage.sync.get("color", ({ color }) => {
	console.log(`Color is: ${JSON.stringify(color)}`);
	changeColorBtn.style.backgroundColor = color;
});

const narratePageBtn = document.getElementById("narrate-page");
const narrateSelectionBtn = document.getElementById("narrate-selection");
const stopNarrationBtn = document.getElementById("narrate-stop");
const pauseResumeNarrationBtn = document.getElementById("narrate-pause-resume");
//let textToNarrate = ""
console.log(narratePageBtn);
// When the button is clicked, inject narratePage into current page
narratePageBtn.addEventListener("click", async () => {
	if (DEBUG_FLAG) {
		console.log("inside narratePageBtn event handler ...");
	}
	//narratePageBtn.class="button-pulse"
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: narratePage,
	});
});

narrateSelectionBtn.addEventListener("click", async () => {
	if (DEBUG_FLAG) {
		console.log("inside narrateSelectionBtn event handler ...");
	}
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: narrateSelection,
	});
});

stopNarrationBtn.addEventListener("click", () => {
	window.speechSynthesis.cancel();
});

pauseResumeNarrationBtn.addEventListener("click", () => {
	let currText = pauseResumeNarrationBtn.textContent;
	if (currText == "Pause") {
		window.speechSynthesis.pause();
		pauseResumeNarrationBtn.textContent = "Resume";
	} else {
		window.speechSynthesis.resume();
		pauseResumeNarrationBtn.textContent = "Pause";
	}
});

window.speechSynthesis.addEventListener("start-narration-selected", () => {
	narrateSelectionBtn.className = "button-pulse";
});
window.speechSynthesis.addEventListener("stoped-narration-selected", () => {});
// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
	chrome.storage.sync.get("color", ({ color }) => {
		console.log(
			`Pre ... ${JSON.stringify(document.body.style.backgroundColor)}`
		);
		document.body.style.backgroundColor = color;
		console.log(
			`Post... ${JSON.stringify(document.body.style.backgroundColor)}`
		);
	});
}
