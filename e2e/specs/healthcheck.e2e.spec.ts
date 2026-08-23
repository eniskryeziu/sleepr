import { ping } from 'tcp-ping';

describe('Healthcheck', () => {
  test('Reservations should return 200', async () => {
    const response = await fetch('http://reservations:3000/health');
    expect(response.status).toBe(200);
  });

  test('Auth should return 200', async () => {
    const response = await fetch('http://auth:3001/health');
    expect(response.status).toBe(200);
  });

  test('Payments service should be reachable', (done) => {
    ping({ address: 'payments', port: 3003 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });

  test('Notifications service should be reachable', (done) => {
    ping({ address: 'notifications', port: 3004 }, (err) => {
      if (err) {
        fail();
      }
      done();
    });
  });
});
