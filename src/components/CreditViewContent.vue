<template>
  <div class="container calculator-container">
    <h1 class="text-center my-4">Simulador de Créditos</h1>
    <div class="content">
      <div class="credit-form">
        <div class="form-group">
          <label for="credit-type">Tipo de Crédito:</label>
          <select id="credit-type" v-model="solicitud.tipoCredito" class="form-control" @blur="touched.tipoCredito = true">
            <option value="" disabled selected>Selecciona el tipo de crédito</option>
            <option value="hipotecario">Crédito Hipotecario</option>
            <option value="automotriz">Crédito Automotriz</option>
            <option value="libreInversion">Libre Inversión</option>
            <option value="personal">Crédito Personal</option>
          </select>
          <div v-if="touched.tipoCredito && !solicitud.tipoCredito" class="text-danger">Este campo es obligatorio.</div>
        </div>

        <div class="form-group">
          <label for="income">Ingreso anual:
            <span v-if="solicitud.tipoCredito === 'hipotecario'" class="text-muted">mínimo $46,800,000 ($3,900,000 al mes)</span>
            <span v-else-if="solicitud.tipoCredito === 'automotriz'" class="text-muted">mínimo 27,000,000 (2,600,000 al mes)</span>
            <span v-else-if="solicitud.tipoCredito === 'libreInversion'" class="text-muted">mínimo $500,000 ()</span>
            <span v-else-if="solicitud.tipoCredito === 'personal'" class="text-muted">mínimo $500,000 ()</span>
          </label>
          <input type="number" min="0" id="income" v-model.number="solicitud.ingresoAnual" placeholder="Ingresa tu ingreso anual" class="form-control" @blur="touched.ingresoAnual = true" />
          <div v-if="touched.ingresoAnual && solicitud.ingresoAnual <= 0" class="text-danger">El ingreso anual debe ser mayor que cero.</div>
        </div>

        <div class="form-group">
          <label for="amount">Monto a solicitar:
            <span v-if="solicitud.tipoCredito === 'hipotecario'" class="text-muted">mínimo $50,000,000, máximo ingreso anual * 6</span>
            <span v-else-if="solicitud.tipoCredito === 'automotriz'" class="text-muted">mínimo $5,000,000, máximo ingreso anual * 3</span>
            <span v-else-if="solicitud.tipoCredito === 'libreInversion'" class="text-muted">mínimo $500,000, máximo ingreso anual * 1,5</span>
            <span v-else-if="solicitud.tipoCredito === 'personal'" class="text-muted">mínimo $500,000</span>
          </label>
          <input type="number" min="0" id="amount" v-model.number="solicitud.montoSolicitado" placeholder="Ingresa el monto solicitado" class="form-control" @blur="touched.montoSolicitado = true" />
          <div v-if="touched.montoSolicitado && solicitud.montoSolicitado <= 0" class="text-danger">El monto solicitado debe ser mayor que cero.</div>
        </div>

        <div class="form-group">
          <label for="term">Plazo (en meses):</label>
          <input type="number" min="0" id="term" v-model.number="solicitud.plazo" placeholder="Ingresa el plazo en meses" class="form-control" @blur="touched.plazo = true" />
          <div v-if="touched.plazo && solicitud.plazo <= 0" class="text-danger">El plazo debe ser mayor que cero.</div>
        </div>

        <div class="form-group">
          <label for="interest">Tasa de Interés anual(%):</label>
          <input type="number" min="0" id="interest" v-model.number="solicitud.tasaInteres" placeholder="Ingresa la tasa de interés" class="form-control" @blur="touched.tasaInteres = true" />
          <div v-if="touched.tasaInteres && solicitud.tasaInteres <= 0" class="text-danger">La tasa de interés debe ser mayor que cero.</div>
        </div>

        <button @click="calcular" :disabled="!isFormValid" class="btn btn-primary btn-block">Calcular</button>
      </div>

      <div class="amortization-table mt-4" v-if="respuesta && respuesta.tablaAmortizacion.length">
        <h3 class="text-center">Tabla de Amortización</h3>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Plazo</th>
              <th>Pago</th>
              <th>Interés</th>
              <th>Capital</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in respuesta.tablaAmortizacion" :key="index">
              <td>{{ entry.plazo }}</td>
              <td>{{ entry.pago.toFixed(2) }}</td>
              <td>{{ entry.interes.toFixed(2) }}</td>
              <td>{{ entry.capital.toFixed(2) }}</td>
              <td>{{ entry.saldo.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="respuesta && respuesta.tablaAmortizacion.length && respuesta.esAprobado" class="download-buttons text-center mt-3">
        <button @click="descargarExcel" class="btn btn-success me-3">Descargar en Excel</button>
        <button @click="descargarTxt" class="btn btn-secondary">Descargar en TXT</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calcularCredito, SolicitudCredito, RespuestaCredito } from '../services/service';
import * as XLSX from 'xlsx';

const solicitud = ref<SolicitudCredito>({
  tipoCredito: '',
  ingresoAnual: 0,
  montoSolicitado: 0,
  plazo: 0, 
  tasaInteres: 0
});

const respuesta = ref<RespuestaCredito | null>(null);

const touched = ref({
  tipoCredito: false,
  ingresoAnual: false,
  montoSolicitado: false,
  plazo: false,
  tasaInteres: false
});

const isFormValid = computed(() => {
  return (
    solicitud.value.ingresoAnual > 0 &&
    solicitud.value.montoSolicitado > 0 &&
    solicitud.value.plazo > 0 &&
    solicitud.value.tasaInteres > 0 &&
    solicitud.value.tipoCredito !== ''
  );
});

function calcular() {
  if (!isFormValid.value) return; 

  respuesta.value = calcularCredito(solicitud.value);
}

function descargarExcel() {
  if (respuesta.value) {
    const worksheet = XLSX.utils.json_to_sheet(respuesta.value.tablaAmortizacion);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Amortizacion");

    const now = new Date();
    const options = {
      timeZone: 'America/Bogota',
      year: 'numeric' as 'numeric',
      month: '2-digit' as '2-digit',
      day: '2-digit' as '2-digit',
      hour: '2-digit' as '2-digit',
      minute: '2-digit' as '2-digit',
      second: '2-digit' as '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('es-CO', options);
    const parts = formatter.formatToParts(now);
    const dateObj: Record<string, string> = {};
    for (const { type, value } of parts) {
      dateObj[type] = value;
    }

    const formattedDate = `${dateObj.year}-${dateObj.month}-${dateObj.day}_${dateObj.hour}-${dateObj.minute}-${dateObj.second}`;
    const filename = `tabla_amortizacion_${formattedDate}.xlsx`;

    XLSX.writeFile(workbook, filename);
  }
}

function descargarTxt() {
  if (respuesta.value) {
    const encabezado = "Plazo\tPago\tInterés\tCapital\tSaldo\n";
    const filas = respuesta.value.tablaAmortizacion.map(entry => 
      `${entry.plazo}\t${entry.pago.toFixed(2)}\t${entry.interes.toFixed(2)}\t${entry.capital.toFixed(2)}\t${entry.saldo.toFixed(2)}`
    ).join("\n");
    
    const contenido = encabezado + filas;
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tabla_amortizacion.txt";
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
</script>

<style>
.calculator-container {
  color: black;
  background-color: #f8f9fa; 
  padding: 80px;
  border-radius: 8px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.credit-form {
  background-color: #ffffff; 
  padding: 20px; /* Reducido para evitar un padding excesivo */
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group input,
.form-group select {
  width: calc(100% - 1rem); /* Resta un poco para evitar desbordamiento */
  margin-bottom: 1rem; /* Espaciado entre los campos */
}

.amortization-table {
  width: 100%;
}

.btn-primary {
  background-color: #007bff; /* Color de fondo del botón primario */
  border-color: #007bff; /* Color de borde del botón primario */
}

.btn-primary:hover {
  background-color: #0056b3; /* Color de fondo en hover */
}

.text-danger {
  font-size: 0.875rem; /* Tamaño del texto de error */
}

.download-buttons {
  margin-top: 20px; /* Espaciado entre el contenido y los botones */
}

.download-buttons button {
  margin-right: 20px; /* Espacio entre los botones de descarga */
}
</style>
