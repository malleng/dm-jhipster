import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'findLanguageFromKey' })
export class FindLanguageFromKeyPipe implements PipeTransform {
  private languages: { [key: string]: { name: string; rtl?: boolean } } = {
    hy: { name: 'Հայերեն' },
    bg: { name: 'Български' },
    'zh-cn': { name: '中文（简体）' },
    en: { name: 'English' },
    fr: { name: 'Français' },
    my: { name: 'မြန်မာ' },
    ru: { name: 'Русский' },
    // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
  };

  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
