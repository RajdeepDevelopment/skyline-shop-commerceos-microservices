import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
const PROTO_PATH = './proto/auth.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const auth_proto = grpc.loadPackageDefinition(packageDefinition).auth as any;

const client = new auth_proto.AuthService('localhost:50051', grpc.credentials.createInsecure());

client.Login({ email: 'test@example.com', password: 'password' }, function (err, response) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Response:', response);
  }
});
