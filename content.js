let lastMessageId = null;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let data = request.message; //Por convencion y facilidad de lectura

    const urlObj = new URL(data.url);
    const messageId = urlObj.searchParams.get('message_id');

    if (messageId=== lastMessageId) {
        console.log("Mensaje ignorado, es igual al último recibido.");
        return;
    }
    lastMessageId = messageId;
    console.log("Mensaje recibido de background.js:", request.message);



    let headers = {};
    data.requestHeaders.forEach(header => {
        headers[header.name] = header.value;
    });

    function executeFetch() {
        fetch(data.url, {
            "headers"       : headers,
            "referrer"      : data.initiator,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body"          : null,
            "method"        : data.method,
            "mode"          : "cors",
            "credentials"   : "include"
        }).then(response => response.blob())  // Convertir la respuesta a Blob
            .then(blob => {
                // Crear un objeto URL para el Blob y simular la descarga
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${messageId}.aac`;  // Nombre del archivo a descargar
                document.body.appendChild(a);
                a.click();
                // Limpiar el objeto URL después de la descarga
                window.URL.revokeObjectURL(url);
                console.log("Archivo descargado con éxito.");
            })
            .catch(error => console.error('Error descargando el archivo:', error));
    }

    function countdownAndExecuteFetch(seconds) {
        let counter = seconds;
        console.log(`Descargando audio en ${counter}...`);

        const interval = setInterval(() => {
            counter -= 1;
            console.log(`Descargando audio en ${counter}...`);

            if (counter <= 0) {
                clearInterval(interval);
                executeFetch();
            }
        }, 1000);
    }
    countdownAndExecuteFetch(5);
});