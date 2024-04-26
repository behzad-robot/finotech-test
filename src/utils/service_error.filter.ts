import { ArgumentsHost, Catch, ExceptionFilter, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "./service_error";

// @Injectable()
// export class ServiceErrorMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: NextFunction) {
//         try {
//             // console.log(`req is recieved`, req);
//             next();
//         }
//         catch (err) {
//             if (typeof (err) == 'object' && 'code' in err && 'error' in err) {
//                 console.log(`MY MIDDLEWARE CAUGHT THIS!`);
//                 var e = err as ServiceError;
//                 console.log(e);
//                 res.status(e.code).json({
//                     message: e.error,
//                     statusCode: e.code,
//                 })
//             }
//         }
//     }
// }

@Catch(ServiceError)
export class ServiceExceptionFilter implements ExceptionFilter {
    catch(exception: ServiceError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        var msg = 'Internal Server Error';
        var code = 500;
        if (typeof (exception) == 'object' && 'error' in exception && 'code' in exception) {
            var e = exception as ServiceError;
            code = e.code;
            msg = e.error;
        }
        response
            .status(code)
            .json({
                statusCode: code,
                timestamp: new Date().toISOString(),
                path: request.url,
                error: msg,
            });
    }
}