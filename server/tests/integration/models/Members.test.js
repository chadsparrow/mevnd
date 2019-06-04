const { Member } = require('../../../models/Member');

describe('Member', () => {
  describe('lookup', () => {
    it('should return a status 400 if member id is invalid', () => {
      const result = await Member.lookup('1');
      console.log(result);
      //expect(res.status).toBe(400);
    })

    it('should return a status of 200 if member id is valid', () => {
      const result = await Member.lookup('5ceef9b1580b510051d730f7');
      console.log(result)
    })
  })
})