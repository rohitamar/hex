document.addEventListener('DOMContentLoaded', () => {
    const optionsMenu = document.getElementById('options-menu');
    const friendSetup = document.getElementById('friend-setup');
    const btnMcts = document.getElementById('btn-mcts');
    const btnMinimax = document.getElementById('btn-minimax');
    const btnFriend = document.getElementById('btn-friend');
    const shareLinkElement = document.getElementById('share-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    const backButton = document.getElementById('back-to-options');


    btnMcts.addEventListener('click', () => {
        console.log('Starting game against MCTS AI...');
    });

    btnMinimax.addEventListener('click', () => {
        console.log('Starting game against Minimax AI...');
    });

    btnFriend.addEventListener('click', () => {
        optionsMenu.style.display = 'none'; // Hide initial options
        friendSetup.style.display = 'block'; // Show friend setup section

        const roomId = typeof crypto !== 'undefined' && crypto.randomUUID ?
                       crypto.randomUUID().substring(0, 8) :
                       Math.random().toString(36).substring(2, 10);

        const currentUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${currentUrl}?room=${roomId}`;

        shareLinkElement.textContent = shareUrl;

        copyFeedback.textContent = ''; // Clear previous feedback
        copyFeedback.classList.remove('error');

        console.log(`Generated Room ID: ${roomId}`);
        console.log(`Share URL: ${shareUrl}`);

    });

     backButton.addEventListener('click', () => {
         friendSetup.style.display = 'none'; // Hide friend setup
         optionsMenu.style.display = 'block'; // Show initial options
     });


    copyLinkBtn.addEventListener('click', () => {
        const linkToCopy = shareLinkElement.textContent;
        copyFeedback.textContent = ''; // Clear previous feedback
        copyFeedback.classList.remove('error');


        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(linkToCopy).then(() => {
                copyFeedback.textContent = 'Link copied!';
                setTimeout(() => { copyFeedback.textContent = ''; }, 2500); // Clear after 2.5s
            }).catch(err => {
                console.error('Clipboard API failed:', err);
                 copyFeedback.textContent = 'Failed to copy!';
                 copyFeedback.classList.add('error');
            });
        } else {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = linkToCopy;
                textArea.style.position = "fixed"; // Prevent scrolling to bottom
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                copyFeedback.textContent = 'Link copied! (fallback)';
                setTimeout(() => { copyFeedback.textContent = ''; }, 2500);
            } catch (err) {
                 console.error('Fallback copy failed:', err);
                 copyFeedback.textContent = 'Failed to copy!';
                 copyFeedback.classList.add('error');
            }
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');

    if (roomFromUrl) {
        console.log(`Detected Room ID from URL: ${roomFromUrl}`);
        // Immediately try to join this room instead of showing the menu
        // You would hide the menu and directly initiate the WebSocket connection
        optionsMenu.style.display = 'none';
        friendSetup.style.display = 'none'; // Hide both initial sections
        // Add a status message like "Joining room ROOM_ID..."
        const joiningMessage = document.createElement('p');
        joiningMessage.textContent = `Attempting to join room: ${roomFromUrl}...`;
        document.querySelector('.container').appendChild(joiningMessage);

        // Call your actual function to initialize the WebSocket connection for joining
        // initializeMultiplayerGame(roomFromUrl); // Example function call
        alert(`Joining room: ${roomFromUrl} (Implement actual WebSocket join)`);

    } else {
         // Normal load, menu is visible by default
         console.log("No Room ID in URL, showing main menu.");
    }

});