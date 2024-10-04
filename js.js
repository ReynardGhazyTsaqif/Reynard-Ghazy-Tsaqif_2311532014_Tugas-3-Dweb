
        // Register the service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
        }

        // Handle the 'beforeinstallprompt' event
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault(); // Prevent the prompt from appearing immediately
            deferredPrompt = event; // Save the event for later use
            const installButton = document.getElementById('installButton');
            installButton.style.display = 'block'; // Show the install button

            // When the user clicks the install button
            installButton.addEventListener('click', () => {
                installButton.style.display = 'none'; // Hide the install button
                deferredPrompt.prompt(); // Show the install prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null; // Reset the deferredPrompt
                });
            });
        });
    