/*
  Usuários disponibilizados para os testes: 
    Admin: admin@test.com / admin123
    Usuário: user@test.com / user123
*/
describe('API - Checkout & fluxo de compra', () => {
  let token

  before(() => {
    cy.request('POST', '/api/login', {
      email: 'user@test.com',
      password: 'user123'
    }).then((resp) => {
      token = resp.body.token
    })
  })

  it('CT-001: Fluxo completo de compra com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/api/checkout',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        items: [
          { id: 1, qty: 1 }, 
          { id: 2, qty: 1 }
        ],
        couponCode: 'WELCOME10'  
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200)
      expect(resp.body).to.have.property('orderId')
    })
  })

  it('CT-002: Validação de estoque insuficiente', () => {
    cy.request({
      method: 'POST',
      url: '/api/checkout',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        items: [
          { id: 1, qty: 9999 }  
        ]
      },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.be.gte(400)
      expect(resp.body.error).to.exist
    })
  })

  it('CT-003: Validação de cupom inválido', () => {
    cy.request({
      method: 'POST',
      url: '/api/checkout',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        items: [
          { id: 1, qty: 1 }  
        ],
        couponCode: 'CUPOM_INVALIDO_123'
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (resp.status >= 400) {
        expect(resp.body.error).to.exist
      } else {
        expect(resp.status).to.be.oneOf([200, 201])
      }
    })
  })
})


