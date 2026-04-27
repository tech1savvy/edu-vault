const { Certification, User } = require('./models');
async function test() {
  const certs = await Certification.findAll({ where: { userId: 6 } });
  console.log("CERTS FOR USER 6:", certs.map(c => c.toJSON()));
}
test();
