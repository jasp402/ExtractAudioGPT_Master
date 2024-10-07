chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.url.includes("/backend-api/synthesize")) {
            console.log("Interceptada la solicitud a la ruta de síntesis de audio:");

            // Captura todos los headers de la solicitud
            const headers = details.requestHeaders.reduce((acc, header) => {
                acc[header.name] = header.value;
                return acc;
            }, {});

            // Mostrar la URL, método y headers
            console.log("URL:", details.url);
            console.log("Método:", details.method);
            console.log("Headers:", headers);

            // Verificar el estado del flag (si el envío de mensajes está activado o no)
            console.log("Verificando el estado del flag...");
            chrome.storage.sync.get('isEnabled', function(data) {
                console.log(data);
                if (data.isEnabled) {
                    // Si el flag está activado, enviar el mensaje al content.js
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var activeTab = tabs[0].id;
                        const detailsMessage = details;  // Define el detalle que quieres enviar
                        chrome.tabs.sendMessage(activeTab, {message: detailsMessage});
                    });
                } else {
                    console.log("El envío de mensajes está desactivado.");
                }
            });
        }
    }, { urls: ["*://chatgpt.com/backend-api/synthesize*"] }, ["requestHeaders"]
);