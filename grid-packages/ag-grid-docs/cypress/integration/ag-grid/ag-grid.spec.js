/// <reference types="cypress" />



xdescribe('AG Grid', () => {
    beforeEach(() => {
        //cy.visit('https://build.ag-grid.com/examples/grouping-unbalanced-groups/unbalanced-groups/packages/angular/index.html')
    })

    it('displays two todo items by default', () => {
        //.waitUntil(() => Cypress.$('iframe').contents().find('.ag-root').length, { timeout: 10_000 })

        //getIframeBody().find('.ag-theme-alpine', { timeout: 10_000 }).should('exist')
        //getIframeBody().find('#top-row-count').should('have.value', '1')
        //expect(stt).to.be.called;

    })
})



describe('AG Grid Examples', () => {
    const pages = Cypress.env('examples')
    console.log(pages)

    it('has valid pages', () => {
        console.log('enve', Cypress.env());
        expect(pages).to.be.an('array').and.not.be.empty
    })

    Cypress._.forEach(pages.slice(0, 3), (p) => {
        describe(p.page, () => {
            Cypress._.forEach(p.examples, (ex) => {
                describe(ex.example, () => {
                    Cypress._.forEach(ex.generated, (g) => {
                        describe(g.type, () => {
                            Cypress._.forEach(g.frameworks, (f) => {
                                if (f.includes('ang')) {

                                    it(f, () => {
                                        cy.visit(`https://build.ag-grid.com/examples/${p.page}/${ex.example}/${g.type}/${f}/index.html`)
                                        cy.get('.ag-cell', { timeout: 10_000 });
                                    })
                                }
                            })
                        })
                    })
                })
            })
        })
    })

    /* xbeforeEach(() => {
        cy.visit('https://build.ag-grid.com/examples/')
    }) */

    // xit('getExamples', () => {

    //.waitUntil(() => Cypress.$('iframe').contents().find('.ag-root').length, { timeout: 10_000 })

    //getIframeBody().find('.ag-theme-alpine', { timeout: 10_000 }).should('exist')
    //getIframeBody().find('#top-row-count').should('have.value', '1')
    //expect(stt).to.be.called;

    // })
})