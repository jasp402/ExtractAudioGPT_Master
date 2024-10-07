document.addEventListener('DOMContentLoaded', function () {
    // Recuperar el estado desde chrome.storage.sync cuando se carga el popup
    chrome.storage.sync.get('isEnabled', function(data) {
        const isEnabled = data.isEnabled || false; // Valor por defecto: false si no está definido
        if (isEnabled) {
            document.getElementById('yes').checked = true;  // Marcar YES si está activado
        } else {
            document.getElementById('no').checked = true;   // Marcar NO si está desactivado
        }
    });

    // Listener para cuando se seleccione YES
    document.getElementById('yes').addEventListener('change', function () {
        if (this.checked) {
            chrome.storage.sync.set({ isEnabled: true }, function() {
                console.log('Funcionalidad activada (YES)');
            });

            // Enviar mensaje al background.js
            chrome.runtime.sendMessage({ isEnabled: true });
        }
    });

    // Listener para cuando se seleccione NO
    document.getElementById('no').addEventListener('change', function () {
        if (this.checked) {
            chrome.storage.sync.set({ isEnabled: false }, function() {
                console.log('Funcionalidad desactivada (NO)');
            });

            // Enviar mensaje al background.js
            chrome.runtime.sendMessage({ isEnabled: false });
        }
    });
});
