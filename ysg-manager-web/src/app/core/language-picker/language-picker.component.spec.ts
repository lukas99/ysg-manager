import { LanguagePickerComponent } from './language-picker.component';

describe('LanguageSelectionComponent', () => {
  let component: LanguagePickerComponent;
  let translateService = <any>{
    getBrowserLang: jest.fn(),
    useLanguage: jest.fn(),
    setDefaultLang: jest.fn()
  };

  beforeEach(() => {
    component = new LanguagePickerComponent(translateService);
  });

  it('uses the browsers language if it is available', () => {
    translateService.getBrowserLang = jest.fn(() => 'en');

    component.ngOnInit();

    expect(component.currentLanguage.name).toBe('English');
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('uses German if browsers language is not available', () => {
    translateService.getBrowserLang = jest.fn(() => 'xx');

    component.ngOnInit();

    expect(component.currentLanguage.name).toBe('Deutsch');
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('de');
  });

  it('can use a given language', () => {
    component.useLanguage({ code: 'fr', name: 'French', abbreviation: 'FR' });

    expect(component.currentLanguage.name).toBe('French');
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('fr');
  });
});
