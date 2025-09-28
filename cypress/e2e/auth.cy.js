/*
  Usuários disponibilizados para os testes: 
    Admin: admin@test.com / admin123
    Usuário: user@test.com / user123
*/

describe('API - Autenticação', () => {
    let token

    it('CT-003: Proteção de rotas de checkout (sem token deve falhar)', () => {
        cy.request({
            method: 'POST',
            url: '/api/checkout',
            failOnStatusCode: false,
            body: {
                items: [{ productId: 'qualquer', quantity: 1 }]
            }
        }).then((resp) => {
            expect(resp.status).to.eq(400) 
        })
    })

    it('CT-004: Persistência de sessão', () => {
        cy.request('POST', '/api/login', {
            email: Cypress.env('userEmail'),
            password: Cypress.env('userPassword')
          }).then((resp) => {
            expect(resp.status).to.eq(200)
            token = resp.body.token
        
            cy.request({
              method: 'GET',
              url: '/api/me',
              headers: { Authorization: `Bearer ${token}` }
            }).then((profile) => {
              expect(profile.status).to.eq(200)
              expect(profile.body.user.email).to.eq(Cypress.env('userEmail'))
            })
        })
    })
})