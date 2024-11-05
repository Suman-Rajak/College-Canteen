const fixedItems = [
    { name: "Tea", price: 10 },
    { name: "Coffee", price: 12 },
    { name: "Idly", price: 15 },
    { name: "Vada", price: 15 },
    { name: "Puri", price: 6 },
    { name: "Roti", price: 5 },
    { name: "Aalu Dam", price: 10 },
    { name: "Ghoogni", price: 15 },
    { name: "Idly", price: 30 },
    // Add more fixed items here if needed
];

// Function to create HTML for fixed items
function createFixedItemsHTML() {
    return fixedItems.map(item => `
        <div class="food-item">
            <label>${item.name}</label>
            <input type="number" class="item-quantity" data-price="${item.price}" value="0" onchange="calculateTotal(this)">
        </div>
    `).join('');
}

// Function to calculate total for each friend
function calculateTotal(element) {
    const friendDiv = element.closest('.friend');
    const quantities = friendDiv.querySelectorAll('.item-quantity');
    let total = 0;

    // Calculate total from fixed items
    quantities.forEach(q => {
        total += q.value * q.dataset.price;
    });

    // Process other items
    const otherItemNames = friendDiv.querySelector('.other-item-names').value.split(',').map(item => item.trim());
    const otherItemPrices = friendDiv.querySelector('.other-item-prices').value.split(',').map(price => parseFloat(price.trim()));
    const otherItemQuantities = friendDiv.querySelector('.other-item-quantities').value.split(',').map(quantity => parseInt(quantity.trim()));

    let otherTotalText = '';

    // Calculate total from other items
    otherItemNames.forEach((name, index) => {
        const price = otherItemPrices[index] || 0;
        const quantity = otherItemQuantities[index] || 0;
        const itemTotal = price * quantity;

        if (itemTotal > 0) {
            otherTotalText += `${name} (${price}) X ${quantity} -> ${itemTotal}\n`;
        }

        total += itemTotal; // Add to total
    });

    // Update friend total display
    friendDiv.querySelector('.friend-total').innerText = total;

    // Update grand total
    updateGrandTotal();
}

// Function to update grand total
function updateGrandTotal() {
    const friendTotals = document.querySelectorAll('.friend-total');
    let grandTotal = 0;

    friendTotals.forEach(total => {
        grandTotal += parseFloat(total.innerText);
    });

    document.getElementById('grand-total').innerText = grandTotal;
}

function copyToClipboard() {
    let text = '';
    const friends = document.querySelectorAll('.friend');

    // Calculate general items
    const generalItemNames = document.getElementById('general-item-names').value.split(',');
    const generalItemPrices = document.getElementById('general-item-prices').value.split(',');
    const generalItemQuantities = document.getElementById('general-item-quantities').value.split(',');
    
    let generalItemsOutput = '';
    let generalTotal = 0; // Initialize general total for clipboard

    generalItemNames.forEach((itemName, index) => {
        const price = parseFloat(generalItemPrices[index]) || 0;
        const quantity = parseInt(generalItemQuantities[index]) || 0;
        const itemTotal = price * quantity;

        if (itemTotal > 0) {
            generalItemsOutput += `${itemName.trim()} (${price}) X ${quantity} -> ${itemTotal}\n`;
            generalTotal += itemTotal; // Update general total
        }
    });

    friends.forEach(friend => {
        const name = friend.querySelector('.friend-name').innerText;
        const total = friend.querySelector('.friend-total').innerText;

        if (total > 0) {
            const quantities = friend.querySelectorAll('.item-quantity');
            let fixedItemsOutput = '';
            quantities.forEach((quantityInput, index) => {
                const quantity = quantityInput.value;
                const item = fixedItems[index];
                if (quantity > 0) {
                    const itemTotal = quantity * item.price;
                    fixedItemsOutput += `${item.name} (${item.price}) X ${quantity} -> ${itemTotal}\n`;
                }
            });

            const otherItemNames = friend.querySelector('.other-item-names').value.split(',');
            const otherItemPrices = friend.querySelector('.other-item-prices').value.split(',');
            const otherItemQuantities = friend.querySelector('.other-item-quantities').value.split(',');
            let otherItemsOutput = '';

            otherItemNames.forEach((itemName, index) => {
                const price = parseFloat(otherItemPrices[index]) || 0;
                const quantity = parseInt(otherItemQuantities[index]) || 0;
                const itemTotal = price * quantity;

                if (itemTotal > 0) {
                    otherItemsOutput += `${itemName.trim()} (${price}) X ${quantity} -> ${itemTotal}\n`;
                }
            });

            text += `\n${name} - ${fixedItemsOutput}${otherItemsOutput}Total -> ${total}\n`;
        }
    });

    const grandTotal = parseFloat(document.getElementById('grand-total').innerText);
    text += `\nGeneral Items:\n${generalItemsOutput}Total for General Items -> ${generalTotal}\n\nGRAND TOTAL -> ${grandTotal}`;
    const paidBy = document.getElementById('paid-by').value;
    const paymentMethod = document.getElementById('payment-method').value;
    text += `\nPaid By: ${paidBy}`;
    text += `\nPayment Method: ${paymentMethod}`;

    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}




