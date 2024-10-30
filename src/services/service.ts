export interface SolicitudCredito {
  tipoCredito: string;
  ingresoAnual: number;
  montoSolicitado: number;
  plazo: number;
  tasaInteres: number;
}

export interface RespuestaCredito {
  esAprobado: boolean;
  montoAprobado: number;
  mensajeError?: string; // Mensaje de error para la validación
  tablaAmortizacion: Array<{
    plazo: number;
    pago: number;
    interes: number;
    capital: number;
    saldo: number;
  }>;
}

export function calcularCredito(solicitud: SolicitudCredito): RespuestaCredito {
  const { tipoCredito, ingresoAnual, montoSolicitado, plazo, tasaInteres } = solicitud;

  // Validaciones
  if (!tipoCredito) {
    return { esAprobado: false, montoAprobado: 0, mensajeError: 'El tipo de crédito es obligatorio.', tablaAmortizacion: [] };
  }
  if (ingresoAnual <= 0) {
    return { esAprobado: false, montoAprobado: 0, mensajeError: 'El ingreso anual debe ser mayor que cero.', tablaAmortizacion: [] };
  }
  if (montoSolicitado <= 0) {
    return { esAprobado: false, montoAprobado: 0, mensajeError: 'El monto solicitado debe ser mayor que cero.', tablaAmortizacion: [] };
  }
  if (plazo <= 0) {
    return { esAprobado: false, montoAprobado: 0, mensajeError: 'El plazo debe ser mayor que cero.', tablaAmortizacion: [] };
  }
  if (tasaInteres <= 0) {
    return { esAprobado: false, montoAprobado: 0, mensajeError: 'La tasa de interés debe ser mayor que cero.', tablaAmortizacion: [] };
  }

  // Verificación de montos permitidos según el tipo de crédito
  const ingresoMensual = ingresoAnual / 12;
  let montoMinimo = 0;
  let montoMaximo = 0;

  switch (tipoCredito) {
    case 'hipotecario':
      montoMinimo = 50000000; // Monto mínimo
      montoMaximo = ingresoAnual * 6; // Límite
      break;
    case 'automotriz':
      montoMinimo = 5000000; // Monto mínimo
      montoMaximo = ingresoAnual * 3; // Límite
      break;
    case 'libreInversion':
      montoMinimo = 1000000; // Monto mínimo
      montoMaximo = ingresoAnual * 1.5; // Límite
      break;
    case 'personal':
      montoMinimo = 500000; // Monto mínimo
      montoMaximo = (ingresoMensual) * 6; // Límite
      break;
    default:
      return { esAprobado: false, montoAprobado: 0, mensajeError: 'Tipo de crédito no válido.', tablaAmortizacion: [] };
  }

  // Validar montos solicitados
  if (montoSolicitado < montoMinimo) {
    return { esAprobado: false, montoAprobado: 0, mensajeError: `El monto solicitado debe ser al menos ${montoMinimo}.`, tablaAmortizacion: [] };
  }

  const esAprobado = montoSolicitado <= montoMaximo;
  const montoAprobado = esAprobado ? montoSolicitado : 0;

  // Cálculo de amortización solo si el crédito es aprobado
  const tablaAmortizacion = esAprobado ? calcularAmortizacion(montoAprobado, plazo, tasaInteres) : [];

  return {
    esAprobado,
    montoAprobado,
    mensajeError: esAprobado ? undefined : 'El monto solicitado excede el monto máximo permitido.',
    tablaAmortizacion
  };
}


// Función de cálculo de amortización en base al plazo en meses
function calcularAmortizacion(monto: number, plazo: number, tasaInteres: number) {
  const tasaMensual = tasaInteres / 100 / 12; // Tasa mensual
  const pagoMensual = monto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo)));
  const tablaAmortizacion = [];



  let saldo = monto;

  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * tasaMensual;
    const capital = pagoMensual - interes;
    saldo -= capital;

    tablaAmortizacion.push({
      plazo: i, // Mostrar el número de mes
      pago: pagoMensual,
      interes: interes,
      capital: capital,
      saldo: Math.max(0, saldo), // Evitar números negativos al final
    });
  }

  return tablaAmortizacion;
}
