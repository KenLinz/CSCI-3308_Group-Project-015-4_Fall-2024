// ********************** Initialize server **********************************

const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************
//We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 400 along with a "Invalid input" message.

describe('Testing Creation of User', () => {
  it('positive : /register    BASIC ACCOUNT CREATION', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'username123', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Successfully created account!');
        done();
      });
  });

  it('Negative : /register     USERNAME TOO LONG', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'username123username123username123username123username123username123username123username123username123username123username123username123username123username123username123', password: 'password123' })
      .end((err, res) => {
        expect(res.body.message).to.equals('Something went wrong. Either your username was invalid or is already taken!');
        done();
      });
  });
});
// ********************************************************************************