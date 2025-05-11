
// Exchange rates
const exchangeRates = {
    ARRR_TO_BTC: 0.0000037,
    ARRR_TO_USD: 0.54,
    ARRR_TO_EUR: 0.49,
    ARRR_TO_VRSC: 0.89,
    ARRR_TO_KMD: 0.75
};

// State variables
let isReverseMode = false;
let currentCurrency = '';

// DOM Elements
const amountInput = document.getElementById('arrr-amount');
const convertBtn = document.getElementById('convert-btn');
const amountLabel = document.getElementById('amount-label');
const btcValue = document.getElementById('btc-value');
const usdValue = document.getElementById('usd-value');
const eurValue = document.getElementById('eur-value');
const vrscValue = document.getElementById('vrsc-value');
const kmdValue = document.getElementById('kmd-value');
const themeSelect = document.getElementById('theme-select');
const toast = document.getElementById('toast');
const luckyAnimation = document.getElementById('lucky-animation');
const closeAnimationBtn = document.getElementById('close-animation');
const treasureChest = document.getElementById('treasure-chest');
const zeroErrorAnimation = document.getElementById('zero-error-animation');
const closeZeroAnimationBtn = document.getElementById('close-zero-animation');

// Add event listeners
window.onload = function() {
    // Convert button
    convertBtn.onclick = function() {
        if (isReverseMode) {
            doReverseConvert(currentCurrency);
        } else {
            doConvert();
        }
    };
    
    // Theme selector
    themeSelect.onchange = function() {
        changeTheme();
    };
    
    // Swap buttons
    document.getElementById('swap-btc').onclick = function() {
        setupReverseConversion('BTC', parseFloat(btcValue.textContent));
    };
    
    document.getElementById('swap-usd').onclick = function() {
        setupReverseConversion('USD', parseFloat(usdValue.textContent.replace('$', '')));
    };
    
    document.getElementById('swap-eur').onclick = function() {
        setupReverseConversion('EUR', parseFloat(eurValue.textContent.replace('€', '')));
    };
    
    document.getElementById('swap-vrsc').onclick = function() {
        setupReverseConversion('VRSC', parseFloat(vrscValue.textContent));
    };
    
    document.getElementById('swap-kmd').onclick = function() {
        setupReverseConversion('KMD', parseFloat(kmdValue.textContent));
    };
    
    // Close animation buttons
    closeAnimationBtn.onclick = function() {
        luckyAnimation.classList.remove('show');
    };
    
    closeZeroAnimationBtn.onclick = function() {
        zeroErrorAnimation.classList.remove('show');
    };
    
    // Enter key in input
    amountInput.onkeyup = function(event) {
        if (event.key === 'Enter') {
            if (isReverseMode) {
                doReverseConvert(currentCurrency);
            } else {
                doConvert();
            }
        }
    };
    
    // Automatically select embed code on click
    const embedCode = document.querySelector('.embed-code');
    if (embedCode) {
        embedCode.onclick = function() {
            this.select();
            showToast('Embed code copied! Update the URL before using.');
        };
    }
    
    // Initial conversion
    doConvert();
};

// Conversion function
function doConvert() {
    const amount = parseFloat(amountInput.value) || 0;
    
    // Check for zero value
    if (amount === 0) {
        playZeroErrorAnimation();
        return;
    }
    
    // Check for lucky 777
    if (amount === 777) {
        playLucky777Animation();
    }
    
    // Calculate conversions
    const btcAmount = amount * exchangeRates.ARRR_TO_BTC;
    const usdAmount = amount * exchangeRates.ARRR_TO_USD;
    const eurAmount = amount * exchangeRates.ARRR_TO_EUR;
    const vrscAmount = amount * exchangeRates.ARRR_TO_VRSC;
    const kmdAmount = amount * exchangeRates.ARRR_TO_KMD;
    
    // Update display
    btcValue.textContent = btcAmount.toFixed(8);
    usdValue.textContent = '$' + usdAmount.toFixed(2);
    eurValue.textContent = '€' + eurAmount.toFixed(2);
    vrscValue.textContent = vrscAmount.toFixed(4);
    kmdValue.textContent = kmdAmount.toFixed(4);
    
    // Animation
    animateResults();
}

// Zero Error animation
function playZeroErrorAnimation() {
    zeroErrorAnimation.classList.add('show');
}

// Lucky 777 animation
function playLucky777Animation() {
    // Create falling coins
    treasureChest.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = Math.random() * 100 + '%';
        coin.style.animationDelay = Math.random() * 2 + 's';
        treasureChest.appendChild(coin);
    }
    
    // Show animation
    luckyAnimation.classList.add('show');
}

