const request = require('supertest') //simula las peticiones del usuario
const app = require('../app')

describe('Ruta inicial', () => {
    test('Debe devolver una respuesta por GET', (done) => {
        request(app).get('/').then((res) => {
            expect(res.statusCode).toBe(200);
            done()
        })
    })

    test('No debe devolver una respuesta por POST', (done) => {
        request(app).post('/').then((res) => {
            expect(res.statusCode).toBe(404);
            expect(res.statusCode).not.toBe(200);
            done()
        })
    })

    test('Debe mostrar para iniciar sesion por google', (done) => {
        request(app).get('/').then((res) => {
            expect(res.text).toMatch(/Sign/);
            done()
        })
    })
})
