import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class RequestTraceMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): any {
        const {ip, method, path: url} = request;
        const userAgent = request.get('user-agent') || '';

        response.on('close', () => {
            const {statusCode} = response;
            const contentLength = response.get('content-length');

            this.logger.log(
                `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
            );
        });

        next();
    }

}