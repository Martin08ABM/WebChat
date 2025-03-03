// Prueba 2do btn
function handleCredentialResponse(response) {
    console.log("Token recibido:", response.credential); // Asegúrate de ver este token en la consola

    fetch('http://localhost:5500', {  // Cambiar la URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_token: response.credential  // Enviamos el token de Google
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
            console.log('Usuario autenticado correctamente');
            window.location.href = '/dashboard'; // Redirigir si es necesario
        } else {
            console.log('Error en el proceso de inicio de sesión o registro');
        }
    })
    .catch(error => console.error('Error:', error));
}