// Reverse conversion
function doReverseConvert(currency) {
    const amount = parseFloat(amountInput.value) || 0;
    
    // Check for zero value
    if (amount === 0) {
        playZeroErrorAnimation();
        return;
    }
    
    let arrrResult = 0;
    
    // Calculate ARRR amount
    switch(currency) {
        case 'BTC':
            arrrResult = amount / exchangeRates.ARRR_TO_BTC;
            break;
        case 'USD':
            arrrResult = amount / exchangeRates.ARRR_TO_USD;
            break;
        case 'EUR':
            arrrResult = amount / exchangeRates.ARRR_TO_EUR;
            break;
        case 'VRSC':
            arrrResult = amount / exchangeRates.ARRR_TO_VRSC;
            break;
        case 'KMD':
            arrrResult = amount / exchangeRates.ARRR_TO_KMD;
            break;
    }
    
    // Check for lucky 777
    if (arrrResult === 777) {
        playLucky777Animation();
    }
    
    // Update display for all other currencies
    const btcResult = arrrResult * exchangeRates.ARRR_TO_BTC;
    const usdResult = arrrResult * exchangeRates.ARRR_TO_USD;
    const eurResult = arrrResult * exchangeRates.ARRR_TO_EUR;
    const vrscResult = arrrResult * exchangeRates.ARRR_TO_VRSC;
    const kmdResult = arrrResult * exchangeRates.ARRR_TO_KMD;
    
    btcValue.textContent = currency === 'BTC' ? amount.toFixed(8) : btcResult.toFixed(8);
    usdValue.textContent = currency === 'USD' ? '$' + amount.toFixed(2) : '$' + usdResult.toFixed(2);
    eurValue.textContent = currency === 'EUR' ? '€' + amount.toFixed(2) : '€' + eurResult.toFixed(2);
    vrscValue.textContent = currency === 'VRSC' ? amount.toFixed(4) : vrscResult.toFixed(4);
    kmdValue.textContent = currency === 'KMD' ? amount.toFixed(4) : kmdResult.toFixed(4);
    
    // Show result toast
    showToast(`${amount} ${currency} = ${arrrResult.toFixed(4)} ARRR`);
    
    // Animation
    animateResults();
}

// Setup for reverse conversion
function setupReverseConversion(currency, value) {
    if (!isReverseMode || (isReverseMode && currentCurrency !== currency)) {
        // Switch to reverse mode
        isReverseMode = true;
        currentCurrency = currency;
        
        // Update UI
        amountLabel.textContent = `Enter ${currency} Amount:`;
        amountInput.placeholder = `How many ${currency} ye be havin'?`;
        convertBtn.textContent = `Convert to ARRR`;
        amountInput.value = value;
        
        // Change button action
        convertBtn.onclick = function() { doReverseConvert(currency); };
        
        // Highlight selected currency
        highlightCurrency(currency);
    } else {
        // Switch back to normal mode
        resetToNormalMode();
    }
}

// Reset to normal conversion mode
function resetToNormalMode() {
    isReverseMode = false;
    currentCurrency = '';
    
    // Reset UI
    amountLabel.textContent = 'Enter ARRR Amount:';
    amountInput.placeholder = 'How many ARRR ye be havin\'?';
    convertBtn.textContent = 'Convert Me Booty!';
    amountInput.value = 1;
    
    // Reset button action
    convertBtn.onclick = doConvert;
    
    // Clear highlights
    resetHighlights();
    
    // Update conversion
    doConvert();
}

// Highlight selected currency
function highlightCurrency(currency) {
    resetHighlights();
    
    // Find and highlight the selected currency
    document.querySelectorAll('.result-item').forEach(item => {
        const currencyText = item.querySelector('.currency').textContent;
        if (currencyText.includes(currency)) {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

// Reset all highlights
function resetHighlights() {
    document.querySelectorAll('.result-item').forEach(item => {
        item.style.backgroundColor = '';
    });
}

// Animate results panel
function animateResults() {
    const resultsPanel = document.getElementById('results');
    resultsPanel.style.backgroundColor = '#1a5e8c';
    setTimeout(function() {
        resultsPanel.style.backgroundColor = '';
    }, 300);
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// Change theme
function changeTheme() {
    const selectedTheme = themeSelect.value;
    
    if (selectedTheme === 'pirate-ocean') {
        document.body.className = '';
    } else if (selectedTheme === 'dark-treasure') {
        document.body.className = 'theme-dark-treasure';
    } else if (selectedTheme === 'tropical') {
        document.body.className = 'theme-tropical';
    } else if (selectedTheme === 'royal-navy') {
        document.body.className = 'theme-royal-navy';
    } else if (selectedTheme === 'ghost-ship') {
        document.body.className = 'theme-ghost-ship';
    } else if (selectedTheme === 'caribbean-pirate') {
        document.body.className = 'theme-caribbean-pirate';
    } else if (selectedTheme === 'white-sail') {
        document.body.className = 'theme-white-sail';
    }
}

// Save theme to local storage
function saveTheme() {
    localStorage.setItem('pirateTheme', themeSelect.value);
}

// Load theme from local storage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('pirateTheme');
    if (savedTheme) {
        themeSelect.value = savedTheme;
        changeTheme();
    }
}