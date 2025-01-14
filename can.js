const fixedItems = [
    { name: "Tea", price: 10 },
    { name: "Coffee", price: 12 },
    { name: "Idly", price: 15 },
    { name: "Vada", price: 15 },
    { name: "Puri", price: 6 },
    { name: "Roti", price: 5 },
    { name: "Aalu Dam", price: 10 },
    { name: "Ghoogni", price: 15 },
];

// Function to create HTML for fixed items
function createFixedItemsHTML() {
    return fixedItems.map(item => `
        <div class="food-item">
            <label>${item.name}</label>
            <input type="number" class="item-quantity" data-price="${item.price}" value="0" min="1" onchange="calculateTotal(this)">
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

    otherItemNames.forEach((name, index) => {
        const price = otherItemPrices[index] || 0;
        const quantity = otherItemQuantities[index] || 0;
        total += price * quantity; // Add to total
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


// // Function to calculate and display the final bill, including general items
// function calculateFinalBill() {
//     const itemTotals = {}; // Object to store total quantities for each item

//     // Loop through each friend to gather item quantities, including other items
//     const friends = document.querySelectorAll('.friend');
//     friends.forEach(friend => {
//         const quantities = friend.querySelectorAll('.item-quantity');

//         quantities.forEach(quantityInput => {
//             const itemName = quantityInput.closest('.food-item').querySelector('label').innerText;
//             const quantity = parseInt(quantityInput.value) || 0;

//             // Aggregate quantity
//             itemTotals[itemName] = (itemTotals[itemName] || 0) + quantity;
//         });

//         // Process other items
//         const otherItemNames = friend.querySelector('.other-item-names').value.split(',').map(item => item.trim());
//         const otherItemPrices = friend.querySelector('.other-item-prices').value.split(',').map(price => parseFloat(price.trim()) || 0);
//         const otherItemQuantities = friend.querySelector('.other-item-quantities').value.split(',').map(quantity => parseInt(quantity.trim()) || 0);

//         otherItemNames.forEach((name, index) => {
//             const quantity = otherItemQuantities[index];
//             itemTotals[name] = (itemTotals[name] || 0) + quantity;
//         });
//     });

//     // Add general items
//     const generalItemNames = document.getElementById('general-item-names').value.split(',').map(name => name.trim());
//     const generalItemPrices = document.getElementById('general-item-prices').value.split(',').map(price => parseFloat(price.trim()) || 0);
//     const generalItemQuantities = document.getElementById('general-item-quantities').value.split(',').map(quantity => parseInt(quantity.trim()) || 0);

//     generalItemNames.forEach((name, index) => {
//         const quantity = generalItemQuantities[index];
//         itemTotals[name] = (itemTotals[name] || 0) + quantity;
//     });

//     // Display final bill
//     const finalBillDiv = document.getElementById('final-bill');
//     finalBillDiv.innerHTML = ''; // Clear previous contents

//     // Populate the final bill with item totals
//     let hasItems = false;
//     for (const [item, totalQuantity] of Object.entries(itemTotals)) {
//         if (totalQuantity > 0) {
//             finalBillDiv.innerHTML += `<div>${totalQuantity} x ${item}</div>`;
//             hasItems = true;
//         }
//     }

//     // Display a message if no items are ordered
//     if (!hasItems) {
//         finalBillDiv.innerHTML = "No items ordered yet.";
//     }
//     finbill = finalBillDiv.innerText;
// }


// Function to calculate and display the final itemized bill, including general items
function calculateFinalBill() {
    const itemTotals = {}; // Object to store total quantities for each item
    let friendTotal = 0;   // Tracks total for friend-specific and other items

    // Loop through each friend to gather item quantities, including other items
    const friends = document.querySelectorAll('.friend');
    friends.forEach(friend => {
        const quantities = friend.querySelectorAll('.item-quantity');

        quantities.forEach(quantityInput => {
            const itemName = quantityInput.closest('.food-item').querySelector('label').innerText;
            const quantity = parseInt(quantityInput.value) || 0;
            const price = parseFloat(quantityInput.dataset.price); // Get price from dataset

            // Aggregate quantity for itemized display and update friendTotal
            itemTotals[itemName] = (itemTotals[itemName] || 0) + quantity;
            friendTotal += quantity * price;
        });

        // Process other items for each friend
        const otherItemNames = friend.querySelector('.other-item-names').value.split(',').map(item => item.trim());
        const otherItemPrices = friend.querySelector('.other-item-prices').value.split(',').map(price => parseFloat(price.trim()) || 0);
        const otherItemQuantities = friend.querySelector('.other-item-quantities').value.split(',').map(quantity => parseInt(quantity.trim()) || 0);

        otherItemNames.forEach((name, index) => {
            const quantity = otherItemQuantities[index];
            const price = otherItemPrices[index];
            itemTotals[name] = (itemTotals[name] || 0) + quantity;
            friendTotal += quantity * price; // Add other items to friendTotal
        });
    });

    // Calculate general items total once
    let generalTotal = 0;
    const generalItemNames = document.getElementById('general-item-names').value.split(',').map(name => name.trim());
    const generalItemPrices = document.getElementById('general-item-prices').value.split(',').map(price => parseFloat(price.trim()) || 0);
    const generalItemQuantities = document.getElementById('general-item-quantities').value.split(',').map(quantity => parseInt(quantity.trim()) || 0);

    generalItemNames.forEach((name, index) => {
        const quantity = generalItemQuantities[index];
        const price = generalItemPrices[index];
        itemTotals[name] = (itemTotals[name] || 0) + quantity;
        generalTotal += quantity * price; // Calculate general items total once
    });

    // Display itemized breakdown in the final-bill div
    const finalBillDiv = document.getElementById('final-bill');
    finalBillDiv.innerHTML = ''; // Clear previous contents

    let hasItems = false;
    for (const [item, totalQuantity] of Object.entries(itemTotals)) {
        if (totalQuantity > 0) {
            finalBillDiv.innerHTML += `<div>${totalQuantity} x ${item}</div>`;
            hasItems = true;
        }
    }

    // Display a message if no items are ordered
    if (!hasItems) {
        finalBillDiv.innerHTML = "No items ordered yet.";
    }

    // Calculate grand total by combining friendTotal and generalTotal
    const grandTotal = friendTotal + generalTotal;

    // Display the grand total in its designated div
    document.getElementById('grand-total').innerText = `${grandTotal}`;

    // Save the itemized bill text for sharing
    finbill = finalBillDiv.innerText;
}

function copyToClipboard() {
    let text = '';
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    text+=formattedDate+"\n";
    const friends = document.querySelectorAll('.friend');

    // Calculate general items
    const generalItemNames = document.getElementById('general-item-names').value.split(',');
    const generalItemPrices = document.getElementById('general-item-prices').value.split(',');
    const generalItemQuantities = document.getElementById('general-item-quantities').value.split(',');

    let generalItemsOutput = '';
    let generalTotal = 0;

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

            text += `\n${name} - \n${fixedItemsOutput}${otherItemsOutput}Total -> ${total}\n`;
        }
    });

    const grandTotal = parseFloat(document.getElementById('grand-total').innerText);
    if (generalTotal > 0) {
        text += `\nGeneral Items:\n${generalItemsOutput}Total for General Items -> ${generalTotal}`;
    }
    text += `\n\nGRAND TOTAL -> ${grandTotal}`;
    const paidBy = document.getElementById('paid-by').value;
    const paymentMethod = document.getElementById('payment-method').value;
    text += `\nPaid By: ${paidBy}\nPayment Method: ${paymentMethod}\n\nFINAL BILL - \n${finbill}`;

    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Function to generate the friend sections dynamically
// function generateFriends() {
//     const friendsContainer = document.getElementById('friends-container');

//     // Array of friend names
//     const friendNames = [
//         "Aakif",
//         "Aditya",
//         "Aman",
//         "Nazlee",
//         "Rishabh",
//         "Sulagna",
//         "Suman"
//     ];

//     // Loop through the friend names array
//     friendNames.forEach(name => {
//         const friendHTML = `
//             <div class="friend">
//                 <h3 class="friend-name">${name}</h3>
//                 ${createFixedItemsHTML()}

//                 <div>
//                     <label for="other-item-names">Other Item Names:</label>
//                     <input type="text" class="other-item-names" placeholder="e.g., Pizza, Curd" oninput="calculateTotal(this)">
//                 </div>
//                 <div>
//                     <label for="other-item-prices">Other Item Prices:</label>
//                     <input type="text" class="other-item-prices" placeholder="e.g., 80, 20" oninput="calculateTotal(this)">
//                 </div>
//                 <div>
//                     <label for="other-item-quantities">Other Item Quantities:</label>
//                     <input type="text" class="other-item-quantities" placeholder="e.g., 1, 2" oninput="calculateTotal(this)">
//                 </div>
//                 <div class="friend-total">0</div>
//             </div>
//         `;
//         friendsContainer.innerHTML += friendHTML; // Append to the container
//     });
// }

// // Call the function to generate friends on page load
// window.onload = generateFriends;

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
    document.getElementById('general-total').innerText = generalTotal;

    // Update grand total in the UI
    const grandTotalElement = document.getElementById('grand-total');
    const individualTotals = document.querySelectorAll('.friend-total');
    let total = generalTotal; // Start total with general total

    individualTotals.forEach(friendTotal => {
        total += parseFloat(friendTotal.innerText) || 0;
    });

    grandTotalElement.innerText = total; // Update the displayed grand total
}

// Export to Google Sheets
async function exportToGoogleSheets() {

    const url = 'https://script.google.com/macros/s/AKfycbxIywsEjszxRwBJI8IIbeXAf88VQ8YEZZheLkbL1gpXahFikBrE-HMiVItbp68D-MvG/exec'; // Replace with your script URL

    const paidByInput = document.getElementById('paid-by');
    const paymentMethodSelect = document.getElementById('payment-method');
    const generalTotalElement = document.getElementById('general-total');

    // Check if the elements are found
    if (!paidByInput || !paymentMethodSelect || !generalTotalElement) {
        console.error('One or more elements not found');
        return; // Exit the function if any element is not found
    }

    const friendTotals = {};
    const friends = document.querySelectorAll('.friend');

    // Loop through each friend to get their totals
    friends.forEach(friend => {
        const name = friend.querySelector('.friend-name').innerText;
        const total = friend.querySelector('.friend-total').innerText;
        friendTotals[name] = total; // Store total in an object with friend's name as the key
    });

    const data = {
        date: new Date().toLocaleDateString(), // Current date
        totals: friendTotals, // Use the friendTotals object
        generalTotal: generalTotalElement.innerText,
        paidBy: paidByInput.value,
        paymentMethod: paymentMethodSelect.value
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Exported successfully', result);
        alert('Data exported successfully!');
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error exporting data');
    }
}

// Function to calculate total for each friend and update final bill
function calculateTotal(element) {
    const friendDiv = element.closest('.friend');
    const quantities = friendDiv.querySelectorAll('.item-quantity');
    let total = 0;

    // Calculate total from fixed items
    quantities.forEach(q => {
        const price = parseFloat(q.dataset.price);
        const quantity = parseInt(q.value) || 0;
        total += price * quantity;
    });

    // Process other items
    const otherItemNames = friendDiv.querySelector('.other-item-names').value.split(',').map(item => item.trim());
    const otherItemPrices = friendDiv.querySelector('.other-item-prices').value.split(',').map(price => parseFloat(price.trim()) || 0);
    const otherItemQuantities = friendDiv.querySelector('.other-item-quantities').value.split(',').map(quantity => parseInt(quantity.trim()) || 0);

    otherItemNames.forEach((name, index) => {
        const price = otherItemPrices[index];
        const quantity = otherItemQuantities[index];
        total += price * quantity; // Add to total
    });

    // Update friend total display
    friendDiv.querySelector('.friend-total').innerText = total;

    // Update grand total
    updateGrandTotal();
}


// Call calculateFinalBill when any quantity input changes
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.item-quantity, .other-item-names, .other-item-prices, .other-item-quantities, #general-item-names, #general-item-prices, #general-item-quantities').forEach(input => {
        input.addEventListener('input', calculateFinalBill);
    });
});


// Function to generate the friend sections dynamically and add event listeners
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
                    <input type="text" class="other-item-names" placeholder="e.g., Pizza, Curd">
                </div>
                <div>
                    <label for="other-item-prices">Other Item Prices:</label>
                    <input type="text" class="other-item-prices" placeholder="e.g., 80, 20">
                </div>
                <div>
                    <label for="other-item-quantities">Other Item Quantities:</label>
                    <input type="text" class="other-item-quantities" placeholder="e.g., 1, 2">
                </div>
                <div class="friend-total">0</div>
            </div>
        `;
        friendsContainer.innerHTML += friendHTML; // Append to the container
    });

    // Add event listeners for each item quantity input to recalculate totals
    document.querySelectorAll('.item-quantity, .other-item-names, .other-item-prices, .other-item-quantities').forEach(input => {
        input.addEventListener('input', () => {
            calculateTotal(input);  // Update individual totals
            calculateFinalBill();   // Update final bill
        });
    });
}

// Call the function to generate friends on page load
window.onload = generateFriends;
