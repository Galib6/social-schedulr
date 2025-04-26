import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        if (request?.verifiedUser) {
          if (request.method === 'POST') {
            data.createdBy = request.verifiedUser; // ✅ Modify after validation
          } else if (request.method === 'PUT' || request.method === 'PATCH') {
            data.updatedBy = request.verifiedUser;
          } else if (request.method === 'DELETE') {
            data.deletedBy = request.verifiedUser;
          }
        }
        return data;
      }),
    );
  }
}
