const API_URL = "http://127.0.0.1:8000";
let currentShipmentId = null;

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        navButtons.forEach(b => b.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const sectionId = btn.getAttribute("data-section");
        document.getElementById(sectionId).classList.add("active");

        if (sectionId === "list-section") {
            loadShipments();
        }
    });
});

function formatearFecha(fechaStr) {
    const fechaUTC = fechaStr.endsWith("Z") ? fechaStr : fechaStr + "Z";
    return new Date(fechaUTC).toLocaleString();
}

const form = document.getElementById("shipment-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nuevoEnvio = {
        origen: document.getElementById("origen").value,
        destino: document.getElementById("destino").value,
        remitente: document.getElementById("remitente").value,
        destinatario: document.getElementById("destinatario").value,
        peso_kg: parseFloat(document.getElementById("peso_kg").value),
        descripcion: document.getElementById("descripcion").value || null
    };

    const response = await fetch(`${API_URL}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEnvio)
    });

    if (response.ok) {
        alert("Envío registrado con éxito");
        form.reset();
    } else {
        alert("Error al registrar el envío");
    }
});

async function loadShipments() {
    const response = await fetch(`${API_URL}/shipments`);
    const shipments = await response.json();

    const tbody = document.getElementById("shipments-body");
    tbody.innerHTML = "";

    shipments.forEach(envio => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td title="${envio.id}">${envio.id.slice(0, 8)}...</td>
            <td>${envio.remitente}</td>
            <td>${envio.destinatario}</td>
            <td>${envio.origen}</td>
            <td>${envio.destino}</td>

            <td><span class="estado-badge estado-${envio.estado}">${envio.estado}</span></td>
            <td>
                <button class="action-btn" onclick="verDetalle('${envio.id}')">Ver</button>
                <button class="action-btn" onclick="eliminarEnvio('${envio.id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function verDetalle(id) {
    const response = await fetch(`${API_URL}/shipments/${id}`);
    const envio = await response.json();

    document.getElementById("detail-content").innerHTML = `
        <p><strong>ID:</strong> <span class="valor">${envio.id}</span></p>
        <p><strong>Origen:</strong> <span class="valor">${envio.origen}</span></p>
        <p><strong>Destino:</strong> <span class="valor">${envio.destino}</span></p>
        <p><strong>Remitente:</strong> <span class="valor">${envio.remitente}</span></p>
        <p><strong>Destinatario:</strong> <span class="valor">${envio.destinatario}</span></p>
        <p><strong>Peso:</strong> <span class="valor">${envio.peso_kg} kg</span></p>
        <p><strong>Descripción:</strong> <span class="valor">${envio.descripcion || "Sin descripción"}</span></p>
        <p><strong>Estado:</strong> <span class="estado-badge estado-${envio.estado}">${envio.estado}</span></p>
        <p><strong>Creado:</strong> <span class="valor">${formatearFecha(envio.fecha_creacion)}</span></p>
        <p><strong>Actualizado:</strong> <span class="valor">${formatearFecha(envio.fecha_actualizacion)}</span></p>
`;

    currentShipmentId = id;
        document.getElementById("estado-select").value = envio.estado;

// Actualizar Detalles 
document.getElementById("update-estado-btn").addEventListener("click", async () => {
    const nuevoEstado = document.getElementById("estado-select").value;

    const response = await fetch(`${API_URL}/shipments/${currentShipmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
    });

    if (response.ok) {
        alert("Estado actualizado con éxito");
        document.querySelector('[data-section="list-section"]').click();
    } else {
        alert("Error al actualizar el estado");
    }
});



    navButtons.forEach(b => b.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("detail-section").classList.add("active");
}

document.getElementById("search-btn").addEventListener("click", async () => {
    const id = document.getElementById("search-id").value.trim();
    if (!id) {
        alert("Escribe un ID para buscar");
        return;
    }

    const response = await fetch(`${API_URL}/shipments/${id}`);

    if (response.ok) {
        verDetalle(id);
    } else {
        alert("No se encontró ningún envío con ese ID");
    }
});

async function eliminarEnvio(id) {
    if (!confirm("¿Seguro que quieres eliminar este envío?")) return;

    await fetch(`${API_URL}/shipments/${id}`, { method: "DELETE" });
    loadShipments();
}

document.getElementById("close-detail").addEventListener("click", () => {
    document.querySelector('[data-section="list-section"]').click();
});