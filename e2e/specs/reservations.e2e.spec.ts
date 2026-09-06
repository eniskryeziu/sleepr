describe('Reservations', () => {
  let jwt: string;

  const headers = {
    'Content-Type': 'application/json',
  };

  const getAuthHeaders = () => ({
    ...headers,
    Authentication: jwt,
  });

  beforeAll(async () => {
    const user = {
      email: 'enis@mail.com',
      password: '123321',
    };

    await fetch('http://auth:3001/users', {
      method: 'post',
      body: JSON.stringify(user),
      headers,
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'post',
      body: JSON.stringify(user),
      headers,
    });

    jwt = await response.text();
  });

  test('Create & Get', async () => {
    const createdReservation = await createReservation();

    const responseGet = await fetch(
      `http://reservations:3000/reservations/${createdReservation._id}`,
      { headers: getAuthHeaders() },
    );
    const reservation = await responseGet.json();

    expect(createdReservation).toEqual(reservation);
  });

  const createReservation = async () => {
    const responseCreate = await fetch(
      'http://reservations:3000/reservations',
      {
        method: 'post',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          startDate: '2026-03-05',
          endDate: '2026-05-09',
          charge: {
            amount: 5.9,
            card: {
              cvc: '421',
              exp_month: 12,
              exp_year: 2027,
              number: '4242424242424242',
            },
          },
        }),
      },
    );
    expect(responseCreate.ok).toBeTruthy();
    const created = await responseCreate.json();
    return created;
  };
});
