function handleCredentialResponse(response) {
    console.log("Token recibido:", response.credential); 

    fetch('http://localhost:3000/auth/google', {  // Asegúrate de cambiar la URL correcta del backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_token: response.credential
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
            console.log('Usuario autenticado correctamente');
            window.location.href = '/dashboard'; // Redirigir a la página correcta
        } else {
            console.error('Error en el proceso de registro o inicio de sesión:', data.message);
            alert("Error en la autenticación: " + (data.message || "Inténtalo nuevamente"));
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert("Hubo un problema con el inicio de sesión. Revisa la consola para más detalles.");
    });
}
