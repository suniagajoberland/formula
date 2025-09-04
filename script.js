// Número fijo al que se enviarán los mensajes (sin símbolos)
const myPhoneNumber = "584143693311";

// Manejar selección de "Todos los productos"
document.getElementById("product5").addEventListener("change", function (e) {
  const allChecked = e.target.checked;
  document
    .querySelectorAll('.checkbox-group input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = allChecked;
    });
});
document
  .getElementById("priceListForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phoneRaw = document.getElementById("phone").value.trim();

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phoneRaw)) {
      alert(
        "Por favor ingresa un número de WhatsApp válido con formato +1234567890"
      );
      return;
    }

    const selectedProducts = [];
    document
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        selectedProducts.push(checkbox.value);
      });

    if (selectedProducts.length === 0) {
      alert("Por favor, selecciona al menos un producto");
      return;
    }

    const formData = {
      name: name,
      phone: phoneRaw,
      products: selectedProducts,
    };

    // Cambia aquí por la URL de tu Web App de Google Apps Script
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbwW6HYNjK87VbhN6uUitFF6t8s6rT8tgtaxCPawXdOO158aF3_3uSpyvZljsrEBYp6zHw/exec";

    fetch(scriptUrl, {
      method: "POST",
      mode: "cors", // Habilitar CORS para esta petición
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error en la respuesta del servidor: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.result === "success") {
          let message = `Hola, mi nombre es *${name}*.\nMi número de WhatsApp es: *${phoneRaw}*.\nEstoy interesado en recibir la lista de precios para los siguientes productos:\n`;
          selectedProducts.forEach((product, i) => {
            message += `${i + 1}. ${product}\n`;
          });
          message += `\nGracias.`;

          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;
          window.open(whatsappUrl, "_blank");

          document.getElementById("successMessage").style.display = "block";
          document.getElementById("errorMessage").style.display = "none";
          this.reset();
        } else {
          alert(
            "Hubo un error enviando los datos. Por favor intenta de nuevo."
          );
        }
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error.message || error);
        alert("Hubo un error enviando los datos. Por favor intenta de nuevo.");
      });
  });
