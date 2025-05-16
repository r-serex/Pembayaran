document.addEventListener('DOMContentLoaded', function() {
    // Payment methods data
    const paymentMethods = [
        {
            id: 'dana',
            name: 'Dana',
            accountNumber: '081234567890',
            accountName: 'PT Payment Indonesia'
        },
        {
            id: 'gopay',
            name: 'Gopay',
            accountNumber: '081234567891',
            accountName: 'PT Payment Indonesia'
        },
        {
            id: 'ovo',
            name: 'OVO',
            accountNumber: '081234567892',
            accountName: 'PT Payment Indonesia'
        },
        {
            id: 'qris',
            name: 'QRIS',
            accountNumber: 'ID10123456789012345',
            accountName: 'PT Payment Indonesia'
        }
    ];

    // Get amount from URL parameter - FIXED VERSION
    function getAmountFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        let amount = urlParams.get('amount');
        console.log("URL amount parameter:", amount);
        
        // Format amount or use default
        let formattedAmount = 'Rp 150.000';
        if (amount) {
            // Convert to number and format with thousand separator
            const amountNumber = parseInt(amount, 10);
            if (!isNaN(amountNumber)) {
                formattedAmount = formatRupiah(amountNumber);
                console.log("Formatted amount:", formattedAmount);
            }
        }
        return formattedAmount;
    }
    
    // Get and set the amount
    const formattedAmount = getAmountFromUrl();
    
    // Update all amount elements on the page
    const amountElements = document.querySelectorAll('.amount');
    console.log("Found amount elements:", amountElements.length);
    
    amountElements.forEach(el => {
        el.textContent = formattedAmount;
        console.log("Updated element:", el);
    });

    // Current active tab
    let activeTab = 'dana';

    // Initialize countdown
    let timeLeft = 3600; // 1 hour in seconds
    const countdownElement = document.getElementById('countdown');
    
    // Start countdown
    const countdownInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timeLeft = 0;
        }
        
        // Format time as MM:SS
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        countdownElement.textContent = formattedTime;
        
        // Add warning class if less than 5 minutes
        if (timeLeft < 300) {
            countdownElement.classList.add('warning');
        }
    }, 1000);

    // Tab switching
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');
    const paymentMethodNameElement = document.getElementById('payment-method-name');
    const paymentNumberElement = document.getElementById('payment-number');
    
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            // Remove active class from all triggers and contents
            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked trigger and corresponding content
            trigger.classList.add('active');
            const tabId = trigger.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
            
            // Update active tab
            activeTab = tabId;
            
            // Update payment method in instructions
            const method = paymentMethods.find(m => m.id === activeTab);
            paymentMethodNameElement.textContent = method.name;
            paymentNumberElement.textContent = method.accountNumber;
        });
    });

    // Copy to clipboard functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const numberToCopy = button.getAttribute('data-number');
            copyToClipboard(numberToCopy);
        });
    });
    
    // Main copy button
    const copyButton = document.getElementById('copy-button');
    copyButton.addEventListener('click', () => {
        const method = paymentMethods.find(m => m.id === activeTab);
        copyToClipboard(method.accountNumber);
    });
    
    function copyToClipboard(text) {
        // Use modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => showToast())
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    fallbackCopyToClipboard(text);
                });
        } else {
            fallbackCopyToClipboard(text);
        }
    }
    
    function fallbackCopyToClipboard(text) {
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        
        // Select and copy the text
        tempInput.select();
        document.execCommand('copy');
        
        // Remove the temporary element
        document.body.removeChild(tempInput);
        
        // Show toast notification
        showToast();
    }
    
    function showToast() {
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Helper function to format number as Rupiah
    function formatRupiah(number) {
        return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Add a debug message to show the current URL
    console.log("Current URL:", window.location.href);
});
