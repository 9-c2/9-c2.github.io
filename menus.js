function showOptionsMenu() {

    setMenu({
        title: "Options Menu With A Very Long Title That Wraps Properly",
        tfill: 0xffffff,
        buttons: [
            { label: "Audio Settings And Sound Controls", onClick: () => {}, fill: 0x2d8cff},
            { label: "Graphics And Display Options", onClick: () => {} , fill: 0x2d8cff},
            { label: "Back To Main Menu", onClick: () => setMenu(currentMenuData) , fill: 0x2d8cff}
        ]
    });
}

function beforeSendMenu() {
    app.renderer.background.color="#DE5D91"
    setMenu({
        title: "My room is RDB 203 (staircase 5, floor 2, overlooking BEV gardens)",
        tfill: "#FAC4B4",
        buttons: [
            { label: "i want to swap", onClick: () => sendMenu(), fill: "#DEA85D"},
            { label: "i need more convincing plz", onClick: () => whyMenu() , fill: "#DEA85D"},
        ]
    });
}

function mainMenu() {
    setMenu({
        title: "Please SWAP WITH ME!!!!",
        tfill: 0xffffff,
        buttons: [
            { label: "ok", onClick: () => beforeSendMenu(), fill: 0x2d8cff },
            { label: "no", onClick: () => startVideo(), fill: 0x2d8cff },
            { label: "maybe", onClick: () => maybeMenu() , fill: 0x2d8cff}
        ]
    });
}

function maybeMenu() {
    setMenu({
        title: "Choose an option plz",
        tfill: 0xffffff,
        buttons: [
            { label: "i want to know what room", onClick: () => beforeSendMenu(), fill: 0x2d8cff },
            { label: "i want reasons why", onClick: () => whyMenu(), fill: 0x2d8cff },
            { label: "im bored and here for fun", onClick: () => boredMenu() , fill: 0x2d8cff}
        ]
    });
}

function whyMenu() {
    app.renderer.background.color="#D162F5"
    setMenu({
        title: "Facts and logic",
        tfill: "#c6beff",
        buttons: [
            { label: "view is good", onClick: () => viewMenu(), fill: "#539804" },
            { label: "floor is good", onClick: () => floorMenu(), fill: "#539804" },
            { label: "staircase is good", onClick: () => staircaseMenu() , fill: "#539804"},
            { label: "why im not staying", onClick: () => notStayingMenu() , fill: "#a7032c"},
            { label: "im convinced", onClick: () => beforeSendMenu() , fill: "#929c05"},
        ]
    });
}

function notStayingMenu() { // TODO img
    app.renderer.background.color="#000000"
    setMenu({
        title: "I don't like rooms above 1st floor since I imagine the building will sway and fall over irrationally :(",
        tfill: "#7643a0",
        buttons: [
            { label: "back", onClick: () => whyMenu() , fill: "#9a2696"}
        ]
    });
}

function viewMenu() { // TODO img
    app.renderer.background.color="#709642"
    setMenu({
        title: "The view is into BEV gardens which WILL have some nice grass growing, and you still get decent sun. ALSO it's more private",
        tfill: "#f7ff1b",
        buttons: [
            { label: "back", onClick: () => whyMenu() , fill: "#7b8138"}
        ]
    });
}

function floorMenu() { // TODO img
    app.renderer.background.color="#709642"
    setMenu({
        title: "The floor is floor 2, which is not too bad in terms of stairs and decreases probability of mould/spiders",
        tfill: "#f7ff1b",
        buttons: [
            { label: "back", onClick: () => whyMenu() , fill: "#7b8138"}
        ]
    });
}

function staircaseMenu() { // TODO img
    app.renderer.background.color="#709642"
    setMenu({
        title: "Most private staircase, small number of people so less unwanted distruptions (but still near everyone else e.g. staircase 6)",
        tfill: "#f7ff1b",
        buttons: [
            { label: "back", onClick: () => whyMenu() , fill: "#7b8138"}
        ]
    });
}

window.theme_set = false

