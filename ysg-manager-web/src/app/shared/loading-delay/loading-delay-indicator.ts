import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

/**
 * Indicates whether application is loading 50 ms after loading was started.
 * In case loading finishes before, loading is not indicated.
 * In case loading finishes after, loading is indicated until it is finished.
 */
export class LoadingDelayIndicator {
  isLoading = false;
  private loading: 'READY' | 'LOADING' | 'FINISHED' = 'READY';

  /**
   * Call this method when loading actually starts.
   */
  startLoading(): Observable<any> {
    return of({}).pipe(
      delay(50),
      tap(() => {
        if (this.loading === 'FINISHED') {
          this.loading = 'READY';
          this.isLoading = false;
        } else {
          this.loading = 'LOADING';
          this.isLoading = true;
        }
      })
    );
  }

  /**
   * Call this method when loading actually finishes.
   */
  finishLoading() {
    if (this.loading === 'LOADING') {
      this.loading = 'READY';
    } else {
      this.loading = 'FINISHED';
    }
    this.isLoading = false;
  }
}
