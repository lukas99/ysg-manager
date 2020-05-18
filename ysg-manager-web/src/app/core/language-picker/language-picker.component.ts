import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface AppLanguage {
  code: string;
  name: string;
}

/**
 * Provides a language selection menu.
 */
@Component({
  selector: 'ysg-language-picker',
  templateUrl: 'language-picker.component.html',
  styleUrls: ['language-picker.component.css']
})
export class LanguagePickerComponent implements OnInit {
  languages: AppLanguage[] = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' }
  ];
  currentLanguage = this.languages[0].name;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.setDefaultLanguage();
  }

  private setDefaultLanguage() {
    const browserLanguage = this.translateService.getBrowserLang();
    const language = this.languages.find(
      (lang) => lang.code === browserLanguage
    );
    if (language) {
      this.useLanguage(language);
    } else {
      this.useLanguage(this.languages[0]);
    }
  }

  useLanguage(language: AppLanguage) {
    this.translateService.setDefaultLang(language.code);
    this.currentLanguage = language.name;
  }
}
