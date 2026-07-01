const API_URL = "http://127.0.0.1:8000";

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
        <p><strong>Origen:</strong> ${envio.origen}</p>
        <p><strong>Destino:</strong> ${envio.destino}</p>
        <p><strong>Remitente:</strong> ${envio.remitente}</p>
        <p><strong>Destinatario:</strong> ${envio.destinatario}</p>
        <p><strong>Peso:</strong> ${envio.peso_kg} kg</p>
        <p><strong>Descripción:</strong> ${envio.descripcion || "Sin descripción"}</p>
        <p><strong>Estado:</strong> <span class="estado-badge estado-${envio.estado}">${envio.estado}</span></p>
        <p><strong>Creado:</strong> ${new Date(envio.fecha_creacion).toLocaleString()}</p>
        <p><strong>Actualizado:</strong> ${new Date(envio.fecha_actualizacion).toLocaleString()}</p>
    `;

    navButtons.forEach(b => b.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById("detail-section").classList.add("active");
}

async function eliminarEnvio(id) {
    if (!confirm("¿Seguro que quieres eliminar este envío?")) return;

    await fetch(`${API_URL}/shipments/${id}`, { method: "DELETE" });
    loadShipments();
}

document.getElementById("close-detail").addEventListener("click", () => {
    document.querySelector('[data-section="list-section"]').click();
});