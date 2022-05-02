let toggled = false;
let paused;

const createIcon = (iconName) => {
    let icon = document.createElement("span");
    icon.setAttribute("class", "material-symbols-rounded");
    icon.textContent = iconName;
    return icon;
};

function resizeCallback() {
    if (toggled) {
        setStyles();
    }
}

function toggleController() {
    if (!paused) {
        document.querySelector("#playControlsWrapper").classList.toggle("show-controller");
    }
}
// background: hsl(0 0% 100% / 0.8);
//     backdrop-filter: blur(8px);
function setStyles() {
    document.querySelector("#primaryPlayer").style = `
    position: fixed;
    height: calc(100vh - 40px);
    width: 100vw;
    z-index: 998;
    `;
    document.querySelector("#playControlsWrapper").style = `
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    background: hsl(0 0% 14% / 0.7);
    backdrop-filter: blur(8px);
    opacity: 1;
    transition: opacity 200ms ease-in-out;
    `;
    document.querySelector("#primaryScreen").style = `
    height: 100%;
    width: 100%;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
    `;
    let thumbnailsBtn = document.querySelector("#toggleThumbnailsButton");
    thumbnailsBtn.ariaExpanded = "false";
    thumbnailsBtn.firstElementChild.textContent = "keyboard_arrow_up";
    thumbnailsBtn.style.display = "none";

    let thumbnailList = document.querySelector("#thumbnailList");
    thumbnailList.style.display = "none";
}

function injectStyles() {
    let variableIconSet = document.createElement("link");
    variableIconSet.setAttribute("rel", "stylesheet");
    variableIconSet.setAttribute(
        "href",
        "https://fonts.sandbox.google.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    );
    document.querySelector("head").append(variableIconSet);
}

function setLayout() {
    const playControls = document.querySelector("#playControls");
    const positionSlider = document.querySelector("#positionSlider");
    const positionControl = document.querySelector("#positionControl");
    const transportControls = document.querySelector("#transportControls");
    // const positionBar = positionSlider.querySelector("#positionBar");
    
    document.querySelector("#playControlsWrapper").style = `
        background: hsl(0 0% 14% / 0.7);
        backdrop-filter: blur(8px);
    `;

    transportControls.style = `
        height: 48px;
    `;

    playControls.style = `
        position: relative;
        height: 48px;
        display: flex;
    
    `;

    positionControl.style = `
        left: 0;
        right: 0;
        position: absolute;
        bottom: 47px;
    `;

    positionSlider.style = `
        background: transparent;
    `;

    const toggleButton = document.createElement("div");
    toggleButton.setAttribute("class", "transport-button");
    toggleButton.setAttribute("id", "theaterModeButton");
    toggleButton.setAttribute("role", "button");
    toggleButton.style = `width: 48px; height: auto; aspect-ratio: 1/1;`;
    toggleButton.setAttribute("aria-label", "Theater Mode");
    toggleButton.append(createIcon("width_full"));
    toggleButton.addEventListener("click", (e) => {
        if (toggleTheaterMode()) {
            window.addEventListener("mouseover", toggleController, false);
            window.addEventListener("mouseout", toggleController, false);
            window.addEventListener("resize", resizeCallback, false);
        } else {
            window.removeEventListener("mouseover", toggleController, false);
            window.removeEventListener("mouseout", toggleController, false);
            window.removeEventListener("resize", resizeCallback, false);
        }
    }, false);
    transportControls.append(toggleButton);
}

function setIcons() {
    const rewindBtn = document.querySelector("#quickRewindButton");
    const forwardBtn = document.querySelector("#quickFastForwardButton");
    const playBtn = document.querySelector("#playButton");
    const muteBtn = document.querySelector("#muteButton");
    const qualityBtn = document.querySelector("#qualityButton");

    forwardBtn.style = "background-image: none;";
    forwardBtn.append(createIcon("forward_10"));
    rewindBtn.style = "background-image: none;";
    rewindBtn.append(createIcon("replay_10"));
    playBtn.style = "background-image: none;";
    if (playBtn.getAttribute("title") === "Play") {
        playBtn.append(createIcon("play_arrow"));
        paused = true;
    } else {
        playBtn.append(createIcon("pause"));
        paused = false;
    }
    muteBtn.style = "background-image: none; display: flex; flex-direction: column; justify-content: center;";
    muteBtn.getAttribute("title") === "Mute"
        ? muteBtn.append(createIcon("volume_up"))
        : muteBtn.append(createIcon("volume_off"));
    qualityBtn.style = "background-image: none;";
    qualityBtn.classList.add("transport-button");
    qualityBtn.replaceChild(createIcon("tune"), qualityBtn.firstElementChild);

    let playBtnObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
                if (mutation.target.getAttribute("title") === "Play") {
                    playBtn.firstChild.textContent = "play_arrow";
                    paused = true;
                } else {
                    playBtn.firstChild.textContent = "pause";
                    paused = false;
                }
            }
        });
    });

    let muteBtnObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
                let num = parseInt(mutation.target.style.bottom.substring(0, mutation.target.style.bottom.length - 1));
                if (num === 0) {
                    muteBtn.firstElementChild.textContent = "volume_off";
                } else if (num <= 15) {
                    muteBtn.firstElementChild.textContent = "volume_mute";
                }
                else if (num <= 50) {
                    muteBtn.firstElementChild.textContent = "volume_down";
                } else {
                    muteBtn.firstElementChild.textContent = "volume_up";
                }
            }
        });
    });

    playBtnObserver.observe(playBtn, {
        attributes: true,
        attributeFilter: ["title"]
    });

    muteBtnObserver.observe(document.querySelector("#volumeSlider > .ui-slider-handle"), {
        attributes: true,
        attributeFilter: ["style"]
    });
}

function toggleTheaterMode() {
    if (!toggled) {
        setStyles();
        document.querySelector("#theaterModeButton").firstElementChild.textContent = "width_normal";
        let cameraBtn = document.querySelector("#inline4b69bcb8-3435-4084-82c0-ae8500225601");
        cameraBtn.style.display = "none";
        cameraBtn.ariaDisabled = "true";
        let slidesButton = document.querySelector("#inlineslideDeck");
        slidesButton.style.display = "none";
        slidesButton.ariaDisabled = "true";

        return (toggled = true);
    } else {
        document.querySelector("#primaryPlayer").style = "";
        document.querySelector("#playControlsWrapper").style = "";
        document.querySelector("#primaryScreen").style = "";
        document.querySelector("#theaterModeButton").firstElementChild.textContent = "width_full";
        return (toggled = false);
    }
}

injectStyles();
setLayout();
setIcons();


