import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AppRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'GET') {
      Object.assign(request.query, { isActive: 'true' }); // ✅ Works!
    }
    return next.handle();
  }
}
