module.exports.deleteJwtCookie = (req, res, next) => {
  return res.status(200).clearCookie('jwt').send('Cookie Удалены');
};
