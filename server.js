const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Cargar el archivo .proto
const packageDefinition = protoLoader.loadSync('./calculator.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

// Cargar el paquete definido en el archivo .proto
const calculatorProto = grpc.loadPackageDefinition(packageDefinition).CalculatorService;

// Implementación de cada método en el servicio CalculatorService
function add(call, callback) {
  const result = call.request.number1 + call.request.number2;
  callback(null, { result });
}

function subtract(call, callback) {
  const result = call.request.number1 - call.request.number2;
  callback(null, { result });
}

function multiply(call, callback) {
  const result = call.request.number1 * call.request.number2;
  callback(null, { result });
}

function divide(call, callback) {
  if (call.request.number2 === 0) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Division by zero is not allowed',
    });
  }
  const result = call.request.number1 / call.request.number2;
  callback(null, { result });
}

// Crear el servidor gRPC y registrar los servicios
const server = new grpc.Server();
server.addService(calculatorProto.service, {
  Add: add,
  Subtract: subtract,
  Multiply: multiply,
  Divide: divide,
});

// Iniciar el servidor en el puerto 50051
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Servidor gRPC corriendo en el puerto 50051');
  server.start();
});
