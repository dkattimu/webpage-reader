const DEBUG_FLAG = true;

// Drive this from options page to support trouble shooting user issues in the future?
if (DEBUG_FLAG) {
	console.log("executing popup.js");
}

// -------------------------------------------------------
/**
 *
 * @param {*} verbose
 */
const narratePageOrSelected = (verbose = true) => {
	if (verbose) {
		console.log(`inside narratePageOrSelected()`);
	}
	let text = window.getSelection().toString();

	/** @type {SpeechSynthesis.SpeechSynthesisUtterance} */
	let utterance;

	if (text.length > 0) {
		//narrateSelection()
		utterance = new SpeechSynthesisUtterance(text);
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
		utterance = new SpeechSynthesisUtterance(text);
		selection.removeAllRanges();
	}
    /*
	chrome.storage.sync.set({ "narrateText": text }, () => {
		if (verbose) {
			console.log(`Placed the narration text into storage`);
		}
	});*/
	window.speechSynthesis.speak(utterance);
};

//---------------------------------------------------------------------

let narratePageBtn = document.getElementById("narrate-page");
let stopNarrationBtn = document.getElementById("narrate-stop");
let themeToggleBtn = document.getElementById("settings-theme");

let origBGColor = document.body.style.backgroundColor;
//console.log(`Orig BG Color: ${JSON.stringify(origBGColor)}`);
/*
chrome.storage.sync.get("narrateText", (res) => {
	console.log(`The text from storage is : ${JSON.stringify(res.narrateText)}`);
});*/

themeToggleBtn.addEventListener("click", () => {
	let themeImgSrc = themeToggleBtn.children[0].src;
	//console.log(themeToggleBtn.children)
	let darkImgSrc = "dark.png";
	let lightImgSrc = "light.png";

	if (themeImgSrc.includes(darkImgSrc)) {
		themeToggleBtn.children[0].src = lightImgSrc;
		updateTheme(true);
	} else if (themeImgSrc.includes(lightImgSrc)) {
		themeToggleBtn.children[0].src = darkImgSrc;
		updateTheme(false);

		if (DEBUG_FLAG) {
			console.log(`inside toggle for theme`);
			console.log(themeImgSrc);
		}
	}
});

/**
 *
 * @param {Boolean} darkTheme
 * @param {Boolean} verbose
 */
const updateTheme = (darkTheme = True, verbose = DEBUG_FLAG) => {
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
   /*
	chrome.storage.sync.put({ theme: { "type": "dark", "icon": "dark.png" } }, () => {
		if (verbose) {
			console.log(`set default theme: ${JSON.stringify(theme)}`);
		}
	});*/
};

stopNarrationBtn.addEventListener("click", () => {
    let ctr = 0
	window.speechSynthesis.cancel();//might not work....hack below

    if(window.speechSynthesis.speaking){
        while(window.speechSynthesis.speaking){
            ctr++
            window.speechSynthesis.pause()
            window.speechSynthesis.cancel()
            if (ctr ==10){
                break;
            }
        }
    }
});

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


//TODO:
// Add option for male/female voice
// Add CSS for buttons to be depressed when clicked
// Add option for dark/light theme -DONE
