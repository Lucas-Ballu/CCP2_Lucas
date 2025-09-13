/**
 * Middleware d'autorisation par rôle
 * Vérifie que l'utilisateur connecté possède un des rôles autorisés.
 *
 * @param {string[]} roles - Tableau des rôles autorisés (ex: ["ASSOCIATION", "VOLUNTEER"])
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 * Middleware Express qui bloque l'accès avec un 403 si le rôle n'est pas autorisé
 */
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
