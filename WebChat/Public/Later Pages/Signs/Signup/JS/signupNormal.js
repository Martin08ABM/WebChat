document.getElementById("submit").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente si está dentro de un <form>
    
    const name = document.getElementById("UserName").value;
    const email = document.getElementById("UserEmail").value;

    if (!name || !email) {
        console.log("Por favor, completa todos los campos.");
        return;
    }

    fetch('http://127.0.0.1:5500/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.success) {
            console.log('Usuario autenticado correctamente');
            window.location.href = '/dashboard';
        } else {
            console.log('Error en el proceso de registro');
        }
    })
    .catch(error => console.error('Error:', error));
});
