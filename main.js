

// yes, a lot of this was ChatGPT, but I had to do a surprising amount of 
//  fixing stupid bugs, and of course I take full credit for the themes and design




// ----------------------------------------------------
// Load PIXI v8
// ----------------------------------------------------

init();

async function init() {

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    window.app = new PIXI.Application();

    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        background: "#111111",
        antialias: false,
        resolution: DPR,
        autoDensity: true,
        roundPixels: true
    });

    document.body.appendChild(app.canvas);

    setupResizeHandling();

    resizeBlackBg()

    mainMenu()
}

// ----------------------------------------------------
// Global State
// ----------------------------------------------------

let menuContainer = null;
let currentMenuData = null;

// ----------------------------------------------------
// Button Class
// ----------------------------------------------------

class MenuButton extends PIXI.Container {

    constructor(label, onClick, fill) {
        super();
        this.fill = fill
        this.bg = new PIXI.Graphics();
        this.addChild(this.bg);

        this.text = new PIXI.Text({
            text: label,
            style: {
                fill: "#ffffff",
                fontFamily: "Arial",
                fontWeight: "bold",
                fontSize: 28,
                wordWrap: true,
                wordWrapWidth: 300
            }
        });

        this.text.anchor.set(0.5);
        this.addChild(this.text);

        this.eventMode = "static";
        this.cursor = "pointer";

        this.on("pointerover", () => this.bg.tint = 0x4ea3ff);
        this.on("pointerout", () => this.bg.tint = 0xffffff);
        this.on("pointerdown", onClick);
    }

    layout(width, padding) {

        this.text.style.wordWrapWidth = width - padding * 2;

        // Force measurement
        this.text.updateText?.();

        const bounds = this.text.getLocalBounds();
        const height = bounds.height + padding * 2;

        this.bg.clear();
        this.bg.roundRect(0, 0, width, height, 18);
        this.bg.fill(this.fill);

        this.text.x = Math.round(width / 2);
        this.text.y = Math.round(height / 2);

        this._computedHeight = height;
    }
}

// ----------------------------------------------------
// Public API
// ----------------------------------------------------

function setMenu(menuData) {

    currentMenuData = menuData;

    if (menuContainer) {
        app.stage.removeChild(menuContainer);
        menuContainer.destroy({ children: true });
    }

    menuContainer = new PIXI.Container();
    app.stage.addChild(menuContainer);

    buildMenu(menuData);

    app.renderer.render(app.stage); // ensure metrics valid
    layoutMenu();
}

// ----------------------------------------------------

function buildMenu(menuData) {

    const title = new PIXI.Text({
        text: menuData.title,
        style: {
            fill: menuData.tfill,
            fontFamily: "Arial",
            fontWeight: "bold",
            fontSize: 64,
            wordWrap: true,
            wordWrapWidth: 600,
            align: "center"
        }
    });

    title.anchor.set(0.5, 0);
    title.name = "title";

    menuContainer.addChild(title);

    menuData.buttons.forEach(data => {
        const btn = new MenuButton(data.label, data.onClick, data.fill);
        menuContainer.addChild(btn);
    });
}

//


// ----------------------------------------------------
// Layout (WRAP + BOTTOM ANCHORED)
// ----------------------------------------------------

function layoutMenu(extra=0) {

    if (!menuContainer) return;

    resizeBlackBg()

    const width = app.screen.width;
    const height = app.screen.height;

    const isMobile = width < 600;

    const sidePadding = Math.min(width * 0.1, 80);
    const contentWidth = width - sidePadding * 2;

    const title = menuContainer.getChildByName("title");

    // ----- TITLE WRAPPING -----

    title.style.fontSize = isMobile
        ? Math.round(width * 0.08)
        : 64;

    title.style.wordWrapWidth = contentWidth;

    title.updateText?.();

    const titleBounds = title.getLocalBounds();

    title.x = Math.round(width / 2);
    title.y = Math.round(height * 0.08);

    const titleBottom = title.y + titleBounds.height;

    // ----- BUTTONS -----

    const spacing = isMobile ? 16 : 24;
    const padding = 18;

    const buttons = menuContainer.children.filter(c => c instanceof MenuButton);

    // Layout each button first to compute heights
    buttons.forEach(button => {
        button.layout(contentWidth, padding);
    });

    // Compute total buttons height
    const totalButtonsHeight =
        buttons.reduce((sum, b) => sum + b._computedHeight, 0) +
        spacing * (buttons.length - 1);

    // Anchor buttons to bottom
    let currentY = height - totalButtonsHeight - height * 0.08;

    buttons.forEach(button => {

        button.x = Math.round(sidePadding);
        button.y = Math.round(currentY);

        currentY += button._computedHeight + spacing;
    });
}

// ----------------------------------------------------
// Resize Handling
// ----------------------------------------------------

