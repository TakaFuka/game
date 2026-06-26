const DEBUG_MODE = true;

let screens = [];
let currentScreen = null;

let initialVariables = {};
let gameVariables = {};

let screenElapsed = 0;
let previousScreenElapsed = 0;
let gameElapsed = 0;
let counterValue = 0;

let screenTimer = null;
let counterTimer = null;


const taskText =
    document.getElementById("taskText");

const screenTime =
    document.getElementById("screenTime");

const counterDisplay =
    document.getElementById("counter");

const buttonArea =
    document.getElementById("buttonArea");

const debugPanel =
    document.getElementById("debugPanel");

async function loadScreens() {

    const response =
        await fetch("data/screens.json");

    const data =
        await response.json();
        
    initialVariables =
        structuredClone(
            data.variables || {}
        );

    gameVariables =
        structuredClone(
            data.variables || {}
        );

    screens =
        data.screens || [];

    showScreen("start01");
}

function findScreen(id) {

    return screens.find(
        screen => screen.id === id
    );
}

function showScreen(id) {

    previousScreenElapsed =
        screenElapsed;

    currentScreen =
        findScreen(id);

    applyVariableChanges(currentScreen.variableChanges);

    if (currentScreen.type === "start") {

        gameElapsed = 0;

        gameVariables =
            structuredClone(
                initialVariables
            );
    }

    if (!currentScreen) {

        console.error(
            "Screen not found:",
            id
        );

        return;
    }

    taskText.textContent =
        renderText(
            currentScreen.text
        );

    if (currentScreen.showScreenTime) {

        screenTime.style.visibility =
            "visible";

    } else {

        screenTime.style.visibility =
            "hidden";
    }
    
    startScreenTimer();

    startCounter();

    updateScreenText();

    renderButtons();

    updateDebugPanel();
}


function updateScreenText() {

    if (!currentScreen) {

        return;
    }

    taskText.textContent =
        renderText(
            currentScreen.text
        );
}

function startScreenTimer() {

    if (screenTimer) {

        clearInterval(screenTimer);
    }

    screenElapsed = 0;

    updateScreenTime();

    screenTimer = setInterval(() => {

        screenElapsed++;
        if (currentScreen &&currentScreen.type !== "start") {
            gameElapsed++;
        }

        updateScreenTime();
        
        updateScreenText();

        updateButtonVisibility();

        checkAutoTransition();

        updateDebugPanel();

    }, 1000);
}

function updateScreenTime() {

    const minutes =
        Math.floor(screenElapsed / 60);

    const seconds =
        screenElapsed % 60;

    screenTime.textContent =
        String(minutes).padStart(2, "0")
        + ":"
        + String(seconds).padStart(2, "0");
}

function startCounter() {

    if (counterTimer) {

        clearInterval(counterTimer);
    }

    counterValue = 0;

    const config =
        currentScreen.counter;

    if (!config) {

        counterDisplay.textContent = "";

        return;
    }

    switch (config.type) {

        case "none":

            counterDisplay.textContent =
                "";

            break;

        case "countdown":

            startCountdown(config);

            break;

        case "countup":

            startCountup(config);

            break;

        case "elapsed":

            startElapsedCounter();

            break;

        case "timer":

            startTimer(config);

            break;
    }
}

function startCountdown(config) {

    counterValue =
        config.start;

    counterDisplay.textContent =
        counterValue;

    counterTimer = setInterval(() => {

        counterValue--;

        counterDisplay.textContent =
            counterValue;

        updateButtonVisibility();

        checkAutoTransition();

        updateDebugPanel();

        if (counterValue <= 0) {

            clearInterval(counterTimer);
        }

    }, (config.interval || 1) * 1000);
}

function startCountup(config) {

    counterValue = 
        config.start || 0;

    counterDisplay.textContent =
        counterValue;

    counterTimer = setInterval(() => {

        counterValue++;

        counterDisplay.textContent =
            counterValue;

        updateButtonVisibility();

        checkAutoTransition();

        updateDebugPanel();

    }, (config.interval || 1) * 1000);
}

function startElapsedCounter() {

    counterDisplay.textContent =
        "00:00";

    counterTimer = setInterval(() => {

        const minutes =
            Math.floor(screenElapsed / 60);

        const seconds =
            screenElapsed % 60;

        counterDisplay.textContent =
            String(minutes).padStart(2, "0")
            + ":"
            + String(seconds).padStart(2, "0");

    }, 200);
}

function startTimer(config) {

    let remaining =
        config.duration;

    counterValue =
        remaining;

    updateDisplay();

    counterTimer = setInterval(() => {

        remaining--;

        counterValue =
            remaining;

        updateDisplay();

        updateButtonVisibility();

        checkAutoTransition();

        updateDebugPanel();

        if (remaining <= 0) {

            clearInterval(counterTimer);
        }

    }, 1000);

    function updateDisplay() {

        const minutes =
            Math.floor(remaining / 60);

        const seconds =
            remaining % 60;

        counterDisplay.textContent =
            String(minutes).padStart(2, "0")
            + ":"
            + String(seconds).padStart(2, "0");
    }
}


function renderText(
    text
) {

    if (!text) {

        return "";
    }

    return text.replace(

        /\{([^}]+)\}/g,

        (match, expression) => {

            try {

                return evaluateExpression(
                    expression
                );

            } catch(error) {

                console.error(
                    "Text Expression Error:",
                    expression
                );

                return "[ERROR]";
            }
        }
    );
}


