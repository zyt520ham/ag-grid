/// <reference types="cypress" />



describe('AG Grid Examples', () => {
    const pages = Cypress.env('examples')
    const updateSnapshots = Cypress.env('updateSnapshots');

    it('has valid pages', () => {
        expect(pages).to.be.an('array').and.not.be.empty
    })


    if (updateSnapshots) {

        it('generate snapshots', () => {
            expect(true).to.true;
        })

        Cypress._.forEach(pages.filter(e => e.page.includes('row-spanning') || e.page.includes('grid-size')).slice(0, 1), (p) => {
            describe(p.page, () => {
                Cypress._.forEach(p.examples, (ex) => {
                    describe(ex.example, () => {

                        Cypress._.forEach(ex.generated, (g) => {
                            describe(g.type, () => {
                                Cypress._.forEach(g.frameworks.filter(f => f !== 'typescript').slice(0, 1), (f) => {

                                    it(f, () => {
                                        cy.visit(`https://ag-grid.com/examples/${p.page}/${ex.example}/${g.type}/${f}/index.html`)
                                        cy.get('.ag-row', { timeout: 10_000 })
                                            .then(() => {
                                                cy.matchImageSnapshot(`${p.page}/${ex.example}/${g.type}/${f}`);
                                            })
                                    })
                                })
                            });
                        })
                    })
                })
            })
        })
    } else {

        it('compare snapshots', () => {
            expect(true).to.true;
        })

        Cypress._.forEach(pages.filter(e => e.page.includes('row-spanning') || e.page.includes('grid-size')), (p) => {
            describe(p.page, () => {
                Cypress._.forEach(p.examples, (ex) => {
                    describe(ex.example, () => {

                        Cypress._.forEach(ex.generated, (g) => {
                            describe(g.type, () => {
                                Cypress._.forEach(g.frameworks, (f) => {

                                    it(f, () => {


                                        cy.visit(`https://build.ag-grid.com/examples/${p.page}/${ex.example}/${g.type}/${f}/index.html`)
                                        // Compare typescript with javascript as that not on live
                                        const compFramework = f === 'typescript' ? 'javascript' : f;
                                        cy.get('.ag-row', { timeout: 10_000 })
                                            .then(() => {
                                                cy.matchImageSnapshot(`${p.page}/${ex.example}/${g.type}/${compFramework}`);
                                            })
                                    })
                                })
                            });
                        })
                    })
                })
            })
        })
    }
})