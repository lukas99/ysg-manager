import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  constructor(private hotkeysService: HotkeysService) {}

  /**
   * Registers a shortcut with a shortcut
   * @param combo The shortcut combo as string or as list of strings.
   * @param callback The callback method to invoke when the combo was pressed.
   */
  add(combo: string | string[], callback: Function) {
    // see https://github.com/brtnshrdr/angular2-hotkeys
    this.hotkeysService.add(
      new Hotkey(
        combo,
        (event: KeyboardEvent): boolean => {
          callback();
          return false; // Prevent bubbling
        },
        ['INPUT', 'SELECT'] // also allow hotkeys in input and select elements
      )
    );
  }
}