function evaluateExpression(expression) {

    if (
        typeof expression ===
        "number"
    ) {

        return expression;
    }

    let expr =
        String(expression);
    
    const variables = {

        ...gameVariables,

        counterValue,

        screenElapsed,

        previousScreenElapsed,

        gameElapsed
    };

    Object.entries(
        variables
    ).forEach(
        ([key, value]) => {

            const regex =
                new RegExp(
                    "\\b" +
                    key +
                    "\\b",
                    "g"
                );

            expr =
                expr.replace(
                    regex,
                    value
                );
        }
    );

    return Function(
        "return (" +
        expr +
        ");"
    )();
}

function setVariable(variableName, expression) {
    try {

        const value =
            evaluateExpression(
                expression
            );

        gameVariables[
            variableName
        ] = value;

    } catch(error) {

        console.error(
            "Variable Error:",
            variableName,
            expression,
            error
        );
    }
}

function applyVariableChanges(changes) {

    if (!changes) {

        return;
    }

    changes.forEach(change => {

        setVariable(
            change.name,
            change.value
        );
    });
}




function compareValues(
    left,
    operator,
    right
) {

    switch (operator) {

        case "==":
            return left == right;

        case "!=":
            return left != right;

        case ">":
            return left > right;

        case ">=":
            return left >= right;

        case "<":
            return left < right;

        case "<=":
            return left <= right;

        default:
            return false;
    }
}

function evaluateCondition(
    condition
) {

    if (!condition) {

        return true;
    }

    switch (condition.type) {

        case "immediate":

            return true;

        case "value":

            return compareValues(

                evaluateExpression(
                    condition.variable
                ),

                condition.operator || ">=",

                evaluateExpression(
                    condition.value
                )
            );

        default:

            return false;
    }
}

function renderButtons() {

    buttonArea.innerHTML = "";

    if (!currentScreen.buttons) {

        return;
    }

    currentScreen.buttons.forEach(
        (button, index) => {

            const btn =
                document.createElement(
                    "button"
                );

            btn.id =
                "button_" + index;

            btn.textContent =
                button.label;

            btn.style.display =
                "none";

            btn.addEventListener(
                "click",
                () => {
                    applyVariableChanges(button.variableChanges);

                    executeTransition(button.transition);
                }
            );

            buttonArea.appendChild(btn);
        }
    );

    updateButtonVisibility();
}

function updateButtonVisibility() {

    if (!currentScreen.buttons) {

        return;
    }

    currentScreen.buttons.forEach(
        (button, index) => {

            const btn =
                document.getElementById(
                    "button_" + index
                );

            if (!btn) {

                return;
            }

            btn.style.display =
                evaluateCondition(
                    button.visibleCondition
                )
                ? "inline-block"
                : "none";
        }
    );
}

function checkAutoTransition() {

    if (
        !currentScreen.autoTransition
    ) {

        return;
    }

    const auto =
        currentScreen.autoTransition;

    if (
        evaluateCondition(
            auto.condition
        )
    ) {

        executeTransition(
            auto.transition
        );
    }
}


function getRandomPool(poolConfig) {

    if (!poolConfig) {

        return [];
    }

    // pool:"task"

    if (typeof poolConfig === "string") {

        return screens.filter(
            screen =>
                screen.type === poolConfig
        );
    }

    // pool:[...]

    if (Array.isArray(poolConfig)) {

        return screens.filter(screen => {

            return poolConfig.some(item =>

                screen.id === item ||

                screen.type === item
            );
        });
    }

    return [];
}

function getWeight(
    screen,
    weightsConfig
) {

    const defaultWeight =
        screen.defaultWeight ?? 1;

    if (!weightsConfig) {

        return defaultWeight;
    }

    if (
        weightsConfig[
            screen.id
        ] !== undefined
    ) {

        return weightsConfig[
            screen.id
        ];
    }

    if (
        weightsConfig.else !==
        undefined
    ) {

        return weightsConfig.else;
    }

    return defaultWeight;
}

function chooseWeightedScreen(
    candidates,
    weightsConfig
) {

    const weightedList = [];

    let totalWeight = 0;

    candidates.forEach(screen => {

        const weight =
            getWeight(
                screen,
                weightsConfig
            );

        if (weight <= 0) {

            return;
        }

        weightedList.push({
            screen,
            weight
        });

        totalWeight += weight;
    });

    if (totalWeight <= 0) {

        console.warn(
            "No selectable screens"
        );

        return null;
    }

    const random =
        Math.random() *
        totalWeight;

    let cumulative = 0;

    for (
        const item of weightedList
    ) {

        cumulative += item.weight;

        if (
            random <
            cumulative
        ) {

            return item.screen;
        }
    }

    return weightedList[
        weightedList.length - 1
    ].screen;
}

function executeRandomTransition(
    transition
) {

    const candidates =
        getRandomPool(
            transition.pool
        );

    const selected =
        chooseWeightedScreen(
            candidates,
            transition.weights
        );

    if (!selected) {

        console.warn(
            "Random transition failed"
        );

        return;
    }

    showScreen(
        selected.id
    );
}


function executeTransition(transition) {
    applyVariableChanges(transition.variableChanges);

    if (!transition) {

        return;
    }

    switch (transition.type) {

        case "fixed":

            showScreen(
                transition.target
            );

            break;
        case "random":
            executeRandomTransition(
                transition
            );
            break;
    }
}

function updateDebugPanel() {
    if (!DEBUG_MODE) {
        return;
    }

    if (!debugPanel) {
        return;
    }

    debugPanel.innerHTML = `
        currentScreen:
        ${currentScreen?.id}
        <br>

        screenElapsed:
        ${screenElapsed}
        <br>
        
        gameElapsed:
        ${gameElapsed}
        <br>

        previousScreenElapsed:
        ${previousScreenElapsed}
        <br>

        counterValue:
        ${counterValue}
        <br>

        Variables:
        ${JSON.stringify(gameVariables)}
    `;
}

loadScreens();