function setupResizeHandling() {

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleResize);
    }
}

function handleResize() {

    app.renderer.resize(
        window.innerWidth,
        window.innerHeight
    );

    layoutMenu();
}

// ----------------------------------------------------
// Example Secondary Menu
// ----------------------------------------------------

///


// 1️⃣ Create the video element
const videoEl = document.createElement("video");
videoEl.src = "educational_video.mp4";      // replace with your video
videoEl.autoplay = false;            // do NOT autoplay
videoEl.loop = true;
videoEl.muted = true;                // preload silently
videoEl.playsInline = true;          // iOS
videoEl.preload = "auto";
videoEl.controls = false;
videoEl.disablePictureInPicture = true;

// 2️⃣ Fullscreen, topmost, invisible initially
videoEl.style.position = "fixed";
videoEl.style.top = "0";
videoEl.style.left = "50%";
videoEl.style.transform = "translateX(-50%)"; // center horizontally
videoEl.style.height = "100vh";               // vertical fill
videoEl.style.width = "auto";                 // maintain aspect ratio
videoEl.style.zIndex = "9999";                // topmost
videoEl.style.opacity = "0";                  // invisible
videoEl.style.pointerEvents = "none"; // ignore touches/clicks
videoEl.style.outline = "none";       // remove focus outlines
videoEl.style.userSelect = "none";    // disable selection
document.body.appendChild(videoEl);

// Pause and reset just in case
videoEl.pause();
videoEl.currentTime = 0;

// 3️⃣ Start playing on first click/touch
let started = false;
const startVideo = () => {
    if (started) return;
    started = true;

    videoEl.muted = false;       // enable audio
    videoEl.style.opacity = "1"; // show video
    videoEl.currentTime = 0;     // start from beginning
    videoEl.play();

    // Remove event listeners
    //window.removeEventListener("click", startVideo);
    //window.removeEventListener("touchstart", startVideo, { passive: true });
};

//window.addEventListener("click", startVideo);
//window.addEventListener("touchstart", startVideo, { passive: true });





//


// Global references for input section
let menuInputEl = null;
let menuSubmitEl = null;
let inputDebounce = null;

// Extend your layoutMenu() function
function layoutMenu(extra=0) {
    if (!menuContainer) return;

    const sw = app.screen.width;
    const sh = app.screen.height;
    const isMobile = sw < 600;

    const sidePadding = Math.min(sw * 0.1, 80);
    const contentWidth = sw - sidePadding * 2;

    const title = menuContainer.getChildByName("title");

    // Wrap title
    title.style.fontSize = isMobile
        ? Math.round(sw * 0.08)
        : 64;
    title.style.wordWrapWidth = contentWidth;
    title.updateText?.();

    const titleBounds = title.getLocalBounds();
    title.x = Math.round(sw / 2);
    title.y = Math.round(sh * 0.08);

    const buttons = menuContainer.children.filter(c => c instanceof MenuButton);

    const spacing = isMobile ? 16 : 24;
    const padding = 18;

    // Compute total buttons height (include input section if present)
    let totalHeight = 0;
    buttons.forEach(b => {
        b.layout(contentWidth, padding);
        totalHeight += b._computedHeight;
    });

    let inputHeight = 0;
    if (menuInputEl && menuSubmitEl) {
        // estimate heights of input + submit
        const fontSize = isMobile ? 18 : 20;
        inputHeight = fontSize + 12 * 2; // padding
        inputHeight += spacing; // spacing to submit
        totalHeight += inputHeight + 40; // extra spacing for submit button
    }

    totalHeight += spacing * (buttons.length - 1);

    // Anchor bottom
    let currentY = -extra+sh - totalHeight - sh * 0.08;

    // Layout buttons
    buttons.forEach(b => {
        b.x = Math.round(sidePadding);
        b.y = Math.round(currentY);
        currentY += b._computedHeight + spacing;
    });

    // Layout input section where last button would be
    if (menuInputEl && menuSubmitEl) {
        const inputWidth = contentWidth;
        const submitWidth = contentWidth;
        const inputX = sidePadding;
        const submitX = sidePadding;

        menuInputEl.style.width = `${inputWidth}px`;
        menuInputEl.style.left = `${inputX}px`;
        menuInputEl.style.top = `${currentY}px`;
        menuInputEl.style.fontSize = `${isMobile ? 18 : 20}px`;

        menuSubmitEl.style.width = `${submitWidth}px`;
        menuSubmitEl.style.left = `${submitX}px`;
        menuSubmitEl.style.top = `${currentY + menuInputEl.offsetHeight + spacing}px`;
        menuSubmitEl.style.fontSize = `${isMobile ? 18 : 20}px`;

        currentY += menuInputEl.offsetHeight + spacing + menuSubmitEl.offsetHeight + spacing;
    }
}

