import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {AuthApiService} from "./auth-api.service";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {CurrentStateService} from "../services/current-state.service";
import {LocalStorageService} from "../services/local-storage.service";
import jwt_decode from "jwt-decode";

/**
 * Интерсептор для работы с токенами
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private currentStateService: CurrentStateService,
    private localStorageService: LocalStorageService,
    private authApiService: AuthApiService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;

    const token = this.localStorageService.token;
    const ref_token = this.localStorageService.refresh_token;

    if (token != null) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !request.url.includes(`refresh-access`) &&
        !request.url.includes(`sign-in`) && !request.url.includes('sign-up') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.localStorageService.refresh_token;

      if (token) {
        return this.authApiService.getRefreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.localStorageService.token = token.access_token;
            this.localStorageService.refresh_token = token.refresh_token;

            this.currentStateService.isUserLoggedIn = true;
            this.currentStateService.currentUser = jwt_decode(token.token_access);

            this.refreshTokenSubject.next(token.token_access);

            return next.handle(this.addTokenHeader(request, token.token_access));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.currentStateService.clearCurrentState();
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
}
