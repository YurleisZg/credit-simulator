<template>
    <div class="calculator-container">
      <h1>Simulador de Créditos</h1>
      <br />
      <div class="content">
        <div class="credit-form">
          <div class="form-group">
            <label for="credit-type">Tipo de Crédito:</label>
            <select id="credit-type">
              <option value="" disabled selected>Selecciona el tipo de crédito</option>
              <option value="hipotecario">Crédito Hipotecario</option>
              <option value="automotriz">Crédito Automotriz</option>
              <option value="libreInversion">Libre Inversión</option>
              <option value="personal">Crédito Personal</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="amount">Ingreso anual:</label>
            <input type="number" id="amount" placeholder="Ingresa el monto" />
          </div>
  
          <div class="form-group">
            <label for="income">Valor a solicitar:</label>
            <input type="number" id="income" placeholder="Ingresa tu ingreso anual" />
          </div>

          <div class="form-group">
            <label for="term-type">Tipo de plazo</label>
            <select id="term-type">
              <option value="" disabled selected>Selecciona el tipo de plazo</option>
              <option value="Mensual">Mensual</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="term">Plazo:</label>
            <input type="number" id="term" placeholder="Ingresa el plazo" />
          </div>
  
          <div class="form-group">
            <label for="interest">Tasa de Interés (%):</label>
            <input type="number" id="interest" placeholder="Ingresa la tasa de interés" />
          </div>

          <div class="form-group">
            <label for="share-type">Tipo de couta:</label>
            <select id="share-type">
              <option value="" disabled selected>Selecciona el tipo de couta</option>
              <option value="Mensual">Mensual</option>
              <option value="Bimensual">bimensual</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
          <button>Calcular</button>
        </div>
  
        <div class="amortization-table">
          <h3>Tabla de Amortización</h3>
          <table>
            <thead>
              <tr>
                <th>Plazo</th>
                <th>Pago</th>
                <th>Interés</th>
                <th>Capital</th>
                <th>Saldo</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  
  <style>
  .calculator-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
  }
  
  .content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1000px;
    gap:100px;
  }
  
  h1 {
    margin-bottom: 5px;
    font-size: 2.5em;
  }
  
  .credit-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group label {
    font-size: 14px;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #ffffff;
    color: #3e3d3d;
  }
  
  button {
    padding: 8px;
    font-size: 1em;
    background-color: #737171;
    color: rgb(29, 29, 29);
    border: none;
    cursor: pointer;
    width: 70%;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #a7a7fd;
  }
  
  .amortization-table {
    width: 50%;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 8px;
    
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table, th, td {
    border: 1px solid #ddd;
  }
  
  th, td {
    padding: 20px;
    text-align: center;
  }
  
  h2 {
    text-align: center;
    font-size: 1.8em;
    margin-bottom: 15px;
  }
  </style>