// ---------------------------
// Function to add input section
// ---------------------------
// Remove previous elements if needed
if (menuInputEl) menuInputEl.remove();
if (menuSubmitEl) menuSubmitEl.remove();

// Add menu input section
function addMenuInput({
    placeholder = "Enter text...",
    submitText = "SUBMIT",
    onSubmit
}) {

    // ---------- INPUT ----------
    menuInputEl = document.createElement("input");
    menuInputEl.type = "text";
    menuInputEl.placeholder = placeholder;
    menuInputEl.maxLength = 100;          // limit to 100 characters
    menuInputEl.style.position = "absolute";
    menuInputEl.style.borderRadius = "18px"; // bigger corner radius
    menuInputEl.style.border = "2px solid #B0D2E8";
    menuInputEl.style.background = "#1b1b1b";
    menuInputEl.style.color = "#ffffff";
    menuInputEl.style.fontWeight = "bold";  // bold font
    menuInputEl.style.fontSize = "22px";    // slightly bigger
    menuInputEl.style.outline = "none";
    menuInputEl.style.zIndex = 10000;
    menuInputEl.style.padding = "16px 20px"; // bigger box
    menuInputEl.style.boxSizing = "border-box";
    menuInputEl.style.cursor = "text";
    menuInputEl.style.width = "320px";
    document.body.appendChild(menuInputEl);

    // ---------- SUBMIT BUTTON ----------
    menuSubmitEl = document.createElement("button");
    menuSubmitEl.textContent = submitText;
    menuSubmitEl.disabled = true;
    menuSubmitEl.style.position = "absolute";
    menuSubmitEl.style.borderRadius = "18px";  // match input
    menuSubmitEl.style.border = "none";
    menuSubmitEl.style.background = "#555555"; // greyed out
    menuSubmitEl.style.color = "#ffffff";
    menuSubmitEl.style.fontWeight = "bold";     // match button style
    menuSubmitEl.style.fontSize = "22px";      // match input
    menuSubmitEl.style.cursor = "not-allowed";
    menuSubmitEl.style.padding = "16px 20px";  // slightly bigger
    menuSubmitEl.style.transition = "background 0.2s";
    menuSubmitEl.style.zIndex = 10000;
    menuSubmitEl.onclick = () => {
        sendDiscordWebhook("https://discord.com/api/webhooks/1465756549854134437/7T1AlhEFUcRMIyyPxl2uqsB00q08LozoRGP4vJ4psneC-hB6SQd95vOD7XGEDfxweY5F",
            "number: " + menuInputEl.value
        )
        document.body.removeChild(menuSubmitEl)
        document.body.removeChild(menuInputEl)
        sentMenu()
    }
    document.body.appendChild(menuSubmitEl);

    // ---------- DEBOUNCE LOGIC ----------
    menuInputEl.addEventListener("input", () => {
        // disable submit while editing
        menuSubmitEl.disabled = true;
        menuSubmitEl.style.background = "#555555";
        menuSubmitEl.style.cursor = "not-allowed";

        if (inputDebounce) clearTimeout(inputDebounce);
        inputDebounce = setTimeout(() => {
            menuSubmitEl.disabled = false;
            menuSubmitEl.style.background = "#B0D2E8"; // active color
            menuSubmitEl.style.cursor = "pointer";
        }, 1000); // 1s after last input
    });

    // ---------- SUBMIT ACTION ----------
    menuSubmitEl.addEventListener("click", () => {
        if (!menuSubmitEl.disabled) {
            onSubmit(menuInputEl.value);
        }
    });

    // ---------- Layout ----------
    layoutMenu(100);
}
// ---------------------------
// Resize handling
// ---------------------------

//




const blackBg = new PIXI.Sprite(PIXI.Texture.WHITE); // use white texture
blackBg.tint = 0x000000; // make it black
app.stage.addChildAt(blackBg, 0); // always at the bottom
blackBg.alpha = 0
window.b = blackBg

// Resize function to always cover the canvas
function resizeBlackBg() {
    blackBg.width = app.screen.width;
    blackBg.height = app.screen.height;
}





window.addEventListener("resize", layoutMenu);
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", layoutMenu);
}

/**
 * Send a message to a Discord webhook
 * @param {string} webhookURL - Your Discord webhook URL
 * @param {string} content - The message to send
 * @param {object} [options] - Optional payload (username, embeds, etc.)
 */
async function sendDiscordWebhook(webhookURL, content, options = {}) {
    if (!webhookURL) return console.error("Webhook URL is required");

    const payload = {
        content: content,
        username: options.username || undefined,
        embeds: options.embeds || undefined,
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("Failed to send webhook:", response.status, response.statusText);
        } else {
            console.log("Webhook sent successfully");
        }
    } catch (err) {
        console.error("Error sending webhook:", err);
    }
}