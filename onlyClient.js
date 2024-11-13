const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Cargar el archivo .proto
const packageDefinition = protoLoader.loadSync('calculator.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Cargar el paquete definido en el archivo .proto
const calculatorProto = grpc.loadPackageDefinition(packageDefinition).CalculatorService;

// Crear el cliente gRPC
const client = new calculatorProto('localhost:50051', grpc.credentials.createInsecure());

// Función para realizar la operación en el servidor
function performOperation(operation, number1, number2) {
  switch (operation) {
    case 'add':
      client.Add({ number1, number2 }, (error, response) => {
        if (!error) {
          console.log(`Resultado de la suma: ${response.result}`);
        } else {
          console.error(`Error en la suma: ${error.message}`);
        }
      });
      break;

    case 'subtract':
      client.Subtract({ number1, number2 }, (error, response) => {
        if (!error) {
          console.log(`Resultado de la resta: ${response.result}`);
        } else {
          console.error(`Error en la resta: ${error.message}`);
        }
      });
      break;

    case 'multiply':
      client.Multiply({ number1, number2 }, (error, response) => {
        if (!error) {
          console.log(`Resultado de la multiplicación: ${response.result}`);
        } else {
          console.error(`Error en la multiplicación: ${error.message}`);
        }
      });
      break;

    case 'divide':
      client.Divide({ number1, number2 }, (error, response) => {
        if (!error) {
          console.log(`Resultado de la división: ${response.result}`);
        } else {
          console.error(`Error en la división: ${error.message}`);
        }
      });
      break;

    default:
      console.log('Operación no soportada');
  }
}

// Ejemplo de uso del cliente único
performOperation('add', 9, 3);        // Resultado esperado: 8
performOperation('subtract', 10, 4);  // Resultado esperado: 6
performOperation('multiply', 6, 7);   // Resultado esperado: 42
performOperation('divide', 12, 3);     // Resultado esperado: 3
