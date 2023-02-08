import { LoadingDelayIndicator } from './loading-delay-indicator';
import { fakeAsync, tick } from '@angular/core/testing';

describe('LoadingDelayIndicator', () => {
  let loadingIndicator: LoadingDelayIndicator;

  beforeEach(() => {
    loadingIndicator = new LoadingDelayIndicator();
  });

  it('should not indicate loading when initialized', () => {
    expect(loadingIndicator.isLoading).toBe(false);
  });

  it('should finish loading after delay', fakeAsync(() => {
    finishLoadingAfterDelay();
  }));

  it('should finish loading before delay', fakeAsync(() => {
    finishLoadingBeforeDelay();
  }));

  describe('restart loading after first loading', () => {
    it('finish after delay & finish after delay', fakeAsync(() => {
      finishLoadingAfterDelay();
      finishLoadingAfterDelay();
    }));

    it('finish after delay & finish before delay ', fakeAsync(() => {
      finishLoadingAfterDelay();
      finishLoadingBeforeDelay();
    }));

    it('finish before delay & finish after delay', fakeAsync(() => {
      finishLoadingBeforeDelay();
      finishLoadingAfterDelay();
    }));

    it('finish before delay & finish before delay', fakeAsync(() => {
      finishLoadingBeforeDelay();
      finishLoadingBeforeDelay();
    }));
  });

  function finishLoadingAfterDelay() {
    loadingIndicator.startLoading().subscribe();
    tick(50);
    expect(loadingIndicator.isLoading).toBe(true);
    loadingIndicator.finishLoading();
    expect(loadingIndicator.isLoading).toBe(false);
  }

  function finishLoadingBeforeDelay() {
    loadingIndicator.startLoading().subscribe();
    tick(30);
    expect(loadingIndicator.isLoading).toBe(false);
    loadingIndicator.finishLoading();
    expect(loadingIndicator.isLoading).toBe(false);
    tick(20);
    expect(loadingIndicator.isLoading).toBe(false);
  }
});