// Function to export to Google Sheets (placeholder)
function exportToGoogleSheets() {
    // Implement Google Sheets export functionality here
}

// Function to generate the friend sections dynamically
function generateFriends() {
    const friendsContainer = document.getElementById('friends-container');
    
    // Array of friend names
    const friendNames = [
        "Aakif",
        "Aditya",
        "Aman",
        "Nazlee",
        "Rishabh",
        "Sulagna",
        "Suman"
    ];
    
    // Loop through the friend names array
    friendNames.forEach(name => {
        const friendHTML = `
            <div class="friend">
                <h3 class="friend-name">${name}</h3>
                ${createFixedItemsHTML()}
                
                
                <div>
                    <label for="other-item-names">Other Item Names:</label>
                    <input type="text" class="other-item-names" placeholder="e.g., Pizza, Curd" oninput="calculateTotal(this)">
                </div>
                <div>
                    <label for="other-item-prices">Other Item Prices:</label>
                    <input type="text" class="other-item-prices" placeholder="e.g., 80, 20" oninput="calculateTotal(this)">
                </div>
                <div>
                    <label for="other-item-quantities">Other Item Quantities:</label>
                    <input type="text" class="other-item-quantities" placeholder="e.g., 1, 2" oninput="calculateTotal(this)">
                </div>
                <div class="friend-total">0</div>
            </div>
        `;
        friendsContainer.innerHTML += friendHTML; // Append to the container
    });
}


// Call the function to generate friends on page load
window.onload = generateFriends;


function calculateGeneralTotal() {
    const generalItemNames = document.getElementById('general-item-names').value.split(',');
    const generalItemPrices = document.getElementById('general-item-prices').value.split(',');
    const generalItemQuantities = document.getElementById('general-item-quantities').value.split(',');

    let generalTotal = 0;

    generalItemNames.forEach((itemName, index) => {
        const price = parseFloat(generalItemPrices[index]) || 0;
        const quantity = parseInt(generalItemQuantities[index]) || 0;
        generalTotal += price * quantity;
    });

    // Update the total for general items in the UI
    const generalTotalElement = document.getElementById('general-total');
    generalTotalElement.innerText = generalTotal; // Display general total

    // Update grand total in the UI
    const grandTotalElement = document.getElementById('grand-total');
    const individualTotals = document.querySelectorAll('.friend-total');
    let total = generalTotal; // Start total with general total

    individualTotals.forEach(friendTotal => {
        total += parseFloat(friendTotal.innerText) || 0;
    });

    grandTotalElement.innerText = total; // Update the displayed grand total
}





