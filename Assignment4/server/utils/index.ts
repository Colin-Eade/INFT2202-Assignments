import express, {Request, Response, NextFunction} from 'express';

/**
 * Retrieves the display name of the user from the request object.
 * If the user is authenticated, a UserDocument is attached to the request.
 * @param req - The Express request object containing the user information.
 * @returns The user's display name if authenticated and present; otherwise, an empty string.
 */
export function UserDisplayName(req: Request): string {

    if (req.user) {
        let user: UserDocument = req.user as UserDocument;
        return user.displayName.toString();
    }
    return '';
}

/**
 * Middleware to ensure that the user is authenticated.
 * Redirects to the login page if the user is not authenticated.
 * Otherwise, proceeds to the next middleware in the stack.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function to call.
 */
export function AuthGuard(req: Request, res: Response, next: NextFunction): void {

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}