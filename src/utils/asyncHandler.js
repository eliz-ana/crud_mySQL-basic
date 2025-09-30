// Envuelve controladores async y pasa cualquier error a next(err)
export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
