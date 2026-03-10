function notFoundHandler(req, res) {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Endpoint not found'
    });
  }

  return res.status(404).render('pages/not-found', {
    title: 'Сторінку не знайдено'
  });
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';

  if (req.path.startsWith('/api')) {
    return res.status(status).json({
      success: false,
      message
    });
  }

  return res.status(status).render('pages/error', {
    title: 'Помилка',
    message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
