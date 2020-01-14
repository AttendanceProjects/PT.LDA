const chai = require('chai'),
  ep = chai.expect,
  app = require('../app'),
  { User } = require('../models'),
  { hash, jwt } = require('../helpers')

chai.use(require('chai-http'));

let initialUser,
  initialDirector,
  initialToken,
  initialSecretCode


before(async done => {
  try {
    const user = await User.create({ username: 'eric', password: '12345', email: 'sudhartioeric@gmail.com' })
    const Director = await User.create({ username: 'sudhartio', password: '12345', email: 'sudhartio@gmail.com', role: 'director' });
    initialUser = user;
    initialDirector = Director;
    initialToken = jwt.signToken({ id: user._id, role: user.role });
    initialSecretCode = jwt.signToken({ id: user.id, email: user.email });
    done()
  } catch(err) { console.log(err) }
})

after(async done => {
  try {
    if( process.env.NODE_ENV == 'testing' ) {
      await User.deleteMany({})
      console.log('user testing done deleted!');
      done();
    }
  } catch(err) { console.log(err) }
})

describe('user Route Testing', _ => {
  
  describe('GET /users for check user signin', _ => {
    let link = '/users';

    describe('success process', _ => {
      it('should send an object user', done => {
        chai.request(app)
          .get(link)
          .set('token', initialToken)
          .end((err, res) => {
            ep(err).to.be.null;
            ep(res).to.have.status(200);
            ep(res.body).to.be.an('object').to.have.any.keys('user');
            ep(res.body.user).to.be.an('object').to.have.any.keys('_id','username','password','email');
            done()
          })
      })
    })
  })

})
