import type { UserDetail } from '../../models/user.ts';

declare global {
    namespace Express {
        interface Request {
            user?: UserDetail;
        }
    }
}
