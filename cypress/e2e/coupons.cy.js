describe('API - Cupons de desconto', () => {
  let token

  before(() => {
    cy.request('POST', '/api/login', {
      email: 'user@test.com',
      password: 'user123'
    }).then((resp) => {
      token = resp.body.token
    })
  })

  it('CT-005: Cupom válido deve ser aceito', () => {
    cy.request({
      method: 'POST',
      url: '/api/validate-coupon',  // ← CORRIGIDO: /api/coupons/validate → /api/validate-coupon
      headers: { Authorization: `Bearer ${token}` },
      body: { code: 'WELCOME10' }
    }).then((resp) => {
      expect(resp.status).to.eq(200)
      expect(resp.body).to.have.property('valid', true)
      expect(resp.body.coupon).to.have.property('type', 'percentage')
      expect(resp.body.coupon).to.have.property('discount', 10)
    })
  })

  it('CT-006: Cupom inválido deve ser rejeitado', () => {
    cy.request({
      method: 'POST',
      url: '/api/validate-coupon',  // ← CORRIGIDO
      headers: { Authorization: `Bearer ${token}` },
      body: { code: 'INVALIDO123' },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(200)
      expect(resp.body).to.have.property('valid', false)
    })
  })

  it('CT-007: Cupom expirado deve ser rejeitado', () => {
    cy.request({
      method: 'POST',
      url: '/api/validate-coupon',  // ← CORRIGIDO
      headers: { Authorization: `Bearer ${token}` },
      body: { code: 'EXPIRED10' },
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(200)
      expect(resp.body).to.have.property('valid', false)
    })
  })

  it('CT-008: Validação sem código deve retornar erro', () => {
    cy.request({
      method: 'POST',
      url: '/api/validate-coupon',  // ← CORRIGIDO
      headers: { Authorization: `Bearer ${token}` },
      body: { code: '' },
      failOnStatusCode: false
    }).then((resp) => {
      // Pode retornar 400 ou 200 com valid: false
      if (resp.status === 200) {
        expect(resp.body).to.have.property('valid', false)
      } else {
        expect(resp.status).to.be.gte(400)
      }
    })
  })
})