function boredMenu() {
    app.renderer.background.color="#94c851"
    setMenu({
        title: "Ok the deal is, if this entertains you, you need to find someone who might want to swap",
        tfill: 0xffffff,
        buttons: [
            { label: window.theme_set ? "REFRESH TO CHANGE THEME :0" : "THEMES", onClick: () => {if(!window.theme_set)themesMenu()}, fill: "#d4b656" },
            { label: "crash the website (literally just crashes the website)", onClick: () => {while(1){}}, fill: 0x2d8cff },
            { label: "credits", onClick: () => creditsMenu(), fill: "#e73eba" },
            { label: "more info", onClick: () => moreInfoMenu(), fill: "#e73eba" }
        ]
    });
}

function creditsMenu() {
    app.renderer.background.color="#e73eba"
    setMenu({
        title: "ChatGPT, me, and at least one iceberg. Refresh the page now :/",
        tfill: 0,
        buttons: [
        ]
    });
}

function sentMenu() {
    app.renderer.background.color="#e73eba"
    setMenu({
        title: "DONE !!!!!!!!!!! THANK YOU SO MUCH",
        tfill: 0,
        buttons: [
        ]
    });
}

function moreInfoMenu() {
    app.renderer.background.color="#e73eba"
    setMenu({
        title: "I made this in about 4 hours of delirium and sleep deprivation. I wanted to add images and stuff but that didn't happen. Refresh the page now :/",
        tfill: 0,
        buttons: [
        ]
    });
}

function themesMenu() {
    setMenu({
        title: "These buttons will take you back to the newly transformed home page",
        tfill: 0xffffff,
        buttons: [
            { label: "blood", onClick: () => {
                window.theme_set = true
                window.b.alpha = 1
                app.stage.filters=[new PIXI.filters.OldFilmFilter,new PIXI.filters.ColorReplaceFilter]
                t=0;app.ticker.add(()=>{t++;app.stage.filters[0].seed=t;app.stage.filters[1].tolerance=Math.sin(t/100)+1})
                mainMenu()
            }, fill: 0x2d8cff },
            { label: "3d colourblind", onClick: () => {
                window.theme_set = true
                window.b.alpha = 1
                app.stage.filters=[new PIXI.filters.EmbossFilter]
                t=0;app.ticker.add(()=>{t++;app.stage.filters[0].strength=Math.sin(t/25)*3+4})
                mainMenu()
            }, fill: 0x2d8cff },
            { label: "more coming soon as I get increasingly desperate", onClick: () => {}, fill: "#5c5c5c" },
        ]
    });
}


function sendMenu() {
    app.renderer.background.color="#61F5E2"
    {
                setMenu({
                    title: "If you are serious about a swap then contact me :) (scroll on a phone if needed)",
                    tfill: "#0A04F0",
                    buttons: []
                });
                addMenuInput({
                    placeholder: "enter number no spaces",
                    submitText: "SWAP!!!",
                    onSubmit: text => console.log("User submitted:", text)
                });
                // In addMenuInput(), modify the input element for phone number:
                menuInputEl.type = "tel"; // text because we need '+'
menuInputEl.maxLength = 16; // optional limit

// Regex for validation: optional + at start, then digits
const phoneRegex = /^\+?\d+$/;

menuInputEl.addEventListener("input", e => {
    let val = e.target.value;

    // Remove invalid characters (allow digits and optional leading +)
    if (val.length > 0) {
        if (val[0] === "+") {
            val = "+" + val.slice(1).replace(/\D/g, "");
        } else {
            val = val.replace(/\D/g, "");
        }
    }

    e.target.value = val;

    // Grey out submit while typing / debounce
    menuSubmitEl.disabled = true;
    menuSubmitEl.style.background = "#555555";
    menuSubmitEl.style.cursor = "not-allowed";

    if (inputDebounce) clearTimeout(inputDebounce);
    inputDebounce = setTimeout(() => {
        // Enable submit only if input matches regex
        const valid = phoneRegex.test(val);
        menuSubmitEl.disabled = !valid;
        menuSubmitEl.style.background = valid ? "#2d8cff" : "#555555";
        menuSubmitEl.style.cursor = valid ? "pointer" : "not-allowed";
    }, 1000); // 1s after last edit
});
            }
}