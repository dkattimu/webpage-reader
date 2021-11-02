const DEBUG_FLAG = true;

if (DEBUG_FLAG) {
	console.log("executing popup.js");
}

// --------------------------------- MVP FXNALITY----------------------
/**
 *
 * @param {*} debug
 */
const narratePageOrSelected = (debug = true) => {
	if (debug) {
		console.log(`inside narrateWholePage()`);
	}
	let text = window.getSelection().toString();

	if (text.length>0) {
		//narrateSelection()
		window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
	} else {
		text = `You did not select any text on this page. So I will narrate the whole page`;
		window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));

		let range = document.createRange();
		let body = document.getElementsByTagName("body")[0];
		range.selectNodeContents(body);
		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		text = selection.toString(); //document.getSelection();
		console.log(text);
		speechSynthesis.speak(new SpeechSynthesisUtterance(text));
		selection.removeAllRanges();
	}
};
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
	if (debug) {
		console.log(`inside narrateWholePage()`);
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
let narratePageBtn = document.getElementById("narrate-page");
//let narrateSelectionBtn = document.getElementById("narrate-selection");
let stopNarrationBtn = document.getElementById("narrate-stop");
//const pauseResumeNarrationBtn = document.getElementById("narrate-pause-resume");
let themeToggleBtn = document.getElementById("settings-theme");

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
	//changeColorBtn.style.backgroundColor = color;
});

themeToggleBtn.addEventListener("click", () => {

	let themeImgSrc = themeToggleBtn.children[0].src;
    //console.log(themeToggleBtn.children)
	let darkImgSrc = "dark.png";
	let lightImgSrc = "light.png";

	if (themeImgSrc.includes(darkImgSrc)){
        themeToggleBtn.children[0].src = lightImgSrc
		updateTheme(false);
	} else if (themeImgSrc.includes(lightImgSrc)) {
		themeToggleBtn.children[0].src = darkImgSrc;
		updateTheme(true);

        if (DEBUG_FLAG) {
            console.log(`inside toggle for theme`);
            console.log(themeImgSrc)
        }
	}
});

/**
 *
 * @param {*} darkTheme
 */
const updateTheme = (darkTheme = True) => {
	let body = document.getElementsByTagName("body")[0];
	let html = document.getElementsByTagName("html")[0];
	let buttons = document.getElementsByTagName("button"); //[document.get, narratePageBtn, narrateSelectionBtn, stopNarrationBtn]
	if (darkTheme) {
		[...buttons].map((btn) => {
			btn.className = "btn-dark-theme";
			//btn.style.backgroundColor='black'
			//btn.style.color='white'
			console.log(`classname: ${btn.className}`);
		});
		themeToggleBtn.className = "btn-dark-theme";
		body.className = "body-dark-theme";
		html.className = "html-dark-theme";
	} else {
		[...buttons].map((btn) => {
			btn.className = "btn-light-theme";
		});
		body.className = "body-light-theme";
		html.className = "html-light-theme";
	}
};
// When the button is clicked, inject narratePage into current page
narratePageBtn.addEventListener("click", async () => {
	if (DEBUG_FLAG) {
		console.log("inside narratePageBtn event handler ...");
	}
	//narratePageBtn.class="button-pulse"
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: narratePageOrSelected,
	});
});

/*narrateSelectionBtn.addEventListener("click", async () => {
	if (DEBUG_FLAG) {
		console.log("inside narrateSelectionBtn event handler ...");
	}
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: narratePageOrSelected, //narrateSelection,
	});
});
*/
stopNarrationBtn.addEventListener("click", () => {
	window.speechSynthesis.cancel();
});

/*pauseResumeNarrationBtn.addEventListener("click", () => {
	let currText = pauseResumeNarrationBtn.textContent;
	if (currText == "Pause") {
		window.speechSynthesis.pause();
		pauseResumeNarrationBtn.textContent = "Resume";
	} else {
		window.speechSynthesis.resume();
		pauseResumeNarrationBtn.textContent = "Pause";
	}
});*/

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

//TODO:
// Add option for male/female voice
// Add CSS for buttons to be depressed when clicked
// Add option for dark/light theme -DONE
